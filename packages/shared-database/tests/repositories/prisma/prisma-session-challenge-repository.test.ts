import 'reflect-metadata';

import { PrismaSessionChallengeRepository, SessionChallenge, prisma } from '../../../src';
import { mockSessionChallenge, mockTenant, mockUser } from '../../mocks';
import {
  deleteSessionChallenges,
  deleteUsersAndTenants,
  getSessionChallenges,
  insertSessionChallenges,
  insertUserAndTenants,
} from './prisma-setups';

const tenant = mockTenant();
const user = mockUser();
const sessionChallenges = [mockSessionChallenge({ tenant, user }), mockSessionChallenge({ tenant, user })];

type SutTypes = {
  sut: PrismaSessionChallengeRepository;
};

const makeSut = (): SutTypes => {
  const sut = new PrismaSessionChallengeRepository();
  return { sut };
};

describe('prisma-session-challenge-repository', () => {
  beforeAll(async () => {
    await insertUserAndTenants({ user, tenants: [tenant] });
  });

  afterAll(async () => {
    await deleteUsersAndTenants({ user, tenants: [tenant] });
  });

  describe('save', () => {
    afterAll(async () => {
      await deleteSessionChallenges(tenant);
    });

    it('should save a sessionChallenge to the database', async () => {
      const { sut } = makeSut();

      const sessionChallenge = sessionChallenges[0];

      await sut.save(sessionChallenge);

      const fetchedSessionChallenges = await getSessionChallenges(sessionChallenges);

      const savedSessionChallenge = fetchedSessionChallenges.find(
        (fetchedSessionChallenge) => fetchedSessionChallenge.sessionIdentifier === sessionChallenge.sessionIdentifier,
      );

      expect(savedSessionChallenge).toEqual(
        expect.objectContaining({
          id: sessionChallenge.id,
          sessionIdentifier: sessionChallenge.sessionIdentifier,
          tenantId: sessionChallenge.tenant?.id!,
          userId: sessionChallenge.userId,
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should throw when prisma throws', async () => {
      const { sut } = makeSut();
      vi.spyOn(prisma.session_challenge, 'create').mockImplementation(() => {
        throw new Error();
      });

      const promise = sut.save(sessionChallenges[0]);

      await expect(promise).rejects.toThrow();
    });
  });

  describe('getBySessionTokenIdentifier', () => {
    beforeAll(async () => {
      await insertSessionChallenges(sessionChallenges);
    });

    afterAll(async () => {
      await deleteSessionChallenges(tenant);
    });

    it('should return a sessionChallenge by session tokenIdentifier', async () => {
      const { sut } = makeSut();

      const sessionChallenge = sessionChallenges[0];

      const result = await sut.getBySessionIdentifier({
        sessionIdentifier: sessionChallenge.sessionIdentifier,
      });

      expect(result).toBeInstanceOf(SessionChallenge);
      expect(result).toEqual(
        expect.objectContaining({
          id: sessionChallenge.id,
          sessionIdentifier: sessionChallenge.sessionIdentifier,
          tenantCode: sessionChallenge.tenantCode,
          userId: sessionChallenge.userId,
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should return undefined when sessionChallenge not found', async () => {
      const { sut } = makeSut();

      const sessionChallenge = sessionChallenges[0];

      const result = await sut.getBySessionIdentifier({
        sessionIdentifier: 'not-found',
      });

      expect(result).toBeUndefined();
    });

    it('should throw when prisma throws', async () => {
      const { sut } = makeSut();
      vi.spyOn(prisma.session_challenge, 'findFirst').mockImplementation(() => {
        throw new Error();
      });

      const promise = sut.getBySessionIdentifier({
        sessionIdentifier: sessionChallenges[0].sessionIdentifier,
      });

      await expect(promise).rejects.toThrow();
    });
  });
});
