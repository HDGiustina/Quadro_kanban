# Kanban - Projeto em React

Este projeto consiste em uma aplicação web no modelo **Kanban**, desenvolvida com **React** e **Vite**, com foco na organização e gerenciamento de tarefas. A aplicação permite criar, editar e acompanhar tarefas por status, aplicando regras de negócio para validações, além de testes automatizados.

---

## Tecnologias Utilizadas

- React
- Vite
- React Router DOM
- Tailwind CSS
- Jest

---

## Funcionalidades

- Criação e edição de tarefas
- Alteração de status das tarefas
- Validação de regras de negócio (ex.: status "Atrasado" condicionado à data limite)
- Interface organizada no formato Kanban
- Testes automatizados para validações e comportamentos do sistema

---

## Estrutura do Projeto

- `src/components`  
  Componentes visuais da aplicação, incluindo modais e cards de tarefas.

- `src/context`  
  Contexto global responsável pelo gerenciamento das tarefas e regras de negócio.

- `src/__tests__`  
  Testes automatizados utilizando Jest e Testing Library.

- `src/pages`  
  Páginas principais da aplicação.

---

## Instalação e Execução

Clone o repositório e instale as dependências:

```bash
npm install
````

Para rodar o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```

Para gerar a build de produção:

```bash
npm run build
```

---

## Testes Automatizados

Para executar todos os testes:

```bash
npm run test
```

---

## Padrões e Qualidade de Código

* Componentização seguindo boas práticas do React
* Regras de negócio centralizadas no contexto


