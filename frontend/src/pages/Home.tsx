import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { PersonalizeButton } from '@/components/PersonalizeButton';
import { PersonalizationModal } from '@/components/PersonalizationModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Evaluation } from '@/types/evaluation';
import { EvaluationService } from '@/services/evaluationService';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const loadEvaluations = async () => {
    // Load evaluations from storage
    const loadedEvaluations = await EvaluationService.getAll();
    // Sort by creation date, newest first
    loadedEvaluations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setEvaluations(loadedEvaluations);
  };

  useEffect(() => {
    // Load evaluations on mount and when location changes (e.g., returning from evaluation)
    loadEvaluations();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Home" />
      
      <main className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Avaliações Realizadas</h2>
          <Button 
            onClick={() => navigate('/avaliacao')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Nova Avaliação
          </Button>
        </div>

        {evaluations.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              Nenhuma avaliação realizada ainda.
            </p>
            <p className="text-muted-foreground text-sm">
              Clique em "Nova Avaliação" para começar.
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Aplicação</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Fluxo</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Nota geral</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow 
                    key={evaluation.id} 
                    className="border-b border-border hover:bg-secondary/50 cursor-pointer"
                    onClick={() => navigate(`/avaliacao/${evaluation.id}`)}
                  >
                    <TableCell className="text-foreground">{evaluation.applicationName}</TableCell>
                    <TableCell className="text-foreground">{evaluation.flow}</TableCell>
                    <TableCell className="text-foreground font-semibold">
                      {evaluation.overallScore.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <button 
                        className="text-accent hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/avaliacao/${evaluation.id}`);
                        }}
                      >
                        Ver detalhes
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <PersonalizeButton onClick={() => setShowPersonalization(true)} />
      <PersonalizationModal 
        open={showPersonalization} 
        onOpenChange={setShowPersonalization} 
      />
    </div>
  );
}
