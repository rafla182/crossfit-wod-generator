import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💪</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">IA WOD</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/generator")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ir para Gerador
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Treinos de CrossFit com IA
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Gere WODs otimizados e personalizados usando inteligência artificial. Perfeito para coaches que querem economizar tempo e criar planos de treinamento melhores.
          </p>
          <Button
            onClick={() => navigate("/generator")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
          >
            Começar a Gerar WODs
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Alimentado por IA</h3>
            <p className="text-slate-600">
              Usa OpenAI GPT-4 para gerar treinos inteligentes e balanceados, personalizados de acordo com suas especificações.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Rápido e Fácil</h3>
            <p className="text-slate-600">
              Gere WODs completos em segundos. Basta selecionar seus parâmetros e deixar a IA fazer o trabalho.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Salvar e Gerenciar</h3>
            <p className="text-slate-600">
              Salve seus WODs favoritos e crie uma biblioteca de treinos para seus atletas.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg p-12 shadow-sm">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">Como Funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Selecione a Estratégia</h4>
              <p className="text-sm text-slate-600">Escolha o tipo de treino (AMRAP, EMOM, etc.)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Defina os Parâmetros</h4>
              <p className="text-sm text-slate-600">Defina duração, dificuldade e área de foco</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Gere o WOD</h4>
              <p className="text-sm text-slate-600">IA cria um treino completo em segundos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Salve e Compartilhe</h4>
              <p className="text-sm text-slate-600">Salve seu WOD para uso futuro</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
