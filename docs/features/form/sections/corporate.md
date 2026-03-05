
## Seção 5 — Informações Corporativas

**Objetivo:** Avaliar o histórico de captação, estrutura societária e maturidade financeira da startup para subsidiar a triagem por IA.

> Estes campos pertencem à tabela `startups` no banco de dados.

| Campo | Tipo | Obrigatório | Validação | Placeholder / Máscara |
|---|---|---|---|---|
| Já teve alguma rodada de investimento? | `single-select` | ✅ | — | — |
| Quantas rodadas? | `number` | ❌ | Inteiro ≥ 1; exibir apenas se resposta anterior for "Sim" | "Ex: 2" |
| Qual o percentual da empresa pertence aos fundadores? | `number` | ✅ | Inteiro entre 1 e 100 | "Ex: 70" |
| Qual a composição do Captable? | `textarea` | ❌ | Min. 10 caracteres | "Ex: Fundadores 70%, Investidor A 20%, Opções 10%" |
| Apresentação da startup (pitch deck ou similar) | `file` | ❌ | Formatos aceitos: PDF, PPT, PPTX; tamanho máx. 20 MB; armazenado via Supabase Storage | — |
| Alguma outra informação importante? | `textarea` | ❌ | Min. 10 caracteres quando preenchido | — |


**Opções — Já teve alguma rodada de investimento?**

| Opção | Lógica condicional |
|---|---|
| Sim | Habilita o campo "Quantas rodadas?" |
| Não | Mantém o campo "Quantas rodadas?" oculto; persiste `investment_rounds_count = 0` no banco |


### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco | Tabela | FK |
|---|---|---|---|---|
| Teve rodada de investimento? | `had_investment_round` | `boolean` | `startups` | — |
| Quantas rodadas? | `investment_rounds_count` | `integer` | `startups` | — |
| % dos fundadores | `founders_equity_pct` | `integer` | `startups` | — |
| Composição do Captable | `captable_composition` | `string \| null` | `startups` | — |
| Pitch deck | `pitch_deck_url` | `string \| null` | `startups` | — |
| Informações adicionais | `additional_info` | `string \| null` | `startups` | — |

> **Nota sobre `investment_rounds_count`:** quando a resposta for "Não", persistir `0` no banco (campo nunca é `null`).
>
> **Nota sobre `pitch_deck_url`:** o arquivo é enviado ao Supabase Storage e a URL pública resultante é persistida neste campo.
