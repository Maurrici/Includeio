import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface Evaluation {
  id: string;
  aplicacao: string;
  fluxo: string;
  notaGeral: number;
}

const mockEvaluations: Evaluation[] = [
  { id: '9080797679', aplicacao: 'Mercado Livre', fluxo: 'Pesquisa', notaGeral: 4 },
  { id: '9080797680', aplicacao: 'Mercado Livre', fluxo: 'Compra', notaGeral: 5 },
  { id: '9080797681', aplicacao: 'Mercado Livre', fluxo: 'Cadastro', notaGeral: 2 },
  { id: '9080797682', aplicacao: 'Mercado Livre', fluxo: 'Venda', notaGeral: 1 },
  { id: '9080797683', aplicacao: 'Ifood', fluxo: 'Pesquisa', notaGeral: 8 },
  { id: '9080797684', aplicacao: 'Ifood', fluxo: 'Compra', notaGeral: 4 },
  { id: '9080797685', aplicacao: 'Ifood', fluxo: 'Cadastro', notaGeral: 3 },
  { id: '9080797686', aplicacao: 'Ifood', fluxo: 'Venda', notaGeral: 8 },
];

export default function Home() {
  const navigate = useNavigate();
  const [showPersonalization, setShowPersonalization] = useState(false);

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

        <div className="bg-card rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary">
                <TableHead className="text-primary-foreground font-semibold">Aplicação</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Fluxo</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Nota geral</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Relatório</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvaluations.map((evaluation) => (
                <TableRow key={evaluation.id} className="border-b border-border">
                  <TableCell className="text-foreground">{evaluation.aplicacao}</TableCell>
                  <TableCell className="text-foreground">{evaluation.fluxo}</TableCell>
                  <TableCell className="text-foreground">{evaluation.notaGeral}</TableCell>
                  <TableCell>
                    <button className="text-accent hover:underline">{evaluation.id}</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <PersonalizeButton onClick={() => setShowPersonalization(true)} />
      <PersonalizationModal 
        open={showPersonalization} 
        onOpenChange={setShowPersonalization} 
      />
    </div>
  );
}
