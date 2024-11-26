# Changelog

Todas as alterações importantes dos projetos de solutions deverão ser documentadas nesse arquivo.

O formato é baseando no [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
e o mesmo adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Obs.: Alterações que precisem de ações manuais em aplicação em Homologação ou Produção também deverão ser incluidas nesse arquivo.

## Services

Cada serviço possui seu próprio arquivo changelog.md. Que podem ser encontrados em:

- [ocr](./apps/ocr/changelog.md)
- [liveness](./apps/liveness/changelog.md)
- [document-examination](./apps/document-examination/changelog.md)
- [background-check](./apps/background-check/changelog.md)
- [callback](./apps/callback/changelog.md)
- [datasources](./apps/datasources/changelog.md)
- [user-management](./apps/user-management/changelog.md)

## Outros

Temporariamente alguns projetos ainda não foram unificados no monorepo, são eles:

- Biometrics Validation
- Services Hub
- Services Docs
- Terraform

Nesse período pré-unificação, os changelogs desses projetos serão mantidos aqui:


# Biometrics Validation

## [Unreleased]

### Changed

- Alterado Busca e Validação de faces para registrar validações extras no banco de dados apenas se elas forem solicitadas na requisição.
- Alterado retorno da serpro para converter o valor de probabilidade de 0 a 1 pra 0 a 100.
- Alterado o numero máximo de 50 para 100 paginas em todas as rotas de busca paginada.
- Refatorado handler de upsert por completo para uma execução mais clara e fácil de entender.
- Adicionado logs simples no handler do upsert.
- Refatorado extrutura do banco para ganrantir que a tabela de chaves `Keys` não permita linhas duplicadas com o campo `DeletedAt` nulo.

### Action

- Executar comandos sql para corrigir registros anteriores
```sql
-- Validações extras
update "FaceSearch" set "CustomValidationsResult" = '{}' where "CustomValidations" = '[]';
update "Validation" set "CustomValidationsResult" = '{}' where "CustomValidations" = '[]';

-- probabilidade de 0 a 1 para 0 a 100
update
	"Biometric"
set
	"CustomValidationsResult" = jsonb_set("CustomValidationsResult",
	'{faceMatchesCpf, probability}',
	(("CustomValidationsResult"#>'{faceMatchesCpf, probability}')::numeric * 100)::text::jsonb)
where
	("CustomValidationsResult"#>'{faceMatchesCpf, probability}')::numeric between 0 and 1;
```


## 1.5.2 (2024-11-11)

### Fixed

- Corrigido erro na rota `upsert` onde a imagem não era salva em caso de inserção.

## 1.5.1 (2024-11-06)

### Changed

- Atualizado chamada do serviço Serpro da versão `v2` para `v4`

### Action

- Atualizar credenciais do serviço Serpro (tivit)

# Services Docs

## [Unreleased]

### Changed

- Atualizado documentação do serviço Background Check
- Atualizado documentação do serviço Documentoscopia
- Atualizado documentação do serviço Ocr

## 1.5.2 (2024-02-29)

### Changed

- Ocr
  - Especificado campos faltantes na tabela de campos presentes no response
  - Adicionado campos faltantes no exemplo em json do response.

## 1.5.1 (2024-02-20)

### Added

- Adicionado documentação sobre a busca de extrações de ocr
- Adicionado documentação sobre a busca de execução de documentoscopia

## 1.5.0 (2024-02-19)

### Added

- Adicionado Documentoscopia
- Adicionado Background Check

# Terraform

### [Unreleased]

### Added

- Adicionado serviço user-management ao ECS
- Adicionado define-auth-challenge lambda trigger ao cognito

### Changed

- Alterado o mfa para obrigatório no cognito

### Action

- Criar repositorio docker na conta da AWS `stoneage/user-management/api`


# Legenda

- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for any bug fixes.
- **Security** in case of vulnerabilities.
- **Action** for prd or hmg deployment actions
- **Internal** for internal infrastructure changes
