#!/bin/sh

(cd apps/user-management && node_modules/.bin/prisma generate)
(cd apps/user-management && node_modules/.bin/prisma migrate deploy)
(cd apps/user-management && node dist/src/main/server.js)
