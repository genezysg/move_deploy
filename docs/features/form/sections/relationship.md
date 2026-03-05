
## Seção 6 — Relacionamento com o Programa

**Objetivo:** Avaliar o alinhamento da startup com o MoVe Track, identificar necessidades de desenvolvimento e garantir comprometimento formal com os termos do programa.

> Estes campos pertencem à tabela `startups` no banco de dados.

| Campo | Tipo | Obrigatório | Validação | Placeholder / Tooltip |
|---|---|---|---|---|
| Por que você deseja participar do Move Track? | `textarea` | ✅ | Min. 20 caracteres | — |
| Quais são as principais áreas em que sua Startup precisa se desenvolver? | `textarea` | ✅ | Min. 20 caracteres | — |
| Qual sua maior expectativa com o Move Track? | `textarea` | ✅ | Min. 20 caracteres | — |
| Quantos membros poderão se dedicar ao Programa? Quem são? | `multi-select` | ✅ | Pelo menos 1 membro selecionado; opções populadas dinamicamente com os membros adicionados na Seção 4 | Tooltip: "O Programa exige uma dedicação mínima de 10 horas semanais da equipe, podendo haver revezamento entre os membros" |
| Você leu, compreendeu e aceita as disposições estabelecidas no edital do Programa? | `checkbox` | ✅ | Deve ser marcado para prosseguir | — |
| Você atesta a veracidade das informações compartilhadas no formulário? | `checkbox` | ✅ | Deve ser marcado para prosseguir | — |


### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco | Tabela | FK |
|---|---|---|---|---|
| Por que deseja participar? | `motivation` | `string` | `startups` | — |
| Áreas de desenvolvimento | `development_areas` | `string` | `startups` | — |
| Maior expectativa | `main_expectation` | `string` | `startups` | — |
| Membros dedicados ao programa | `dedicated_members` | `string[]` | `startups` | — |
| Aceite do edital | `accepted_terms` | `boolean` | `startups` | — |
| Ateste de veracidade | `attested_truthfulness` | `boolean` | `startups` | — |

> **Nota sobre `dedicated_members`:** armazenado como array de nomes dos membros selecionados (`text[]`). Os nomes são provenientes dos membros cadastrados na Seção 4 — o campo deve ser populado dinamicamente a partir dos dados do time informados anteriormente no formulário.
>
> **Nota sobre `accepted_terms` e `attested_truthfulness`:** ambos devem obrigatoriamente ser `true` para que o formulário possa ser submetido. Não há valor padrão — o usuário precisa marcar explicitamente cada um.
