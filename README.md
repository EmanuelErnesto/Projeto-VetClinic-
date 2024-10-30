<h1 align="center">Projeto VetClinic 🐶🐱 </h1>

O projeto descrito a seguir se trata de uma API que armazena dados de tutores e pets, onde um pet pode ter apenas um tutor, mas o mesmo tutor pode ter vários pets.

## Pré-requisitos

Antes de começar, verifique se sua máquina possui os seguintes requisitos:

- **Node.js**: versão 20.15.0. Se você ainda não tem o Node.js instalado, siga o tutorial de instalação [aqui](https://www.alura.com.br/artigos/como-instalar-node-js-windows-linux-macos).

- **Git**: essencial para clonar o repositório. Baixe-o [aqui](https://www.git-scm.com/downloads).

## Instalação e Configuração

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/EmanuelErnesto/Projeto-VetClinic-.git
  

2. **Navegue Até a pasta do projeto**

  ```bash
  cd Projeto-VetClinic-

  ```

3. **Instale as dependências**

  ```bash

  npm install

  ```

4. **Configuração do ambiente**

- Crie um arquivo .env na raiz do projeto com as seguintes configurações:

  ```bash
  PORT=8000
  DATABASE=databaseVetClinic.db

  ```

⚠️ Certifique-se que a porta `8000` esteja livre para o correto funcionamento da aplicação

<h1>🔧 Executando a API</h1>

**Para iniciar a API em modo de desenvolvimento, execute:**

```bash
npm run start:dev

```

<h1>🪢Testes</h1>

**Execute os seguintes comandos para rodar os testes:**


- Testes de ponta a ponta e2e:

```bash
npm run test:e2e
```

- Testes de integração: 

```bash
npm run test:integration
```

- Testes de mutação:

```bash
npm run test:mutation
```

- Verificar cobertura de testes.

```bash
npm run test:cov
```

<h1>Tecnologias utilizadas</h1>

- Node.Js com Typescript.
- Banco de dados com sqlite
- Documentação com swagger.
- Segurança das rotas com Joi.
- Testes e2e (end to end) e de integração com vitest e de mutação com stryker.
- Integração contínua com github actions
- Validação de commits e pre-push com husky
- Logging com pino