-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tokenIdentifier" VARCHAR(40) NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_challenge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionIdentifier" VARCHAR(40) NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "session_token_identifier_index" ON "session"("tokenIdentifier");

-- CreateIndex
CREATE INDEX "session_challenge_session_identifier_index" ON "session_challenge"("sessionIdentifier");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_challenge" ADD CONSTRAINT "session_challenge_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_challenge" ADD CONSTRAINT "session_challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
