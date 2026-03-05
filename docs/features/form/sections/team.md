
## Seção 4 — Composição do Time

**Objetivo:** Mapear os membros envolvidos na startup para avaliar capacidade de execução e diversidade do time.

> Esta seção permite adicionar múltiplos membros. Deve haver um botão **"+ Adicionar membro"** que expande um novo bloco de campos. Cada membro é salvo como uma linha independente na tabela `members`.

| Campo | Tipo | Obrigatório | Validação | Placeholder / Máscara |
|---|---|---|---|---|
| Nome | `text` | ✅ | Min. 3 caracteres; sem números | "Ex: João Silva" |
| Experiência anterior | `textarea` | ✅ | Min. 20 caracteres | "Descreva experiências profissionais relevantes" |
| LinkedIn | `url` | ❌ | Deve conter `linkedin.com/in/` quando preenchido | "https://linkedin.com/in/seu-perfil" |
| Tipo | `single-select` | ✅ | — | — |
| Função | `text` | ✅ | Min. 2 caracteres | "Ex: CTO" |


**Opções — Tipo**

| Opção |
|---|
| Fundador |
| Funcionário |
| Mentor |


### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco | Tabela | FK |
|---|---|---|---|---|
| Nome | `member_name` | `string` | `members` | — |
| Experiência anterior | `prior_experience` | `string` | `members` | — |
| LinkedIn | `member_linkedin` | `string \| null` | `members` | — |
| Tipo | `member_type` | `string` | `members` | — |
| Função | `member_role` | `string` | `members` | — |
| — | `startup_id` | `uuid` | `members` | `startups(id)` |

#### Relação com outras tabelas

| Tabela | Coluna FK | Referencia | Comportamento ao deletar |
|---|---|---|---|
| `members` | `startup_id` | `startups(id)` | `CASCADE` |
