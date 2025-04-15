"use server"

// Проверяем, установлена ли переменная окружения ANTHROPIC_API_KEY
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
    throw new Error("Переменная окружения ANTHROPIC_API_KEY не установлена")
  }

  const apiUrl = "https://api.anthropic.com/v1/messages"
  const platformsStr = platforms.join(", ")

  const prompt = `На основе следующего описания компании создайте комплексный 1-месячный план маркетинга в социальных сетях для следующих платформ: ${platformsStr}.

Описание компании:
${companyDescription}

Частота публикаций: ${postingFrequency}

Для каждой платформы включите:
1. Подписи и хэштеги (где это уместно) для каждого поста
2. Подсказки для генерации изображений

Организуйте план по неделям (Неделя 1-4) для каждой платформы, с конкретными действенными рекомендациями, соответствующими запрошенной частоте публикаций.`

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
      throw new Error(`Запрос к API не удался: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result.content[0].text
  } catch (error) {
    console.error("Ошибка при генерации маркетингового плана:", error)
    throw new Error("Не удалось сгенерировать маркетинговый план. Пожалуйста, попробуйте позже.")
  }
}
