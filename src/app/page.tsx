"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { excludeCidr, parseCidr } from "cidr-tools";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Moon, Sun } from "lucide-react";
import useHashState from "use-hash-state";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";

const PRIVATE_IPS = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/24"];

const DEFAULT_STATE = {
  allowedIps: "0.0.0.0/0",
  disallowedIps: "",
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
  allowedIps?: string;
  disallowedIps?: string;
};

export default function Home() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const { state, setStateAtKey } = useHashState<AppState>(DEFAULT_STATE, {
    usePushState: true,
    validateKeysAndTypes: false,
  });

  const allowedIps = parseIps(state.allowedIps);
  const disallowedIps = parseIps(state.disallowedIps);
  const invalidIps = [...allowedIps, ...disallowedIps].flatMap((ip) => {
    try {
      parseCidr(ip);
      return [];
    } catch {
      return [ip];
    }
  });

  let result = "";
  try {
    result = excludeCidr(allowedIps, disallowedIps).join(", ");
  } catch {}

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-10 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-rows-[fit-content(100%)_fit-content(100%)] grid-cols-[1fr_fit-content(100%)] gap-8 align-middle max-w-3xl w-full row-start-2 items-center ">
        <h1 className="text-2xl w-fit">{`Wireguard "AllowedIPs" Calculator`}</h1>
        <a
          className="cur"
          onClick={() => {
            setStateAtKey("allowedIps", DEFAULT_STATE.allowedIps);
            setStateAtKey("disallowedIps", DEFAULT_STATE.disallowedIps);
          }}
        >
          Clear
        </a>
        <form className="grid grid-cols-[fit-content(100%)_1fr] row-start-2 col-span-full items-center justify-items-end gap-5 w-full">
          <Label htmlFor="wg-allowed-ips">Allowed IPs</Label>
          <Input
            id="wg-allowed-ips"
            name="allowedIps"
            onChange={(e) => setStateAtKey("allowedIps", e.target.value)}
            value={state.allowedIps ?? ""}
          />

          <Label htmlFor="wg-disallowed-ips">Disallowed IPs</Label>
          <Input
            id="wg-disallowed-ips"
            name="disallowedIps"
            onChange={(e) => setStateAtKey("disallowedIps", e.target.value)}
            value={state.disallowedIps ?? ""}
          />
          <div className="flex items-center gap-2 col-span-full">
            <Checkbox
              id="include-private-ips"
              name="includePrivateIps"
              checked={PRIVATE_IPS.every((ip) => disallowedIps.includes(ip))}
              onCheckedChange={(checked) => {
                if (checked) {
                  const unqiueDisallowedIps = new Set([
                    ...PRIVATE_IPS,
                    ...disallowedIps,
                  ]);
                  setStateAtKey(
                    "disallowedIps",
                    [...unqiueDisallowedIps].join(", ")
                  );
                } else {
                  setStateAtKey(
                    "disallowedIps",
                    disallowedIps
                      .filter((ip) => !PRIVATE_IPS.includes(ip))
                      .join(", ")
                  );
                }
              }}
            />
            <label htmlFor="include-private-ips" className="text-sm">
              Exclude Private Networks
            </label>
          </div>

          {invalidIps.length > 0 && (
            <Alert variant="destructive" className="col-span-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Invalid IP: {invalidIps.join(", ")}
              </AlertDescription>
            </Alert>
          )}
          <div
            className="col-span-full w-full p-4 bg-accent"
            id="allowed-ips-output"
            contentEditable
            onBeforeInput={(e) => e.preventDefault()}
          >
            {result}
          </div>
        </form>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/tim-crisp/wireguard-allowed-ips-calculator"
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
          Github
        </a>

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
      </footer>
    </div>
  );
}
