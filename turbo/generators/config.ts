import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('service', {
    description: 'Gera um novo serviço na pasta apps',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name:',
      },
      {
        type: 'list',
        name: 'type',
        choices: ['api'],
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
      },
      {
        type: 'input',
        name: 'port',
        message: 'Port:',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'apps/{{kebabCase name}}',
        templateFiles: 'service-template/**',
      },
      {
        type: 'add',
        path: 'apps/{{kebabCase name}}/.env.sample',
        templateFile: 'service-template/.env.sample',
      },
    ],
  })

  plop.setGenerator('package', {
    description: 'Gera uma nova lib na pasta packages',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nome:',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Descrição:',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/{{kebabCase name}}',
        templateFiles: 'package-template/**',
      },
    ],
  })
}
