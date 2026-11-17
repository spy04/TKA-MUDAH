# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Authentication

The client uses JWT Bearer authentication only. On successful login or registration,
the returned `accessToken` is retained in `sessionStorage` for the current browser tab
and sent as `Authorization: Bearer <token>` to protected APIs. The token is checked
with `GET /me` after a reload; a `401` clears it and protected routes redirect to login.
There is no `/auth/refresh` request, refresh cookie, or automatic JWT extension.
Passwords are only submitted to login/register and are never stored by the client.

Logout sends the current Bearer token to `POST /auth/logout` for server-side auditing,
then always clears the local session. With stateless JWTs, this cannot revoke an already
issued token before expiry unless the Go backend adds a server-side revocation mechanism
(for example, a denylist keyed by `jti` with an expiry matching the token).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
