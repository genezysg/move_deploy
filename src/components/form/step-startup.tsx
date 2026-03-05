"use client"

import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SECTORS = ["Govtech", "IdTech", "Cybersegurança", "Fintech", "IoT", "AI", "Outro"] as const

const STAGES = [
  { label: "Ideação", description: "Possui uma ideia de projeto, ainda sem produto ou validação" },
  { label: "Validação", description: "Dor de mercado e proposta de valor ainda não validadas" },
  { label: "Prototipação", description: "MVP em fase de desenvolvimento e validação inicial" },
  { label: "Operação inicial", description: "MVP em fase avançada, projeto já gerando receita" },
  { label: "Escalabilidade", description: "MVP finalizado e validado, projeto em fase de crescimento" },
] as const

const CURRENT_YEAR = new Date().getFullYear()

function formatCNPJ(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

function validateCNPJ(cnpj: string): boolean {
  const d = cnpj.replace(/\D/g, "")
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false
  const calc = (digits: string, weights: number[]) =>
    weights.reduce((sum, w, i) => sum + parseInt(digits[i]) * w, 0)
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const r1 = calc(d, w1) % 11
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const r2 = calc(d, w2) % 11
  return parseInt(d[12]) === (r1 < 2 ? 0 : 11 - r1) && parseInt(d[13]) === (r2 < 2 ? 0 : 11 - r2)
}

const schema = z
  .object({
    startup_name: z.string().min(2, "Mínimo 2 caracteres"),
    startup_cnpj: z
      .string()
      .optional()
      .refine((val) => !val || val.replace(/\D/g, "").length === 0 || validateCNPJ(val), {
        message: "CNPJ inválido",
      }),
    founding_year: z
      .number({ error: "Informe um ano válido" })
      .int()
      .min(1900, "Ano inválido")
      .max(CURRENT_YEAR, `Máximo ${CURRENT_YEAR}`),
    city_state: z.string().min(3, "Mínimo 3 caracteres"),
    social_profile: z.string().url("URL inválida"),
    sector: z.string().min(1, "Selecione uma opção"),
    sector_custom: z.string().optional(),
    stage: z.string().min(1, "Selecione uma opção"),
    business_description: z.string().min(20, "Mínimo 20 caracteres"),
    current_revenue: z.string().optional(),
    team_size: z
      .number({ error: "Informe um número válido" })
      .int()
      .min(1, "Mínimo 1 pessoa"),
  })
  .superRefine((data, ctx) => {
    if (data.sector === "Outro" && (!data.sector_custom || data.sector_custom.trim().length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Descreva a área de atuação (mín. 3 caracteres)",
        path: ["sector_custom"],
      })
    }
  })

type StartupFormValues = z.infer<typeof schema>

export interface StartupData {
  startup_name: string
  startup_cnpj?: string
  founding_year: number
  city_state: string
  social_profile: string
  sector: string
  stage: string
  business_description: string
  current_revenue?: string
  team_size: number
}

interface Props {
  onNext: (data: StartupData) => void
  onBack?: () => void
  defaultValues?: Partial<StartupFormValues>
}

