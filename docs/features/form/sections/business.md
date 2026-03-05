
## Seção 3 — Modelo de Negócio

**Objetivo:** Entender o problema endereçado, a proposta de valor e o estágio comercial da startup para subsidiar a triagem por IA.

> Estes campos pertencem à tabela `startups` no banco de dados.

| Campo | Tipo | Obrigatório | Validação | Lógica condicional |
|---|---|---|---|---|
| Qual problema a sua startup resolve? | `textarea` | ✅ | Min. 20 caracteres | — |
| Como esse problema é resolvido hoje? | `textarea` | ✅ | Min. 20 caracteres | — |
| Qual a inovação que diferencia a solução dos concorrentes? | `textarea` | ✅ | Min. 20 caracteres | — |
| Quem são seus principais clientes ou público-alvo? | `textarea` | ✅ | Min. 10 caracteres | — |
| Como a sua startup gera receita? | `textarea` | ❌ | Min. 10 caracteres quando exibido | Exibir apenas se `current_revenue` estiver preenchido |
| Possui clientes ativos? Se sim, quantos? | `text` | ❌ | Min. 1 caractere quando exibido | Exibir apenas se `stage` ≠ "Ideação" |


### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco | Tabela |
|---|---|---|---|
| Qual problema resolve? | `problem_statement` | `string` | `startups` |
| Como é resolvido hoje? | `current_solution` | `string` | `startups` |
| Inovação / diferencial | `competitive_advantage` | `string` | `startups` |
| Público-alvo | `target_audience` | `string` | `startups` |
| Como gera receita? | `revenue_model` | `string \| null` | `startups` |
| Clientes ativos | `active_clients` | `string \| null` | `startups` |
