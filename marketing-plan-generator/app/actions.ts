"use server"

// Check if the ANTHROPIC_API_KEY environment variable is set
const apiKey = process.env.ANTHROPIC_API_KEY

type MarketingPlanParams = {
  companyDescription: string
  postingFrequency: string
  platforms: string[]
}

export async function generateMarketingPlan({
  companyDescription,
  postingFrequency,
  platforms,
}: MarketingPlanParams): Promise<string> {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set")
  }

  const apiUrl = "https://api.anthropic.com/v1/messages"
  const platformsStr = platforms.join(", ")

  const prompt = `Based on the following company description, create a comprehensive 1-month social media marketing plan for the following platforms: ${platformsStr}.

Company Description:
${companyDescription}

Posting Frequency: ${postingFrequency}

For each platform, include:
1. Сaptions and hashtags (where relevant) for each post
2. Prompt for image generation

Organize the plan by week (Week 1-4) for each platform, with specific actionable recommendations that match the requested posting frequency.`

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result.content[0].text
  } catch (error) {
    console.error("Error generating marketing plan:", error)
    throw new Error("Failed to generate marketing plan. Please try again later.")
  }
}
