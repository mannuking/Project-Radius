import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, CheckCircle, CreditCard, DollarSign, FileText, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-highradius-800">
            <CreditCard className="h-5 w-5 text-highradius-600" />
            <span>AR Manager</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-gray-600 hover:text-highradius-700 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-highradius-700 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-highradius-700 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-highradius-600 hover:text-highradius-700 hover:bg-highradius-50">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-highradius-600 hover:bg-highradius-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Streamline Your Accounts Receivable Management
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Efficiently track, manage, and collect your accounts receivables with our comprehensive financial
                    tool.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5 bg-highradius-600 hover:bg-highradius-700">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-highradius-200 text-highradius-700 hover:bg-highradius-50"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Dashboard Preview"
                  width={550}
                  height={550}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900 md:text-4xl/tight">
                  Powerful Features for Accounts Receivable Management
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your accounts receivables efficiently
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-highradius-50 p-3">
                  <BarChart3 className="h-6 w-6 text-highradius-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Comprehensive Dashboard</h3>
                <p className="text-center text-gray-500">
                  Get a complete overview of your accounts receivable with our intuitive dashboard.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-highradius-50 p-3">
                  <FileText className="h-6 w-6 text-highradius-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Invoice Management</h3>
                <p className="text-center text-gray-500">
                  Create, track, and manage invoices with ease. Monitor payment status and aging.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-highradius-50 p-3">
                  <Users className="h-6 w-6 text-highradius-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                <p className="text-center text-gray-500">
                  Assign roles and permissions to team members for better collaboration.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-highradius-50 p-3">
                  <DollarSign className="h-6 w-6 text-highradius-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Payment Tracking</h3>
                <p className="text-center text-gray-500">
                  Track payments and reconcile accounts with our powerful payment tracking system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-highradius-50 p-3">
                  <BarChart3 className="h-6 w-6 text-highradius-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Detailed Reports</h3>
                <p className="text-center text-gray-500">
                  Generate comprehensive reports for better financial decision-making.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-highradius-50 p-3">
                  <CreditCard className="h-6 w-6 text-highradius-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Aging Analysis</h3>
                <p className="text-center text-gray-500">
                  Analyze aging of receivables to prioritize collection efforts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900 md:text-4xl/tight">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for your business
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Starter</h3>
                  <p className="text-gray-500">For small businesses</p>
                  <div className="mt-4 text-4xl font-bold">
                    $49<span className="text-base font-normal text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {["Up to 100 invoices", "Basic reporting", "Email support", "1 user"].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-highradius-600 hover:bg-highradius-700">Get Started</Button>
              </div>
              <div className="flex flex-col rounded-lg border-2 border-highradius-600 bg-white p-6 shadow-md">
                <div className="mb-4">
                  <div className="inline-block rounded-full bg-highradius-100 px-3 py-1 text-xs font-medium text-highradius-700 mb-2">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Professional</h3>
                  <p className="text-gray-500">For growing companies</p>
                  <div className="mt-4 text-4xl font-bold">
                    $99<span className="text-base font-normal text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {[
                    "Up to 500 invoices",
                    "Advanced reporting",
                    "Priority email support",
                    "5 users",
                    "Custom fields",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-highradius-600 hover:bg-highradius-700">Get Started</Button>
              </div>
              <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                  <p className="text-gray-500">For large organizations</p>
                  <div className="mt-4 text-4xl font-bold">
                    $249<span className="text-base font-normal text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {[
                    "Unlimited invoices",
                    "Custom reporting",
                    "24/7 phone support",
                    "Unlimited users",
                    "API access",
                    "Custom integrations",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-highradius-600 hover:bg-highradius-700">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-white py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2025 AR Manager. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-gray-500 underline-offset-4 hover:text-highradius-600 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 underline-offset-4 hover:text-highradius-600 hover:underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
