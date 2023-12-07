# Reta-Final

![Badge](https://img.shields.io/badge/Versão-V1.0.0-%237159c1?style=plastic&color=ffa500)

## Conteúdo

- [Sobre](#sobre)
- [Instalação](#instalacao)
- [Pré-requisitos](#pre-requisitos)
- [Rodando o Back-end](#rodando-o-back-end)
- [Testes](#testes)
- [Tecnologias](#tecnologias)
- [Link](#link)

## Sobre

[Reta-Final](https://reta-final.herokuapp.com/) é um projeto que faz parte da disciplina Prática Profissional em Análise e Desenvolvimento de Sistemas da Universidade Presbiteriana Mackenzie.

Esse projeto visa o desenvolvimento e a implementação de uma aplicação web para a organização e divulgação de campeonatos de uma escola de futebol.

## Instalação

### Pré-requisitos

Antes de começar, precisamos ter instalado no nosso computador:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/)
- Um editor de código, ex: [VSCode](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/) para instalar o banco de dados
- Database UI client para criação das tabelas - [Postbird](https://github.com/Paxa/postbird)

### Rodando o Back-end

1. Clone o repositório.

```bash
git clone git@github.com:Pamcosta1712/reta-final.git
```

2. Acesse a pasta do projeto pelo terminal/cmd

```bash
cd reta-final
```

3. Agora vamos usar o package manager [npm](https://www.npmjs.com/) para instalar todas as bibliotecas necessárias para inicializar a aplicação.

```bash
npm install
```

4. Terminado a instalação das bibliotecas, vamos iniciar o banco de dados:

```bash
docker compose up
```

- Vamos usar o Postbird para nos conectarmos ao "master user". O username será **postgres** e o password é aquele definido no arquivo **docker-compose.yaml**

- Após conectado, vamos na aba **query** e executamos esse código:
  - **IMPORTANTE:** Executar uma linha por vez do código abaixo.

```bash
create database retafinal;
create user retafinaluser with encrypted password 'retafinal12345';
grant all privileges on database retafinal to retafinaluser;
```

- Vamos nos logar novamente no Postbird, desta vez usando a senha que acabamos de criar.

- Podemos criar as tabelas agora, também utilizando a aba **query**. Para isso vamos copiar o conteúdo do arquivo **database-create.sql** e executar.

5. Em outra tab (aba) do terminal, vamos executar a aplicação em modo de desenvolvimento.

```bash
npm start dev
```

6. O servidor iniciará na porta:3000 - acesse <http://localhost:3333>

## Testes

Em produção..

## Tecnologias

As seguintes tecnologias são usadas neste projeto:

**Front-end:** HTML, CSS, JavaScript.

**Back-end:** [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/) e [NunJucks](https://mozilla.github.io/nunjucks/).

**Database:** [PostgreSQL](https://www.postgresql.org/).

## Link

🚨🚨🚨
**Attention:** Porque este aplicativo utiliza um provedor de hospedagem gratuito, quando sem uso, ele é interrompido automaticamente. Para acessar o aplicativo, será necessário aguardar alguns segundos após fazer o login para ter acesso ao site.

**Link para o site:** https://reta-final.onrender.com/campeonatos
