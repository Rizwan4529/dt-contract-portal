# Dar Al Taqwa — Contract Management Portal

React 19 + TypeScript + Vite, Tailwind v4, shadcn/ui, Redux Toolkit / RTK Query, react-hook-form + zod.
Backend: `dt-contract-apis` (Express, `/api/v1`).

## Setup

```bash
cp .env.example .env.local   # VITE_API_URL, VITE_FILES_URL
npm install
npm run dev                  # must run on :5173 (backend CORS whitelist)
```

## Structure

```
src/
  main.tsx              providers: Redux, Theme, Tooltip, Toaster
  App.tsx               router; protected routes share one SidebarLayout (Outlet)
  AppBootstrap.tsx      route guard (auth, auth-route redirect, permission)
  routes.ts             lazy pages + route config (drives router, sidebar, guards)
  app/
    store.ts, hooks.ts  store + typed useAppDispatch / useAppSelector
    services/baseApi.ts RTK Query base: bearer token, refresh on 401, global toasts
    services/apiHelpers.ts  unwrapResponse, providesList / invalidatesItem tag helpers
    features/<module>/  <module>Api.ts (injectEndpoints), slices
  components/
    ui/                 shadcn primitives (kebab-case)
    common/             reusable *Common components (FormCommons, DialogCommon, StatusBadge ...)
    layout/             SidebarLayout, AuthLayout, adminPageLayout (shared class strings)
    auth/               login / forgot password + AuthSchema
    <module>/           module components: Module.tsx, AddUpdateModule.tsx, moduleSchema.ts
  pages/<module>/Page.tsx  thin page shells
  hooks/                useTheme, usePermission, useAuthLogout, useDebouncedSearch, useCurrentRoute
  utils/                Constants (routes, API urls, enums), Helpers, permissions, statusStyles, secureStorage
  types/                API + entity types
```

## Conventions

- **Never hardcode** routes, API paths, enum values or labels — add them to `utils/Constants.ts`.
- **Colors come from tokens** in `index.css` (`bg-primary`, `text-muted-foreground`, `bg-success-soft` ...). No hex values in components.
- **Forms**: `useForm` + `zodResolver(schema)`, fields via `InputCommon` / `SelectCommon` / `TextAreaCommon` inside `<Form {...form}>`.
- **API calls**: generated RTK hooks + `.unwrap()` in `try/catch`. Success / error toasts are global for mutations; pass `meta: { silent: true }` to opt out.
- **Permissions**: `usePermission().can(PERMISSIONS.X)`; route access via `permission` in `routes.ts`. Map lives in `utils/permissions.ts` (mirrors backend CASL policies).
- Repeated UI (page header, cards, badges, dialogs) goes in `components/common` with a `Common` suffix.
- Contract status (Active / Expiring Soon / Expired) is derived client-side from `endDate` via `getContractStatus`.
- **Contracts + dashboard are UI-only for now** and read `src/mocks/contractsMock.ts` through `hooks/useContractList.ts`. To go live, swap the source in that hook for `useGetContractsQuery` (+ `useLookupOptions` for names), replace `findPreviewContract` with `useGetContractQuery`, call `addContract(toContractPayload(values))` in `AddUpdateContract`, then delete the mock file and the preview notices.
