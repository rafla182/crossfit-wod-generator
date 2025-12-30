import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

interface GeneratedWOD {
  title: string;
  description: string;
  warmup: string;
  mainWorkout: string;
  cooldown: string;
  movements: string[];
  equipment: string[];
  notes: string;
}

export default function WODGenerator() {
  const [strategy, setStrategy] = useState<"AMRAP" | "EMOM" | "For Time" | "Strength" | "Hybrid">("AMRAP");
  const [duration, setDuration] = useState(20);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [focusArea, setFocusArea] = useState("Full Body");
  const [movements, setMovements] = useState("");
  const [equipment, setEquipment] = useState("");

  const [generatedWOD, setGeneratedWOD] = useState<GeneratedWOD | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMutation = trpc.wod.generate.useMutation();
  const saveMutation = trpc.wod.save.useMutation();
  const listQuery = trpc.wod.list.useQuery();

  const handleGenerate = async () => {
    if (!strategy || !duration || !difficulty) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMutation.mutateAsync({
        strategy,
        duration,
        difficulty,
        focusArea: focusArea || undefined,
        movements: movements ? movements.split(",").map(m => m.trim()) : undefined,
        equipment: equipment ? equipment.split(",").map(e => e.trim()) : undefined,
      });

      setGeneratedWOD(result);
      toast.success("WOD generated successfully!");
    } catch (error) {
      console.error("Error generating WOD:", error);
      toast.error("Failed to generate WOD. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWOD = async () => {
    if (!generatedWOD) return;

    try {
      await saveMutation.mutateAsync({
        title: generatedWOD.title,
        description: generatedWOD.description,
        strategy,
        duration,
        difficulty,
        warmup: generatedWOD.warmup,
        mainWorkout: generatedWOD.mainWorkout,
        cooldown: generatedWOD.cooldown,
        movements: JSON.stringify(generatedWOD.movements),
        equipment: JSON.stringify(generatedWOD.equipment),
        notes: generatedWOD.notes,
      });

      toast.success("WOD saved successfully!");
      listQuery.refetch();
      setGeneratedWOD(null);
    } catch (error) {
      console.error("Error saving WOD:", error);
      toast.error("Failed to save WOD. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">CrossFit WOD Generator</h1>
          <p className="text-lg text-slate-600">
            Create optimized workouts powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Workout Parameters</h2>

              <div className="space-y-4">
                {/* Strategy */}
                <div>
                  <Label htmlFor="strategy" className="text-sm font-semibold text-slate-700">
                    Strategy
                  </Label>
                  <Select value={strategy} onValueChange={(value: any) => setStrategy(value)}>
                    <SelectTrigger id="strategy" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AMRAP">AMRAP (As Many Rounds As Possible)</SelectItem>
                      <SelectItem value="EMOM">EMOM (Every Minute On the Minute)</SelectItem>
                      <SelectItem value="For Time">For Time</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div>
                  <Label htmlFor="duration" className="text-sm font-semibold text-slate-700">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="120"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <Label htmlFor="difficulty" className="text-sm font-semibold text-slate-700">
                    Difficulty Level
                  </Label>
                  <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                    <SelectTrigger id="difficulty" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Focus Area */}
                <div>
                  <Label htmlFor="focusArea" className="text-sm font-semibold text-slate-700">
                    Focus Area (Optional)
                  </Label>
                  <Select value={focusArea} onValueChange={setFocusArea}>
                    <SelectTrigger id="focusArea" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Body">Full Body</SelectItem>
                      <SelectItem value="Upper Body">Upper Body</SelectItem>
                      <SelectItem value="Lower Body">Lower Body</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Gymnastics">Gymnastics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Movements */}
                <div>
                  <Label htmlFor="movements" className="text-sm font-semibold text-slate-700">
                    Specific Movements (Optional)
                  </Label>
                  <Textarea
                    id="movements"
                    placeholder="e.g., Barbell Back Squat, Pull-ups, Kettlebell Swings (comma-separated)"
                    value={movements}
                    onChange={(e) => setMovements(e.target.value)}
                    className="mt-2 h-20"
                  />
                </div>

                {/* Equipment */}
                <div>
                  <Label htmlFor="equipment" className="text-sm font-semibold text-slate-700">
                    Available Equipment (Optional)
                  </Label>
                  <Textarea
                    id="equipment"
                    placeholder="e.g., Barbell, Dumbbells, Kettlebells, Pull-up Bar (comma-separated)"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="mt-2 h-20"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate WOD"
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Generated WOD */}
          <div className="lg:col-span-2">
            {generatedWOD ? (
              <Card className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{generatedWOD.title}</h2>
                    <p className="text-slate-600 mt-2">{generatedWOD.description}</p>
                  </div>
                  <Button
                    onClick={handleSaveWOD}
                    disabled={saveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save WOD
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Warm-up */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Warm-up</h3>
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700">
                      <Streamdown>{generatedWOD.warmup}</Streamdown>
                    </div>
                  </div>

                  {/* Main Workout */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Main Workout</h3>
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700">
                      <Streamdown>{generatedWOD.mainWorkout}</Streamdown>
                    </div>
                  </div>

                  {/* Cool-down */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Cool-down</h3>
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700">
                      <Streamdown>{generatedWOD.cooldown}</Streamdown>
                    </div>
                  </div>

                  {/* Movements & Equipment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Movements</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedWOD.movements.map((movement, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {movement}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Equipment</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedWOD.equipment.map((equip, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                          >
                            {equip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Coaching Notes</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg text-slate-700 border-l-4 border-yellow-400">
                      <Streamdown>{generatedWOD.notes}</Streamdown>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <div className="text-slate-400 mb-4">
                  <svg
                    className="mx-auto h-16 w-16 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Generate Your First WOD
                </h3>
                <p className="text-slate-600">
                  Fill in the parameters on the left and click "Generate WOD" to create an AI-powered workout
                </p>
              </Card>
            )}

            {/* Saved WODs */}
            {listQuery.data && listQuery.data.length > 0 && (
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Saved WODs</h3>
                <div className="grid gap-4">
                  {listQuery.data.map((wod) => (
                    <Card key={wod.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900">{wod.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{wod.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {wod.strategy}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {wod.duration} min
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {wod.difficulty}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement delete functionality
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
