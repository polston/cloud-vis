import type { CloudProvider } from '../types';

export interface ProviderConfig {
  id: CloudProvider;
  label: string;
  color: string;
  gradient: string;
  bgColor: string;
}

export const providers: Record<CloudProvider, ProviderConfig> = {
  aws: {
    id: 'aws',
    label: 'Amazon Web Services',
    color: '#FF9900',
    gradient: 'linear-gradient(135deg, #FF9900, #FF6600)',
    bgColor: 'rgba(255, 153, 0, 0.08)',
  },
  gcp: {
    id: 'gcp',
    label: 'Google Cloud Platform',
    color: '#4285F4',
    gradient: 'linear-gradient(135deg, #4285F4, #34A853)',
    bgColor: 'rgba(66, 133, 244, 0.08)',
  },
  azure: {
    id: 'azure',
    label: 'Microsoft Azure',
    color: '#0078D4',
    gradient: 'linear-gradient(135deg, #0078D4, #50E6FF)',
    bgColor: 'rgba(0, 120, 212, 0.08)',
  },
};

export const categoryColors: Record<string, string> = {
  compute: '#F97316',
  networking: '#8B5CF6',
  storage: '#10B981',
  database: '#3B82F6',
  containers: '#06B6D4',
  security: '#EF4444',
  kubernetes: '#326CE5',
  'control-plane': '#7C3AED',
  'worker-node': '#059669',
  monitoring: '#F59E0B',
  serverless: '#EC4899',
  ai: '#8B5CF6',
  messaging: '#F97316',
};
