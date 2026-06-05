import type { CapacitorConfig } from "@capacitor/cli";

// These placeholder values are rewritten by scripts/patch.mjs at build time
// using workflow_dispatch inputs.
const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "App",
  webDir: "www",
  server: {
    url: "https://example.com",
    cleartext: false,
    androidScheme: "https",
  },
};

export default config;
