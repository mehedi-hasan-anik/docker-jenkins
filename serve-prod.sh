#!/bin/bash
# Run web + admin apps in production mode side-by-side.
# Make sure `pnpm build` (or `pnpm remove-all-and-build`) has run first.

pnpm web:serve:production &
pnpm admin:serve:production
