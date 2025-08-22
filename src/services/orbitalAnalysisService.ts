// Orbital Analysis Service - Astronomical Data Analysis
export interface OrbitalAnalysisResult {
  verdict: 'approved' | 'likely_hoax' | 'adaptive_intervention' | 'insufficient_evidence';
  message: string;
  hoax_analysis?: {
    hoax_probability: number;
    hoax_flags: string[];
    fear_flags: string[];
  };
  live_orbital_facts?: {
    resolved: Array<{
      query: string;
      resolved_fullname?: string;
      error?: string;
    }>;
  };
}

export interface ObjectData {
  designation: string;
  sbdb_data?: any;
  data_source: string;
}

class OrbitalAnalysisService {
  async analyzeAstronomicalClaim(text: string, sourceUrl?: string): Promise<OrbitalAnalysisResult> {
    // Simulate orbital analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const hoaxProbability = this.calculateHoaxProbability(text, sourceUrl);
    const extractedObjects = this.extractAstronomicalObjects(text);
    
    let verdict: OrbitalAnalysisResult['verdict'] = 'approved';
    let message = 'Analysis complete';
    
    if (hoaxProbability > 0.7) {
      verdict = 'likely_hoax';
      message = 'High probability of misinformation detected';
    } else if (hoaxProbability > 0.3 && extractedObjects.length === 0) {
      verdict = 'insufficient_evidence';
      message = 'Extraordinary claims require extraordinary evidence';
    }

    return {
      verdict,
      message,
      hoax_analysis: {
        hoax_probability: hoaxProbability,
        hoax_flags: this.detectHoaxFlags(text),
        fear_flags: this.detectFearFlags(text)
      },
      live_orbital_facts: {
        resolved: extractedObjects.map(obj => ({
          query: obj,
          resolved_fullname: `Resolved: ${obj}`,
        }))
      }
    };
  }

  async getObjectData(designation: string): Promise<ObjectData> {
    // Simulate object data retrieval
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      designation,
      sbdb_data: {
        object: {
          fullname: designation,
          kind: 'asteroid',
          orbit_class: 'MBA'
        }
      },
      data_source: 'JPL Small-Body Database'
    };
  }

  private calculateHoaxProbability(text: string, sourceUrl?: string): number {
    let probability = 0;
    const textLower = text.toLowerCase();
    
    // Check for hoax indicators
    const hoaxPatterns = [
      'government cover-up',
      'they don\'t want you to know',
      'mainstream media won\'t report',
      'secret footage',
      'leaked documents',
      'end of the world',
      'planet killer'
    ];
    
    hoaxPatterns.forEach(pattern => {
      if (textLower.includes(pattern)) {
        probability += 0.2;
      }
    });
    
    // Check source credibility
    if (sourceUrl) {
      const credibleSources = ['nasa.gov', 'jpl.nasa.gov', 'esa.int', 'iau.org'];
      const isCredible = credibleSources.some(source => sourceUrl.includes(source));
      if (!isCredible) {
        probability += 0.3;
      }
    }
    
    return Math.min(1, probability);
  }

  private extractAstronomicalObjects(text: string): string[] {
    const objects: string[] = [];
    
    // Look for asteroid/comet designations
    const patterns = [
      /\b\d{4}\s+[A-Z]{1,2}\d*\b/g, // 2023 BU
      /\bC\/\d{4}\s+[A-Z]\d*\b/g,   // C/2023 A1
      /\b\d+P\/[A-Za-z-]+\b/g       // 1P/Halley
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        objects.push(...matches);
      }
    });
    
    return objects;
  }

  private detectHoaxFlags(text: string): string[] {
    const flags: string[] = [];
    const textLower = text.toLowerCase();
    
    const hoaxPatterns = [
      'cover-up',
      'conspiracy',
      'hidden truth',
      'they don\'t want',
      'secret',
      'leaked'
    ];
    
    hoaxPatterns.forEach(pattern => {
      if (textLower.includes(pattern)) {
        flags.push(pattern);
      }
    });
    
    return flags;
  }

  private detectFearFlags(text: string): string[] {
    const flags: string[] = [];
    const textLower = text.toLowerCase();
    
    const fearWords = [
      'catastrophic',
      'devastating',
      'apocalyptic',
      'terrifying',
      'disaster',
      'extinction'
    ];
    
    fearWords.forEach(word => {
      if (textLower.includes(word)) {
        flags.push(word);
      }
    });
    
    return flags;
  }
}

export const orbitalAnalysisService = new OrbitalAnalysisService();