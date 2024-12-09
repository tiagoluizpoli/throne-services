## Logger

Este pacote tem como objetivo fornecer uma maneira de log de forma centralizada e padronizada.

### Instalação

```bash
pnpm add @solutions/logger
```

### Uso
`Importante` Esse pacote foi pensado para funcionar com a biblioteca [tsyringe](https://github.com/microsoft/tsyringe), por isso, é necessário registrar o container com o `Logger` e `LoggerProps` antes de usá-lo.


#### Registro do container
```ts
import { Logger, type LoggerProps } from '@solutions/logger'

container.register<LoggerProps>('LoggerProps', {
	useValue: {
		level: 'info',
		targets: [
			{ name: 'console' },
			// {
			// 	name: 'file',
			// 	config: {
			// 		fileFolder: './logs',
			// 	},
			// },
		],
	},
})

container.register<Logger>('Logger', Logger, {
  lifecycle: Lifecycle.ResolutionScoped, // Essa linha torna a resolução do logger singleton
})

```

#### Utilização do logger
```ts
import { container } from 'tsyringe'
import { Logger } from '@solutions/logger'

// Ele pode ser resolvido diretamente no código dessa forma
const logger = container.resolve<Logger>('Logger')

// Ou resolvido pelo próprio tsyringe através da injeção via constructor.
const ClasseQueLoga = class {
  constructor(@inject('Logger') private readonly logger: Logger) {}

  public logar() {
    this.logger.info('Hello World that will be printed!')
    this.logger.debug('Hello World that wont be printed!')
  }
}

```

### Configurações
O Logger precisa de dois campos para funcionar corretamente.

#### level
Nesse campo podemos definir o nível de log que será registrado. Os valores possíveis são:

- fatal
- error
- warn
- info
- debug
- trace

> O nível do log é tratado de forma crescente de `fatal` para `trace`.
>
><b>Exemplo</b>: Se o level for `info` os logs de `fatal`, `error`, `warn` e `info` serão registrados.

#### targets
Neste campo podemos adicionar os destinos dos logs e suas configurações. (quando existentes)

O campo consiste em um array de objetos, onde cada objeto tem o campo `name` e quando necessário, o campo `config`.

hoje temos os seguintes destinos definidos (e suas configurações):
- console
- file
  - fileFolder: _destino dos arquivos de log no formato `json`_

> O `console` é o destino padrão, caso nenhum target seja definido, ele será usado.

<b>Exemplo</b>:
```ts
container.register<LoggerProps>('LoggerProps', {
	useValue: {
		level: 'info',
	},
})
```


### Avançado

#### Tags
As tags são um recurso muito útil para rastrear o log de forma mais eficiente. Eles são utilizados para adicionar informações extras ao log, como o nome do usuário, o endereço de IP, o ID de algum recurso ou objeto, etc.

##### `Adicionar Tag`

As tags podem ser adicionadas de duas formas:

- Através da função `addTag`
  - As tags adicionadas através da função `addTag` são adicionadas aos logs de forma persistente, ou seja, elas estarão presentes em todos os logs até que sejam removidas.
- Diretamente no ato do log, através de um objeto após a mensagem de log.
  - Dessa forma, podemos passar quantas tags quisermos e a tag será utilizada apenas naquele registro em específico.
  - Nesse formato as tags devem ser adiconadas no formato chave-valor (key-value). em um objeto apóes a mensagem.

<b>Exemplos</b>:

Através da função `addTag`
```ts
    this.logger.addTag('extractionId', '063772ea-243b-42b1-add1-b702fba6d2c4')
```
Através do objeto após a mensagem de log
 ```ts
    this.logger.info('Hello World that will be printed!', {
      extractionId: '063772ea-243b-42b1-add1-b702fba6d2c4'
    })
```

##### `Remover Tag`
É possível remover tags adicionadas através da função `addTag` de duas formas:
- Através da função `removeTag` (Remove tags individualmente)
- Através da função `clearTags` (Remove todas as tags)

<b>Exemplos</b>:
Através da função `removeTag`
```ts
    this.logger.removeTag('extractionId')
```
Através da função `clearTags`
```ts
    this.logger.clearTags()
```
