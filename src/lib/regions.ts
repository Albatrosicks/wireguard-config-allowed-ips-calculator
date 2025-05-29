export interface Region {
  id: string;
  name: string;
  flag: string;
  prefix: string;
  pingMin: number;
  pingMax: number;
  category: 'europe-cis' | 'asia' | 'north-america' | 'south-america';
}

export const regions: Region[] = [
  // Europe/CIS - Very close (0-20ms)
  { id: 'ru', name: 'Россия', flag: '🇷🇺', prefix: 'ru.', pingMin: 0, pingMax: 0, category: 'europe-cis' },
  { id: 'rb', name: 'Беларусь', flag: '🇧🇾', prefix: 'rb.', pingMin: 5, pingMax: 15, category: 'europe-cis' },
  { id: 'kz', name: 'Казахстан', flag: '🇰🇿', prefix: 'kz.', pingMin: 10, pingMax: 20, category: 'europe-cis' },
  
  // Europe/CIS - Close (20-50ms)
  { id: 'ua', name: 'Украина', flag: '🇺🇦', prefix: 'ua.', pingMin: 15, pingMax: 25, category: 'europe-cis' },
  { id: 'am', name: 'Армения', flag: '🇦🇲', prefix: 'am.', pingMin: 20, pingMax: 30, category: 'europe-cis' },
  { id: 'ge', name: 'Грузия', flag: '🇬🇪', prefix: 'ge.', pingMin: 20, pingMax: 30, category: 'europe-cis' },
  { id: 'uz', name: 'Узбекистан', flag: '🇺🇿', prefix: 'uz.', pingMin: 25, pingMax: 35, category: 'europe-cis' },
  { id: 'lv', name: 'Латвия', flag: '🇱🇻', prefix: 'lv.', pingMin: 25, pingMax: 35, category: 'europe-cis' },
  { id: 'lt', name: 'Литва', flag: '🇱🇹', prefix: 'lt.', pingMin: 25, pingMax: 35, category: 'europe-cis' },
  { id: 'fin', name: 'Финляндия', flag: '🇫🇮', prefix: 'fin.', pingMin: 30, pingMax: 40, category: 'europe-cis' },
  
  // Europe/CIS - Medium (50-80ms)
  { id: 'po', name: 'Польша', flag: '🇵🇱', prefix: 'po.', pingMin: 35, pingMax: 45, category: 'europe-cis' },
  { id: 'pra', name: 'Чехия', flag: '🇨🇿', prefix: 'pra.', pingMin: 40, pingMax: 50, category: 'europe-cis' },
  { id: 'bu', name: 'Венгрия', flag: '🇭🇺', prefix: 'bu.', pingMin: 40, pingMax: 50, category: 'europe-cis' },
  { id: 'rs', name: 'Сербия', flag: '🇷🇸', prefix: 'rs.', pingMin: 40, pingMax: 50, category: 'europe-cis' },
  { id: 'stm', name: 'Швеция', flag: '🇸🇪', prefix: 'stm.', pingMin: 45, pingMax: 55, category: 'europe-cis' },
  { id: 'au', name: 'Австрия', flag: '🇦🇹', prefix: 'au.', pingMin: 45, pingMax: 55, category: 'europe-cis' },
  { id: 'fra', name: 'Германия', flag: '🇩🇪', prefix: 'fra.', pingMin: 50, pingMax: 60, category: 'europe-cis' },
  { id: 'sw', name: 'Швейцария', flag: '🇨🇭', prefix: 'sw.', pingMin: 50, pingMax: 60, category: 'europe-cis' },
  { id: 'ams', name: 'Нидерланды', flag: '🇳🇱', prefix: 'ams.', pingMin: 55, pingMax: 65, category: 'europe-cis' },
  { id: 'fr', name: 'Франция', flag: '🇫🇷', prefix: 'fr.', pingMin: 60, pingMax: 70, category: 'europe-cis' },
  { id: 'lon', name: 'Великобритания', flag: '🇬🇧', prefix: 'lon.', pingMin: 65, pingMax: 75, category: 'europe-cis' },
  { id: 'it', name: 'Италия', flag: '🇮🇹', prefix: 'it.', pingMin: 65, pingMax: 75, category: 'europe-cis' },
  { id: 'es', name: 'Испания', flag: '🇪🇸', prefix: 'es.', pingMin: 70, pingMax: 80, category: 'europe-cis' },
  { id: 'pt', name: 'Португалия', flag: '🇵🇹', prefix: 'pt.', pingMin: 75, pingMax: 85, category: 'europe-cis' },
  
  // Asia - Middle East (30-100ms)
  { id: 'tr', name: 'Турция', flag: '🇹🇷', prefix: 'tr.', pingMin: 30, pingMax: 50, category: 'asia' },
  { id: 'il', name: 'Израиль', flag: '🇮🇱', prefix: 'il.', pingMin: 60, pingMax: 80, category: 'asia' },
  { id: 'ae', name: 'ОАЭ', flag: '🇦🇪', prefix: 'ae.', pingMin: 80, pingMax: 100, category: 'asia' },
  
  // Asia - South and Southeast (100-200ms)
  { id: 'ind', name: 'Индия', flag: '🇮🇳', prefix: 'ind.', pingMin: 120, pingMax: 170, category: 'asia' },
  { id: 'th', name: 'Таиланд', flag: '🇹🇭', prefix: 'th.', pingMin: 150, pingMax: 200, category: 'asia' },
  { id: 'sg', name: 'Сингапур', flag: '🇸🇬', prefix: 'sg.', pingMin: 170, pingMax: 220, category: 'asia' },
  
  // Asia - East (150-250ms)
  { id: 'hk', name: 'Гонконг', flag: '🇭🇰', prefix: 'hk.', pingMin: 180, pingMax: 230, category: 'asia' },
  { id: 'jp', name: 'Япония', flag: '🇯🇵', prefix: 'jp.', pingMin: 200, pingMax: 250, category: 'asia' },
  
  // North America (130-200ms)
  { id: 'ny', name: 'Нью-Йорк', flag: '🇺🇸', prefix: 'ny.', pingMin: 130, pingMax: 160, category: 'north-america' },
  { id: 'ca', name: 'Канада', flag: '🇨🇦', prefix: 'ca.', pingMin: 140, pingMax: 180, category: 'north-america' },
  { id: 'la', name: 'Лос-Анджелес', flag: '🇺🇸', prefix: 'la.', pingMin: 180, pingMax: 220, category: 'north-america' },
  
  // South America (200-350ms)
  { id: 'br', name: 'Бразилия', flag: '🇧🇷', prefix: 'br.', pingMin: 220, pingMax: 300, category: 'south-america' },
  { id: 'ag', name: 'Аргентина', flag: '🇦🇷', prefix: 'ag.', pingMin: 250, pingMax: 350, category: 'south-america' },
];

export const regionsByCategory = {
  'europe-cis': regions.filter(r => r.category === 'europe-cis'),
  'asia': regions.filter(r => r.category === 'asia'), 
  'north-america': regions.filter(r => r.category === 'north-america'),
  'south-america': regions.filter(r => r.category === 'south-america'),
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