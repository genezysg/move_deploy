# Analytics — Spec Técnica

## Contexto

O Google Analytics (GA4) já está configurado no root do projeto (`src/app/layout.tsx`) com o ID `G-N495P6Z5Q4`. Os eventos customizados devem ser disparados via `window.gtag('event', ...)` no cliente.

---

## Eventos a Implementar

### 1. Visualização de Etapa do Formulário

Disparar quando o usuário acessa cada etapa do formulário de inscrição.

**Evento:** `form_step_view`

**Onde disparar:** `src/components/form/application-form.tsx` — via `useEffect` que observa mudanças em `currentStep`.

**Parâmetros:**

| Parâmetro    | Tipo   | Valores possíveis                                              |
|--------------|--------|----------------------------------------------------------------|
| `step_index` | number | `1` a `6`                                                      |
| `step_name`  | string | `"Quem é você"`, `"Sua Startup"`, `"Negócio"`, `"Time"`, `"Corporativo"`, `"Programa"` |

**Exemplo de chamada:**

```ts
window.gtag('event', 'form_step_view', {
  step_index: currentStep,
  step_name: STEPS[currentStep - 1].label,
})
```

---

### 2. Envio da Inscrição

Disparar quando a inscrição é enviada com sucesso (após `submitApplication` retornar sem erro).

**Evento:** `form_submission`

**Onde disparar:** `src/components/form/application-form.tsx` — dentro de `handleStep6`, após `setSubmitted(true)`.

**Parâmetros:**

| Parâmetro | Tipo   | Descrição                        |
|-----------|--------|----------------------------------|
| `stage`   | string | Estágio da startup (ex: `"mvp"`) |
| `sector`  | string | Setor da startup                 |

**Exemplo de chamada:**

```ts
window.gtag('event', 'form_submission', {
  stage: formData.step2?.stage,
  sector: formData.step2?.sector,
})
```

---

## Tipagem

Para evitar erros de TypeScript com `window.gtag`, adicionar a declaração global em `src/types/gtag.d.ts`:

```ts
declare function gtag(
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>
): void

declare function gtag(
  command: 'js' | 'config',
  target: Date | string,
  params?: Record<string, unknown>
): void
```

---

## Arquivos a Modificar

| Arquivo                                          | Alteração                                          |
|--------------------------------------------------|----------------------------------------------------|
| `src/components/form/application-form.tsx`       | Adicionar `useEffect` para `form_step_view` e chamada `form_submission` em `handleStep6` |
| `src/types/gtag.d.ts`                            | Criar — declaração de tipo global para `gtag`      |
