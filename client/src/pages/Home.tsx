import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const [, navigate] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💪</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">CrossFit WOD Generator</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/generator")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go to Generator
                </Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            AI-Powered CrossFit Workouts
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Generate optimized, personalized WODs (Workouts of the Day) using advanced AI. Perfect for coaches who want to save time and create better training plans.
          </p>
          {isAuthenticated ? (
            <Button
              onClick={() => navigate("/generator")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
            >
              Start Generating WODs
            </Button>
          ) : (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
            >
              Login to Get Started
            </Button>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered</h3>
            <p className="text-slate-600">
              Uses OpenAI GPT-4 to generate intelligent, balanced workouts tailored to your specifications.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast & Easy</h3>
            <p className="text-slate-600">
              Generate complete WODs in seconds. Just select your parameters and let AI do the work.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Save & Manage</h3>
            <p className="text-slate-600">
              Save your favorite WODs and build a library of workouts for your athletes.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg p-12 shadow-sm">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Select Strategy</h4>
              <p className="text-sm text-slate-600">Choose your workout type (AMRAP, EMOM, etc.)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Set Parameters</h4>
              <p className="text-sm text-slate-600">Define duration, difficulty, and focus area</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Generate WOD</h4>
              <p className="text-sm text-slate-600">AI creates a complete workout in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Save & Share</h4>
              <p className="text-sm text-slate-600">Save your WOD for future use</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
