"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Award,
  Brain,
  Calendar,
  ChevronRight,
  Heart,
  Menu,
  Pill,
  Scan,
  Shield,
  Stethoscope,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const translations = {
  nav: {
    home: "Home",
    features: "Features",
    mission: "Mission",
    contact: "Contact",
    login: "Login",
    getStarted: "Get Started",
  },
  hero: {
    title: "AI-Powered Healthcare",
    subtitle: "for Everyone",
    description:
      "Revolutionizing healthcare with advanced AI technology. Get instant health insights, disease predictions, and connect with healthcare professionals.",
    cta: "Start Your Health Journey",
    learnMore: "Learn More",
  },
  features: {
    title: "Cutting-Edge AI Healthcare Solutions",
    subtitle: "Advanced medical intelligence made accessible",
    items: [
      {
        title: "Disease Predictor",
        description:
          "Advanced AI algorithms analyze symptoms to predict potential health conditions with high accuracy.",
      },
      {
        title: "Alzheimer Detector",
        description:
          "Early detection of Alzheimer's disease using cognitive assessment and brain imaging analysis.",
      },
      {
        title: "Brain Tumor Detector",
        description:
          "State-of-the-art MRI analysis for early brain tumor detection and classification.",
      },
      {
        title: "Pneumonia Detector",
        description:
          "Chest X-ray analysis powered by AI to detect pneumonia with radiologist-level accuracy.",
      },
      {
        title: "Drug Side Effect Checker",
        description:
          "Comprehensive database analysis to predict and warn about potential drug interactions.",
      },
      {
        title: "Doctor Appointments",
        description:
          "Smart scheduling system that matches you with the right specialists based on your needs.",
      },
    ],
  },
  mission: {
    title: "Our Mission",
    subtitle: "Making healthcare accessible, intelligent, and patient-centered",
    description:
      "We believe everyone deserves access to advanced healthcare technology. Our AI-driven platform democratizes medical expertise, providing instant insights and connecting patients with the care they need.",
    stats: [
      { number: "1M+", label: "Patients Helped" },
      { number: "95%", label: "Accuracy Rate" },
      { number: "24/7", label: "Availability" },
      { number: "50+", label: "Countries" },
    ],
  },
  footer: {
    description:
      "Transforming healthcare through artificial intelligence and compassionate care.",
    links: {
      product: "Product",
      company: "Company",
      support: "Support",
    },
  },
};

export default function IntelliCureLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const t = translations;

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Target,
      title: t.features.items[0].title,
      description: t.features.items[0].description,
      color: "bg-blue-500",
    },
    {
      icon: Brain,
      title: t.features.items[1].title,
      description: t.features.items[1].description,
      color: "bg-purple-500",
    },
    {
      icon: Scan,
      title: t.features.items[2].title,
      description: t.features.items[2].description,
      color: "bg-red-500",
    },
    {
      icon: Activity,
      title: t.features.items[3].title,
      description: t.features.items[3].description,
      color: "bg-green-500",
    },
    {
      icon: Pill,
      title: t.features.items[4].title,
      description: t.features.items[4].description,
      color: "bg-orange-500",
    },
    {
      icon: Calendar,
      title: t.features.items[5].title,
      description: t.features.items[5].description,
      color: "bg-teal-500",
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2"
              onClick={() => scrollToSection("home")}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                IntelliCure
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.nav.features}
              </button>
              <button
                onClick={() => scrollToSection("mission")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.nav.mission}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.nav.contact}
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <ModeToggle />
              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/login")}
                >
                  {t.nav.login}
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  {t.nav.getStarted}
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.nav.home}
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.nav.features}
                </button>
                <button
                  onClick={() => scrollToSection("mission")}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.nav.mission}
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.nav.contact}
                </button>
                <div className="flex items-center space-x-2 pt-2">
                  <Button variant="ghost" size="sm">
                    {t.nav.login}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    {t.nav.getStarted}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10 dark:from-blue-600/5 dark:to-green-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
              {t.hero.title}
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {t.hero.subtitle}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 text-lg"
              >
                {t.hero.cta}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                {t.hero.learnMore}
              </Button>
            </div>
          </div>

          {/* Floating Health Icons */}
          <div className="absolute top-20 left-10 animate-bounce">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="absolute top-20 right-10 animate-bounce delay-1500">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="absolute bottom-20 right-24 animate-bounce delay-1000">
            <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center">
              <Pill className="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <div className="absolute bottom-20 left-20 animate-bounce delay-500">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        className="py-20 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.mission.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              {t.mission.subtitle}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t.mission.description}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {t.mission.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg bg-white dark:bg-gray-800">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your health data is protected with enterprise-grade security and
                privacy measures.
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg bg-white dark:bg-gray-800">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Patient-Centered
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Designed with patients in mind, making healthcare more
                accessible and understandable.
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg bg-white dark:bg-gray-800">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Clinically Validated
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI models are trained and validated by medical professionals
                and clinical data.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust IntelliCure for their health
            insights and medical care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Start Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">IntelliCure</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                {t.footer.description}
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">{t.footer.links.product}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t.footer.links.company}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 IntelliCure. All rights reserved. Transforming
              healthcare with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
