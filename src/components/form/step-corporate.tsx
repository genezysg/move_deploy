"use client"

import { useRef, useState } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, Check, Paperclip, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ACCEPTED_TYPES = ["application/pdf", "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
const MAX_FILE_MB = 20

const textareaClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"

const schema = z
  .object({
    had_investment_round: z.boolean({ message: "Selecione uma opção" }),
    investment_rounds_count: z.number().int().min(1, "Mínimo 1 rodada").optional(),
    founders_equity_pct: z
      .number({ error: "Informe um valor" })
      .int()
      .min(1, "Mínimo 1%")
      .max(100, "Máximo 100%"),
    captable_composition: z
      .string()
      .optional()
      .refine((val) => !val || val.trim().length === 0 || val.trim().length >= 10, {
        message: "Mínimo 10 caracteres",
      }),
    additional_info: z
      .string()
      .optional()
      .refine((val) => !val || val.trim().length === 0 || val.trim().length >= 10, {
        message: "Mínimo 10 caracteres",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.had_investment_round && !data.investment_rounds_count) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número de rodadas",
        path: ["investment_rounds_count"],
      })
    }
  })

type CorporateFormValues = z.infer<typeof schema>

export interface CorporateData {
  had_investment_round: boolean
  investment_rounds_count: number
  founders_equity_pct: number
  captable_composition?: string
  pitch_deck?: File | null
  additional_info?: string
}

interface Props {
  onNext: (data: CorporateData) => void
  defaultValues?: Partial<CorporateFormValues>
}

export function StepCorporate({ onNext, defaultValues }: Props) {
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CorporateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  })

  const hadRound = useWatch({ control, name: "had_investment_round" })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFileError(null)
    if (!file) { setPitchDeckFile(null); return }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Formato inválido. Use PDF, PPT ou PPTX.")
      setPitchDeckFile(null)
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`Arquivo muito grande. Máximo ${MAX_FILE_MB} MB.`)
      setPitchDeckFile(null)
      return
    }
    setPitchDeckFile(file)
  }

  function onSubmit(data: CorporateFormValues) {
    onNext({
      ...data,
      investment_rounds_count: data.had_investment_round
        ? (data.investment_rounds_count ?? 0)
        : 0,
      pitch_deck: pitchDeckFile,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Rodada de investimento */}
      <div className="space-y-2">
        <Label>Já teve alguma rodada de investimento?</Label>
        <Controller
          control={control}
          name="had_investment_round"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {[
                { label: "Sim", value: true },
                { label: "Não", value: false },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    field.onChange(opt.value)
                    if (!opt.value) setValue("investment_rounds_count", undefined)
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-4 py-2.5 text-left text-sm transition-colors",
                    field.value === opt.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {field.value === opt.value && <Check className="h-3.5 w-3.5 text-primary" />}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
        {errors.had_investment_round && (
          <p className="text-xs text-destructive">{errors.had_investment_round.message}</p>
        )}
      </div>

      {/* Quantas rodadas — condicional */}
      {hadRound && (
        <div className="space-y-1.5">
          <Label htmlFor="investment_rounds_count">Quantas rodadas?</Label>
          <Input
            id="investment_rounds_count"
            type="number"
            min={1}
            placeholder="Ex: 2"
            aria-invalid={!!errors.investment_rounds_count}
            {...register("investment_rounds_count", { valueAsNumber: true })}
          />
          {errors.investment_rounds_count && (
            <p className="text-xs text-destructive">{errors.investment_rounds_count.message}</p>
          )}
        </div>
      )}

      {/* % dos fundadores */}
      <div className="space-y-1.5">
        <Label htmlFor="founders_equity_pct">
          Percentual da empresa pertencente aos fundadores (%)
        </Label>
        <Input
          id="founders_equity_pct"
          type="number"
          min={1}
          max={100}
          placeholder="Ex: 70"
          aria-invalid={!!errors.founders_equity_pct}
          {...register("founders_equity_pct", { valueAsNumber: true })}
        />
        {errors.founders_equity_pct && (
          <p className="text-xs text-destructive">{errors.founders_equity_pct.message}</p>
        )}
      </div>

      {/* Captable */}
      <div className="space-y-1.5">
        <Label htmlFor="captable_composition">
          Composição do Captable{" "}
          <span className="text-muted-foreground text-xs">(opcional)</span>
        </Label>
        <textarea
          id="captable_composition"
          rows={2}
          placeholder="Ex: Fundadores 70%, Investidor A 20%, Opções 10%"
          aria-invalid={!!errors.captable_composition}
          className={textareaClass}
          {...register("captable_composition")}
        />
        {errors.captable_composition && (
          <p className="text-xs text-destructive">{errors.captable_composition.message}</p>
        )}
      </div>

      {/* Pitch deck */}
      <div className="space-y-1.5">
        <Label>
          Apresentação da startup{" "}
          <span className="text-muted-foreground text-xs">(opcional — PDF, PPT ou PPTX, máx. 20 MB)</span>
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.ppt,.pptx"
          className="hidden"
          onChange={handleFileChange}
        />
        {pitchDeckFile ? (
          <div className="flex items-center justify-between rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-foreground min-w-0">
              <Paperclip className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{pitchDeckFile.name}</span>
            </div>
            <button
              type="button"
              onClick={() => { setPitchDeckFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
              className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remover arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-2.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            <Paperclip className="h-4 w-4" />
            Selecionar arquivo
          </button>
        )}
        {fileError && <p className="text-xs text-destructive">{fileError}</p>}
      </div>

      {/* Informações adicionais */}
      <div className="space-y-1.5">
        <Label htmlFor="additional_info">
          Alguma outra informação importante?{" "}
          <span className="text-muted-foreground text-xs">(opcional)</span>
        </Label>
        <textarea
          id="additional_info"
          rows={3}
          aria-invalid={!!errors.additional_info}
          className={textareaClass}
          {...register("additional_info")}
        />
        {errors.additional_info && (
          <p className="text-xs text-destructive">{errors.additional_info.message}</p>
        )}
      </div>

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
