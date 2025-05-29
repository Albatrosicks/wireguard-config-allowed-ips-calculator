export interface WireguardConfig {
  interfaceAddress: string[];
  peerEndpoints: string[];
  originalConfig: string;
}

export function parseWireguardConfig(config: string): WireguardConfig {
  const lines = config.split('\n').map(line => line.trim());
  const result: WireguardConfig = {
    interfaceAddress: [],
    peerEndpoints: [],
    originalConfig: config
  };

  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1).toLowerCase();
      continue;
    }

    if (!line || line.startsWith('#')) continue;

    const [key, ...valueParts] = line.split('=');
    if (!key || valueParts.length === 0) continue;

    const trimmedKey = key.trim().toLowerCase();
    const value = valueParts.join('=').trim();

    if (currentSection === 'interface' && trimmedKey === 'address') {
      const addresses = value.split(',').map(addr => addr.trim());
      result.interfaceAddress.push(...addresses);
    } else if (currentSection === 'peer' && trimmedKey === 'endpoint') {
      result.peerEndpoints.push(value);
    }
  }

  return result;
}

export function updateWireguardConfig(
  originalConfig: string,
  newEndpoints: string[],
  newAllowedIPs: string[]
): string {
  const lines = originalConfig.split('\n');
  const updatedLines: string[] = [];
  let currentSection = '';
  let peerIndex = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
      currentSection = trimmedLine.slice(1, -1).toLowerCase();
      if (currentSection === 'peer') {
        peerIndex++;
      }
      updatedLines.push(line);
      continue;
    }

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      updatedLines.push(line);
      continue;
    }

    const [key, ...valueParts] = line.split('=');
    if (!key || valueParts.length === 0) {
      updatedLines.push(line);
      continue;
    }

    const trimmedKey = key.trim().toLowerCase();

    if (currentSection === 'peer' && trimmedKey === 'endpoint' && newEndpoints[peerIndex - 1]) {
      // Replace endpoint with new value
      const leadingWhitespace = line.match(/^\s*/)?.[0] || '';
      updatedLines.push(`${leadingWhitespace}Endpoint = ${newEndpoints[peerIndex - 1]}`);
    } else if (currentSection === 'peer' && trimmedKey === 'allowedips') {
      // Replace AllowedIPs with calculated value
      const leadingWhitespace = line.match(/^\s*/)?.[0] || '';
      updatedLines.push(`${leadingWhitespace}AllowedIPs = ${newAllowedIPs.join(', ')}`);
    } else {
      updatedLines.push(line);
    }
  }

  return updatedLines.join('\n');
}

export function extractHostname(endpoint: string): string | null {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([\da-fA-F]{0,4}:){2,7}[\da-fA-F]{0,4}$/;
  
  if (ipv4Regex.test(endpoint) || ipv6Regex.test(endpoint)) {
    return null;
  }
  
  return endpoint;
}