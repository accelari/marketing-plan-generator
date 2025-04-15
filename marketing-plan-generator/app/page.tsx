import { MarketingPlanForm } from "@/components/marketing-plan-form"
import { ApiKeySetup } from "@/components/api-key-setup"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-2">
              Генератор плана маркетинга в социальных сетях
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Создайте комплексный 1-месячный маркетинговый план для вашей компании в выбранных социальных сетях.
            </p>
          </div>

          <ApiKeySetup />
          <MarketingPlanForm />
        </div>
      </div>
    </main>
  )
}
