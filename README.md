# 💰 Meu Corre Financeiro

Sistema de controle financeiro pessoal e empresarial, integrante do ecossistema **Meu Corre**.

Desenvolvido inicialmente como um estudo prático de arquitetura frontend e organização financeira, o projeto evolui agora para uma base de um futuro sistema financeiro profissional e completo, com emissão de notas fiscais e facilitando a vida do Vendedor.

---

## 🚀 Visão do Produto

O **Meu Corre Financeiro** nasce com o objetivo de organizar:

- Entradas e saídas dia à dia( onde cada entrada ou saida é um titulo financeiro, com isso eu consigo futuramente manipular melhor os dados, tratando como objeto e não uma string/Inteiro)
- Controle de contas( saldo do dia)
- Saldo mensal(faturamento e resultados em grafico)
- Despesas parceladas (pode ser custo operacional, sera pagamento de parcela de financiamento por um periodo determinado, ou até a quitação e ao sinalizar aquitação do titulo criado, as parcelas são amortizadas dos sistema de forma automatica, e sinalizada no relatorio, quitações pagas, valor gasto com quitação/ valor gasto com parcelas para cada titulo financeiro criado)
- custo operacional, gasto para manter o funcionamento,funcionários, agua, luz, custo de manutenção e  gasto fixas (salário, internet)
- o titulo cheque pode ter a opção de Cheque trocado, e mostrar quanto foi o abatimento se for 5% 3%, e isso será abatido no custo operacionais do produto associado a entrada deste titulo financeiro de modo que eu tambem possa saber quanto eu estou perdendo ao trocar cheques, ou até mesmo, amortizar parcelamentos próprios como boletos e primissórias, entao o abatimento vale para titulo de entrada e saída.
- Cartões de crédito e faturas (uso mais casual, porem importante)
- Planejamento financeiro futuro ( podendo abrangir pessoal e proficional, como reforma, ampliação ou gasto programado)

A longo prazo, o sistema poderá integrar-se ao:

- Meu Corre CRM
- Gestão de clientes
- Controle de vendas
- ERP empresarial
Mas a prioridade é aplicar a visão do produto e trabalhar a integração visual, experiencia de usuario, e usuabilidade em diferentes meios, seja computador ou pelo smartphone.
---

## 🧠 Origem do Projeto

O projeto começou como uma solução para organizar finanças familiares e problemas observados em meu emprego como auxiliar ADM, permitindo:

- Divisão de despesas
- Projeção de saldos futuros
- Planejamento de compras parceladas
- Visualização de impacto financeiro ao longo dos meses
- Organização de gastos e planejamento com proposito, de modo que se prometi pagar 30 mil em 3 dias, todo dia eu tenho que colocar 10 naquela caixinha para no dia eu ter tranquilamente o valor e honrar com os outros compromissos, pensando em todos, e não apenas naquele que mais deu dor de cabeça, ou no que é mais facil pagar, o que acontece muito com empresas que trabalham com capital de giro onde não há capital acumulado, para quitação de todas as dividas, é o conhecido dilema "importante é conseguir tempo, até muita coisa pode acontecer e eu conseguir sair dessa situação, mas nunca deisistir, sempre conseguir mais tempo, para dar certo la na frente".

Agora, o foco é aplicar conceitos como Diagramas de classes, entidade-relacionamento banco de dados Relacional, e Por ultimo a o frontend, primeiro passo será o CRUD e diagramas bem estruturados, talvez faça documentação de casos de uso, mas não acho necessario ainda.

---

## 🏗️ Arquitetura Atual

### Frontend
- React (PWA-ready)

### Backend
- FastAPI

### Banco de Dados
- SQLite

---

## 🎯 Próxima Evolução

A nova versão será desenvolvida com:

- Flutter (mobile)
- FastAPI (backend moderno)
- PostgreSQL (produção)
- Estrutura multiusuário
- Integração com outros módulos Meu Corre

---

## 📌 Roadmap

- [ ] MVP mobile Flutter
- [ ] Backend FastAPI
- [ ] Controle de múltiplas contas
- [ ] Sistema de faturas automáticas
- [ ] Dashboard financeiro
- [ ] Integração com CRM
- [ ] Estrutura SaaS

---

## 👤 Autor

Guilherme Pereira Nascimento  
Projeto integrante do ecossistema **Meu Corre**
