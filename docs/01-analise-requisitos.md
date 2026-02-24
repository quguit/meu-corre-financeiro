📋 1️⃣ ANÁLISE DE REQUISITOS
🎯 Objetivo do Sistema

O Meu Corre Financeiro será um sistema de gestão financeira pessoal e empresarial, permitindo controle de:

Entradas

Saídas

Contas bancárias

Cartões de crédito

Parcelamentos

Lançamentos recorrentes

Saldo mensal

Histórico financeiro

✅ Requisitos Funcionais (RF)
👤 Gestão de Usuário

RF01 – O sistema deve permitir cadastro de usuário
RF02 – O sistema deve permitir login
RF03 – O sistema deve permitir que um usuário pertença a uma ou mais organizações

🏢 Gestão de Organização

RF04 – O sistema deve permitir criar organização
RF05 – O sistema deve permitir adicionar membros à organização
RF06 – O sistema deve permitir definir permissões (admin, membro)

🏦 Gestão de Contas

RF07 – O sistema deve permitir cadastrar contas financeiras
RF08 – O sistema deve permitir definir tipo da conta (banco, cartão, caixa)
RF09 – O sistema deve armazenar saldo inicial
RF10 – O sistema deve calcular saldo atual automaticamente

💸 Gestão de Transações

RF11 – O sistema deve permitir cadastrar transações
RF12 – A transação deve possuir:

valor

tipo (entrada/saída)

categoria

data

conta associada

descrição

RF13 – O sistema deve permitir parcelamento automático
RF14 – O sistema deve gerar parcelas futuras automaticamente
RF15 – O sistema deve permitir transações recorrentes
RF16 – O sistema deve manter histórico imutável

📊 Relatórios

RF17 – O sistema deve calcular saldo total
RF18 – O sistema deve calcular saldo por conta
RF19 – O sistema deve apresentar histórico mensal
RF20 – O sistema deve permitir consulta por período

🔒 Requisitos Não Funcionais (RNF)

RNF01 – API REST
RNF02 – Arquitetura escalável
RNF03 – Banco relacional
RNF04 – Separação clara entre camadas
RNF05 – Segurança com autenticação futura JWT
RNF06 – Estrutura preparada para SaaS
