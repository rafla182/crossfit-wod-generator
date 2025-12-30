import { invokeLLM } from "./_core/llm";

export interface WODGenerationParams {
  strategy: "AMRAP" | "EMOM" | "For Time" | "Strength" | "Hybrid";
  duration: number; // in minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  movements?: string[]; // Optional specific movements to include
  equipment?: string[]; // Optional equipment constraints
  focusArea?: string; // e.g., "Upper Body", "Lower Body", "Full Body", "Cardio"
}

export interface GeneratedWOD {
  title: string;
  description: string;
  warmup: string;
  mainWorkout: string;
  cooldown: string;
  movements: string[];
  equipment: string[];
  notes: string;
}

/**
 * Generate a WOD using OpenAI GPT-4
 * Returns a structured workout that coaches can use
 */
export async function generateWOD(params: WODGenerationParams): Promise<GeneratedWOD> {
  const systemPrompt = `You are an expert CrossFit coach with 10+ years of experience designing optimal workouts. 
Your task is to create a detailed, safe, and effective Workout of the Day (WOD) based on the coach's specifications.

When generating WODs:
1. Ensure proper progression and intensity scaling
2. Include warm-up and cool-down phases
3. Specify exact rep ranges, weights, and timing
4. Consider recovery and injury prevention
5. Make workouts challenging but achievable for the specified difficulty level
6. Include scaling options for different fitness levels

Always respond with a valid JSON object with the following structure:
{
  "title": "WOD Title",
  "description": "Brief description of the workout",
  "warmup": "Detailed warm-up instructions",
  "mainWorkout": "Main workout with exact movements, reps, and timing",
  "cooldown": "Cool-down and stretching routine",
  "movements": ["movement1", "movement2", ...],
  "equipment": ["equipment1", "equipment2", ...],
  "notes": "Additional coaching notes and modifications"
}`;

  const userPrompt = buildUserPrompt(params);

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "wod_generation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string", description: "WOD title" },
              description: { type: "string", description: "Brief description" },
              warmup: { type: "string", description: "Warm-up routine" },
              mainWorkout: { type: "string", description: "Main workout details" },
              cooldown: { type: "string", description: "Cool-down routine" },
              movements: {
                type: "array",
                items: { type: "string" },
                description: "List of movements in the WOD",
              },
              equipment: {
                type: "array",
                items: { type: "string" },
                description: "Equipment needed",
              },
              notes: { type: "string", description: "Coaching notes" },
            },
            required: [
              "title",
              "description",
              "warmup",
              "mainWorkout",
              "cooldown",
              "movements",
              "equipment",
              "notes",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content || typeof content !== "string") {
      throw new Error("No content returned from OpenAI");
    }

    const wod = JSON.parse(content) as GeneratedWOD;
    return wod;
  } catch (error) {
    console.error("[WOD Generator] Error generating WOD:", error);
    throw error;
  }
}

/**
 * Build the user prompt based on WOD parameters
 */
function buildUserPrompt(params: WODGenerationParams): string {
  const parts: string[] = [
    `Create a ${params.difficulty} level CrossFit WOD with the following specifications:`,
    `\nWorkout Type: ${params.strategy}`,
    `Duration: ${params.duration} minutes`,
    `Difficulty Level: ${params.difficulty}`,
  ];

  if (params.focusArea) {
    parts.push(`Focus Area: ${params.focusArea}`);
  }

  if (params.movements && params.movements.length > 0) {
    parts.push(`\nRequired Movements: ${params.movements.join(", ")}`);
  }

  if (params.equipment && params.equipment.length > 0) {
    parts.push(`Available Equipment: ${params.equipment.join(", ")}`);
  }

  parts.push(
    `\nMake sure the workout is:`,
    `- Appropriate for ${params.difficulty} athletes`,
    `- Fits within the ${params.duration} minute timeframe`,
    `- Includes a proper warm-up and cool-down`,
    `- Specifies exact movements, rep ranges, and weights`,
    `- Provides scaling options for different fitness levels`
  );

  return parts.join("\n");
}
