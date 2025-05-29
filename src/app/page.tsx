"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { excludeCidr, parseCidr } from "cidr-tools";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Moon, Sun, Copy, Info } from "lucide-react";
import useHashState from "use-hash-state";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import { parseWireguardConfig, updateWireguardConfig } from "@/lib/wireguard-parser";
import { resolveEndpoints } from "@/lib/dns-resolver";
import { sortedRegions, availablePorts, changeEndpoint } from "@/lib/regions";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRIVATE_IPS = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"];

const DEFAULT_STATE = {
  wireguardConfig: "",
  additionalDisallowedIps: "172.18.20.0/30",
};

const parseIps = (input: string = "") =>
  typeof input === "string"
    ? input
        .split("\n")
        .map((inputLine) => inputLine.split(","))
        .flat()
        .map((inputLine) => inputLine.split(" "))
        .flat()
        .map((cidr) => cidr.trim())
        .filter(Boolean)
    : [input];

type AppState = {
  wireguardConfig?: string;
  additionalDisallowedIps?: string;
};

export default function Home() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [mounted, setMounted] = useState(false);
  const { state, setStateAtKey } = useHashState<AppState>(DEFAULT_STATE, {
    usePushState: true,
    validateKeysAndTypes: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [resolvedEndpoints, setResolvedEndpoints] = useState<string[]>([]);
  const [displayEndpoints, setDisplayEndpoints] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("none");
  const [selectedPort, setSelectedPort] = useState<string>("none");

  useEffect(() => {
    const resolveConfig = async () => {
      if (!state.wireguardConfig) {
        setResolvedEndpoints([]);
        return;
      }

      setIsResolving(true);
      try {
        const config = parseWireguardConfig(state.wireguardConfig);
        let endpoints = config.peerEndpoints;
        
        // Apply region and port changes if selected
        if (selectedRegion !== "none" && endpoints.length > 0) {
          const region = sortedRegions.find(r => r.id === selectedRegion);
          if (region) {
            endpoints = endpoints.map(endpoint => 
              changeEndpoint(endpoint, region.prefix, selectedPort)
            );
          }
        } else if (selectedPort !== "none" && endpoints.length > 0) {
          // Just change port if no region selected
          endpoints = endpoints.map(endpoint => 
            changeEndpoint(endpoint, "", selectedPort)
          );
        }
        
        setDisplayEndpoints(endpoints);
        const resolved = await resolveEndpoints(endpoints);
        setResolvedEndpoints(resolved);
      } catch (error) {
        console.error("Error parsing/resolving config:", error);
        setResolvedEndpoints([]);
        setDisplayEndpoints([]);
      } finally {
        setIsResolving(false);
      }
    };

    resolveConfig();
  }, [state.wireguardConfig, selectedRegion, selectedPort]);

  if (!mounted) {
    return null;
  }

  const parsedConfig = state.wireguardConfig ? parseWireguardConfig(state.wireguardConfig) : { interfaceAddress: [], peerEndpoints: [], originalConfig: '' };
  const additionalDisallowedIps = parseIps(state.additionalDisallowedIps);
  
  const allowedIps = ["0.0.0.0/0"];
  const disallowedIps = [
    ...parsedConfig.interfaceAddress,
    ...resolvedEndpoints,
    ...additionalDisallowedIps,
  ];

  const invalidIps = [...allowedIps, ...disallowedIps].flatMap((ip) => {
    try {
      parseCidr(ip);
      return [];
    } catch {
      return [ip];
    }
  });

  let result = "";
  let calculatedAllowedIPs: string[] = [];
  try {
    calculatedAllowedIPs = excludeCidr(allowedIps, disallowedIps);
  } catch {
    calculatedAllowedIPs = [];
  }

  // Generate updated config
  if (state.wireguardConfig && parsedConfig.originalConfig) {
    // Prepare endpoints with region and port changes
    let modifiedEndpoints = parsedConfig.peerEndpoints;
    if (selectedRegion !== "none" && parsedConfig.peerEndpoints.length > 0) {
      const region = sortedRegions.find(r => r.id === selectedRegion);
      if (region) {
        modifiedEndpoints = parsedConfig.peerEndpoints.map(endpoint => {
          return changeEndpoint(endpoint, region.prefix, selectedPort);
        });
      }
    }
    
    result = updateWireguardConfig(
      parsedConfig.originalConfig,
      modifiedEndpoints,
      calculatedAllowedIPs
    );
  } else {
    result = calculatedAllowedIPs.join(", ");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-10 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-rows-[fit-content(100%)_fit-content(100%)] grid-cols-[1fr_fit-content(100%)] gap-8 align-middle max-w-3xl w-full row-start-2 items-center ">
        <h1 className="text-2xl w-fit">Калькулятор AllowedIPs для WireGuard</h1>
        <a
          className="cursor-pointer"
          onClick={() => {
            setStateAtKey("wireguardConfig", DEFAULT_STATE.wireguardConfig);
            setStateAtKey("additionalDisallowedIps", DEFAULT_STATE.additionalDisallowedIps);
          }}
        >
          Очистить
        </a>
        <form className="grid grid-cols-[fit-content(100%)_1fr] row-start-2 col-span-full items-center justify-items-end gap-5 w-full">
          <Label htmlFor="wg-config">Конфигурация WireGuard</Label>
          <Textarea
            id="wg-config"
            name="wireguardConfig"
            placeholder="Вставьте вашу конфигурацию WireGuard здесь..."
            className="min-h-[200px] font-mono text-sm"
            onChange={(e) => setStateAtKey("wireguardConfig", e.target.value)}
            value={state.wireguardConfig ?? ""}
          />

          <Label htmlFor="endpoint-region">Регион подключения</Label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger id="endpoint-region">
              <SelectValue placeholder="Выберите регион (необязательно)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" suppressHydrationWarning>Без изменений</SelectItem>
              {sortedRegions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.flag} {region.name} ({region.pingMin}-{region.pingMax}ms)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="endpoint-port">Порт подключения</Label>
          <Select value={selectedPort} onValueChange={setSelectedPort}>
            <SelectTrigger id="endpoint-port">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePorts.map((port) => (
                <SelectItem key={port.value} value={port.value}>
                  {port.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="additional-disallowed-ips">Дополнительные исключаемые IP</Label>
          <Input
            id="additional-disallowed-ips"
            name="additionalDisallowedIps"
            onChange={(e) => setStateAtKey("additionalDisallowedIps", e.target.value)}
            value={state.additionalDisallowedIps ?? ""}
          />
          <div className="flex items-center gap-2 col-span-full">
            <Checkbox
              id="include-private-ips"
              name="includePrivateIps"
              checked={PRIVATE_IPS.every((ip) => additionalDisallowedIps.includes(ip))}
              onCheckedChange={(checked) => {
                if (checked) {
                  const uniqueDisallowedIps = new Set([
                    ...PRIVATE_IPS,
                    ...additionalDisallowedIps,
                  ]);
                  setStateAtKey(
                    "additionalDisallowedIps",
                    [...uniqueDisallowedIps].join(", ")
                  );
                } else {
                  setStateAtKey(
                    "additionalDisallowedIps",
                    additionalDisallowedIps
                      .filter((ip) => !PRIVATE_IPS.includes(ip))
                      .join(", ")
                  );
                }
              }}
            />
            <label htmlFor="include-private-ips" className="text-sm">
              Исключить частные сети
            </label>
          </div>

          {isResolving && (
            <Alert className="col-span-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Определение адресов</AlertTitle>
              <AlertDescription>
                Определение IP адресов узлов...
              </AlertDescription>
            </Alert>
          )}
          {invalidIps.length > 0 && (
            <Alert variant="destructive" className="col-span-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>
                Неверный IP: {invalidIps.join(", ")}
              </AlertDescription>
            </Alert>
          )}
          
          <Alert className="col-span-2">
            <Info className="h-4 w-4" />
            <AlertTitle>Исключаемые адреса</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="font-mono text-sm space-y-1">
                {disallowedIps.length > 0 ? (
                  <>
                    <div>Интерфейс: {parsedConfig.interfaceAddress.join(", ") || "Нет"}</div>
                    <div>Узлы: {displayEndpoints.join(", ") || "Нет"}</div>
                    <div>Разрешенные IP узлов: {resolvedEndpoints.join(", ") || "Нет"}</div>
                    <div>Дополнительные: {additionalDisallowedIps.join(", ") || "Нет"}</div>
                    <div className="font-semibold mt-2">Всего исключено: {disallowedIps.join(", ")}</div>
                  </>
                ) : (
                  <div>Нет исключаемых адресов</div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          <div className="col-span-2 flex items-center justify-between gap-4">
            <Label>Итоговая конфигурация</Label>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(result);
              }}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-accent transition-colors"
            >
              <Copy className="h-4 w-4" />
              Копировать
            </button>
          </div>
          <textarea
            className="col-span-full w-full p-4 bg-accent font-mono text-sm min-h-[200px] resize-y"
            id="allowed-ips-output"
            readOnly
            value={result}
          />
        </form>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Albatrosicks/wireguard-config-allowed-ips-calculator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/wireguard-allowed-ips-calculator/github.svg"
            alt="Github icon"
            width={16}
            height={16}
            className="dark:invert"
          />
          GitHub
        </a>

        {mounted && (
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="bg-gray-100 p-2 rounded-xl dark:invert"
          >
            {currentTheme === "dark" ? (
              <Sun size={25} color="black" />
            ) : (
              <Moon size={25} color="black" />
            )}
          </button>
        )}
      </footer>
    </div>
  );
}
