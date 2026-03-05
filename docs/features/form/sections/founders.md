
## Seção 1 — Informações Básicas do(s) Empreendedor(es)

**Objetivo:** Identificar o responsável pela inscrição e garantir canal de contato direto.

| Campo | Tipo | Obrigatório | Validação | Placeholder / Máscara |
|---|---|---|---|---|
| Nome completo do responsável pela inscrição | `text` | ✅ | Min. 3 caracteres; sem números | "Ex: Maria Oliveira" |
| E-mail para contato | `email` | ✅ | Formato de e-mail válido (regex) | "nome@empresa.com" |
| Telefone para contato | `tel` | ✅ | Máscara `(XX) XXXXX-XXXX`; aceitar formato internacional com `+` | "(11) 99999-0000" |
| LinkedIn | `url` | ✅ | Deve conter `linkedin.com/in/` | "https://linkedin.com/in/seu-perfil" |
| Como ficou sabendo do MoVe Track? | `multi-select` | ✅ | Pelo menos 1 opção selecionada |-|-| 
| Possui algum vínculo com o Grupo Montreal? | `single-select` | ✅ | — | — |
| Qual Vínculo? | `text` | no | Min. 3 caracteres; Campo só deve ser exibido caso a opção "Sou Colaborador" seja selecionada | — | 




**Opções — Como ficou sabendo do MoVe Track?**

| Opção |
|---|
| Eventos |
| Notícias |
| LinkedIn |
| Instagram |
| Site de busca |
| Indicação |

**Opções — Possui algum vínculo com o Grupo Montreal?**

| Opção | Lógica condicional |
|---|---|
| Não possuo vínculo | — |
| Sou Colaborador | Sinal de maturidade: vínculo interno → flag `internal_referral = true` no CRM - Caso seja selecionado, deve habilitar o campo "Qual Vinculo" | 


### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco |
|---|---|---|
| Nome completo | `founder_name` | `string` |
| E-mail | `founder_email` | `string` (unique) |
| Telefone | `founder_phone` | `string` |
| LinkedIn | `founder_linkedin` | `string (url)` |
| Como ficou sabendo | `acquisition_channel` | `string[]` |
| Vínculo com Grupo Montreal | `internal_referral` | `boolean` |
| Qual Vínculo | `referral_name` | `string` |