# Throne Services

Repositório contendo todos os projetos da API de serviços da equipe de Solutions.

## Estrutura do Projeto

// TODO

## Projetos incluídos

Este repositório é um monorepo que inclui diversos projetos. Para gerenciar o monorepo, utilizamos a ferramenta [Turborepo](https://turborepo.org/).

Os seguintes projetos estão neste monorepo:

- [throne-management](apps/throne-management/README.md)
- [user-management](apps/user-management/README.md)

Os seguintes pacotes estão nesse monorepo:

- [core](packages/core/README.md) - Pacote contendo todos os arquivos comuns a todos os projetos
- [logger](packages/logger/README.md) - Pacote responsável por criar o logger do projeto
- [shared-database](packages/shared-database/README.md) - Pacote contendo o schema, cliente, migrations, seeds e repositórios do banco de dados compartilhado

## Requisitos

Para executar os projetos desse monorepo é necessário ter as seguintes ferramentas instaladas:

- [pnpm](https://pnpm.io/pt/installation)
- [turborepo](https://turbo.build/repo/docs/getting-started/installation)
- [docker](https://docs.docker.com/engine/install/)
- [Task](https://taskfile.dev/installation/)

## Execução

Clone o projeto utilizando o comando:

```ssh
git clone git@gitlab.stoneage.com.br:dev/solutions/services.git
```

Utilize a task `setup` configurada no arquivo `Taskfile.yml` para realizar o setup.

```ssh
task setup
```

Essa tarefa irá rodar os seguintes comando e configurações:

1. Instalar todas as dependências com o comando `pnpm install`
2. Gerar toda a tipagem do prisma para os projetos necessários com o comando `pnpm prisma:generate`
3. Criar todos os arquivos .env utilizando como base o .env.sample
4. Subir o banco de dados e o minio no docker
5. Realizar o setup dos diretórios do minio
6. Criar o banco de dados e executar as seeds com o comando `pnpm db:sync`

## Padrões Utilizados

### Commits

Os commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), com o escopo sendo obrigatório.

Para garantir que todos os commits sigam esse padrão, antes de cada commit é realizada uma verificação para assegurar que a mensagem do commit respeita o formato esperado.

Como estamos em um monorepo, é importante ter visibilidade sobre qual projeto um determinado commit se refere. Para isso, tornamos o escopo obrigatório e configuramos um enum para padronizar os escopos utilizados.

Os possíveis escopos são: `background-check`, `callback`, `datasources`, `document-examination`, `hub`, `liveness`, `ocr`, `configs`, `dev-tools`, `packages`, `multiple`, `root`, `user-management`.

Um commit que contém alterações em um determinado serviço deve ter o escopo com o nome desse serviço. Caso a alteração seja realizada em mais de um serviço, utilize o escopo `multiple` e, caso a alteração seja realizada em arquivos gerais, utilize o escopo `root`.

### Tags

Todas as tags devem ser criadas utilizando o padrão `projeto@semver`, por exemplo, `ocr@1.2.3`.

### Criação de Novos Serviços

Para criar um novo serviço, utilize o recurso [Generators](https://turbo.build/repo/docs/guides/generating-code) do Turbo. Execute o comando abaixo na raiz do projeto:

> **Nota:** Para executar o comando abaixo, é necessário ter o Turbo instalado globalmente. Veja [Requisitos](#requisitos).

```sh
turbo generate service
```

Será necessário informar o nome do serviço, o tipo (API), a descrição e a porta. Após esse preenchimento, todos os arquivos necessários serão gerados e incluídos na pasta apps.

Além disso é necessário configurar o novo serviço em alguns lugares.

1. Abra o arquivo `commitlint.config.js` e inclua o nome do serviço na lista de scope-enum.
2. Abra o arquivo `Taskfile.yml` e inclua o nome do serviço no `for` da task `setup.envs`
3. Atualize a documentação com informações do novo serviço em [projetos incluídos](#projetos-incluídos) e [padrões utilizados -> commits](#commits)

Agora, basta executar `pnpm install`, depois `pnpm prisma:generate` e seu serviço estará totalmente configurado com um template inicial.
