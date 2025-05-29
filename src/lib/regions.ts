export interface Region {
  id: string;
  name: string;
  flag: string;
  prefix: string;
  pingMin: number;
  pingMax: number;
  category: 'europe' | 'asia' | 'north-america';
}

export const regions: Region[] = [
  // Europe
  { id: 'lv', name: 'Латвия', flag: '🇱🇻', prefix: 'lv.', pingMin: 20, pingMax: 30, category: 'europe' },
  { id: 'lt', name: 'Литва', flag: '🇱🇹', prefix: 'lt.', pingMin: 20, pingMax: 30, category: 'europe' },
  { id: 'fin', name: 'Финляндия', flag: '🇫🇮', prefix: 'fin.', pingMin: 25, pingMax: 35, category: 'europe' },
  { id: 'po', name: 'Польша', flag: '🇵🇱', prefix: 'po.', pingMin: 30, pingMax: 40, category: 'europe' },
  { id: 'pra', name: 'Чехия', flag: '🇨🇿', prefix: 'pra.', pingMin: 35, pingMax: 45, category: 'europe' },
  { id: 'bu', name: 'Венгрия', flag: '🇭🇺', prefix: 'bu.', pingMin: 40, pingMax: 50, category: 'europe' },
  { id: 'fra', name: 'Германия', flag: '🇩🇪', prefix: 'fra.', pingMin: 45, pingMax: 55, category: 'europe' },
  { id: 'au', name: 'Австрия', flag: '🇦🇹', prefix: 'au.', pingMin: 45, pingMax: 55, category: 'europe' },
  { id: 'ams', name: 'Нидерланды', flag: '🇳🇱', prefix: 'ams.', pingMin: 50, pingMax: 60, category: 'europe' },
  { id: 'fr', name: 'Франция', flag: '🇫🇷', prefix: 'fr.', pingMin: 55, pingMax: 65, category: 'europe' },
  { id: 'it', name: 'Италия', flag: '🇮🇹', prefix: 'it.', pingMin: 60, pingMax: 70, category: 'europe' },
  
  // Asia
  { id: 'il', name: 'Израиль', flag: '🇮🇱', prefix: 'il.', pingMin: 50, pingMax: 70, category: 'asia' },
  { id: 'ind', name: 'Индия', flag: '🇮🇳', prefix: 'ind.', pingMin: 100, pingMax: 150, category: 'asia' },
  { id: 'hk', name: 'Гонконг', flag: '🇭🇰', prefix: 'hk.', pingMin: 150, pingMax: 200, category: 'asia' },
  { id: 'jp', name: 'Япония', flag: '🇯🇵', prefix: 'jp.', pingMin: 180, pingMax: 250, category: 'asia' },
  
  // North America
  { id: 'ny', name: 'Нью-Йорк', flag: '🇺🇸', prefix: 'ny.', pingMin: 120, pingMax: 150, category: 'north-america' },
  { id: 'ca', name: 'Канада', flag: '🇨🇦', prefix: 'ca.', pingMin: 130, pingMax: 170, category: 'north-america' },
  { id: 'la', name: 'Лос-Анджелес', flag: '🇺🇸', prefix: 'la.', pingMin: 170, pingMax: 200, category: 'north-america' },
];

export const regionsByCategory = {
  'europe': regions.filter(r => r.category === 'europe'),
  'asia': regions.filter(r => r.category === 'asia'), 
  'north-america': regions.filter(r => r.category === 'north-america'),
};

export const sortedRegions = [...regions].sort((a, b) => a.pingMin - b.pingMin);

export const availablePorts = [
  { value: 'none', label: 'Без изменений' },
  { value: '1725', label: '1725 (рекомендуется)' },
  { value: '5060', label: '5060' },
  { value: '51821', label: '51821' },
];

export function parseEndpoint(endpoint: string): { host: string; port: string } {
  const parts = endpoint.split(':');
  return {
    host: parts[0] || '',
    port: parts[1] || '51820',
  };
}

export function isIPAddress(host: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([\da-fA-F]{0,4}:){2,7}[\da-fA-F]{0,4}$/;
  return ipv4Regex.test(host) || ipv6Regex.test(host);
}

export function extractDomain(host: string): string | null {
  // Check if host has our known region prefixes
  const knownPrefixes = regions.map(r => r.prefix);
  for (const prefix of knownPrefixes) {
    if (host.startsWith(prefix)) {
      // Return domain without the prefix
      return host.substring(prefix.length);
    }
  }
  // If no known prefix, return the host as is
  return host;
}

export function changeEndpoint(endpoint: string, newPrefix: string, newPort?: string): string {
  const { host, port } = parseEndpoint(endpoint);
  
  // Don't change region for IP addresses
  if (isIPAddress(host)) {
    const finalPort = newPort === 'none' ? port : (newPort || port);
    return `${host}:${finalPort}`;
  }
  
  let newHost = host;
  if (newPrefix) {
    // Get the base domain without any existing region prefix
    const baseDomain = extractDomain(host);
    if (baseDomain) {
      newHost = `${newPrefix}${baseDomain}`;
    }
  }
  
  const finalPort = newPort === 'none' ? port : (newPort || port);
  
  return `${newHost}:${finalPort}`;
}