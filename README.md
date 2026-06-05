# capacitor-android-template

Minimal Capacitor Android build template. Driven entirely by GitHub Actions
`workflow_dispatch` — receives website URL + branding inputs, produces a
signed APK/AAB artifact, and POSTs status back to the calling app.

## Required GitHub repo secret

| Secret | Purpose |
|---|---|
| `CAPACITOR_WEBHOOK_SECRET` | HMAC-SHA256 key shared with the calling app; used to sign the status callback. Must match the `CAPACITOR_WEBHOOK_SECRET` runtime secret in the app. |

## Branch

The workflow must live on the repo's **default branch** (`main`).
`workflow_dispatch` only resolves against the default branch.

## Workflow

`.github/workflows/capacitor-android.yml` — `name: Capacitor Android Build`,
trigger `workflow_dispatch`. Inputs: `build_id`, `website_url`, `app_name`,
`package_id`, `output` (`apk`|`aab`), `callback_url`, `theme_color`.

## Dispatch URL

```
POST https://api.github.com/repos/<owner>/<repo>/actions/workflows/capacitor-android.yml/dispatches
```

Body:
```json
{ "ref": "main", "inputs": { ...above... } }
```
