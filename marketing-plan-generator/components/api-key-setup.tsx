"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ApiKeySetup() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkApiKey() {
      try {
        const response = await fetch("/api/check-api-key")
        const data = await response.json()
        setHasApiKey(data.hasApiKey)
      } catch (error) {
        console.error("Error checking API key:", error)
        setHasApiKey(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkApiKey()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (hasApiKey === true) {
    return null
  }

  return (
    <Card className="mb-8 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="text-amber-800">API Key Required</CardTitle>
        <CardDescription className="text-amber-700">
          To use this application, you need to set up your Anthropic API key.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 mb-4">
          This application requires an Anthropic API key to generate marketing plans. Please add your API key as an
          environment variable named <code className="bg-amber-100 px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code>.
        </p>
        <div className="flex justify-end">
          <Button
            variant="default"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => {
              window.location.reload()
            }}
          >
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
