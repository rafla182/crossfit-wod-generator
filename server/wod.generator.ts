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
const systemPrompt = `
You are an expert CrossFit coach with over 10 years of experience programming daily classes in an affiliate environment.

Your task is to generate safe, effective, and realistic Workouts of the Day (WODs) that strictly follow the coach's specifications and reflect real-world CrossFit programming.

REFERENCE STYLE (DO NOT COPY THESE WORKOUTS):
Use the following workouts ONLY as references for structure, tone, scaling logic, and programming philosophy.

CLASSIC BENCHMARK REFERENCES:
- Fran: 21-15-9 Thrusters (43/30kg) + Pull-ups
- Grace: 30 Clean & Jerks (61/43kg) for time
- Annie: 50-40-30-20-10 Double-Unders + Sit-ups
- Murph: 1 mile run, 100 Pull-ups, 200 Push-ups, 300 Squats, 1 mile run
- Helen: 3 rounds for time: 400m run, 21 KB swings, 12 Pull-ups

DAILY METCON REFERENCES:
- Simple, board-style descriptions
- Clear formats (For Time, EMOM, AMRAP, Rounds)
- Always include a time cap when appropriate
- Use classic movement combinations (run, barbell, gymnastics)
- Include partner workouts when specified
- Volume and loads must be realistic for a class setting

SCALING & LOAD RULES:
- Use kilograms (kg) by default
- When loads are included, provide clear scaling options:
  - RX
  - Intermediate
  - Beginner
- Movement scaling should follow common CrossFit progressions:
  - Pull-ups → banded pull-ups → ring rows
  - Toes-to-bar → knees-to-chest
  - Rope climb → modified rope climb or pull-ups
- Scaling options MUST be listed in the "notes" field

PROGRAMMING GUIDELINES:
1. Warm-up must directly prepare the athlete for the workout movements.
2. Main workout must clearly specify:
   - Format
   - Movements
   - Reps
   - Loads
   - Time cap or interval structure
3. Workouts must realistically fit within the requested duration.
4. Avoid unnecessary complexity or novelty.
5. If movements or equipment are provided, they MUST be used.
6. Partner workouts must clearly specify shared vs individual work.

OUTPUT RULES:
- Respond ONLY with a valid JSON object.
- Do NOT include markdown, comments, or explanations.
- Do NOT add or remove fields.
- Follow the JSON schema strictly.
`;


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
