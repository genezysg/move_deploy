import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const STATS = [
  { value: "16 semanas", label: "intensivas" },
  { value: "R$\u00a0300k", label: "investimento potencial" },
  { value: "3 startups", label: "selecionadas" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Radial glow — primary color behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[700px] w-[700px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:28px_28px]"
      />

      {/* Navbar */}
      <header className="relative flex items-center justify-between px-6 py-4 md:px-10">
        <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Montreal Ventures
        </span>
        <ThemeToggle />
      </header>

      {/* Hero content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-28 text-center">

        {/* Eyebrow badge with live pulse */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            MoVe Track · Inscrições Abertas
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Acelere sua startup{" "}
          <span className="text-primary">com quem entende</span>{" "}
          o mercado
        </h1>

        {/* Value prop */}
        <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
          Programa de aceleração focado em soluções digitais para o setor
          público e corporativo. Do MVP ao primeiro contrato.
        </p>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {STATS.map((stat, i) => (
            <div key={stat.value} className="flex items-center gap-8">
              {i > 0 && (
                <div className="hidden h-5 w-px bg-border sm:block" />
              )}
              <div className="text-center">
                <div className="text-lg font-bold text-foreground sm:text-xl">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            size="lg"
            className="rounded-full bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110"
            asChild
          >
            <Link href="/inscricao">
              Inscreva sua startup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            Inscrições abertas até{" "}
            <span className="font-medium text-foreground">30/09/2025</span>
            &nbsp;·&nbsp;Apenas 3 vagas
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"
      />
    </section>
  );
}
