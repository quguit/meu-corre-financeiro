👥 2️⃣ ATORES DO SISTEMA
🎭 Atores Primários
1️⃣ Usuário

Realiza login

Gerencia contas

Cadastra transações

Consulta saldo

Gera relatórios

2️⃣ Administrador da Organização

Gerencia membros

Define permissões

Gerencia configurações da organização

🎭 Atores Secundários (Futuros)
3️⃣ Sistema Bancário (Integração futura)

Importa extratos

Sincroniza movimentações

4️⃣ Sistema Meu Corre CRM

Envia informações de vendas

Recebe dados financeiros

🧩 3️⃣ CASOS DE USO PRINCIPAIS

Vou estruturar como base para diagrama de casos de uso.

📌 UC01 – Autenticar Usuário

Ator: Usuário
Fluxo:

Inserir email

Inserir senha

Validar credenciais

Acessar organização

📌 UC02 – Criar Organização

Ator: Usuário
Fluxo:

Informar nome

Criar organização

Associar usuário como admin

📌 UC03 – Cadastrar Conta

Ator: Usuário
Fluxo:

Informar nome

Definir tipo

Informar saldo inicial

Salvar

📌 UC04 – Registrar Transação

Ator: Usuário
Fluxo:

Informar valor

Selecionar tipo

Selecionar conta

Selecionar categoria

Definir data

Salvar

Extensão:

Se parcelado → gerar múltiplas transações

📌 UC05 – Calcular Saldo

Ator: Sistema
Fluxo:

Somar entradas

Subtrair saídas

Atualizar saldo por conta

📌 UC06 – Consultar Relatório

Ator: Usuário
Fluxo:

Selecionar período

Visualizar saldo

Visualizar transações
