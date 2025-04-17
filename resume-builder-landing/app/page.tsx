import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Upload, FileText, Zap, Shield, Star, Clock, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/0 to-transparent"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/60 border-b border-slate-800/50 supports-[backdrop-filter]:bg-slate-900/20">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              ResumeAI
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="#try-now" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50">
                Log in
              </Button>
            </Link>
            <Link href="#try-now">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-900/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center opacity-10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center space-x-1 rounded-full bg-slate-800/60 px-3 py-1 text-sm backdrop-blur-md border border-slate-700/50">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-slate-300">AI-Powered Resume Builder</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                    Land Your Dream Job with AI-Tailored Resumes
                  </h1>
                  <p className="max-w-[600px] text-slate-400 md:text-xl">
                    Automatically customize your resume for each job application in seconds. Increase your interview
                    chances by 3x.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#try-now">
                    <Button
                      size="lg"
                      className="gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-900/20"
                    >
                      Try for Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/resume-builder">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    >
                      See How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>5 Free Resumes</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Star className="h-4 w-4 text-blue-400" />
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-slate-700/50 backdrop-blur-sm bg-slate-800/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    width={800}
                    height={600}
                    alt="AI Resume Builder in action"
                    className="object-cover mix-blend-luminosity opacity-80"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-sm font-medium text-slate-300">Resume match score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                          92%
                        </p>
                        <div className="h-1.5 w-24 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full w-[92%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center space-x-1 rounded-full bg-slate-800/60 px-3 py-1 text-sm backdrop-blur-md border border-slate-700/50">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-slate-300">Simple Process</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                  Tailor Your Resume in 3 Simple Steps
                </h2>
                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl/relaxed">
                  Our AI-powered platform makes customizing your resume for each job application quick and effortless.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 md:gap-12">
              {[
                {
                  icon: <Upload className="h-8 w-8" />,
                  title: "1. Upload Resume",
                  description: "Upload your existing resume or create a new one using our templates.",
                },
                {
                  icon: <FileText className="h-8 w-8" />,
                  title: "2. Paste Job Description",
                  description: "Copy and paste the job description you're applying for.",
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "3. Get Tailored Resume",
                  description: "Our AI instantly customizes your resume to match the job requirements.",
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20"></div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-900/20">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900 to-slate-950"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center space-x-1 rounded-full bg-slate-800/60 px-3 py-1 text-sm backdrop-blur-md border border-slate-700/50">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-slate-300">Key Features</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                  Why Job Seekers Love ResumeAI
                </h2>
                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl/relaxed">
                  Our AI-powered platform gives you the edge in today's competitive job market.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Keyword Optimization",
                  description: "Our AI identifies and incorporates relevant keywords from the job description.",
                },
                {
                  title: "Skills Matching",
                  description: "Automatically highlights your most relevant skills for each position.",
                },
                {
                  title: "ATS-Friendly Format",
                  description: "Ensures your resume passes through Applicant Tracking Systems.",
                },
                {
                  title: "Professional Templates",
                  description: "Choose from dozens of professionally designed resume templates.",
                },
                {
                  title: "Instant Download",
                  description: "Download your tailored resume in PDF, Word, or plain text formats.",
                },
                {
                  title: "Privacy First",
                  description: "Your data is encrypted and never shared with third parties.",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border border-slate-800/50 bg-slate-900/50 backdrop-blur-md shadow-xl shadow-purple-900/5 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center space-x-1 rounded-full bg-slate-800/60 px-3 py-1 text-sm backdrop-blur-md border border-slate-700/50">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-slate-300">Pricing</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                  Simple, Transparent Pricing
                </h2>
                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl/relaxed">
                  Start for free and upgrade when you're ready.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              <Tabs defaultValue="monthly" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-1">
                  <TabsTrigger
                    value="monthly"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    Yearly (Save 20%)
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-slate-800/50 bg-slate-900/50 backdrop-blur-md shadow-xl shadow-purple-900/5 overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-white">Free</CardTitle>
                        <div className="text-4xl font-bold text-white">$0</div>
                        <CardDescription className="text-slate-400">Perfect for trying out the service</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <ul className="space-y-2 text-sm">
                          {[
                            "5 AI-tailored resumes",
                            "Basic templates",
                            "Download as PDF",
                            "Keyword optimization",
                            "7-day access to edited resumes",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-slate-300">
                              <Check className="h-4 w-4 text-blue-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Get Started</Button>
                      </CardFooter>
                    </Card>
                    <Card className="border border-blue-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md shadow-xl shadow-purple-900/10 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                      <div className="absolute -top-24 -right-24 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-white">Premium</CardTitle>
                          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md">
                            Most Popular
                          </div>
                        </div>
                        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                          $4.99
                        </div>
                        <CardDescription className="text-slate-400">Per month, billed monthly</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 relative z-10">
                        <ul className="space-y-2 text-sm">
                          {[
                            "Unlimited AI-tailored resumes",
                            "Premium templates",
                            "Download in all formats",
                            "Advanced keyword optimization",
                            "Cover letter generation",
                            "Unlimited storage",
                            "Priority support",
                            "Resume performance analytics",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-slate-300">
                              <Check className="h-4 w-4 text-blue-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="relative z-10">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-900/20">
                          Subscribe Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="yearly" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-slate-800/50 bg-slate-900/50 backdrop-blur-md shadow-xl shadow-purple-900/5 overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-white">Free</CardTitle>
                        <div className="text-4xl font-bold text-white">$0</div>
                        <CardDescription className="text-slate-400">Perfect for trying out the service</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <ul className="space-y-2 text-sm">
                          {[
                            "5 AI-tailored resumes",
                            "Basic templates",
                            "Download as PDF",
                            "Keyword optimization",
                            "7-day access to edited resumes",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-slate-300">
                              <Check className="h-4 w-4 text-blue-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Get Started</Button>
                      </CardFooter>
                    </Card>
                    <Card className="border border-blue-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md shadow-xl shadow-purple-900/10 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                      <div className="absolute -top-24 -right-24 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-white">Premium</CardTitle>
                          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md">
                            Best Value
                          </div>
                        </div>
                        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                          $47.88
                        </div>
                        <CardDescription className="text-slate-400">$3.99/month, billed annually</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 relative z-10">
                        <ul className="space-y-2 text-sm">
                          {[
                            "Unlimited AI-tailored resumes",
                            "Premium templates",
                            "Download in all formats",
                            "Advanced keyword optimization",
                            "Cover letter generation",
                            "Unlimited storage",
                            "Priority support",
                            "Resume performance analytics",
                            "2 months free",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-slate-300">
                              <Check className="h-4 w-4 text-blue-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="relative z-10">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-900/20">
                          Subscribe Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section id="demo" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900 to-slate-950"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center space-x-1 rounded-full bg-slate-800/60 px-3 py-1 text-sm backdrop-blur-md border border-slate-700/50">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-slate-300">See It In Action</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                    Watch Your Resume Transform
                  </h2>
                  <p className="max-w-[600px] text-slate-400 md:text-xl/relaxed">
                    Our AI analyzes job descriptions and your existing resume to create the perfect match. See how your
                    resume transforms in real-time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#try-now">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-900/20"
                    >
                      Try It Yourself
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[550px] aspect-video rounded-xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-slate-700/50 backdrop-blur-sm bg-slate-800/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="Resume transformation demo"
                    className="object-cover mix-blend-luminosity opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-30"></div>
                      <div className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-lg shadow-purple-900/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center space-x-1 rounded-full bg-slate-800/60 px-3 py-1 text-sm backdrop-blur-md border border-slate-700/50">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-slate-300">Success Stories</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                  What Our Users Say
                </h2>
                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl/relaxed">
                  Join thousands of job seekers who have landed their dream jobs with ResumeAI.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Sarah J.",
                  role: "Marketing Manager",
                  content:
                    "After 3 months of job searching with no callbacks, I used ResumeAI and got 4 interviews in just 2 weeks. I'm now working at my dream company!",
                  rating: 5,
                },
                {
                  name: "Michael T.",
                  role: "Software Engineer",
                  content:
                    "The keyword optimization is incredible. My resume match score went from 65% to 92% for a senior developer role. I got the job and a 30% salary increase.",
                  rating: 5,
                },
                {
                  name: "Jessica L.",
                  role: "Financial Analyst",
                  content:
                    "I was skeptical at first, but the results speak for themselves. ResumeAI helped me tailor my resume perfectly for each application. Worth every penny!",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="text-left border border-slate-800/50 bg-slate-900/50 backdrop-blur-md shadow-xl shadow-purple-900/5 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-20"></div>
                        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                          <span className="text-xl font-bold">{testimonial.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-base text-white">{testimonial.name}</CardTitle>
                        <CardDescription className="text-slate-400">{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">{testimonial.content}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-blue-400 text-blue-400" />
                        ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="try-now" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="mx-auto max-w-[700px] text-slate-300 md:text-xl/relaxed">
                  Join thousands of successful job seekers who have transformed their job search with ResumeAI.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-white/20">
                  Get Started for Free
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  See Pricing
                </Button>
              </div>
              <p className="text-sm text-slate-400">No credit card required. Start with 5 free resumes.</p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center space-x-1 rounded-full bg-slate-800/60 px-3 py-1 text-sm backdrop-blur-md border border-slate-700/50">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-slate-300">FAQ</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
                    Frequently Asked Questions
                  </h2>
                  <p className="max-w-[600px] text-slate-400 md:text-xl/relaxed">
                    Find answers to common questions about ResumeAI.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      question: "How does ResumeAI work?",
                      answer:
                        "ResumeAI uses advanced natural language processing to analyze job descriptions and your existing resume. It then identifies key skills, experiences, and keywords to highlight, restructuring your resume to maximize relevance for each specific job application.",
                    },
                    {
                      question: "Is my data secure?",
                      answer:
                        "Yes, we take data security seriously. Your resume data is encrypted and never shared with third parties. We only use your information to provide the resume tailoring service.",
                    },
                    {
                      question: "Can I cancel my subscription anytime?",
                      answer:
                        "Absolutely. You can cancel your subscription at any time with no questions asked. You'll continue to have access until the end of your billing period.",
                    },
                    {
                      question: "How many resumes can I create?",
                      answer:
                        "Free users can create up to 5 tailored resumes. Premium subscribers enjoy unlimited resume creation and customization.",
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="space-y-2 p-4 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                      <p className="text-slate-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Card className="w-full max-w-md border border-slate-800/50 bg-slate-900/50 backdrop-blur-md shadow-xl shadow-purple-900/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
                  <CardHeader>
                    <CardTitle className="text-white">Still have questions?</CardTitle>
                    <CardDescription className="text-slate-400">
                      Our support team is here to help you with any questions you might have.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium leading-none text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium leading-none text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium leading-none text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          className="flex min-h-[100px] w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter your message"
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-900/20">
                      Send Message
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-slate-800 bg-slate-950">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-4 md:flex-row md:gap-6 md:px-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-1.5">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                ResumeAI
              </span>
            </div>
            <p className="text-center text-sm leading-loose text-slate-500 md:text-left">
              &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
