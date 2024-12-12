import type { session, tenant } from '../../../../drizzle/schemas/schema';
import { Session } from '../../../entities';
import { TenantMapper } from './tenant-mapper';

type SessionPersistence = {
  tenant: typeof tenant.$inferSelect | null;
  session: typeof session.$inferSelect;
};

export class SessionMapper {
  static toDomain(raw: SessionPersistence[]): Session | undefined {
    const persistence = raw[0];

    const { session: sessionPersistence, tenant: tenantPersistence } = persistence;

    if (!sessionPersistence || !tenantPersistence) {
      return undefined;
    }

    return Session.create(
      {
        tenantCode: tenantPersistence.code,
        refreshTokenIdentifier: sessionPersistence.refreshTokenIdentifier,
        tokenIdentifier: sessionPersistence.tokenIdentifier,
        userId: sessionPersistence.userId,
        createdAt: sessionPersistence.createdAt,
        tenant: TenantMapper.toDomain(tenantPersistence),
      },
      sessionPersistence.id,
    );
  }
}
