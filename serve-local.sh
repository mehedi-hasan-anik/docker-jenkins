#!/bin/bash
# Run web + admin apps in dev mode side-by-side.

pnpm web:serve &
pnpm admin:serve
