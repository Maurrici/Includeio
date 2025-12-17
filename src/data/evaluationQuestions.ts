export interface Question {
  id: string;
  title: string;
  description: string;
}

export interface Section {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export const sections: Section[] = [
  {
    id: 'clareza',
    name: 'Clareza e Compreensão',
    description: 'Esta seção avalia se o conteúdo da aplicação é claro, previsível e compreensível para diferentes perfis de usuários, especialmente aqueles com deficiências cognitivas ou dificuldades de aprendizagem.',
    questions: [
      {
        id: '1.1',
        title: 'Linguagem simples e direta',
        description: 'Avalie se o conteúdo utiliza frases curtas, vocabulário cotidiano e evita jargões técnicos. O objetivo é garantir que o usuário compreenda a mensagem sem esforço cognitivo excessivo.'
      },
      {
        id: '1.2',
        title: 'Ícones e símbolos',
        description: 'Verifique se os elementos visuais seguem convenções conhecidas (ex: lupa para busca, engrenagem para configurações), facilitando o reconhecimento e reduzindo a necessidade de interpretação.'
      },
      {
        id: '1.3',
        title: 'Destaque de informações importantes',
        description: 'Observe se as informações essenciais são facilmente localizáveis por meio de contraste, posição, tamanho de fonte ou cor, permitindo que o usuário identifique rapidamente o que é mais relevante.'
      },
      {
        id: '1.4',
        title: 'Manutenção do significado',
        description: 'Analise se versões simplificadas do conteúdo (ex: modo leitura fácil) preservam o sentido original, sem omitir informações críticas.'
      },
      {
        id: '1.5',
        title: 'Suporte multimodal e acessibilidade textual',
        description: 'Considere se a interface oferece diferentes formas de acesso à informação — como leitura em voz alta, legendas, imagens explicativas — para atender usuários com diferentes perfis cognitivos e sensoriais.'
      }
    ]
  },
  {
    id: 'navegacao',
    name: 'Navegação e Encontrabilidade',
    description: 'Esta seção avalia se o usuário consegue se localizar e acessar informações com facilidade durante o uso da aplicação.',
    questions: [
      {
        id: '2.1',
        title: 'Estrutura de navegação consistente',
        description: 'Avalie se a disposição dos menus, botões e caminhos se mantém igual em todas as páginas, permitindo que o usuário aprenda o padrão de navegação e o reconheça facilmente ao explorar o sistema.'
      },
      {
        id: '2.2',
        title: 'Indicação clara de localização',
        description: 'Verifique se o usuário consegue saber onde está dentro do site ou aplicativo a todo momento, por meio de cabeçalhos, trilhas de navegação (breadcrumbs) ou realce de seções no menu.'
      },
      {
        id: '2.3',
        title: 'Menus acessíveis e ferramentas de busca',
        description: 'Observe se os menus e ferramentas de busca são visíveis, intuitivos e oferecem resultados relevantes, evitando que o usuário se perca ou precise navegar excessivamente.'
      },
      {
        id: '2.4',
        title: 'Correção e reversão de ações',
        description: 'Analise se o sistema permite desfazer ações ou retornar ao estado anterior de forma rápida e previsível, reduzindo o medo de cometer erros durante a navegação.'
      },
      {
        id: '2.5',
        title: 'Pistas visuais e orientação contextual',
        description: 'Considere se elementos gráficos, cores e ícones orientam o usuário sobre onde clicar e o que esperar ao interagir, funcionando como guias visuais que reforçam o entendimento da estrutura do site.'
      }
    ]
  },
  {
    id: 'foco',
    name: 'Foco e Atenção',
    description: 'Esta seção avalia se o ambiente visual e interativo da aplicação favorece a concentração do usuário, evitando distrações e mantendo a continuidade das tarefas.',
    questions: [
      {
        id: '3.1',
        title: 'Ausência de elementos distrativos',
        description: 'Avalie se a interface evita animações desnecessárias, anúncios piscantes ou notificações invasivas. O objetivo é reduzir distrações visuais e auditivas, permitindo que o usuário mantenha o foco na tarefa principal.'
      },
      {
        id: '3.2',
        title: 'Contraste e tipografia adequados',
        description: 'Verifique se os textos possuem bom contraste com o fundo e se a tipografia é legível, com tamanho e espaçamento confortáveis. Isso facilita a leitura contínua e evita esforço visual.'
      },
      {
        id: '3.3',
        title: 'Execução de tarefas sem perda de foco',
        description: 'Observe se o design permite que o usuário conclua ações sem interrupções inesperadas, redirecionamentos automáticos ou etapas confusas. A continuidade da tarefa deve ser preservada.'
      },
      {
        id: '3.4',
        title: 'Apoio à orientação e contexto da tarefa',
        description: 'Analise se elementos como cabeçalhos, títulos e trilhas de navegação ajudam o usuário a lembrar o que está fazendo e em qual etapa do processo se encontra, prevenindo desorientação.'
      },
      {
        id: '3.5',
        title: 'Coerência visual e textual',
        description: 'Considere se o sistema mantém consistência entre cores, ícones, terminologia e estrutura em todas as páginas, evitando confusão e reforçando o reconhecimento automático durante a navegação.'
      }
    ]
  },
  {
    id: 'memoria',
    name: 'Memória e Processos',
    description: 'Esta seção avalia se o usuário consegue concluir tarefas sem depender fortemente da memória, considerando se o sistema oferece suporte à execução de tarefas de forma fluida, orientada e com baixo esforço cognitivo.',
    questions: [
      {
        id: '4.1',
        title: 'Redução da carga de memória do usuário',
        description: 'Avalie se a interface evita exigir que o usuário memorize instruções, dados ou etapas complexas. Isso inclui manter informações visíveis, evitar instruções que desaparecem e oferecer suporte entre telas.'
      },
      {
        id: '4.2',
        title: 'Processos simplificados e orientados',
        description: 'Verifique se os fluxos de interação são curtos, com etapas bem definidas e orientações claras. Avalie se há instruções passo a passo, preenchimento automático ou exemplos visuais que guiem o usuário.'
      },
      {
        id: '4.3',
        title: 'Opções para desfazer e revisar ações',
        description: 'Observe se o sistema permite que o usuário revise ou desfaça ações com facilidade, como editar dados antes de enviar, retornar a etapas anteriores ou cancelar operações sem penalidades.'
      },
      {
        id: '4.4',
        title: 'Persistência de informações importantes',
        description: 'Analise se dados relevantes — como preferências, progresso ou histórico — permanecem visíveis ou podem ser recuperados, evitando que o usuário precise repetir tarefas por falta de memória do sistema.'
      },
      {
        id: '4.5',
        title: 'Reforço visual e contextual de informações',
        description: 'Considere se a interface utiliza elementos visuais como ícones, cores ou agrupamentos para reforçar o significado de ações e dados, facilitando o reconhecimento e reduzindo a dependência da memória verbal.'
      }
    ]
  },
  {
    id: 'suporte',
    name: 'Suporte e Personalização',
    description: 'Esta seção avalia se a interface oferece ajuda, flexibilidade e adaptação às preferências do usuário, especialmente no contexto de acessibilidade cognitiva.',
    questions: [
      {
        id: '5.1',
        title: 'Facilidade de acesso à ajuda e suporte humano',
        description: 'Avalie se o sistema oferece canais visíveis e acessíveis para suporte, como chat, telefone ou ajuda contextual. Isso reduz frustração e oferece segurança ao usuário em caso de dúvidas ou erros.'
      },
      {
        id: '5.2',
        title: 'Disponibilidade de instruções e exemplos claros',
        description: 'Verifique se há tutoriais, dicas visuais, exemplos práticos e orientações passo a passo que facilitem o entendimento das funcionalidades.'
      },
      {
        id: '5.3',
        title: 'Suporte a diferentes formas de compreensão',
        description: 'Observe se o conteúdo é oferecido em múltiplos formatos — texto, áudio, vídeo, gráficos — para atender diferentes estilos de aprendizagem e necessidades cognitivas.'
      },
      {
        id: '5.4',
        title: 'Adaptação da apresentação de conteúdo',
        description: 'Avalie se o sistema permite ajustar a forma como as informações são exibidas, como ativar modo de leitura simplificada, ocultar elementos não essenciais ou reorganizar conteúdos para facilitar a compreensão.'
      },
      {
        id: '5.5',
        title: 'Opções de personalização da interface',
        description: 'Considere se o sistema permite ajustes como tamanho da fonte, esquema de cores, espaçamento ou modo de foco, adaptando a experiência às preferências e necessidades do usuário.'
      }
    ]
  }
];

export const evaluationSteps = [
  'Identificação',
  'Clareza e Compreensão',
  'Navegação e Encontrabilidade',
  'Foco e Atenção',
  'Memória e Processos',
  'Suporte e Personalização'
];
