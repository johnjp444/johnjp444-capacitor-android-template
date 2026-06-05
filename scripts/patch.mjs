#!/usr/bin/env node
/**
 * Rewrites capacitor.config.ts (and, after `cap add android`, the Android
 * resource files) from the workflow_dispatch inputs exposed as env vars:
 *   INPUT_WEBSITE_URL, INPUT_APP_NAME, INPUT_PACKAGE_ID, INPUT_THEME_COLOR
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const url = process.env.INPUT_WEBSITE_URL || "https://example.com";
const appName = process.env.INPUT_APP_NAME || "App";
const pkg = process.env.INPUT_PACKAGE_ID || "com.example.app";
const theme = process.env.INPUT_THEME_COLOR || "#000000";

function patch(file, replacements) {
  if (!existsSync(file)) return false;
  let src = readFileSync(file, "utf8");
  for (const [re, val] of replacements) src = src.replace(re, val);
  writeFileSync(file, src);
  return true;
}

// 1) capacitor.config.ts (always present)
patch("capacitor.config.ts", [
  [/appId:\s*"[^"]*"/, `appId: "${pkg}"`],
  [/appName:\s*"[^"]*"/, `appName: "${appName}"`],
  [/url:\s*"[^"]*"/, `url: "${url}"`],
]);

// 2) Android resources (only present after `cap add android` has run)
const strings = join("android", "app", "src", "main", "res", "values", "strings.xml");
patch(strings, [
  [/<string name="app_name">[^<]*<\/string>/, `<string name="app_name">${appName}</string>`],
  [/<string name="title_activity_main">[^<]*<\/string>/, `<string name="title_activity_main">${appName}</string>`],
  [/<string name="package_name">[^<]*<\/string>/, `<string name="package_name">${pkg}</string>`],
  [/<string name="custom_url_scheme">[^<]*<\/string>/, `<string name="custom_url_scheme">${pkg}</string>`],
]);

const colors = join("android", "app", "src", "main", "res", "values", "colors.xml");
patch(colors, [
  [/<color name="colorPrimary">[^<]*<\/color>/, `<color name="colorPrimary">${theme}</color>`],
  [/<color name="colorPrimaryDark">[^<]*<\/color>/, `<color name="colorPrimaryDark">${theme}</color>`],
  [/<color name="colorAccent">[^<]*<\/color>/, `<color name="colorAccent">${theme}</color>`],
]);

console.log("Patched:", { url, appName, pkg, theme });
