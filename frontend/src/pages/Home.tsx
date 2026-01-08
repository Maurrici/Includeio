import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { PersonalizationModal } from '@/components/PersonalizationModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApplicationWithStats } from '@/types/evaluation';
import { EvaluationService } from '@/services/evaluationService';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [applications, setApplications] = useState<ApplicationWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const loadedApplications = await EvaluationService.getApplicationsWithStats();
      // Sort by evaluation count (descending), then by name
      loadedApplications.sort((a, b) => {
        if (b.evaluationCount !== a.evaluationCount) {
          return b.evaluationCount - a.evaluationCount;
        }
        return a.name.localeCompare(b.name);
      });
      setApplications(loadedApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load applications on mount and when location changes (e.g., returning from evaluation)
    loadApplications();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Home" />
      
      <main className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Aplicações Avaliadas</h2>
          <Button 
            onClick={() => navigate('/avaliacao')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Nova Avaliação
          </Button>
        </div>

        {loading ? (
          <div className="bg-card rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg">Carregando aplicações...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              Nenhuma aplicação avaliada ainda.
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
                  <TableHead className="text-primary-foreground font-semibold">Quantidade de Avaliações</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Média de Nota</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow 
                    key={application.id} 
                    className="border-b border-border hover:bg-secondary/50 cursor-pointer"
                    onClick={() => navigate(`/aplicacao/${application.id}`)}
                  >
                    <TableCell className="text-foreground font-medium">
                      {application.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {application.evaluationCount}
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">
                      {application.averageScore !== null 
                        ? application.averageScore.toFixed(2) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <a 
                        href={application.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Acessar
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <PersonalizationModal 
        open={showPersonalization} 
        onOpenChange={setShowPersonalization} 
      />
    </div>
  );
}
