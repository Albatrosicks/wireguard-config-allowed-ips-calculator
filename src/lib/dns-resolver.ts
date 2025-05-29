interface DNSResponse {
  Status: number;
  Answer?: Array<{
    name: string;
    type: number;
    data: string;
  }>;
}

export async function resolveHostname(hostname: string): Promise<string[]> {
  const ips: string[] = [];
  
  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
      {
        headers: {
          'Accept': 'application/dns-json',
        },
      }
    );

    if (!response.ok) {
      console.error(`DNS resolution failed for ${hostname}`);
      return ips;
    }

    const data: DNSResponse = await response.json();
    
    if (data.Status === 0 && data.Answer) {
      for (const answer of data.Answer) {
        if (answer.type === 1) {
          ips.push(answer.data);
        }
      }
    }
  } catch (error) {
    console.error(`Error resolving ${hostname}:`, error);
  }

  return ips;
}

export async function resolveEndpoints(endpoints: string[]): Promise<string[]> {
  const resolvedIps: string[] = [];
  
  for (const endpoint of endpoints) {
    // Extract hostname from endpoint (remove port)
    const hostname = endpoint.split(':')[0];
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    if (ipv4Regex.test(hostname)) {
      resolvedIps.push(`${hostname}/32`);
    } else {
      const ips = await resolveHostname(hostname);
      resolvedIps.push(...ips.map(ip => `${ip}/32`));
    }
  }
  
  return resolvedIps;
}