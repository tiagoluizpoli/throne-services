# Changelog

Todas as alterações importantes dos projetos de solutions deverão ser documentadas nesse arquivo.

O formato é baseando no [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
e o mesmo adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Adicionado rota de consulta de usuário `GET /api/v1/auth/get-user`
- Adicionado rota de troca de senha `POST /api/v1/auth/change-password`
- Adicionado rota de recuperação de senha perdida `POST /api/v1/auth/forgot-password`
- Adicionado rota de confirmação de recuperação de senha `POST /api/v1/auth/confirm-forgot-password`
- Adicionado rota de signout `POST /api/v1/auth/signout`

### Changed

- Adiconado alguns novos erros necessários para o fluxo de autenticação

### Action

- Aplicar política `AmazonCognitoPowerUser` no usuário utilizado pelos serviço user-management no IAM (Através da interface de gerenciamento de usuários do AWS)

## 1.0.0 (2024-10-04)

### Added

- Endpoint de listagem de tenants de um determinado usuário com credenciais
- Endpoint de signin que pode retornar os tokens de acesso ao um challenge
- Endpoint de resposta do challenge
- Endpoint de autorização (consumido pela lambda de autorização)
- Endpoint de atualizar o token (refresh-token)

### Internal

- Adicionado logger (@solutions/logger)
- Alterado modo de execução em dev para usar o tsup
- Alterado dockerfile para executar o prisma:generate antes do build
- Terraform local

# Legenda

- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for any bug fixes.
- **Security** in case of vulnerabilities.
- **Action** for prd or hmg deployment actions
- **Internal** for internal infrastructure changes
