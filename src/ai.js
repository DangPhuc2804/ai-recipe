export async function getRecipeFromMixtralRaw(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  const prompt = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. Format your response in markdown.

User: I have ${ingredientsString}. Please give me a recipe!
Assistant:
  `;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HF_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data[0]?.generated_text || "No result";
  } catch (err) {
    console.error("Hugging Face raw API error:", err.message);
    return "Failed to generate recipe.";
  }
}