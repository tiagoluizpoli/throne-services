#!/bin/sh

(cd apps/throne-management && node_modules/.bin/prisma generate)
(cd apps/throne-management && node_modules/.bin/prisma migrate deploy)
(cd apps/throne-management && node dist/src/main/server.js)
