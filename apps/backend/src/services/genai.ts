import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function getGenaiFeedback(
  data: any,
  options: { perspective: string }
): Promise<string> {
  try {
    let prompt: string;
    if (options.perspective === "athlete") {
      prompt = `You are a professional athletic coach. Provide personalized feedback to the athlete based on the following performance data:\n${JSON.stringify(
        data,
        null,
        2
      )}\nGive tips to improve and motivational suggestions.`;
    } else if (options.perspective === "official") {
      prompt = `You are a sports performance analyst. Analyze the following athlete performance data:\n${JSON.stringify(
        data,
        null,
        2
      )}\nProvide evaluation, comparative insights, and suggestions for improvement.`;
    } else {
      throw new Error("Invalid perspective for GenAI feedback");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful sports performance AI." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const feedback = completion.choices[0]?.message?.content;
    if (!feedback) {
      throw new Error("Failed to get feedback from OpenAI");
    }

    return feedback;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Unable to generate feedback at this time.";
  }
}
