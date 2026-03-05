"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const textareaClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"

const schema = z.object({
  problem_statement: z.string().min(20, "Mínimo 20 caracteres"),
  current_solution: z.string().min(20, "Mínimo 20 caracteres"),
  competitive_advantage: z.string().min(20, "Mínimo 20 caracteres"),
  target_audience: z.string().min(10, "Mínimo 10 caracteres"),
  revenue_model: z.string().optional(),
  active_clients: z.string().optional(),
})

type BusinessFormValues = z.infer<typeof schema>

export interface BusinessData {
  problem_statement: string
  current_solution: string
  competitive_advantage: string
  target_audience: string
  revenue_model?: string
  active_clients?: string
}

interface Props {
  onNext: (data: BusinessData) => void
  onBack?: () => void
  defaultValues?: Partial<BusinessFormValues>
  hasRevenue: boolean
  stage: string
}

export function StepBusiness({ onNext, onBack, defaultValues, hasRevenue, stage }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  })

  const showActiveClients = stage !== "Ideação"

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      {/* Problema */}
      <div className="space-y-1.5">
        <Label htmlFor="problem_statement">Qual problema a sua startup resolve?</Label>
        <textarea
          id="problem_statement"
          rows={3}
          aria-invalid={!!errors.problem_statement}
          className={textareaClass}
          {...register("problem_statement")}
        />
        {errors.problem_statement && (
          <p className="text-xs text-destructive">{errors.problem_statement.message}</p>
        )}
      </div>

      {/* Solução atual */}
      <div className="space-y-1.5">
        <Label htmlFor="current_solution">Como esse problema é resolvido hoje?</Label>
        <textarea
          id="current_solution"
          rows={3}
          aria-invalid={!!errors.current_solution}
          className={textareaClass}
          {...register("current_solution")}
        />
        {errors.current_solution && (
          <p className="text-xs text-destructive">{errors.current_solution.message}</p>
        )}
      </div>

      {/* Diferencial competitivo */}
      <div className="space-y-1.5">
        <Label htmlFor="competitive_advantage">
          Qual a inovação que diferencia a solução dos concorrentes?
        </Label>
        <textarea
          id="competitive_advantage"
          rows={3}
          aria-invalid={!!errors.competitive_advantage}
          className={textareaClass}
          {...register("competitive_advantage")}
        />
        {errors.competitive_advantage && (
          <p className="text-xs text-destructive">{errors.competitive_advantage.message}</p>
        )}
      </div>

      {/* Público-alvo */}
      <div className="space-y-1.5">
        <Label htmlFor="target_audience">
          Quem são seus principais clientes ou público-alvo?
        </Label>
        <textarea
          id="target_audience"
          rows={2}
          aria-invalid={!!errors.target_audience}
          className={textareaClass}
          {...register("target_audience")}
        />
        {errors.target_audience && (
          <p className="text-xs text-destructive">{errors.target_audience.message}</p>
        )}
      </div>

      {/* Modelo de receita — exibido apenas se current_revenue preenchido */}
      {hasRevenue && (
        <div className="space-y-1.5">
          <Label htmlFor="revenue_model">Como a sua startup gera receita?</Label>
          <textarea
            id="revenue_model"
            rows={2}
            aria-invalid={!!errors.revenue_model}
            className={textareaClass}
            {...register("revenue_model")}
          />
          {errors.revenue_model && (
            <p className="text-xs text-destructive">{errors.revenue_model.message}</p>
          )}
        </div>
      )}

      {/* Clientes ativos — exibido apenas se stage !== "Ideação" */}
      {showActiveClients && (
        <div className="space-y-1.5">
          <Label htmlFor="active_clients">Possui clientes ativos? Se sim, quantos?</Label>
          <Input
            id="active_clients"
            placeholder="Ex: Sim, 12 clientes"
            aria-invalid={!!errors.active_clients}
            {...register("active_clients")}
          />
          {errors.active_clients && (
            <p className="text-xs text-destructive">{errors.active_clients.message}</p>
          )}
        </div>
      )}

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
