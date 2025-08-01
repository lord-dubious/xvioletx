# CRUSH.md – Unified Coding & Workflow Rules

Follow the 30 rules below to keep the project consistent, secure, and maintainable. These supersede any conflicting guidance unless explicitly overridden by `.windsurf/rules/*`.

## Core Rules (30 Lines)

1. **Consult `.windsurf/rules/*` before coding.**
2. **Enable TypeScript `strict`; ban `any`.**
3. **Import `wasp/...` in `.ts`/`.tsx` & `@src/...` only in `main.wasp`.**
4. **Place feature code in `src/{feature}` with matching `//#region` in `main.wasp`.**
5. **Define entities in `schema.prisma`; migrate via `wasp db migrate-dev`.**
6. **Keep queries/actions in `{feature}/operations.ts` (queries read, actions mutate).**
7. **Never mutate state inside queries.**
8. **Use optimistic UI only when beneficial.**
9. **Root component must render `<Outlet />`.**
10. **Adopt ShadCN UI per `ui-components.md`; ensure a11y.**
11. **Run Prettier + ESLint (`npm run lint`) before commits.**
12. **CI must fail on unused variables or lint errors.**
13. **Write semantic commit messages (`feat:`, `fix:`, etc.).**
14. **Log every server action with contextual data.**
15. **Throw custom errors; return helpful messages.**
16. **Store secrets in `.env` — never commit them.**
17. **Write unit tests for business logic; E2E via Playwright (`npm run e2e:playwright`).**
18. **Run a single Playwright test with `npx playwright test file.spec.ts`.**
19. **Validate deps via `taskmaster validate`; commit generated tasks.**
20. **Update README/docs with new features.**
21. **Avoid committing large binaries; use Git LFS if needed.**
22. **Refactor duplicate code immediately (DRY).**
23. **Add runtime validation (e.g., `zod`) for external data.**
24. **Use relative imports within `src`, avoid path aliases.**
25. **Read config from env vars (`process.env`).**
26. **Document new patterns in `.windsurf/rules`.**
27. **Update workflows/scripts after significant changes.**
28. **Start app with `wasp start`; reset DB via `wasp db clean-dev`.**
29. **Run `npm run typecheck` before pushing.**
30. **Continuously refine rules per `self_improve.md`.**



## Windsurf Rules

Refer to the following files for Windsurf-specific rules:
- `.windsurf/rules/advanced-troubleshooting.md`
- `.windsurf/rules/authentication.md`
- `.windsurf/rules/database-operations.md`
- `.windsurf/rules/deployment.md`
- `.windsurf/rules/dev_workflow.md`
- `.windsurf/rules/possible-solutions-thinking.md`
- `.windsurf/rules/project-conventions.md`
- `.windsurf/rules/self_improve.md`
- `.windsurf/rules/taskmaster.md`
- `.windsurf/rules/ui-components.md`
- `.windsurf/rules/wasp-overview.md`
- `.windsurf/rules/windsurf_rules.md`
- `.windsurf/rules/x.md`
- and design_system.md
ui.md for design
