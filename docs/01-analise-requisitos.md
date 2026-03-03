# 📋 Análise de Requisitos

Projeto: Meu Corre Financeiro

---

# 1. 📌 Visão Geral

O Meu Corre Financeiro é um sistema de gestão financeira pessoal e empresarial, integrante do ecossistema Meu Corre.

Seu objetivo é permitir o controle estruturado de:

- Entradas financeiras
- Saídas financeiras
- Contas bancárias
- Cartões de crédito
- Despesas parceladas
- Lançamentos recorrentes
- Histórico financeiro por período
- Organização financeira por empresa

O sistema deve nascer simples (MVP), mas com arquitetura preparada para evolução futura para ERP financeiro e modelo SaaS multiempresa.

---

# 2. 🎯 Objetivo do Sistema

Desenvolver uma base financeira sólida, escalável e organizada, capaz de:

- Organizar finanças pessoais
- Evoluir para controle financeiro empresarial
- Integrar-se futuramente ao Meu Corre CRM
- Permitir expansão para múltiplas organizações
- Servir como base para ERP financeiro

---

# 3. 👤 Perfis do Sistema

O sistema deverá permitir múltiplos usuários associados a múltiplas organizações.

Perfis previstos:

- Usuário comum
- Administrador da organização

---

# 4. ✅ Requisitos Funcionais (RF)

## 4.1 Gestão de Usuários

RF01 – O sistema deve permitir cadastro de usuário.  
RF02 – O sistema deve permitir autenticação de usuário.  
RF03 – O sistema deve permitir que um usuário pertença a uma ou mais organizações.

---

## 4.2 Gestão de Organizações

RF04 – O sistema deve permitir criar organização.  
RF05 – O sistema deve permitir associar usuários à organização.  
RF06 – O sistema deve permitir definir papel do usuário (admin, membro).

---

## 4.3 Gestão de Contas

RF07 – O sistema deve permitir cadastrar contas financeiras.  
RF08 – A conta deve possuir:

- nome
- tipo (banco, cartão, caixa)
- saldo inicial

RF09 – O sistema deve calcular saldo atual automaticamente com base nas transações.

---

## 4.4 Gestão de Categorias

RF10 – O sistema deve permitir cadastrar categorias.  
RF11 – A categoria deve ser classificada como:

- Receita
- Despesa

---

## 4.5 Gestão de Transações

RF12 – O sistema deve permitir registrar transações financeiras.

Cada transação deve conter:

- valor
- tipo (entrada ou saída)
- categoria
- conta associada
- data
- descrição
- indicador de recorrência
- indicador de parcelamento

---

RF13 – O sistema deve permitir registrar despesas parceladas.  
RF14 – O sistema deve gerar automaticamente as parcelas futuras.  
RF15 – O sistema deve permitir lançamentos recorrentes (ex: salário mensal).  
RF16 – O sistema deve manter histórico financeiro completo.

---

## 4.6 Relatórios

RF17 – O sistema deve calcular saldo total da organização.  
RF18 – O sistema deve calcular saldo por conta.  
RF19 – O sistema deve permitir consulta por período.  
RF20 – O sistema deve permitir visualização do histórico mensal.

---

# 5. 🔒 Requisitos Não Funcionais (RNF)

RNF01 – O sistema deve utilizar arquitetura REST.  
RNF02 – O backend deve ser desenvolvido em FastAPI.  
RNF03 – O frontend mobile deve ser desenvolvido em Flutter.  
RNF04 – O banco de dados deve ser relacional.  
RNF05 – A estrutura deve permitir migração futura para PostgreSQL.  
RNF06 – O sistema deve ser preparado para modelo SaaS multiempresa.  
RNF07 – A lógica de saldo não deve depender de armazenamento manual, devendo ser calculada a partir das transações.

---

# 6. 📈 Escalabilidade Futura

O sistema deve permitir expansão para:

- Controle de fluxo de caixa empresarial
- Contas a pagar e a receber
- Centro de custo
- Geração automática de DRE
- Integração com CRM
- Integração bancária
- Multiempresa com isolamento de dados
- Modelo de assinatura SaaS

---

# 7. 🧠 Decisões Arquiteturais Iniciais

- O saldo não será armazenado diretamente na conta.
- Parcelamentos serão tratados como múltiplas transações vinculadas.
- Transações recorrentes gerarão instâncias futuras automaticamente.
- Cada dado financeiro estará vinculado obrigatoriamente a uma organização.

---

# 8. 🎓 Objetivo de Aprendizado

Este projeto também tem como meta:

- Desenvolver autonomia em modelagem de sistemas
- Aprimorar capacidade de análise de requisitos
- Consolidar prática em arquitetura backend
- Desenvolver visão de produto escalável
