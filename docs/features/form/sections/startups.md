
## Seção 2 — Dados da Startup

**Objetivo:** Identificar a empresa, seu estágio de maturidade e área de atuação para alimentar o pipeline de triagem.

| Campo | Tipo | Obrigatório | Validação | Placeholder / Máscara |
|---|---|---|---|---|
| Nome da Startup | `text` | ✅ | Min. 2 caracteres | "Ex: Finova" |
| CNPJ | `text` | ❌ | Máscara `XX.XXX.XXX/XXXX-XX`; validação de dígitos verificadores quando preenchido | "00.000.000/0000-00" |
| Ano de fundação | `number` | ✅ | Inteiro entre 1900 e ano atual | "Ex: 2021" |
| Cidade — UF | `text` | ✅ | Formato `Cidade - UF`; min. 3 caracteres | "Ex: Belo Horizonte - MG" |
| Perfil nas redes sociais | `url` | ✅ | URL válida (regex) | "https://instagram.com/suastartup" |
| Área de Atuação | `single-selett` | ✅ | Pelo menos 1 opção selecionada; Deve ser possível escolher "Outro: Nome da área de atuação" | — |
| Qual o Estágio da sua Startup? | `single-select` | ✅ | — | — |
| Descrição breve do negócio | `textarea` | ✅ | Min. 20 caracteres | "Descreva em poucas palavras o que sua startup faz" |
| Faturamento atual | `text` | ❌ | Campo exibido apenas quando o estágio for "Operação inicial" ou "Escalabilidade" | "Ex: R$ 10.000/mês" |
| Tamanho da equipe | `number` | ✅ | Inteiro maior que 0 | "Ex: 3" |




**Opções — Área de Atuação**

| Opção | Regra
|---|
| Govtech |
| IdTech |
| Cybersegurança |
| Fintech |
| IoT |
| AI |
| Outro | Deve permitir a inclusao de um texto qualquer com o prefixo Outro:"Nome da Área"

**Opções — Qual o Estágio da sua Startup?**

| Opção | Descrição |
|---|---|
| Ideação | Possui uma ideia de projeto, ainda sem produto ou validação |
| Validação | Dor de mercado e proposta de valor ainda não validadas |
| Prototipação | MVP em fase de desenvolvimento e validação inicial |
| Operação inicial | MVP em fase avançada, projeto já gerando receita |
| Escalabilidade | MVP finalizado e validado, projeto em fase de crescimento |


### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco |
|---|---|---|
| Nome da Startup | `startup_name` | `string` |
| CNPJ | `startup_cnpj` | `string \| null` |
| Ano de fundação | `founding_year` | `integer` |
| Cidade — UF | `city_state` | `string` |
| Perfil nas redes sociais | `social_profile` | `string (url)` |
| Área de Atuação | `sector` | `string` |
| Estágio da Startup | `stage` | `string` |
| Descrição breve do negócio | `business_description` | `string` |
| Faturamento atual | `current_revenue` | `string \| null` |
| Tamanho da equipe | `team_size` | `integer` |
