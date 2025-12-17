import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QuestionCard } from '@/components/QuestionCard';
import { CommentsSection } from '@/components/CommentsSection';
import { PersonalizeButton } from '@/components/PersonalizeButton';
import { PersonalizationModal } from '@/components/PersonalizationModal';
import { sections, Section } from '@/data/evaluationQuestions';
import { toast } from '@/hooks/use-toast';

interface IdentificationData {
  nomeAplicacao: string;
  tipoAplicacao: string;
  linkAplicacao: string;
  fluxoAvaliado: string;
}

interface SectionRatings {
  [questionId: string]: number | null;
}

interface EvaluationData {
  identification: IdentificationData;
  ratings: { [sectionId: string]: SectionRatings };
  comments: { [sectionId: string]: string };
}

export default function Avaliacao() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPersonalization, setShowPersonalization] = useState(false);
  
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    identification: {
      nomeAplicacao: '',
      tipoAplicacao: '',
      linkAplicacao: '',
      fluxoAvaliado: '',
    },
    ratings: {},
    comments: {},
  });

  const handleIdentificationChange = (field: keyof IdentificationData, value: string) => {
    setEvaluationData(prev => ({
      ...prev,
      identification: { ...prev.identification, [field]: value }
    }));
  };

  const handleRatingChange = (sectionId: string, questionId: string, value: number) => {
    setEvaluationData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [sectionId]: {
          ...prev.ratings[sectionId],
          [questionId]: value
        }
      }
    }));
  };

  const handleCommentChange = (sectionId: string, value: string) => {
    setEvaluationData(prev => ({
      ...prev,
      comments: { ...prev.comments, [sectionId]: value }
    }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate identification
      const { nomeAplicacao, linkAplicacao, fluxoAvaliado } = evaluationData.identification;
      if (!nomeAplicacao || !linkAplicacao || !fluxoAvaliado) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep < sections.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - save evaluation
      toast({
        title: "Avaliação concluída!",
        description: "Sua avaliação foi salva com sucesso.",
      });
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderIdentification = () => (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Identificação</h2>
      <p className="text-muted-foreground text-center mb-8">
        Informe as informações essenciais da aplicação que será avaliada, incluindo tipo, link de acesso e o fluxo específico que será analisado.
      </p>

      <div className="space-y-6">
        <div className="bg-secondary rounded-lg p-6">
          <label className="block text-secondary-foreground font-medium mb-2">
            Qual é o nome da aplicação que será avaliada?*
          </label>
          <Input
            value={evaluationData.identification.nomeAplicacao}
            onChange={(e) => handleIdentificationChange('nomeAplicacao', e.target.value)}
            className="bg-card"
            placeholder="Ex: Mercado Livre, iFood, etc."
          />
        </div>

        <div className="bg-secondary rounded-lg p-6">
          <label className="block text-secondary-foreground font-medium mb-2">
            Qual é o tipo da aplicação?
          </label>
          <Input
            value={evaluationData.identification.tipoAplicacao}
            onChange={(e) => handleIdentificationChange('tipoAplicacao', e.target.value)}
            className="bg-card"
            placeholder="Ex: Site, App móvel, Sistema web, etc."
          />
        </div>

        <div className="bg-secondary rounded-lg p-6">
          <label className="block text-secondary-foreground font-medium mb-2">
            Informe o link (URL) para acessar a aplicação:*
          </label>
          <Input
            value={evaluationData.identification.linkAplicacao}
            onChange={(e) => handleIdentificationChange('linkAplicacao', e.target.value)}
            className="bg-card"
            placeholder="https://..."
          />
        </div>

        <div className="bg-secondary rounded-lg p-6">
          <label className="block text-secondary-foreground font-medium mb-2">
            Qual fluxo, funcionalidade ou seção específica da aplicação será avaliada?*
          </label>
          <p className="text-sm text-muted-foreground mb-3">
            Defina com detalhes o fluxo que você irá avaliar. Exemplos: processo de login, busca de produtos, preenchimento de formulário, página de perfil, etc.
          </p>
          <Textarea
            value={evaluationData.identification.fluxoAvaliado}
            onChange={(e) => handleIdentificationChange('fluxoAvaliado', e.target.value)}
            className="bg-card min-h-[100px]"
            placeholder="Descreva o fluxo a ser avaliado..."
          />
        </div>
      </div>
    </div>
  );

  const renderSection = (section: Section) => (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-2">{section.name}</h2>
      <p className="text-muted-foreground text-center mb-8">{section.description}</p>

      <div className="space-y-4">
        {section.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            rating={evaluationData.ratings[section.id]?.[question.id] || null}
            onRatingChange={(value) => handleRatingChange(section.id, question.id, value)}
          />
        ))}

        <CommentsSection
          value={evaluationData.comments[section.id] || ''}
          onChange={(value) => handleCommentChange(section.id, value)}
          sectionName={section.name}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Avaliação" />
      <ProgressBar currentStep={currentStep} />

      {currentStep === 0 ? renderIdentification() : renderSection(sections[currentStep - 1])}

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>
          <Button onClick={handleNext}>
            {currentStep === sections.length ? 'Finalizar' : 'Próximo'}
          </Button>
        </div>
      </div>

      <PersonalizeButton onClick={() => setShowPersonalization(true)} />
      <PersonalizationModal 
        open={showPersonalization} 
        onOpenChange={setShowPersonalization} 
      />
    </div>
  );
}
