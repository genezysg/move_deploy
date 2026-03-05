"use client"

import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ACQUISITION_CHANNELS = [
  "Eventos",
  "Notícias",
  "LinkedIn",
  "Instagram",
  "Site de busca",
  "Indicação",
] as const

const MONTREAL_LINK_OPTIONS = [
  { label: "Não possuo vínculo", value: false },
  { label: "Sou Colaborador", value: true },
] as const

const schema = z.object({
  founder_name: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .regex(/^[^\d]+$/, "Não pode conter números"),
  founder_email: z.string().email("E-mail inválido"),
  founder_phone: z.string().min(14, "Telefone inválido"),
  founder_linkedin: z
    .string()
    .url("URL inválida")
    .refine((val) => val.includes("linkedin.com/in/"), {
      message: "Deve ser um perfil: linkedin.com/in/seu-perfil",
    }),
  acquisition_channel: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma opção"),
  internal_referral: z.boolean({ message: "Selecione uma opção" }),
  referral_name: z.string().optional(),
}).refine(
  (data) => !data.internal_referral || (!!data.referral_name && data.referral_name.length >= 3),
  { message: "Mínimo 3 caracteres", path: ["referral_name"] }
)

export type InfoBasicaData = z.infer<typeof schema>

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ""
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

interface Props {
  onNext: (data: InfoBasicaData) => void
  defaultValues?: Partial<InfoBasicaData>
  duplicateWarning?: boolean
}

export function StepInfoBasica({ onNext, defaultValues, duplicateWarning }: Props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InfoBasicaData>({
    resolver: zodResolver(schema),
    defaultValues: {
      acquisition_channel: [],
      ...defaultValues,
    },
  })

  const isCollaborator = useWatch({ control, name: "internal_referral" })

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      {duplicateWarning && (
        <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          Este e-mail já possui uma inscrição. Prossiga para atualizar os dados.
        </div>
      )}

      {/* Nome */}
      <div className="space-y-1.5">
        <Label htmlFor="founder_name">Nome completo</Label>
        <Input
          id="founder_name"
          placeholder="Ex: Maria Oliveira"
          aria-invalid={!!errors.founder_name}
          {...register("founder_name")}
        />
        {errors.founder_name && (
          <p className="text-xs text-destructive">{errors.founder_name.message}</p>
        )}
      </div>

      {/* E-mail */}
      <div className="space-y-1.5">
        <Label htmlFor="founder_email">E-mail para contato</Label>
        <Input
          id="founder_email"
          type="email"
          placeholder="nome@empresa.com"
          aria-invalid={!!errors.founder_email}
          {...register("founder_email")}
        />
        {errors.founder_email && (
          <p className="text-xs text-destructive">{errors.founder_email.message}</p>
        )}
      </div>

      {/* Telefone */}
      <div className="space-y-1.5">
        <Label htmlFor="founder_phone">Telefone</Label>
        <Input
          id="founder_phone"
          type="tel"
          placeholder="(11) 99999-0000"
          aria-invalid={!!errors.founder_phone}
          {...register("founder_phone", {
            onChange: (e) => {
              const masked = formatPhone(e.target.value)
              setValue("founder_phone", masked, { shouldValidate: false })
              e.target.value = masked
            },
          })}
        />
        {errors.founder_phone && (
          <p className="text-xs text-destructive">{errors.founder_phone.message}</p>
        )}
      </div>

      {/* LinkedIn */}
      <div className="space-y-1.5">
        <Label htmlFor="founder_linkedin">LinkedIn</Label>
        <Input
          id="founder_linkedin"
          type="url"
          placeholder="https://linkedin.com/in/seu-perfil"
          aria-invalid={!!errors.founder_linkedin}
          {...register("founder_linkedin")}
        />
        {errors.founder_linkedin && (
          <p className="text-xs text-destructive">{errors.founder_linkedin.message}</p>
        )}
      </div>

      {/* Como ficou sabendo */}
      <div className="space-y-2">
        <Label>Como ficou sabendo do MoVe Track?</Label>
        <p className="text-xs text-muted-foreground">Pode selecionar mais de uma opção.</p>
        <Controller
          control={control}
          name="acquisition_channel"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {ACQUISITION_CHANNELS.map((channel) => {
                const selected = field.value?.includes(channel)
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => {
                      const current = field.value ?? []
                      field.onChange(
                        selected
                          ? current.filter((c) => c !== channel)
                          : [...current, channel]
                      )
                    }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                    {channel}
                  </button>
                )
              })}
            </div>
          )}
        />
        {errors.acquisition_channel && (
          <p className="text-xs text-destructive">{errors.acquisition_channel.message}</p>
        )}
      </div>

      {/* Vínculo com Grupo Montreal */}
      <div className="space-y-2">
        <Label>Possui algum vínculo com o Grupo Montreal?</Label>
        <Controller
          control={control}
          name="internal_referral"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {MONTREAL_LINK_OPTIONS.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    field.onChange(option.value)
                    if (!option.value) setValue("referral_name", undefined)
                  }}
                  className={cn(
                    "rounded-md border px-4 py-2.5 text-left text-sm transition-colors",
                    field.value === option.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
        {errors.internal_referral && (
          <p className="text-xs text-destructive">{errors.internal_referral.message}</p>
        )}
      </div>

      {/* Qual Vínculo — exibido apenas quando "Sou Colaborador" é selecionado */}
      {isCollaborator && (
        <div className="space-y-1.5">
          <Label htmlFor="referral_name">Qual vínculo?</Label>
          <Input
            id="referral_name"
            placeholder="Ex: Analista de TI — Unidade BH"
            aria-invalid={!!errors.referral_name}
            {...register("referral_name")}
          />
          {errors.referral_name && (
            <p className="text-xs text-destructive">{errors.referral_name.message}</p>
          )}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary py-5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
