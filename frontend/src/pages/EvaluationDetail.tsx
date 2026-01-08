import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Evaluation, ApplicationEvaluationsSummary, Flow } from '@/types/evaluation';
import { EvaluationService } from '@/services/evaluationService';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';

// Helper function to get flow name safely
const getFlowName = (flow: Flow | string): string => {
  if (typeof flow === 'object' && flow && 'name' in flow) {
    return flow.name;
  }
  if (typeof flow === 'string') {
    return flow;
  }
  return 'Fluxo desconhecido';
};

export default function EvaluationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [applicationSummary, setApplicationSummary] = useState<ApplicationEvaluationsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplicationView, setIsApplicationView] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      // Check if id is a number (application) or UUID (evaluation)
      const isNumeric = /^\d+$/.test(id);
      
      if (isNumeric) {
        // Load application evaluations
        setIsApplicationView(true);
        const summary = await EvaluationService.getEvaluationsByApplication(parseInt(id));
        if (!summary) {
          navigate('/');
          return;
        }
        setApplicationSummary(summary);
      } else {
        // Load single evaluation
        setIsApplicationView(false);
        const loadedEvaluation = await EvaluationService.getById(id);
        if (!loadedEvaluation) {
          navigate('/');
          return;
        }
        setEvaluation(loadedEvaluation);
      }
      
      setLoading(false);
    };

    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Detalhes" />
        <main className="p-6 max-w-5xl mx-auto">
          <p className="text-muted-foreground">Carregando...</p>
        </main>
      </div>
    );
  }

  // Application view - show evaluations grouped by type
  if (isApplicationView && applicationSummary) {
    return (
      <div className="min-h-screen bg-background">
        <Header title={`Avaliações - ${applicationSummary.application.name}`} />
        
        <main className="p-6 max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {/* Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{applicationSummary.application.name}</CardTitle>
              <CardDescription>
                <a 
                  href={applicationSummary.application.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {applicationSummary.application.link}
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Avaliações</p>
                  <p className="text-3xl font-bold text-primary">{applicationSummary.totalCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Média Geral</p>
                  <div className="flex items-center gap-4">
                    <p className="text-3xl font-bold text-primary">
                      {applicationSummary.averageScore !== null 
                        ? applicationSummary.averageScore.toFixed(2) 
                        : 'N/A'}
                    </p>
                    {applicationSummary.averageScore !== null && (
                      <div className="flex-1">
                        <Progress 
                          value={(applicationSummary.averageScore / 10) * 100} 
                          className="h-3"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluations by Type */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Avaliações por Tipo</h2>
            
            {applicationSummary.evaluationsByType.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma avaliação encontrada para esta aplicação.
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {applicationSummary.evaluationsByType.map((group, index) => (
                  <AccordionItem key={group.applicationType.id} value={`type-${group.applicationType.id}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold">{group.applicationType.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({group.count} {group.count === 1 ? 'avaliação' : 'avaliações'})
                          </span>
                        </div>
                        {group.averageScore !== null && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Média:</span>
                            <span className="text-lg font-bold text-primary">
                              {group.averageScore.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {group.evaluations.map((evaluation) => (
                          <Card key={evaluation.id} className="border-l-4 border-l-primary">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">
                                    {getFlowName(evaluation.flow)}
                                  </CardTitle>
                                  <CardDescription>
                                    {new Date(evaluation.createdAt).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </CardDescription>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Nota Geral</p>
                                  <p className="text-2xl font-bold text-primary">
                                    {evaluation.overallScore.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                  Pontuação por Seção:
                                </h4>
                                {evaluation.sectionScores.map((section) => (
                                  <div key={section.sectionId} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">{section.sectionName}</span>
                                      <span className="text-sm font-semibold text-primary">
                                        {section.normalizedScore.toFixed(2)}
                                      </span>
                                    </div>
                                    <Progress 
                                      value={(section.normalizedScore / 10) * 100} 
                                      className="h-2"
                                    />
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Single evaluation view
  if (!evaluation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Detalhes da Avaliação" />
      
      <main className="p-6 max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Overall Score Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Nota Geral</CardTitle>
            <CardDescription>
              {evaluation.applicationName} - {getFlowName(evaluation.flow)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-primary">
                {evaluation.overallScore.toFixed(2)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>0.00</span>
                  <span>10.00</span>
                </div>
                <Progress 
                  value={(evaluation.overallScore / 10) * 100} 
                  className="h-3"
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Pontuação bruta: {evaluation.totalRawScore} / 125</p>
              <p>Criado em: {new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Section Scores */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Pontuação por Seção</h2>
          {evaluation.sectionScores.map((section) => (
            <Card key={section.sectionId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{section.sectionName}</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    {section.normalizedScore.toFixed(2)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0.00</span>
                    <span>10.00</span>
                  </div>
                  <Progress 
                    value={(section.normalizedScore / 10) * 100} 
                    className="h-2"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Pontuação bruta: {section.rawScore} / 25</p>
                    {section.comment && (
                      <div className="mt-3 p-3 bg-secondary rounded-md">
                        <p className="font-medium mb-1">Comentário:</p>
                        <p className="text-sm">{section.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        {(evaluation.applicationType || evaluation.applicationLink) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {evaluation.applicationType && (
                <p>
                  <span className="font-medium">Tipo de aplicação:</span>{' '}
                  {evaluation.applicationType}
                </p>
              )}
              {evaluation.applicationLink && (
                <p>
                  <span className="font-medium">Link:</span>{' '}
                  <a 
                    href={evaluation.applicationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {evaluation.applicationLink}
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}