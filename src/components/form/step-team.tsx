"use client"

import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MEMBER_TYPES = ["Fundador", "Funcionário", "Mentor"] as const

const textareaClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"

const memberSchema = z.object({
  member_name: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .regex(/^[^\d]+$/, "Sem números"),
  prior_experience: z.string().min(20, "Mínimo 20 caracteres"),
  member_linkedin: z
    .string()
    .optional()
    .refine((val) => !val || val.includes("linkedin.com/in/"), {
      message: "Deve conter linkedin.com/in/",
    }),
  member_type: z.string().min(1, "Selecione um tipo"),
  member_role: z.string().min(2, "Mínimo 2 caracteres"),
})

const schema = z.object({
  members: z.array(memberSchema).min(1),
})

type TeamFormValues = z.infer<typeof schema>

export type MemberData = z.infer<typeof memberSchema>

const EMPTY_MEMBER: MemberData = {
  member_name: "",
  prior_experience: "",
  member_linkedin: "",
  member_type: "",
  member_role: "",
}

interface Props {
  onNext: (data: MemberData[]) => void
  onBack?: () => void
  defaultValues?: TeamFormValues
  founderMember?: { member_name: string; member_linkedin?: string }
}

export function StepTeam({ onNext, onBack, defaultValues, founderMember }: Props) {
  const initialMembers = defaultValues?.members ?? [
    {
      ...EMPTY_MEMBER,
      member_name: founderMember?.member_name ?? "",
      member_linkedin: founderMember?.member_linkedin ?? "",
      member_type: "Fundador",
    },
  ]

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { members: initialMembers },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "members" })

  return (
    <form onSubmit={handleSubmit((data) => onNext(data.members))} noValidate className="space-y-4">
      {fields.map((field, index) => {
        const isFounder = index === 0
        return (
        <div key={field.id} className="rounded-lg border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {isFounder ? "Fundador (você)" : `Membro ${index + 1}`}
            </span>
            {!isFounder && (
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remover membro"
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor={`members.${index}.member_name`}>Nome</Label>
            <Input
              id={`members.${index}.member_name`}
              placeholder="Ex: João Silva"
              readOnly={isFounder}
              disabled={isFounder}
              aria-invalid={!!errors.members?.[index]?.member_name}
              {...register(`members.${index}.member_name`)}
            />
            {errors.members?.[index]?.member_name && (
              <p className="text-xs text-destructive">{errors.members[index]!.member_name!.message}</p>
            )}
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Controller
              control={control}
              name={`members.${index}.member_type`}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {MEMBER_TYPES.map((t) => {
                    const selected = field.value === t
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={isFounder}
                        onClick={() => !isFounder && field.onChange(t)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                          isFounder && "cursor-default opacity-60"
                        )}
                      >
                        {selected && <Check className="h-3 w-3" />}
                        {t}
                      </button>
                    )
                  })}
                </div>
              )}
            />
            {errors.members?.[index]?.member_type && (
              <p className="text-xs text-destructive">{errors.members[index]!.member_type!.message}</p>
            )}
          </div>

          {/* Função */}
          <div className="space-y-1.5">
            <Label htmlFor={`members.${index}.member_role`}>Função</Label>
            <Input
              id={`members.${index}.member_role`}
              placeholder="Ex: CTO"
              aria-invalid={!!errors.members?.[index]?.member_role}
              {...register(`members.${index}.member_role`)}
            />
            {errors.members?.[index]?.member_role && (
              <p className="text-xs text-destructive">{errors.members[index]!.member_role!.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <Label htmlFor={`members.${index}.member_linkedin`}>
              LinkedIn <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Input
              id={`members.${index}.member_linkedin`}
              type="url"
              placeholder="https://linkedin.com/in/seu-perfil"
              readOnly={isFounder && !!founderMember?.member_linkedin}
              disabled={isFounder && !!founderMember?.member_linkedin}
              aria-invalid={!!errors.members?.[index]?.member_linkedin}
              {...register(`members.${index}.member_linkedin`)}
            />
            {errors.members?.[index]?.member_linkedin && (
              <p className="text-xs text-destructive">{errors.members[index]!.member_linkedin!.message}</p>
            )}
          </div>

          {/* Experiência anterior */}
          <div className="space-y-1.5">
            <Label htmlFor={`members.${index}.prior_experience`}>Experiência anterior</Label>
            <textarea
              id={`members.${index}.prior_experience`}
              rows={3}
              placeholder="Descreva experiências profissionais relevantes"
              aria-invalid={!!errors.members?.[index]?.prior_experience}
              className={textareaClass}
              {...register(`members.${index}.prior_experience`)}
            />
            {errors.members?.[index]?.prior_experience && (
              <p className="text-xs text-destructive">{errors.members[index]!.prior_experience!.message}</p>
            )}
          </div>
        </div>
        )
      })}

      <button
        type="button"
        onClick={() => append({ ...EMPTY_MEMBER })}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-2.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
      >
        <Plus className="h-4 w-4" />
        Adicionar membro
      </button>

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
