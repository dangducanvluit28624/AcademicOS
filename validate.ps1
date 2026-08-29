pnpm lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm format:check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm test --run
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm test:e2e
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
