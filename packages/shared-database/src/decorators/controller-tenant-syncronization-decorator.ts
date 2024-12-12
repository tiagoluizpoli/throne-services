import { type Controller, unauthorized } from '@solutions/core/api';
import type { TenantsRepository as ServiceTenantsRepository } from '@solutions/core/application';
import { Tenant as ServiceTenant } from '@solutions/core/domain';
import type { Constructor } from '@solutions/core/main';

import { container } from 'tsyringe';
import type { Tenant as CentralTenant } from '../entities/tenant';
import type { TenantsRepository as CentralTenantsRepository } from '../repositories';

type ControllerTenantSyncronizationHandlingProps = {
  serviceTenantsRepositoryToken: string;
  centralTenantsRepositoryToken: string;
  callback?: (tenant: CentralTenant) => Promise<void>;
};

export const controllerTenantSyncronizationHandling = ({
  serviceTenantsRepositoryToken,
  centralTenantsRepositoryToken,
  callback,
}: ControllerTenantSyncronizationHandlingProps) => {
  return <T extends Constructor<Controller>>(target: T) => {
    const originalHandle = target.prototype.handle;

    target.prototype.handle = async function (request: any) {
      const serviceTenantsRepository = container.resolve<ServiceTenantsRepository>(serviceTenantsRepositoryToken);
      const centralTenantsRepository = container.resolve<CentralTenantsRepository>(centralTenantsRepositoryToken);

      const { tenant } = request;
      const serviceTenant = await serviceTenantsRepository.getByCode({ code: tenant });

      if (!serviceTenant) {
        const centralTenant = await centralTenantsRepository.getByCode({ code: tenant });

        if (!centralTenant) {
          return unauthorized();
        }

        const newServiceTenant = ServiceTenant.create({
          code: centralTenant.code,
        });

        await serviceTenantsRepository.save(newServiceTenant);

        await callback?.(centralTenant);
      }

      const httpResponse = await originalHandle.apply(this, [request]);

      return httpResponse;
    };

    return target;
  };
};
