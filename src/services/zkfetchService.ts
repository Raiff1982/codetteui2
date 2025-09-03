// zkfetch Service - Zero-Knowledge TLS Proof Fetching
export interface ZkFetchRequest {
  url: string;
  method: 'GET' | 'POST' | 'HEAD';
  headers?: Record<string, string>;
  body?: string;
  policy_id?: string;
  disclosure?: DisclosureRules;
  cache?: {
    max_age_s?: number;
    key?: string;
  };
  timeouts?: {
    connect_ms?: number;
    read_ms?: number;
    proof_ms?: number;
  };
}

export interface DisclosureRules {
  mode?: 'jsonpath_allowlist' | 'header_allowlist' | 'body_regex';
  jsonpath?: string[];
  headers?: string[];
  body_regex?: Array<{
    pattern: string;
    group: number;
  }>;
  hash_only?: boolean;
}

export interface ZkFetchResponse {
  origin: {
    host: string;
    url_fetched: string;
    ip?: string;
    cert_chain_summary?: Array<{
      subject: string;
      issuer: string;
      not_before: string;
      not_after: string;
      sha256_spki: string;
    }>;
  };
  tls: {
    version: '1.2' | '1.3';
    cipher_suite: string;
    alpn: string;
  };
  disclosed: any;
  hashes: {
    transcript_sha256: string;
    disclosed_sha256: string;
    full_body_sha256?: string;
  };
  proof: {
    format: string;
    blob_b64: string;
    notary_pubkey_fingerprint?: string;
  };
  timestamp: string;
  policy_id: string;
  cache?: {
    hit: boolean;
    age_s: number;
  };
  request_id: string;
}

export interface ProofBundle {
  response: ZkFetchResponse;
  verifier_inputs: {
    root_store?: string;
    origin_host?: string;
    tls_params?: any;
    policy_snapshot?: any;
  };
}

export interface VerifyResult {
  valid: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    detail: string;
  }>;
  warnings: string[];
}

class ZkFetchService {
  private baseUrl = 'https://api.codette.online';
  private authToken: string | null = null;

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  async zkfetch(request: ZkFetchRequest): Promise<ZkFetchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/zkfetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`zkfetch failed: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Store proof metadata for verification
      this.storeProofMetadata(data);
      
      return data;
    } catch (error) {
      console.error('zkfetch request failed:', error);
      throw error;
    }
  }

  async getProof(proofId: string): Promise<ProofBundle> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/proofs/${proofId}`, {
        headers: {
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to retrieve proof: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Proof retrieval failed:', error);
      throw error;
    }
  }

  async verifyProof(proofId: string): Promise<VerifyResult> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/proofs/${proofId}/verify`, {
        headers: {
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Proof verification failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Proof verification failed:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Fetch GitHub repository data with zero-knowledge proof
  async fetchGitHubWithProof(
    owner: string, 
    repo: string, 
    path: string = '',
    commit?: string
  ): Promise<ZkFetchResponse> {
    const url = commit 
      ? `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path}`
      : `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const request: ZkFetchRequest = {
      url,
      method: 'GET',
      policy_id: 'github-v1',
      disclosure: {
        mode: 'jsonpath_allowlist',
        jsonpath: ['$.name', '$.content', '$.sha', '$.download_url'],
        headers: ['Content-Type', 'ETag']
      },
      cache: {
        max_age_s: 300 // 5 minutes
      }
    };

    return this.zkfetch(request);
  }

  // Fetch research papers with cryptographic verification
  async fetchResearchPaperWithProof(doi: string): Promise<ZkFetchResponse> {
    const url = `https://doi.org/${doi}`;
    
    const request: ZkFetchRequest = {
      url,
      method: 'GET',
      disclosure: {
        mode: 'header_allowlist',
        headers: ['Content-Type', 'Location', 'Content-Length'],
        hash_only: true // Only get hashes for large documents
      }
    };

    return this.zkfetch(request);
  }

  // Verify external API data with zero-knowledge proofs
  async verifyExternalData(
    apiUrl: string, 
    expectedData: any,
    disclosureRules?: DisclosureRules
  ): Promise<{ verified: boolean; proof: ZkFetchResponse }> {
    try {
      const request: ZkFetchRequest = {
        url: apiUrl,
        method: 'GET',
        disclosure: disclosureRules || {
          mode: 'jsonpath_allowlist',
          jsonpath: ['$.*']
        }
      };

      const proof = await this.zkfetch(request);
      
      // Compare disclosed data with expected data
      const verified = this.compareData(proof.disclosed, expectedData);
      
      return { verified, proof };
    } catch (error) {
      console.error('Data verification failed:', error);
      return { verified: false, proof: null as any };
    }
  }

  private storeProofMetadata(response: ZkFetchResponse): void {
    // Store proof metadata for later verification
    const metadata = {
      request_id: response.request_id,
      timestamp: response.timestamp,
      origin_host: response.origin.host,
      proof_format: response.proof.format,
      stored_at: new Date().toISOString()
    };

    localStorage.setItem(`zkfetch_proof_${response.request_id}`, JSON.stringify(metadata));
  }

  private compareData(disclosed: any, expected: any): boolean {
    try {
      return JSON.stringify(disclosed) === JSON.stringify(expected);
    } catch (error) {
      return false;
    }
  }

  // Get stored proof metadata
  getStoredProofs(): Array<{ request_id: string; metadata: any }> {
    const proofs: Array<{ request_id: string; metadata: any }> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('zkfetch_proof_')) {
        const requestId = key.replace('zkfetch_proof_', '');
        const metadata = JSON.parse(localStorage.getItem(key) || '{}');
        proofs.push({ request_id: requestId, metadata });
      }
    }
    
    return proofs.sort((a, b) => 
      new Date(b.metadata.stored_at).getTime() - new Date(a.metadata.stored_at).getTime()
    );
  }

  // Clean up old proofs
  cleanupOldProofs(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const now = new Date().getTime();
    const proofs = this.getStoredProofs();
    
    proofs.forEach(({ request_id, metadata }) => {
      const proofAge = now - new Date(metadata.stored_at).getTime();
      if (proofAge > maxAge) {
        localStorage.removeItem(`zkfetch_proof_${request_id}`);
      }
    });
  }
}

export const zkfetchService = new ZkFetchService();