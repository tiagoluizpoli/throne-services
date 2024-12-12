import { type Controller, GetAllExamplesController, getAllExamplesRequestSchema } from '@/api';
import { DbGetAllExamples, type ExamplesRepository } from '@/application';
import type { GetAllExamples } from '@/domain';
import { PrismaExamplesRepository } from '@/infrastructure';
import { env } from '@/main/config';
import { ErrorHandlingControllerDecorator, ValidationControllerDecorator } from '@/main/decorators';
import { container } from 'tsyringe';

const isLocalEnv = env.baseConfig.environment === 'local';
const isProdEnv = env.baseConfig.environment === 'prod';

// Infra injections

// Repositories
container.register<ExamplesRepository>('ExamplesRepository', PrismaExamplesRepository);

// usecases
// Examples
container.register<GetAllExamples>('GetAllExamples', DbGetAllExamples);

// Api
container.register<Controller>('GetAllCategoriesController', {
  useFactory: () => {
    return new ErrorHandlingControllerDecorator(
      new ValidationControllerDecorator(
        new GetAllExamplesController(container.resolve('GetAllExamples')),
        getAllExamplesRequestSchema,
      ),
    );
  },
});
