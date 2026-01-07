export function OrientacoesStep() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8">Orientações</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-primary rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary-foreground mb-4">Estrutura da Avaliação</h3>
          <ul className="space-y-2 text-primary-foreground text-sm">
            <li>• A avaliação é composta por 5 categorias principais, cada uma com 5 critérios, totalizando 25 parâmetros de análise:</li>
            <li className="ml-4 font-semibold">– Clareza e Compreensão</li>
            <li className="ml-4 font-semibold">– Navegação e Encontrabilidade</li>
            <li className="ml-4 font-semibold">– Foco e Atenção</li>
            <li className="ml-4 font-semibold">– Memória e Processos</li>
            <li className="ml-4 font-semibold">– Suporte e Personalização</li>
          </ul>
          <p className="text-primary-foreground text-sm mt-4 italic">
            Cada critério representa um aspecto essencial da experiência cognitiva e deve ser avaliado considerando o contexto real de uso da aplicação.
          </p>
        </div>

        <div className="bg-primary rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary-foreground mb-4">Etapas da Avaliação</h3>
          <ul className="space-y-2 text-primary-foreground text-sm">
            <li>• Explore a aplicação</li>
            <li>• Navegue e realize o fluxo escolhido ao menos uma vez antes de avaliar.</li>
            <li>• Identifique a aplicação</li>
            <li>• Informe nome, tipo, link e o fluxo que será analisado.</li>
            <li>• Leia as orientações</li>
            <li>• Cada seção possui instruções específicas que devem ser lidas antes da avaliação.</li>
            <li>• Avalie os critérios</li>
            <li>• Atribua notas de 1 a 5, com base na experiência real de uso.</li>
            <li>• Faça comentários ao término de cada categoria, registre observações, dificuldades ou sugestões de melhoria.</li>
          </ul>
        </div>
      </div>

      <div className="bg-secondary rounded-lg p-6">
        <h3 className="text-lg font-bold text-secondary-foreground mb-4">Recomendações Finais</h3>
        <ul className="space-y-2 text-secondary-foreground text-sm">
          <li>• Avalie sempre com base na experiência prática de uso.</li>
          <li>• Considere o impacto da interface na compreensão, foco, autonomia e fluidez da interação.</li>
          <li>• Em caso de dúvida, revise as orientações da seção correspondente.</li>
          <li>• Seja criterioso e empático: o objetivo é promover interfaces mais inclusivas e funcionais para todos os perfis cognitivos.</li>
        </ul>
      </div>
    </div>
  );
}