export function StepStartup({ onNext, onBack, defaultValues }: Props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StartupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  })

  const selectedSector = useWatch({ control, name: "sector" })
  const selectedStage = useWatch({ control, name: "stage" })
  const showRevenue = selectedStage === "Operação inicial" || selectedStage === "Escalabilidade"

  function onSubmit(data: StartupFormValues) {
    const { sector_custom, sector, ...rest } = data
    onNext({
      ...rest,
      sector: sector === "Outro" ? `Outro: ${sector_custom!.trim()}` : sector,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Nome da Startup */}
      <div className="space-y-1.5">
        <Label htmlFor="startup_name">Nome da Startup</Label>
        <Input
          id="startup_name"
          placeholder="Ex: Finova"
          aria-invalid={!!errors.startup_name}
          {...register("startup_name")}
        />
        {errors.startup_name && (
          <p className="text-xs text-destructive">{errors.startup_name.message}</p>
        )}
      </div>

      {/* CNPJ */}
      <div className="space-y-1.5">
        <Label htmlFor="startup_cnpj">
          CNPJ <span className="text-muted-foreground text-xs">(opcional)</span>
        </Label>
        <Input
          id="startup_cnpj"
          placeholder="00.000.000/0000-00"
          aria-invalid={!!errors.startup_cnpj}
          {...register("startup_cnpj", {
            onChange: (e) => {
              const masked = formatCNPJ(e.target.value)
              setValue("startup_cnpj", masked, { shouldValidate: false })
              e.target.value = masked
            },
          })}
        />
        {errors.startup_cnpj && (
          <p className="text-xs text-destructive">{errors.startup_cnpj.message}</p>
        )}
      </div>

      {/* Ano de fundação */}
      <div className="space-y-1.5">
        <Label htmlFor="founding_year">Ano de fundação</Label>
        <Input
          id="founding_year"
          type="number"
          placeholder="Ex: 2021"
          min={1900}
          max={CURRENT_YEAR}
          aria-invalid={!!errors.founding_year}
          {...register("founding_year", { valueAsNumber: true })}
        />
        {errors.founding_year && (
          <p className="text-xs text-destructive">{errors.founding_year.message}</p>
        )}
      </div>

      {/* Cidade - UF */}
      <div className="space-y-1.5">
        <Label htmlFor="city_state">Cidade — UF</Label>
        <Input
          id="city_state"
          placeholder="Ex: Belo Horizonte - MG"
          aria-invalid={!!errors.city_state}
          {...register("city_state")}
        />
        {errors.city_state && (
          <p className="text-xs text-destructive">{errors.city_state.message}</p>
        )}
      </div>

      {/* Perfil nas redes sociais */}
      <div className="space-y-1.5">
        <Label htmlFor="social_profile">Perfil nas redes sociais</Label>
        <Input
          id="social_profile"
          type="url"
          placeholder="https://instagram.com/suastartup"
          aria-invalid={!!errors.social_profile}
          {...register("social_profile")}
        />
        {errors.social_profile && (
          <p className="text-xs text-destructive">{errors.social_profile.message}</p>
        )}
      </div>

      {/* Área de Atuação */}
      <div className="space-y-2">
        <Label>Área de Atuação</Label>
        <Controller
          control={control}
          name="sector"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((s) => {
                const selected = field.value === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      field.onChange(s)
                      if (s !== "Outro") setValue("sector_custom", undefined)
                    }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                    {s}
                  </button>
                )
              })}
            </div>
          )}
        />
        {errors.sector && (
          <p className="text-xs text-destructive">{errors.sector.message}</p>
        )}
        {selectedSector === "Outro" && (
          <div className="pt-1">
            <Input
              placeholder="Ex: Healthtech"
              aria-invalid={!!errors.sector_custom}
              {...register("sector_custom")}
            />
            {errors.sector_custom && (
              <p className="text-xs text-destructive mt-1">{errors.sector_custom.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Estágio */}
      <div className="space-y-1.5">
        <Label htmlFor="stage">Qual o Estágio da sua Startup?</Label>
        <Controller
          control={control}
          name="stage"
          render={({ field }) => (
            <div className={cn("rounded-md border overflow-y-auto max-h-[6.5rem] divide-y", errors.stage ? "border-destructive" : "border-input")}>
              {STAGES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    field.onChange(s.label)
                    const revenueStages = ["Operação inicial", "Escalabilidade"]
                    if (!revenueStages.includes(s.label)) setValue("current_revenue", undefined)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left transition-colors",
                    field.value === s.label
                      ? "bg-primary/10 text-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="block text-xs text-muted-foreground">{s.description}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.stage && (
          <p className="text-xs text-destructive">{errors.stage.message}</p>
        )}
      </div>

      {/* Descrição breve do negócio */}
      <div className="space-y-1.5">
        <Label htmlFor="business_description">Descrição breve do negócio</Label>
        <textarea
          id="business_description"
          rows={3}
          placeholder="Descreva em poucas palavras o que sua startup faz"
          aria-invalid={!!errors.business_description}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          {...register("business_description")}
        />
        {errors.business_description && (
          <p className="text-xs text-destructive">{errors.business_description.message}</p>
        )}
      </div>

      {/* Faturamento atual — exibido apenas em Operação inicial ou Escalabilidade */}
      {showRevenue && (
        <div className="space-y-1.5">
          <Label htmlFor="current_revenue">Faturamento atual</Label>
          <Input
            id="current_revenue"
            placeholder="Ex: R$ 10.000/mês"
            aria-invalid={!!errors.current_revenue}
            {...register("current_revenue")}
          />
          {errors.current_revenue && (
            <p className="text-xs text-destructive">{errors.current_revenue.message}</p>
          )}
        </div>
      )}

      {/* Tamanho da equipe */}
      <div className="space-y-1.5">
        <Label htmlFor="team_size">Tamanho da equipe</Label>
        <Input
          id="team_size"
          type="number"
          placeholder="Ex: 3"
          min={1}
          aria-invalid={!!errors.team_size}
          {...register("team_size", { valueAsNumber: true })}
        />
        {errors.team_size && (
          <p className="text-xs text-destructive">{errors.team_size.message}</p>
        )}
      </div>

      <div className="pt-2 flex gap-3">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 rounded-full py-5 text-sm font-semibold transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-full bg-primary py-5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
