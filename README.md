# Projeto Next.js com Tailwind CSS - Teste Genezys

Este projeto é uma aplicação web desenvolvida com **Next.js** e **Tailwind CSS**. Ele inclui uma interface de registro, login, recuperação de senha, e uma página home para gerenciamento de usuários. O projeto implementa autenticação e controle de sessão usando **Context API**.

## Funcionalidades Principais
- **Registro de Usuário**: Criação de novas contas de usuário com validação de e-mail e CEP.
- **Login**: Autenticação com armazenamento opcional de dados usando a funcionalidade "Lembrar das informações".
- **Recuperação de Senha**: Possibilidade de recuperação de senha através de um link enviado ao e-mail (simulado).
- **Página Home**: Exibição de uma lista de usuários cadastrados.
- **Funções de Administrador**: Usuários registrados com o e-mail `admin@admin.com` terão funcionalidades administrativas adicionais, como:
  - Bloquear ou desbloquear usuários.
  - Excluir usuários da lista.

## Tecnologias Utilizadas
- **Next.js**: Framework React para renderização do lado do servidor e client-side.
- **Tailwind CSS**: Biblioteca para estilização utilizando classes utilitárias.
- **Context API**: Gerenciamento de estado global para controle de autenticação e sessão.
- **React Icons**: Ícones para botões de ação na interface do administrador.
- **CryptoJS**: Biblioteca utilizada para criptografia e descriptografia de dados, garantindo a segurança das informações dos usuários, como senhas.

## Requisitos
- **Node.js** (versão 12 ou superior)
- **NPM** ou **Yarn**

## Como Executar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Instalar Dependências
Instale as dependências do projeto com o comando:
```bash
npm install
```
Ou, se você preferir usar o **Yarn**:
```bash
yarn install
```

### 3. Executar o Projeto
Inicie o servidor de desenvolvimento com o seguinte comando:
```bash
npm run dev
```
Ou, se estiver usando **Yarn**:
```bash
yarn dev
```

O projeto estará rodando no endereço [http://localhost:3000](http://localhost:3000).

## Detalhes Importantes

### Login e Registro
- **Usuário Comum**: Qualquer e-mail pode ser usado para criar uma conta.
- **Usuário Administrador**: Para acessar as funcionalidades administrativas, como bloqueio e exclusão de usuários, crie uma conta usando o e-mail `admin@admin.com`. Qualquer senha pode ser usada para este e-mail.

### Funcionalidades Administrativas
- Somente o usuário `admin@admin.com` pode:
  - **Bloquear/Desbloquear usuários**: Ao bloquear um usuário, ele não poderá fazer login.
  - **Excluir usuários**: Remover permanentemente um usuário da lista.

## Estrutura do Projeto
- **/components**: Componentes reutilizáveis como botões, inputs e a barra de navegação.
- **/context**: Implementação do Context API para controle de autenticação e sessão.
- **/pages**: Páginas principais do projeto, incluindo login, registro, recuperação de senha e a home.
- **/public**: Imagens e arquivos públicos, como o logo da aplicação.

## Licença
Este projeto é licenciado sob a [MIT License](LICENSE).
