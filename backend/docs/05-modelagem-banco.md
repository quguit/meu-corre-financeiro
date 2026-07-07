🏗️ 4️⃣ PREPARAÇÃO PARA DIAGRAMA DE CLASSES

Com base nisso, as classes principais serão:

User

Organization

OrganizationUser

Account

Category

Transaction

Relacionamentos:

User 1..N OrganizationUser

Organization 1..N Account

Organization 1..N Category

Organization 1..N Transaction

Account 1..N Transaction

Transaction pode ter parent_transaction (auto-relacionamento)
