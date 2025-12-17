import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Evaluation } from '@/types/evaluation';
import { EvaluationService } from '@/services/evaluationService';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';

export default function EvaluationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadedEvaluation = EvaluationService.getById(id);
    if (!loadedEvaluation) {
      navigate('/');
      return;
    }

    setEvaluation(loadedEvaluation);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Detalhes da Avaliação" />
        <main className="p-6 max-w-5xl mx-auto">
          <p className="text-muted-foreground">Carregando...</p>
        </main>
      </div>
    );
  }

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
              {evaluation.applicationName} - {evaluation.flow}
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

