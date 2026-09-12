import rawWebsites from './supportedWebsites.json';

export type PlatformCategory = 'All' | 'Social' | 'Professional' | 'Developer' | 'Community' | 'Other';

export interface SupportedPlatform {
  id: string;
  name: string;
  rawName: string;
  domain: string;
  category: 'Social' | 'Professional' | 'Developer' | 'Community' | 'Other';
  supported: boolean;
}

export const supportedWebsites: SupportedPlatform[] = rawWebsites as SupportedPlatform[];

export const TOTAL_SUPPORTED_SITES = supportedWebsites.length;
