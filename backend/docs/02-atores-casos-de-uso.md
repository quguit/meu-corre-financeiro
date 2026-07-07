# 👥 Atores e Casos de Uso

Projeto: Meu Corre Financeiro

---

# 1. 🎭 Identificação dos Atores

## 1.1 Atores Primários

### 👤 Usuário

Representa a pessoa que utiliza o sistema para gerenciar finanças.

Responsabilidades:

- Autenticar-se
- Criar e gerenciar organização
- Cadastrar contas
- Registrar transações
- Consultar saldos
- Gerar relatórios

---

### 👑 Administrador da Organização

Extensão do ator Usuário com privilégios adicionais.

Responsabilidades adicionais:

- Gerenciar membros da organização
- Definir permissões
- Configurar estrutura organizacional

---

## 1.2 Atores Secundários (Futuros)

### 🏦 Sistema Bancário (Integração futura)

- Fornecer extratos
- Permitir conciliação bancária
- Sincronizar movimentações

---

### 🔄 Sistema Meu Corre CRM (Futuro)

- Enviar dados de vendas
- Integrar contas a receber
- Integrar fluxo de caixa

---

# 2. 📌 Casos de Uso

---

## UC01 – Autenticar Usuário

**Ator:** Usuário

Fluxo Principal:

1. Informar email
2. Informar senha
3. Sistema valida credenciais
4. Sistema libera acesso

Fluxo Alternativo:

- Credenciais inválidas → exibir erro

---

## UC02 – Criar Organização

**Ator:** Usuário

Fluxo Principal:

1. Informar nome da organização
2. Sistema cria organização
3. Sistema associa usuário como administrador

---

## UC03 – Gerenciar Membros da Organização

**Ator:** Administrador

Fluxo Principal:

1. Selecionar organização
2. Convidar usuário
3. Definir papel (admin ou membro)

---

## UC04 – Cadastrar Conta

**Ator:** Usuário

Fluxo Principal:

1. Informar nome da conta
2. Selecionar tipo (banco, cartão, caixa)
3. Informar saldo inicial
4. Salvar

---

## UC05 – Cadastrar Categoria

**Ator:** Usuário

Fluxo Principal:

1. Informar nome da categoria
2. Definir tipo (receita ou despesa)
3. Salvar

---

## UC06 – Registrar Transação

**Ator:** Usuário

Fluxo Principal:

1. Informar valor
2. Selecionar tipo (entrada/saída)
3. Selecionar conta
4. Selecionar categoria
5. Informar data
6. Informar descrição
7. Salvar

---

## UC07 – Registrar Transação Parcelada

**Ator:** Usuário

Extensão de UC06.

Fluxo Principal:

1. Informar número de parcelas
2. Sistema divide valor
3. Sistema gera transações futuras vinculadas

---

## UC08 – Registrar Transação Recorrente

**Ator:** Usuário

Fluxo Principal:

1. Marcar como recorrente
2. Definir periodicidade (mensal)
3. Sistema gera lançamentos futuros automaticamente

---

## UC09 – Consultar Saldo

**Ator:** Usuário

Fluxo Principal:

1. Selecionar organização
2. Sistema calcula saldo total
3. Sistema exibe saldo

---

## UC10 – Consultar Relatório por Período

**Ator:** Usuário

Fluxo Principal:

1. Selecionar período
2. Sistema busca transações
3. Sistema calcula resultado do período
4. Exibir relatório

---

# 3. 🔗 Relações Entre Casos de Uso

- UC07 (Transação Parcelada) estende UC06 (Registrar Transação)
- UC08 (Transação Recorrente) estende UC06
- UC03 depende de UC02 (é necessário existir organização)
- UC09 depende de UC06 (existência de transações)

---

# 4. 🎯 Limite do MVP

Para o MVP inicial, serão implementados:

- UC04 – Cadastrar Conta
- UC05 – Cadastrar Categoria
- UC06 – Registrar Transação
- UC09 – Consultar Saldo
- UC10 – Consultar Relatório
