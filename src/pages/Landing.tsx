import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  FileText,
  Globe,
  Shield,
  Clock,
  BarChart3,
  ArrowRight,
  Calendar,
  Users,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/vat-hero-image.jpg";

const features = [
  {
    name: "6-Stage Automated Workflow",
    description: "From data upload to final submission with full audit trail",
    icon: FileText,
  },
  {
    name: "Multi-Country Compliance",
    description: "Handle VAT obligations across all EU member states",
    icon: Globe,
  },
  {
    name: "Real-time Validation",
    description: "VIES integration and automated compliance checks",
    icon: Shield,
  },
  {
    name: "Smart Notifications",
    description: "Never miss a deadline with intelligent alerts",
    icon: Clock,
  },
  {
    name: "Advanced Analytics",
    description: "Comprehensive reporting and trend analysis",
    icon: BarChart3,
  },
  {
    name: "Team Collaboration",
    description: "Seamless workflow between clients and specialists",
    icon: Users,
  },
];

const benefits = [
  "70% reduction in processing time",
  "Zero missed deadlines",
  "Complete audit trail",
  "Real-time status tracking",
  "Multi-tenant security",
  "Expert VAT team support",
];

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Leyton VAT</h1>
                <p className="text-xs text-muted-foreground">Compliance Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">Sign In</Button>
              <Button onClick={onGetStarted} className="bg-gradient-primary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                <Zap className="h-3 w-3 mr-1" />
                EU VAT Automation Platform
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                Streamline Your VAT Compliance
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Automate VAT reporting across multiple EU countries with our comprehensive 
                platform. From data upload to final submission, we handle the entire compliance lifecycle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button onClick={onGetStarted} size="lg" className="bg-gradient-primary text-lg">
                  Access Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Demo
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-accent">45+</div>
                  <div className="text-sm text-muted-foreground">Countries Supported</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">10k+</div>
                  <div className="text-sm text-muted-foreground">Declarations Filed</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="VAT Compliance Dashboard"
                className="rounded-2xl shadow-large"
              />
              <div className="absolute inset-0 bg-gradient-primary/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need for VAT Compliance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform handles the complete VAT lifecycle, from initial data collection 
              to final submission and archival.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border shadow-soft">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Trusted by Leading Multinational Corporations
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform has helped hundreds of companies streamline their 
                VAT compliance processes across Europe.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Join hundreds of companies already using our platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={onGetStarted}
                    variant="secondary" 
                    size="lg" 
                    className="w-full mb-4"
                  >
                    Access Dashboard Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-xs text-primary-foreground/60 text-center">
                    No credit card required • Full access to demo environment
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 Leyton Portugal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}