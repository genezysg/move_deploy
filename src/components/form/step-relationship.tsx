"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { MemberData } from "./step-team"

const textareaClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"

const schema = z.object({
  motivation: z.string().min(20, "Mínimo 20 caracteres"),
  development_areas: z.string().min(20, "Mínimo 20 caracteres"),
  main_expectation: z.string().min(20, "Mínimo 20 caracteres"),
  dedicated_members: z.array(z.string()).min(1, "Selecione pelo menos um membro"),
  accepted_terms: z
    .boolean()
    .refine((v) => v, { message: "Você precisa aceitar o edital para prosseguir" }),
  attested_truthfulness: z
    .boolean()
    .refine((v) => v, { message: "Você precisa atestar a veracidade das informações" }),
})

type RelationshipFormValues = z.infer<typeof schema>

export interface RelationshipData {
  motivation: string
  development_areas: string
  main_expectation: string
  dedicated_members: string[]
  accepted_terms: boolean
  attested_truthfulness: boolean
}

interface Props {
  onNext: (data: RelationshipData) => void
  members: MemberData[]
  defaultValues?: Partial<RelationshipFormValues>
}

export function StepRelationship({ onNext, members, defaultValues }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RelationshipFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dedicated_members: [],
      accepted_terms: false,
      attested_truthfulness: false,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      {/* Motivação */}
      <div className="space-y-1.5">
        <Label htmlFor="motivation">Por que você deseja participar do Move Track?</Label>
        <textarea
          id="motivation"
          rows={3}
          aria-invalid={!!errors.motivation}
          className={textareaClass}
          {...register("motivation")}
        />
        {errors.motivation && (
          <p className="text-xs text-destructive">{errors.motivation.message}</p>
        )}
      </div>

      {/* Áreas de desenvolvimento */}
      <div className="space-y-1.5">
        <Label htmlFor="development_areas">
          Quais são as principais áreas em que sua Startup precisa se desenvolver?
        </Label>
        <textarea
          id="development_areas"
          rows={3}
          aria-invalid={!!errors.development_areas}
          className={textareaClass}
          {...register("development_areas")}
        />
        {errors.development_areas && (
          <p className="text-xs text-destructive">{errors.development_areas.message}</p>
        )}
      </div>

      {/* Expectativa */}
      <div className="space-y-1.5">
        <Label htmlFor="main_expectation">Qual sua maior expectativa com o Move Track?</Label>
        <textarea
          id="main_expectation"
          rows={3}
          aria-invalid={!!errors.main_expectation}
          className={textareaClass}
          {...register("main_expectation")}
        />
        {errors.main_expectation && (
          <p className="text-xs text-destructive">{errors.main_expectation.message}</p>
        )}
      </div>

      {/* Membros dedicados */}
      <div className="space-y-2">
        <div className="space-y-0.5">
          <Label>Quais membros poderão se dedicar ao Programa?</Label>
          <p className="text-xs text-muted-foreground">
            O Programa exige uma dedicação mínima de 10 horas semanais da equipe, podendo haver revezamento entre os membros.
          </p>
        </div>
        <Controller
          control={control}
          name="dedicated_members"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {members.map((m) => {
                const selected = field.value.includes(m.member_name)
                return (
                  <button
                    key={m.member_name}
                    type="button"
                    onClick={() =>
                      field.onChange(
                        selected
                          ? field.value.filter((n) => n !== m.member_name)
                          : [...field.value, m.member_name]
                      )
                    }
                    className={cn(
                      "flex items-center gap-3 rounded-md border px-4 py-2.5 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        selected ? "border-primary bg-primary" : "border-muted-foreground"
                      )}
                    >
                      {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{m.member_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {m.member_role} · {m.member_type}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        />
        {errors.dedicated_members && (
          <p className="text-xs text-destructive">{errors.dedicated_members.message}</p>
        )}
      </div>

      {/* Checkboxes de confirmação */}
      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-muted-foreground accent-primary cursor-pointer"
            {...register("accepted_terms")}
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Você leu, compreendeu e aceita as disposições estabelecidas no edital do Programa.
          </span>
        </label>
        {errors.accepted_terms && (
          <p className="text-xs text-destructive pl-7">{errors.accepted_terms.message}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-muted-foreground accent-primary cursor-pointer"
            {...register("attested_truthfulness")}
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Você atesta a veracidade das informações compartilhadas no formulário.
          </span>
        </label>
        {errors.attested_truthfulness && (
          <p className="text-xs text-destructive pl-7">{errors.attested_truthfulness.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary py-5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
        >
          {isSubmitting ? "Enviando..." : "Enviar inscrição"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}
