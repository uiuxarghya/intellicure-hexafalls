"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconBrain,
  IconDna2,
  IconLungs,
  IconPillFilled,
  IconStethoscope,
  IconHeartbeat,
} from "@tabler/icons-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeatureCards() {
  const aiFeatures = [
    {
      id: "meddoc",
      name: "Medical Document Simplifier",
      description:
        "Simplifying medical jargon into clear, patient-friendly language with AI, so you can understand your health without confusion.",
      icon: IconPillFilled,
      color:
        "from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      borderColor: "border-emerald-200 dark:border-emerald-700",
      textColor: "text-emerald-700 dark:text-emerald-300",
      action: "Simplify",
      status: "AI Ready",
      statusColor:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
      link: "/arthamed",
    },
    {
      id: "appointments",
      name: "Doctor Appointment Booking",
      description:
        "Seamlessly book doctor appointments with AI-powered scheduling—fast, flexible, and tailored to your healthcare needs.",
      icon: IconStethoscope,
      color: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-700",
      textColor: "text-blue-700 dark:text-blue-300",
      action: "Book Now",
      status: "Available",
      statusColor:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      link: "/appointments",
    },

    {
      id: "alzheimer",
      name: "Alzheimer's Disease Detection",
      description:
        "AI-powered cognitive assessment for early Alzheimer's detection, helping preserve memory and quality of life through neural analysis.",
      icon: IconBrain,
      color: "from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700",
      bgColor: "bg-pink-50 dark:bg-pink-900/30",
      borderColor: "border-pink-200 dark:border-pink-700",
      textColor: "text-pink-700 dark:text-pink-300",
      action: "Analyze",
      status: "Neural Net",
      statusColor:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
      link: "/smritiyan",
    },
    {
      id: "diseasepred",
      name: "Disease Prediction",
      description:
        "AI-driven symptom analysis for early disease prediction, helping detect health risks before they escalate with intelligent diagnostic insights.",
      icon: IconHeartbeat,
      color: "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
      bgColor: "bg-red-50 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-700",
      textColor: "text-red-700 dark:text-red-300",
      action: "Predict",
      status: "ML Active",
      statusColor:
        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
      link: "/rog-drishti",
    },
    {
      id: "pneumonia",
      name: "Pneumonia Classification",
      description:
        "AI-powered respiratory analysis for early pneumonia detection, using image processing to protect lung health before symptoms worsen.",
      icon: IconLungs,
      color:
        "from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/30",
      borderColor: "border-yellow-200 dark:border-yellow-700",
      textColor: "text-yellow-700 dark:text-yellow-300",
      action: "Scan",
      status: "Deep Learning",
      statusColor:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      link: "/shwaas-veda",
    },
    {
      id: "brain-tumor",
      name: "Brain Tumor Detection",
      description:
        "AI-powered brain scan analysis for precise tumor detection and classification, delivering life-saving insights in minutes.",
      icon: IconDna2,
      color:
        "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-700",
      textColor: "text-purple-700 dark:text-purple-300",
      action: "Classify",
      status: "AI Vision",
      statusColor:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
      link: "/neuro-setu",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8 space-y-8 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {aiFeatures.map((feature) => (
            <Card
              key={feature.id}
              className={`group relative overflow-hidden border-2 ${feature.borderColor} ${feature.bgColor} hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <CardContent className="px-6">
                <div className="flex justify-between items-start mb-6">
                  <Badge
                    className={`${feature.statusColor} font-medium px-3 py-1`}
                  >
                    {feature.status}
                  </Badge>
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3
                    className={`text-2xl font-bold ${feature.textColor} group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors`}
                  >
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-8">
                  <Link href={feature.link} passHref>
                    <Button
                      className={`w-full bg-gradient-to-r ${feature.color} hover:shadow-lg text-white font-semibold py-3 rounded-xl group-hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                      {feature.action}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent dark:from-white/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
