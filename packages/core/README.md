# Core package

Esse pacote contém contratos e funções comuns a todos os projetos.

## Estrutura

Esse projeto, assim como os serviços, segue a estrutura de pastas abaixo onde cada pasta representa uma camada da `clean architecture`:

```
src/
|-- api/          // Camada de api, contem os controladores que serão chamados pelas rotas
|   application/  // Camada de aplicação, contem as implementações de casos de uso
|   domain/       // Camada de domínio, contem as entidades e contratos de caso de uso
|   main/         // Camada principal, contem a inicialização da aplicação e a injeção de dependências
```

## Domain

A camada de domínio contém as entidades e contratos de caso de uso. As entidades são objetos que representam os dados que serão manipulados pela aplicação. Os contratos são interfaces que definem os métodos que devem ser implementados pelas classes que os implementam.

Nessa camada temos os seguintes arquivos:

- `entities/entity.ts`: Contém a definição de uma entidade base.
- `errors/use-case-error.ts`: Contém a definição de um erro base de um caso de uso.
- `errors/unexpected-error.ts`: Contém a definição de um erro inesperado.
- `logic/either.ts`: Contém a definição de um tipo que pode ser um valor ou um erro.
- `types/pagination-params.ts`: Contém a definição de parâmetros de paginação.
- `types/pagination-result.ts`: Contém a definição de um resultado de paginação.
- `types/search-params.ts`: Contém a definição de parâmetros de busca.

## Application

A camada de aplicação contém as implementações de casos de uso. Os casos de uso são classes que implementam os contratos definidos na camada de domínio. Eles são responsáveis por orquestrar a execução de uma tarefa específica.

Nessa camada temos os seguintes arquivos:

- `contracts/repositories/get-all-repository.ts`: Contém o contrato de um repositório que retorna todos os registros.
- `contracts/repositories/get-by-field-repository.ts`: Contém o contrato de um repositório que retorna um registro por um determinado campo.
- `contracts/repositories/save-repository.ts`: Contém o contrato de um repositório que salva um registro.

Os arquivos de contrato de repositório são interfaces que definem os métodos que devem ser implementados por um repositório. Eles são utilizados para garantir que os repositórios implementem os métodos necessários.


## API

A camada de api contém os controladores que serão chamados pelas rotas. Eles são responsáveis por receber as requisições, chamar os casos de uso e retornar as respostas.

Nessa camada temos os seguintes arquivos:

- `contracts/controllers.ts`: Contém os contratos de controladores.
- `contracts/http.ts`: Contém os contratos de requisição e resposta http.
- `errors/bad-request-error.ts`: Contém a definição de um erro de requisição inválida.
- `errors/http-error.ts`: Contém a definição de um erro http.
- `errors/invalid-param-error.ts`: Contém a definição de um erro de parâmetro inválido.
- `errors/server-error.ts`: Contém a definição de um erro de servidor.
- `errors/unauthorized-error.ts`: Contém a definição de um erro de não autorizado.
- `errors/unprocessable-entity-error.ts`: Contém a definição de um erro de entidade não processável.
- `helpers/base-error-mapper.ts`: Contém uma classe base para mapear erros.
- `helpers/error-helper.ts`: Contém funções auxiliares para criar erros.
- `helpers/http-helper.ts`: Contém funções auxiliares para criar respostas http.


## Main

A camada principal contém a inicialização da aplicação e a injeção de dependências. Ela é responsável por configurar a aplicação e iniciar o servidor.

Nessa camada temos os seguintes arquivos:

- `adapters/express-route-adapters.ts`: Contém funções que adaptam os controladores para serem chamados pelas rotas do express.
- `adapters/express-stream-route-adapters.ts`: Contém funções que adaptam os controladores para serem chamados pelas rotas do express utilizando streams.
- `configs/common-env.ts`: Contém a definição de variáveis de ambiente comuns a todos os projetos.
- `configs/database-env.ts`: Contém a definição de variáveis de ambiente relacionadas ao banco de dados.
- `configs/server-env.ts`: Contém a definição de variáveis de ambiente relacionadas ao servidor.
- `decorators/controller-decorators.ts`: Contém decoradores que são utilizados para marcar os controladores.
- `decorators/decorator-types.ts`: Contém os tipos de decoradores.
- `routes/common-routes.ts`: Contém rotas comuns a todos os projetos.
- `server.ts`: Contém a inicialização do servidor.

