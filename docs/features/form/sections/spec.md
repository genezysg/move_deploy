# Guia de Spec de Entidades — MoVe Track

Este arquivo define o padrão para criar specs de seções do formulário a partir de drafts simples.
Ao receber um draft, use este guia para expandi-lo em um arquivo de entidade completo.

---

## Como usar

1. O usuário escreve um draft simples listando campos (ex: `team-draft.md`)
2. Peça para expandir usando esta spec como modelo
3. O resultado é um arquivo de entidade (ex: `team.md`) pronto para ser implementado no front e no banco

---

## Estrutura obrigatória de um arquivo de entidade

```
## Seção N — <Nome da Seção>

**Objetivo:** <Uma frase descrevendo o que esta seção coleta e para que serve>

[> Nota opcional sobre tabela no banco, quando os campos não pertencem à tabela principal]

| Campo | Tipo | Obrigatório | Validação | Placeholder / Máscara |
|---|---|---|---|---|
| <Label do campo> | `<tipo>` | ✅ ou ❌ | <regra de validação> | "<exemplo ou máscara>" |
...

[Tabelas de opções — para campos select]

**Opções — <Nome do Campo>**

| Opção | [Regra ou Descrição — opcional] |
|---|---|
| <Opção 1> | |
...

### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco | Tabela | FK |
|---|---|---|---|---|
| <Label> | `<snake_case>` | `<tipo>` | `<tabela>` | — ou `<tabela_pai>(id)` |
...
```

> **Regras do mapeamento:**
> - A coluna **Tabela** é sempre obrigatória — indica em qual tabela do banco o campo é persistido.
> - A coluna **FK** deve ser preenchida quando o campo é uma chave estrangeira: usar o formato `<tabela_referenciada>(campo)`, ex: `founders(id)`.
> - Quando a entidade introduz uma **nova tabela**, documentar logo abaixo do mapeamento:
>
> ```
> #### Relação com outras tabelas
>
> | Tabela | Coluna FK | Referencia | Comportamento ao deletar |
> |---|---|---|---|
> | `<tabela>` | `<fk_col>` | `<tabela_pai>(id)` | `CASCADE` ou `SET NULL` |
> ```

---

## Referência de tipos de campo

| Tipo no spec | Uso |
|---|---|
| `text` | Texto curto de uma linha |
| `textarea` | Texto longo, múltiplas linhas |
| `email` | E-mail com validação de formato |
| `tel` | Telefone com máscara |
| `url` | URL com validação |
| `number` | Número inteiro ou decimal |
| `single-select` | Escolha de uma opção entre N |
| `multi-select` | Escolha de uma ou mais opções |

---

## Referência de tipos no banco

| Tipo no spec | Tipo no banco (Postgres) |
|---|---|
| `string` | `text` |
| `string \| null` | `text` (nullable) |
| `string[]` | `text[]` |
| `integer` | `integer` |
| `boolean` | `boolean` |
| `string (url)` | `text` |
| `string (unique)` | `text unique` |

---

## Regras de validação padrão

| Situação | Validação |
|---|---|
| Texto obrigatório curto | Min. 2–3 caracteres |
| Textarea obrigatório | Min. 10–20 caracteres |
| Campo numérico | Inteiro, com limites (ex: ano entre 1900 e ano atual) |
| Campo opcional com mínimo | "Min. N caracteres quando exibido" |
| Campo condicional | Documentar a condição em "Lógica condicional" ou na coluna de validação |
| CNPJ | Máscara `XX.XXX.XXX/XXXX-XX`; validar dígitos verificadores quando preenchido |
| Telefone | Máscara `(XX) XXXXX-XXXX`; aceitar `+` para formato internacional |
| LinkedIn | Deve conter `linkedin.com/in/` |

---

## Referência de chaves estrangeiras (FK)

| Situação | Como documentar na coluna FK |
|---|---|
| Campo sem relação | `—` |
| FK para tabela pai desta seção | `founders(id)`, `startups(id)` |
| Campo gerado pelo banco (PK) | `—` (não aparece no mapeamento) |
| Entidade com múltiplos donos | Documentar todas as FKs em "Relação com outras tabelas" |

**Padrão de nomenclatura de FK no banco:** `<tabela_pai>_id`, ex: `founder_id`, `startup_id`.

---

## Convenções de nomenclatura no CRM (snake_case)

| Padrão | Exemplo |
|---|---|
| Campo identificador da entidade | `startup_name`, `founder_email` |
| Campo booleano de flag | `internal_referral` |
| Campo de seleção múltipla | `acquisition_channel` (array) |
| Campo opcional por condição | sufixo `_model`, `_description`, `_statement` |
| Campo de data/período | `founding_year`, `created_at` |

---

## Lógica condicional — padrões recorrentes

| Situação | Como documentar |
|---|---|
| Campo exibido ao selecionar opção X | "Exibir apenas se `<campo>` = `<valor>`" |
| Campo exibido quando outro está preenchido | "Exibir apenas se `<campo>` estiver preenchido" |
| Campo exibido para estágios avançados | "Exibir apenas se `stage` ≠ `<valor>`" ou "≥ `<valor>`" |
| Campo que habilita outro | Documentar nos dois campos: origem e destino |

---

## Exemplo de draft → entidade expandida

**Draft simples (`team-draft.md`):**
```
1- Nome completo
2- Cargo na startup
3- LinkedIn
4- Dedicação — full-time ou part-time
5- Experiência prévia relevante — caixa de texto
```

**Entidade expandida esperada (`team.md`):**
```markdown
## Seção N — Composição da Equipe

**Objetivo:** Mapear os membros do time fundador e avaliar capacidade de execução.

| Campo | Tipo | Obrigatório | Validação | Placeholder / Máscara |
|---|---|---|---|---|
| Nome completo | `text` | ✅ | Min. 3 caracteres; sem números | "Ex: João Silva" |
| Cargo na startup | `text` | ✅ | Min. 2 caracteres | "Ex: CEO" |
| LinkedIn | `url` | ✅ | Deve conter `linkedin.com/in/` | "https://linkedin.com/in/seu-perfil" |
| Dedicação | `single-select` | ✅ | — | — |
| Experiência prévia relevante | `textarea` | ✅ | Min. 20 caracteres | — |

**Opções — Dedicação**

| Opção |
|---|
| Full-time |
| Part-time |

### Mapeamento para o CRM

| Campo do formulário | Campo no CRM | Tipo no banco | Tabela | FK |
|---|---|---|---|---|
| Nome completo | `member_name` | `string` | `team_members` | — |
| Cargo | `member_role` | `string` | `team_members` | — |
| LinkedIn | `member_linkedin` | `string (url)` | `team_members` | — |
| Dedicação | `dedication` | `string` | `team_members` | — |
| Experiência prévia | `prior_experience` | `string` | `team_members` | — |

#### Relação com outras tabelas

| Tabela | Coluna FK | Referencia | Comportamento ao deletar |
|---|---|---|---|
| `team_members` | `startup_id` | `startups(id)` | `CASCADE` |
```
