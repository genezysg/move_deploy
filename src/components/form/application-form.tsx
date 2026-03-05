"use client"

import { useState, useEffect } from "react"
import { StepInfoBasica, type InfoBasicaData } from "./step-info-basica"
import { StepStartup, type StartupData } from "./step-startup"
import { StepBusiness, type BusinessData } from "./step-business"
import { StepTeam, type MemberData } from "./step-team"
import { StepCorporate, type CorporateData } from "./step-corporate"
import { StepRelationship, type RelationshipData } from "./step-relationship"
import { submitApplication } from "@/app/inscricao/actions"

const STEPS = [
  { id: 1, label: "Quem é você" },
  { id: 2, label: "Sua Startup" },
  { id: 3, label: "Negócio" },
  { id: 4, label: "Time" },
  { id: 5, label: "Corporativo" },
  { id: 6, label: "Programa" },
]

interface FormData {
  step1?: InfoBasicaData
  step2?: StartupData
  step3?: BusinessData
  step4?: MemberData[]
  step5?: CorporateData
  step6?: RelationshipData
}

export function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    gtag('event', 'form_step_view', {
      step_index: currentStep,
      step_name: STEPS[currentStep - 1].label,
    })
  }, [currentStep])

  function handleStep1(data: InfoBasicaData) {
    setFormData((prev) => ({ ...prev, step1: data }))
    setCurrentStep(2)
  }

  function handleStep2(data: StartupData) {
    setFormData((prev) => ({ ...prev, step2: data }))
    setCurrentStep(3)
  }

  function handleStep3(data: BusinessData) {
    setFormData((prev) => ({ ...prev, step3: data }))
    setCurrentStep(4)
  }

  function handleStep4(data: MemberData[]) {
    setFormData((prev) => ({ ...prev, step4: data }))
    setCurrentStep(5)
  }

  function handleStep5(data: CorporateData) {
    setFormData((prev) => ({ ...prev, step5: data }))
    setCurrentStep(6)
  }

  async function handleStep6(data: RelationshipData) {
    setSubmitError(null)

    const step1 = formData.step1!
    const step2 = formData.step2!
    const step3 = formData.step3!
    const step4 = formData.step4!
    const step5 = formData.step5!

    const fd = new FormData()

    // Founder
    fd.append("founder_name", step1.founder_name)
    fd.append("founder_email", step1.founder_email)
    fd.append("founder_phone", step1.founder_phone)
    fd.append("founder_linkedin", step1.founder_linkedin)
    fd.append("acquisition_channel", JSON.stringify(step1.acquisition_channel))
    fd.append("internal_referral", String(step1.internal_referral))
    fd.append("referral_name", step1.referral_name ?? "")

    // Startup
    fd.append("startup_name", step2.startup_name)
    fd.append("startup_cnpj", step2.startup_cnpj ?? "")
    fd.append("founding_year", String(step2.founding_year))
    fd.append("city_state", step2.city_state)
    fd.append("social_profile", step2.social_profile)
    fd.append("sector", step2.sector)
    fd.append("stage", step2.stage)
    fd.append("business_description", step2.business_description)
    fd.append("current_revenue", step2.current_revenue ?? "")
    fd.append("team_size", String(step2.team_size))

    // Business
    fd.append("problem_statement", step3.problem_statement)
    fd.append("current_solution", step3.current_solution)
    fd.append("competitive_advantage", step3.competitive_advantage)
    fd.append("target_audience", step3.target_audience)
    fd.append("revenue_model", step3.revenue_model ?? "")
    fd.append("active_clients", step3.active_clients ?? "")

    // Members
    fd.append("members", JSON.stringify(step4))

    // Corporate
    fd.append("had_investment_round", String(step5.had_investment_round))
    fd.append("investment_rounds_count", String(step5.investment_rounds_count))
    fd.append("founders_equity_pct", String(step5.founders_equity_pct))
    fd.append("captable_composition", step5.captable_composition ?? "")
    fd.append("additional_info", step5.additional_info ?? "")
    if (step5.pitch_deck) {
      fd.append("pitch_deck", step5.pitch_deck)
    }

    // Relationship
    fd.append("motivation", data.motivation)
    fd.append("development_areas", data.development_areas)
    fd.append("main_expectation", data.main_expectation)
    fd.append("dedicated_members", JSON.stringify(data.dedicated_members))
    fd.append("accepted_terms", String(data.accepted_terms))
    fd.append("attested_truthfulness", String(data.attested_truthfulness))

    const result = await submitApplication(fd)

    if (result.error) {
      setSubmitError("Ocorreu um erro ao enviar sua inscrição. Tente novamente.")
      return
    }

    gtag('event', 'form_submission', {
      stage: formData.step2?.stage,
      sector: formData.step2?.sector,
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 text-primary text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-xl font-bold text-foreground">Inscrição recebida!</h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Entraremos em contato em até 5 dias úteis com o resultado da triagem.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {submitError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      {/* Step indicator */}
      <div className="space-y-2">
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  step.id === currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.id < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-1 transition-colors ${
                    step.id < currentStep ? "bg-primary/30" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Etapa {currentStep} de {STEPS.length} —{" "}
          <span className="text-foreground font-medium">{STEPS[currentStep - 1].label}</span>
        </p>
      </div>

      {/* Step content */}
      {currentStep === 1 && (
        <StepInfoBasica onNext={handleStep1} defaultValues={formData.step1} />
      )}
      {currentStep === 2 && (
        <StepStartup onNext={handleStep2} onBack={() => setCurrentStep(1)} defaultValues={formData.step2} />
      )}
      {currentStep === 3 && (
        <StepBusiness
          onNext={handleStep3}
          onBack={() => setCurrentStep(2)}
          defaultValues={formData.step3}
          hasRevenue={!!formData.step2?.current_revenue}
          stage={formData.step2?.stage ?? ""}
        />
      )}
      {currentStep === 4 && (
        <StepTeam
          onNext={handleStep4}
          onBack={() => setCurrentStep(3)}
          defaultValues={formData.step4 ? { members: formData.step4 } : undefined}
          founderMember={formData.step1 ? {
            member_name: formData.step1.founder_name,
            member_linkedin: formData.step1.founder_linkedin,
          } : undefined}
        />
      )}
      {currentStep === 5 && (
        <StepCorporate onNext={handleStep5} onBack={() => setCurrentStep(4)} defaultValues={formData.step5} />
      )}
      {currentStep === 6 && (
        <StepRelationship
          onNext={handleStep6}
          onBack={() => setCurrentStep(5)}
          members={formData.step4 ?? []}
          defaultValues={formData.step6}
        />
      )}
    </div>
  )
}
