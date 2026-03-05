import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ApplicationForm } from "@/components/form/application-form"

export const metadata = {
  title: "Inscrição — MoVe Track",
  description: "Inscreva sua startup no programa MoVe Track da Montreal Ventures.",
}

export default function InscricaoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-lg px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <span className="mb-4 inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            MoVe Track · Inscrição
          </span>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Inscreva sua startup
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Processo seletivo aberto até{" "}
            <span className="font-medium text-foreground">30/09/2025</span>
            &nbsp;·&nbsp;3 vagas disponíveis
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <ApplicationForm />
        </div>
      </div>
    </main>
  )
}
