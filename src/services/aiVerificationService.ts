// AI Verification Service - Cryptographic AI Verification
import { zkfetchService, ZkFetchRequest, ZkFetchResponse } from './zkfetchService';

export interface VerifiedAIResponse {
  response: any;
  verification: {
    source_verified: boolean;
    integrity_hash: string;
    timestamp: string;
    proof_id: string;
  };
  confidence_boost: number; // How much verification increases confidence
}

export interface AIModelVerification {
  model_name: string;
  source_url: string;
  verified: boolean;
  hash: string;
  signature: string;
  verification_timestamp: string;
}

class AIVerificationService {
  // Verify AI model sources with cryptographic proofs
  async verifyAIModel(modelName: string, sourceUrl: string): Promise<AIModelVerification> {
    try {
      const request: ZkFetchRequest = {
        url: sourceUrl,
        method: 'GET',
        policy_id: 'github-v1',
        disclosure: {
          mode: 'jsonpath_allowlist',
          jsonpath: ['$.name', '$.sha', '$.download_url', '$.size'],
          hash_only: true // For large model files, only get hashes
        }
      };

      const response = await zkfetchService.zkfetch(request);
      
      return {
        model_name: modelName,
        source_url: sourceUrl,
        verified: true,
        hash: response.hashes.disclosed_sha256,
        signature: response.proof.blob_b64,
        verification_timestamp: response.timestamp
      };
    } catch (error) {
      console.error('AI model verification failed:', error);
      return {
        model_name: modelName,
        source_url: sourceUrl,
        verified: false,
        hash: '',
        signature: '',
        verification_timestamp: new Date().toISOString()
      };
    }
  }

  // Verify research papers that inform AI decisions
  async verifyResearchSource(doi: string, title: string): Promise<VerifiedAIResponse> {
    try {
      const doiUrl = `https://doi.org/${doi}`;
      
      const request: ZkFetchRequest = {
        url: doiUrl,
        method: 'GET',
        disclosure: {
          mode: 'header_allowlist',
          headers: ['Content-Type', 'Location', 'Content-Length'],
          hash_only: true
        }
      };

      const response = await zkfetchService.zkfetch(request);
      
      return {
        response: {
          title,
          doi,
          verified_url: response.origin.url_fetched,
          tls_version: response.tls.version
        },
        verification: {
          source_verified: true,
          integrity_hash: response.hashes.transcript_sha256,
          timestamp: response.timestamp,
          proof_id: response.request_id
        },
        confidence_boost: 0.2 // 20% confidence boost for verified sources
      };
    } catch (error) {
      console.error('Research verification failed:', error);
      throw error;
    }
  }

  // Verify external AI API responses
  async verifyAIAPIResponse(apiUrl: string, expectedResponse: any): Promise<VerifiedAIResponse> {
    try {
      const request: ZkFetchRequest = {
        url: apiUrl,
        method: 'GET',
        disclosure: {
          mode: 'jsonpath_allowlist',
          jsonpath: ['$.choices[*].text', '$.model', '$.usage', '$.id']
        },
        cache: {
          max_age_s: 60 // Short cache for AI responses
        }
      };

      const response = await zkfetchService.zkfetch(request);
      
      // Verify the response matches expectations
      const verified = this.compareAIResponses(response.disclosed, expectedResponse);
      
      return {
        response: response.disclosed,
        verification: {
          source_verified: verified,
          integrity_hash: response.hashes.disclosed_sha256,
          timestamp: response.timestamp,
          proof_id: response.request_id
        },
        confidence_boost: verified ? 0.15 : 0
      };
    } catch (error) {
      console.error('AI API verification failed:', error);
      throw error;
    }
  }

  // Verify Codette's own research papers
  async verifyCodetteResearch(): Promise<{
    dreamcore: VerifiedAIResponse;
    nexus: VerifiedAIResponse;
  }> {
    const [dreamcore, nexus] = await Promise.all([
      this.verifyResearchSource('10.5281/zenodo.16388758', 'DreamCore Memory System'),
      this.verifyResearchSource('10.57967/hf/6059', 'Nexus Signal Engine')
    ]);

    return { dreamcore, nexus };
  }

