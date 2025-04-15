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
        title: "Company description required",
        description: "Please provide a description of your company.",
        variant: "destructive",
      })
      return
    }

    if (step === STEPS.FREQUENCY && !postingFrequency.trim()) {
      toast({
        title: "Posting frequency required",
        description: "Please specify how often you want to post.",
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
          title: "Platform selection required",
          description: "Please select at least one social media platform.",
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
        title: "Error generating plan",
        description: "There was an error generating your marketing plan. Please try again.",
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
      title: "Copied to clipboard",
      description: "Your marketing plan has been copied to clipboard.",
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
            <h2 className="text-xl font-semibold text-slate-800">Company Description</h2>
            <p className="text-slate-600 text-sm">
              Please provide a description of your company to generate a tailored marketing plan. Include details like
              company name, industry, target audience, products/services, unique selling points, company voice, and
              marketing goals if possible.
            </p>
            <Textarea
              placeholder="Enter your company description here..."
              className="min-h-[200px]"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleNextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === STEPS.FREQUENCY && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Posting Frequency</h2>
            <p className="text-slate-600 text-sm">How frequently would you like to post on social media?</p>
            <Input
              placeholder="e.g., Daily, 3 times per week, etc."
              value={postingFrequency}
              onChange={(e) => setPostingFrequency(e.target.value)}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>Next</Button>
            </div>
          </div>
        )}

        {step === STEPS.PLATFORMS && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Social Media Platforms</h2>
            <p className="text-slate-600 text-sm">
              Which social media platforms would you like to include in your marketing plan?
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
              <h3 className="text-sm font-medium text-slate-700 mb-2">Add another platform</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter platform name"
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
                  Add
                </Button>
              </div>
            </div>

            {customPlatforms.length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Custom platforms:</h3>
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
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === STEPS.RESULTS && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Your Marketing Plan</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap text-sm">
              {marketingPlan || "No marketing plan generated yet."}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(STEPS.PLATFORMS)}>
                Back
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
                Create New Plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
