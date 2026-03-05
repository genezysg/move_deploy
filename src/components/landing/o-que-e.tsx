export function OQueE() {
  return (
    <section className="bg-background py-24 px-6 md:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Section label */}
        <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
          O programa
        </span>

        {/* Two-column layout */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-start">
          {/* Left — headline */}
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            O que é o{" "}
            <span className="text-primary">MoVe</span>?
          </h2>

          {/* Right — body */}
          <div className="space-y-5 text-muted-foreground text-base leading-relaxed">
            <p>
              O <strong className="text-foreground">MoVe Track</strong> é o
              programa de aceleração da{" "}
              <strong className="text-foreground">Montreal Ventures</strong>{" "}
              voltado para startups em estágio inicial que atuam em verticais
              estratégicas do mercado brasileiro.
            </p>
            <p>
              Ao longo de <strong className="text-foreground">16 semanas intensivas</strong>,
              as startups selecionadas recebem mentoria especializada, acesso à
              rede de parceiros da Montreal e suporte para evoluir do MVP à
              tração — com potencial de investimento de até{" "}
              <strong className="text-foreground">R$&nbsp;300&nbsp;mil</strong>.
            </p>
            <p>
              A Montreal Ventures é uma gestora focada em tecnologia e inovação,
              com portfólio diversificado e presença ativa na construção de
              startups que resolvem problemas reais de grandes organizações.
            </p>

            {/* Divider stat row */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-border">
              <div>
                <p className="text-2xl font-extrabold text-primary">16</p>
                <p className="text-xs text-muted-foreground mt-1">semanas de programa</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">R$&nbsp;300k</p>
                <p className="text-xs text-muted-foreground mt-1">investimento potencial</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">3</p>
                <p className="text-xs text-muted-foreground mt-1">startups selecionadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
