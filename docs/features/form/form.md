# Formulário Inteligente — Spec Técnica

## Contexto

Formulário de inscrição do programa **MoVe** (Montreal Ventures). Coleta dados com lógica condicional e sinais de maturidade para alimentar o CRM de análise e a triagem por IA.

---


## Seção 1 — Informações Básicas do(s) Empreendedor(es)
@sections/founders.md

### Regras da Seção

- **Lógica condicional leve:** o campo de vínculo com o Grupo Montreal determina a flag `internal_referral` no CRM.
- **Sinal de maturidade:** Preenchimento do LinkedIn é um indicador positivo de presença profissional. Perfis com poucos dados ou sem foto podem ser sinalizados na triagem por IA.
- **O botão deve levar para a seção 2**: Ao terminar de informar os dados básicos de empreendedores, deve seguir para a seção 2


### Mapeamento para o CRM - @docs/features/form/sections/founders.md

## Seção 2 — Dados das startups
@docs/features/form/sections/startups.md


## Seção 3 — Informações sobre o negócio
@docs/features/form/sections/business.md

## Seção 4 — Dados dos membros do time
### Regras da seção
O primeiro member deve conter os dados referente ao founder
Ele não pode ser removido do formulario.
Os dados que já foram preenchidos não podem ser alterados.
**Execução** - @docs/features/form/sectio

## Seção 5 — Informação Corporativa
@docs/features/form/sections/corporate.md

## Seção 6 — Relacionamento com o Programa
@docs/features/form/sections/relationship.md

---

## Botão de Avanço

- **Etapas 1–5:** botão com texto **"Continuar"** + ícone de seta para a direita.
- **Etapa 6 (final):** botão com texto **"Enviar inscrição"** (estado de loading: "Enviando...") + ícone de seta para a direita ocultado durante envio.