  // Verify GitHub repository data for AI training
  async verifyGitHubCodeExamples(owner: string, repo: string, path: string): Promise<VerifiedAIResponse> {
    try {
      // Validate against policy first
      const validation = zkfetchService.validateGitHubUrl(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
      if (!validation.valid) {
        throw new Error(`Policy violation: ${validation.reason}`);
      }

      const response = await zkfetchService.fetchGitHubWithProof(owner, repo, path);
      
      return {
        response: response.disclosed,
        verification: {
          source_verified: true,
          integrity_hash: response.hashes.disclosed_sha256,
          timestamp: response.timestamp,
          proof_id: response.request_id
        },
        confidence_boost: 0.25 // High confidence boost for verified code examples
      };
    } catch (error) {
      console.error('GitHub code verification failed:', error);
      throw error;
    }
  }

  // Create verifiable AI decision audit trail
  async createAIDecisionAudit(decision: any, sources: string[]): Promise<{
    decision_hash: string;
    source_proofs: string[];
    audit_timestamp: string;
    verifiable: boolean;
  }> {
    try {
      // Verify all sources used in the AI decision
      const sourceVerifications = await Promise.all(
        sources.map(async (source) => {
          try {
            const response = await zkfetchService.zkfetch({
              url: source,
              method: 'GET',
              disclosure: { hash_only: true }
            });
            return response.request_id;
          } catch (error) {
            return null;
          }
        })
      );

      const validProofs = sourceVerifications.filter(proof => proof !== null);
      
      return {
        decision_hash: this.hashDecision(decision),
        source_proofs: validProofs,
        audit_timestamp: new Date().toISOString(),
        verifiable: validProofs.length === sources.length
      };
    } catch (error) {
      console.error('AI decision audit failed:', error);
      throw error;
    }
  }

  // Enhance AI confidence with verification
  enhanceAIConfidenceWithVerification(
    originalConfidence: number,
    verificationResult: VerifiedAIResponse
  ): number {
    if (!verificationResult.verification.source_verified) {
      return originalConfidence * 0.8; // Reduce confidence for unverified sources
    }
    
    return Math.min(1.0, originalConfidence + verificationResult.confidence_boost);
  }

  private compareAIResponses(disclosed: any, expected: any): boolean {
    try {
      // Compare key fields that matter for AI responses
      if (disclosed?.model && expected?.model) {
        return disclosed.model === expected.model;
      }
      
      // For other responses, do a general comparison
      return JSON.stringify(disclosed) === JSON.stringify(expected);
    } catch (error) {
      return false;
    }
  }

  private hashDecision(decision: any): string {
    // Create a hash of the AI decision for audit purposes
    const decisionString = JSON.stringify(decision, Object.keys(decision).sort());
    
    // Simple hash function (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < decisionString.length; i++) {
      const char = decisionString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  // Verify that AI suggestions come from legitimate sources
  async verifyAISuggestionSources(suggestion: string, language: string): Promise<{
    verified_sources: number;
    total_sources: number;
    confidence_multiplier: number;
  }> {
    // This would verify that code suggestions come from verified repositories
    // For now, simulate the verification process
    
    const potentialSources = [
      `https://api.github.com/repos/microsoft/TypeScript/contents/src`,
      `https://api.github.com/repos/facebook/react/contents/packages`,
      `https://api.github.com/repos/nodejs/node/contents/lib`
    ];

    let verifiedSources = 0;
    
    for (const source of potentialSources) {
      try {
        const validation = zkfetchService.validateGitHubUrl(source);
        if (validation.valid) {
          verifiedSources++;
        }
      } catch (error) {
        // Source not verifiable
      }
    }

    return {
      verified_sources: verifiedSources,
      total_sources: potentialSources.length,
      confidence_multiplier: verifiedSources / potentialSources.length
    };
  }
}

export const aiVerificationService = new AIVerificationService();