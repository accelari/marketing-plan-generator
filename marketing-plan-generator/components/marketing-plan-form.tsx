"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, Download } from "lucide-react"
import { generateMarketingPlan } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

const STEPS = {
  COMPANY_INFO: 0,
  FREQUENCY: 1,
  PLATFORMS: 2,
  RESULTS: 3,
}

export function MarketingPlanForm() {
  const [step, setStep] = useState(STEPS.COMPANY_INFO)
  const [companyDescription, setCompanyDescription] = useState("")
  const [postingFrequency, setPostingFrequency] = useState("")
  const [customPlatform, setCustomPlatform] = useState("")
  const [customPlatforms, setCustomPlatforms] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    Instagram: false,
    Facebook: false,
    LinkedIn: false,
    "Twitter/X": false,
  })
  const [marketingPlan, setMarketingPlan] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleNextStep = () => {
    if (step === STEPS.COMPANY_INFO && !companyDescription.trim()) {
      toast({
        title: "Требуется описание компании",
        description: "Пожалуйста, предоставьте описание вашей компании.",
        variant: "destructive",
      })
      return
    }

    if (step === STEPS.FREQUENCY && !postingFrequency.trim()) {
      toast({
        title: "Требуется частота публикаций",
        description: "Пожалуйста, укажите, как часто вы хотите публиковать посты.",
        variant: "destructive",
      })
      return
    }

    if (step === STEPS.PLATFORMS) {
      const platforms = [
        ...Object.entries(selectedPlatforms)
          .filter(([_, selected]) => selected)
          .map(([platform]) => platform),
        ...customPlatforms,
      ]

      if (platforms.length === 0) {
        toast({
          title: "Требуется выбор платформы",
          description: "Пожалуйста, выберите хотя бы одну платформу социальных сетей.",
          variant: "destructive",
        })
        return
      }

      handleGeneratePlan(platforms)
      return
    }

    setStep((prevStep) => prevStep + 1)
  }

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const handleAddCustomPlatform = () => {
    if (customPlatform.trim()) {
      setCustomPlatforms([...customPlatforms, customPlatform.trim()])
      setCustomPlatform("")
    }
  }

  const handleRemoveCustomPlatform = (platform: string) => {
    setCustomPlatforms(customPlatforms.filter((p) => p !== platform))
  }

  const handleGeneratePlan = async (platforms: string[]) => {
    setIsGenerating(true)
    try {
      const result = await generateMarketingPlan({
        companyDescription,
        postingFrequency,
        platforms,
      })

      setMarketingPlan(result)
      setStep(STEPS.RESULTS)
    } catch (error) {
      toast({
        title: "Ошибка при генерации плана",
        description: "Произошла ошибка при генерации вашего маркетингового плана. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(marketingPlan)
    toast({
      title: "Скопировано в буфер обмена",
      description: "Ваш маркетинговый план был скопирован в буфер обмена.",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([marketingPlan], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "marketing_plan.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        {step === STEPS.COMPANY_INFO && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Описание компании</h2>
            <p className="text-slate-600 text-sm">
              Пожалуйста, предоставьте описание вашей компании для создания индивидуального маркетингового плана.
              Включите такие детали, как название компании, отрасль, целевая аудитория, продукты/услуги, уникальные
              преимущества, тон коммуникации компании и маркетинговые цели, если возможно.
            </p>
            <Textarea
              placeholder="Введите описание вашей компании здесь..."
              className="min-h-[200px]"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleNextStep}>Далее</Button>
            </div>
          </div>
        )}

        {step === STEPS.FREQUENCY && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Частота публикаций</h2>
            <p className="text-slate-600 text-sm">Как часто вы хотели бы публиковать посты в социальных сетях?</p>
            <Input
              placeholder="например, Ежедневно, 3 раза в неделю и т.д."
              value={postingFrequency}
              onChange={(e) => setPostingFrequency(e.target.value)}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Назад
              </Button>
              <Button onClick={handleNextStep}>Далее</Button>
            </div>
          </div>
        )}

        {step === STEPS.PLATFORMS && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Платформы социальных сетей</h2>
            <p className="text-slate-600 text-sm">
              Какие платформы социальных сетей вы хотели бы включить в свой маркетинговый план?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(selectedPlatforms).map(([platform, selected]) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={selected}
                    onCheckedChange={(checked) =>
                      setSelectedPlatforms({
                        ...selectedPlatforms,
                        [platform]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor={platform}>{platform}</Label>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Добавить другую платформу</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Введите название платформы"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddCustomPlatform()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddCustomPlatform} variant="secondary">
                  Добавить
                </Button>
              </div>
            </div>

            {customPlatforms.length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Пользовательские платформы:</h3>
                <div className="flex flex-wrap gap-2">
                  {customPlatforms.map((platform) => (
                    <div key={platform} className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="text-sm">{platform}</span>
                      <button
                        onClick={() => handleRemoveCustomPlatform(platform)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Назад
              </Button>
              <Button onClick={handleNextStep} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  "Сгенерировать план"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === STEPS.RESULTS && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Ваш маркетинговый план</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Копировать
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap text-sm">
              {marketingPlan || "Маркетинговый план еще не сгенерирован."}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(STEPS.PLATFORMS)}>
                Назад
              </Button>
              <Button
                onClick={() => {
                  setStep(STEPS.COMPANY_INFO)
                  setCompanyDescription("")
                  setPostingFrequency("")
                  setSelectedPlatforms({
                    Instagram: false,
                    Facebook: false,
                    LinkedIn: false,
                    "Twitter/X": false,
                  })
                  setCustomPlatforms([])
                  setMarketingPlan("")
                }}
              >
                Создать новый план
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
