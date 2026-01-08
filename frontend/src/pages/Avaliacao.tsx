import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionCard } from '@/components/QuestionCard';
import { CommentsSection } from '@/components/CommentsSection';
import { OrientacoesStep } from '@/components/OrientacoesStep';
import { sections, Section } from '@/data/evaluationQuestions';
import { toast } from '@/hooks/use-toast';
import { Evaluation, calculateSectionScore, calculateOverallScore, Application, ApplicationType, Flow } from '@/types/evaluation';
import { EvaluationService } from '@/services/evaluationService';

interface IdentificationData {
  applicationId: number | null;
  applicationTypeId: number | null;
  flowId: number | null;
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
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationTypes, setApplicationTypes] = useState<ApplicationType[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    identification: {
      applicationId: null,
      applicationTypeId: null,
      flowId: null,
    },
    ratings: {},
    comments: {},
  });

  useEffect(() => {
    const loadApplications = async () => {
      setLoadingData(true);
      try {
        const apps = await EvaluationService.getApplications();
        setApplications(apps);
      } catch (error) {
        toast({
          title: "Erro ao carregar aplicações",
          description: "Não foi possível carregar a lista de aplicações.",
          variant: "destructive"
        });
      } finally {
        setLoadingData(false);
      }
    };
    loadApplications();
  }, []);

  const handleIdentificationChange = async (field: keyof IdentificationData, value: number | null) => {
    setEvaluationData(prev => ({
      ...prev,
      identification: { ...prev.identification, [field]: value }
    }));

    // When application changes, load types and reset type/flow
    if (field === 'applicationId' && value) {
      setLoadingData(true);
      try {
        const types = await EvaluationService.getApplicationTypes(value);
        setApplicationTypes(types);
        setFlows([]);
        setEvaluationData(prev => ({
          ...prev,
          identification: { 
            ...prev.identification, 
            applicationTypeId: null, 
            flowId: null 
          }
        }));
      } catch (error) {
        toast({
          title: "Erro ao carregar tipos",
          description: "Não foi possível carregar os tipos de aplicação.",
          variant: "destructive"
        });
      } finally {
        setLoadingData(false);
      }
    }

    // When type changes, load flows and reset flow
    if (field === 'applicationTypeId' && value && evaluationData.identification.applicationId) {
      setLoadingData(true);
      try {
        const appFlows = await EvaluationService.getApplicationFlows(evaluationData.identification.applicationId);
        setFlows(appFlows);
        setEvaluationData(prev => ({
          ...prev,
          identification: { 
            ...prev.identification, 
            flowId: null 
          }
        }));
      } catch (error) {
        toast({
          title: "Erro ao carregar fluxos",
          description: "Não foi possível carregar os fluxos da aplicação.",
          variant: "destructive"
        });
      } finally {
        setLoadingData(false);
      }
    }
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

  const validateSection = (sectionIndex: number): boolean => {
    const section = sections[sectionIndex];
    const sectionRatings = evaluationData.ratings[section.id] || {};
    const sectionComment = evaluationData.comments[section.id] || '';

    // Check if all questions are answered
    const allQuestionsAnswered = section.questions.every(
      q => sectionRatings[q.id] !== null && sectionRatings[q.id] !== undefined
    );

    // Check if comment is filled
    const hasComment = sectionComment.trim().length > 0;

    if (!allQuestionsAnswered) {
      toast({
        title: "Questões pendentes",
        description: "Por favor, responda todas as questões desta seção antes de continuar.",
        variant: "destructive"
      });
      return false;
    }

    if (!hasComment) {
      toast({
        title: "Comentário obrigatório",
        description: "Por favor, preencha o campo de comentários antes de continuar.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Validate identification
      const { applicationId, applicationTypeId, flowId } = evaluationData.identification;
      if (!applicationId || !applicationTypeId || !flowId) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, selecione todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 1) {
      // Orientações step - no validation needed
    } else if (currentStep >= 2 && currentStep <= sections.length + 1) {
      // Section validation - currentStep 2 is section 0, etc.
      const sectionIndex = currentStep - 2;
      if (!validateSection(sectionIndex)) {
        return;
      }
    }
    
    // Total steps: 0 (Identification) + 1 (Orientações) + 5 sections = 7 steps (0-6)
    if (currentStep < sections.length + 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step - calculate scores and save evaluation
      try {
        const evaluation = createEvaluation();
        await EvaluationService.save(evaluation);
        toast({
          title: "Avaliação concluída!",
          description: "Sua avaliação foi salva com sucesso.",
        });
        navigate('/');
      } catch (error) {
        console.error('Error saving evaluation:', error);
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar a avaliação. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const createEvaluation = () => {
    const sectionScores = sections.map(section => {
      const sectionRatings = evaluationData.ratings[section.id] || {};
      const questions = section.questions.map(q => ({
        questionId: q.id,
        score: sectionRatings[q.id] || 1 // Default to 1 if somehow missing
      }));
      
      const { rawScore, normalizedScore } = calculateSectionScore(questions);
      
      return {
        sectionId: section.id,
        sectionName: section.name,
        rawScore,
        normalizedScore,
        comment: evaluationData.comments[section.id] || '',
        questions
      };
    });

    const { totalRawScore, normalizedScore } = calculateOverallScore(sectionScores);

    return {
      application_id: evaluationData.identification.applicationId!,
      application_type_id: evaluationData.identification.applicationTypeId!,
      flow_id: evaluationData.identification.flowId!,
      totalRawScore,
      normalizedScore,
      overallScore: normalizedScore, // Same as normalizedScore
      sectionScores
    };
  };

  const renderIdentification = () => (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Identificação</h2>
      <p className="text-muted-foreground text-center mb-8">
        Selecione a aplicação, seu tipo e o fluxo específico que será avaliado.
      </p>

      <div className="space-y-6">
        <div className="bg-secondary rounded-lg p-6">
          <label className="block text-secondary-foreground font-medium mb-2">
            Selecione a aplicação a ser avaliada:*
          </label>
          <Select
            value={evaluationData.identification.applicationId?.toString() || ''}
            onValueChange={(value) => handleIdentificationChange('applicationId', parseInt(value))}
            disabled={loadingData}
          >
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Selecione uma aplicação..." />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app.id} value={app.id.toString()}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-secondary rounded-lg p-6">
          <label className="block text-secondary-foreground font-medium mb-2">
            Selecione o tipo da aplicação:*
          </label>
          <Select
            value={evaluationData.identification.applicationTypeId?.toString() || ''}
            onValueChange={(value) => handleIdentificationChange('applicationTypeId', parseInt(value))}
            disabled={loadingData || !evaluationData.identification.applicationId}
          >
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent>
              {applicationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-secondary rounded-lg p-6">
          <label className="block text-secondary-foreground font-medium mb-2">
            Selecione o fluxo a ser avaliado:*
          </label>
          <p className="text-sm text-muted-foreground mb-3">
            Selecione o fluxo específico que você irá avaliar.
          </p>
          <Select
            value={evaluationData.identification.flowId?.toString() || ''}
            onValueChange={(value) => handleIdentificationChange('flowId', parseInt(value))}
            disabled={loadingData || !evaluationData.identification.applicationTypeId}
          >
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Selecione um fluxo..." />
            </SelectTrigger>
            <SelectContent>
              {flows.map((flow) => (
                <SelectItem key={flow.id} value={flow.id.toString()}>
                  {flow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

  const renderCurrentStep = () => {
    if (currentStep === 0) {
      return renderIdentification();
    } else if (currentStep === 1) {
      return <OrientacoesStep />;
    } else {
      // currentStep 2 = sections[0], currentStep 3 = sections[1], etc.
      return renderSection(sections[currentStep - 2]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Avaliação" />
      <ProgressBar currentStep={currentStep} />

      {renderCurrentStep()}

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
            {currentStep === sections.length + 1 ? 'Finalizar' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
}
