<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
# TCC_users_ms - Microserviço de Usuários
## Description

Este é o microserviço de Usuários do sistema desenvolvido para o meu Trabalho de Conclusão de Curso (TCC), utilizando o framework [Nest](https://github.com/nestjs/nest)

## ✨ Funcionalidades

- **CRUD de usuários** (Criar, Ler, Atualizar, Deletar)
- **Autenticação de usuários** (com geração de token JWT)
- **Emissão de eventos** para outros microserviços:
  - `user_created`
  - `user_updated`
  - `user_deleted`
  - `user_logged`
  - `user_password_change`
 
  Todos os eventos são focados em *Auditoria*.

## 📦 Parte de uma Arquitetura de Microserviços

Este serviço se comunica com os demais microserviços da aplicação através de mensagens assíncronas, utilizando um broker de mensageria **RabbitMQ**.

## 🛠 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- TypeScript
- JWT para autenticação
- Docker (opcional para containerização)
- Mensageria RabbitMQ
- Documentação Swagger
- Jest para Testes
- ESLint para padrões de código

---

> Este projeto faz parte de um sistema maior desenvolvido como requisito para o TCC.

## Setup do Projeto

Instalar dependências do projeto:
```bash
$ pnpm install
```

## Compilação do projeto

Três scripts para cada caso de inicialização:
```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

Scripts de testes (em desenvolvimento):
```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
