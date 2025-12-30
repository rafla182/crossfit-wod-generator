import { describe, expect, it } from "vitest";
import { invokeLLM } from "./_core/llm";

describe("OpenAI Integration", () => {
  it("should successfully call OpenAI GPT-4 with a simple prompt", async () => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond with a single word.",
        },
        {
          role: "user",
          content: "Say 'test' if you can read this.",
        },
      ],
    });

    // Verify response structure
    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0]).toBeDefined();
    expect(response.choices[0].message).toBeDefined();
    expect(response.choices[0].message.content).toBeDefined();

    // Verify the response contains meaningful content
    const content = response.choices[0].message.content;
    expect(typeof content).toBe("string");
    expect(content.length).toBeGreaterThan(0);

    console.log("✅ OpenAI API Test Passed");
    console.log("Response:", content);
  });
});
