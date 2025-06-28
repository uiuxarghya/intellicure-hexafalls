/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  Brain,
  CheckCircle,
  FileImage,
  ScanEye,
  Upload,
} from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";
import { useCallback, useState } from "react";

interface UploadState {
  file: File | null;
  progress: number;
  status: "idle" | "uploading" | "completed" | "error";
  error?: string;
}

interface AnalysisResult {
  predictedClass: string;
  confidences: Record<string, number>;
  insights: string;
  error?: string;
}

export default function NeuroSetuApp() {
  const { theme } = useTheme();
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    status: "idle",
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  // Theme-aware colors
  const containerBg =
    theme === "dark"
      ? "bg-gradient-to-br from-background to-background"
      : "bg-gradient-to-br from-zinc-50 to-zinc-100";

  const cardBg = theme === "dark" ? "bg-zinc-800" : "bg-zinc-200";
  const cardBorder = theme === "dark" ? "border-zinc-700" : "border-zinc-300";
  const primaryText = theme === "dark" ? "text-zinc-100" : "text-zinc-800";
  const secondaryText = theme === "dark" ? "text-zinc-300" : "text-zinc-600";
  const hoverBorder =
    theme === "dark" ? "hover:border-emerald-500" : "hover:border-emerald-300";
  const dragBg = theme === "dark" ? "bg-zinc-700" : "bg-zinc-50";
  const errorBorder = theme === "dark" ? "border-red-500" : "border-red-300";
  const errorBg = theme === "dark" ? "bg-red-900/30" : "bg-red-50";
  const successBorder =
    theme === "dark" ? "border-emerald-500" : "border-emerald-200";
  const successBg = theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-50";
  const resultBg = theme === "dark" ? "bg-zinc-700" : "bg-emerald-50";
  const resultBorder =
    theme === "dark" ? "border-emerald-600" : "border-emerald-200";

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadState({
        file: null,
        progress: 0,
        status: "error",
        error: "Please select a valid image file (JPEG, PNG, DICOM, etc.)",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadState({
        file: null,
        progress: 0,
        status: "error",
        error: "File size must be less than 50MB",
      });
      return;
    }

    setUploadState({
      file,
      progress: 0,
      status: "idle",
      error: undefined,
    });
    setAnalysisResult(null);
  }, []);

  const fetchAnalysisResult = useCallback(async (file: File) => {
    setIsLoadingResult(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tumor/classify`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setAnalysisResult({
        predictedClass: data.predictedClass,
        confidences: data.confidences,
        insights: data.insights,
      });
    } catch (err: unknown) {
      setAnalysisResult({
        predictedClass: "",
        confidences: {},
        insights: "",
        error: "Failed to analyze image. Please try again.",
      });
    } finally {
      setIsLoadingResult(false);
    }
  }, []);

  const simulateUpload = useCallback(() => {
    if (!uploadState.file) return;

    setUploadState((prev) => ({ ...prev, status: "uploading", progress: 0 }));
    setAnalysisResult(null);

    const interval = setInterval(() => {
      setUploadState((prev) => {
        const newProgress = prev.progress + Math.random() * 15;

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadState((prev) => ({
              ...prev,
              progress: 100,
              status: "completed",
            }));
            fetchAnalysisResult(uploadState.file!);
          }, 500);
          return { ...prev, progress: 100 };
        }

        return { ...prev, progress: newProgress };
      });
    }, 200);
  }, [uploadState.file, fetchAnalysisResult]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) handleFileSelect(files[0]);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const resetUpload = () => {
    setUploadState({
      file: null,
      progress: 0,
      status: "idle",
    });
    setAnalysisResult(null);
  };

  return (
    <div className={`min-h-screen ${containerBg}`}>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-4xl font-bold ${primaryText} mb-4`}>
              <span className="text-purple-600">Neuro Setu</span> – Automated
              Brain Tumor Recognition
            </h2>
            <p className={`text-lg ${secondaryText} leading-relaxed`}>
              Cutting-edge AI for automated brain tumor detection in MRI images.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              {
                icon: <Brain className="w-4 h-4 text-white" />,
                label: "Neurologist-Level Accuracy",
                bgColor: "bg-indigo-600 dark:bg-indigo-700",
                hoverColor: "hover:bg-indigo-700 dark:hover:bg-indigo-800",
                borderColor: "border-indigo-600 dark:border-indigo-700",
              },
              {
                icon: <Activity className="w-4 h-4 text-white" />,
                label: "Brain Activity Analysis",
                bgColor: "bg-purple-600 dark:bg-purple-700",
                hoverColor: "hover:bg-purple-700 dark:hover:bg-purple-800",
                borderColor: "border-purple-600 dark:border-purple-700",
              },
              {
                icon: <AlertOctagon className="w-4 h-4 text-white" />,
                label: "Tumor Detection",
                bgColor: "bg-rose-600 dark:bg-rose-700",
                hoverColor: "hover:bg-rose-700 dark:hover:bg-rose-800",
                borderColor: "border-rose-600 dark:border-rose-700",
              },
              {
                icon: <ScanEye className="w-4 h-4 text-white" />,
                label: "MRI Scan Analysis",
                bgColor: "bg-teal-600 dark:bg-teal-700",
                hoverColor: "hover:bg-teal-700 dark:hover:bg-teal-800",
                borderColor: "border-teal-600 dark:border-teal-700",
              },
            ].map(({ icon, label, bgColor, hoverColor, borderColor }, i) => (
              <div
                key={i}
                className={`flex items-center space-x-2 ${bgColor} ${hoverColor} ${borderColor} rounded-full px-4 py-2 shadow-sm border transition-colors duration-200 cursor-default`}
              >
                {icon}
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
            ))}
          </div>

          <Card className={`shadow-lg border-0 ${cardBg}`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-xl ${primaryText}`}>
                MRI Image Upload
              </CardTitle>
              <CardDescription className={secondaryText}>
                Supported formats: JPEG, PNG. Max size: 50MB
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                  ${
                    isDragOver
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                      : uploadState.status === "error"
                      ? `${errorBorder} ${errorBg}`
                      : `${cardBorder} ${dragBg} ${hoverBorder}`
                  }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadState.status === "uploading"}
                />

                <div className="space-y-4">
                  {uploadState.file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileImage className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-left">
                        <p className={`font-medium ${primaryText}`}>
                          {uploadState.file.name}
                        </p>
                        <p className={`text-sm ${secondaryText}`}>
                          {(uploadState.file.size / (1024 * 1024)).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-zinc-400 dark:text-zinc-500 mx-auto" />
                      <div>
                        <p
                          className={`text-lg font-medium ${primaryText} mb-2`}
                        >
                          Drop your MRI brain scan here
                        </p>
                        <p className={secondaryText}>
                          or click to browse files
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {uploadState.status === "error" && uploadState.error && (
                <Alert className={`${errorBorder} ${errorBg}`}>
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {uploadState.error}
                  </AlertDescription>
                </Alert>
              )}

              {uploadState.file && uploadState.status !== "error" && (
                <div className="space-y-4">
                  {uploadState.status === "uploading" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={secondaryText}>Uploading...</span>
                        <span className={secondaryText}>
                          {Math.round(uploadState.progress)}%
                        </span>
                      </div>
                      <Progress value={uploadState.progress} className="h-2" />
                    </div>
                  )}

                  {uploadState.status === "completed" && (
                    <Alert className={`${successBorder} ${successBg}`}>
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                        Upload completed! The AI is analyzing your image...
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3 pt-2">
                    {uploadState.status === "idle" && (
                      <Button
                        onClick={simulateUpload}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Start Analysis
                      </Button>
                    )}
                    {uploadState.status === "completed" && (
                      <Button
                        onClick={resetUpload}
                        variant="outline"
                        className="flex-1"
                      >
                        Upload Another Image
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {uploadState.status === "completed" && (
            <Card className={`shadow-md mt-6 border-0 ${cardBg}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${primaryText}`}>
                  <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingResult ? (
                  <p className={`${secondaryText} animate-pulse`}>
                    Analyzing image, please wait...
                  </p>
                ) : analysisResult?.error ? (
                  <p className="text-red-600 dark:text-red-400">
                    {analysisResult.error}
                  </p>
                ) : analysisResult ? (
                  <div className="space-y-4">
                    <div
                      className={`p-4 ${resultBg} border ${resultBorder} rounded-lg`}
                    >
                      <h3 className={`text-lg font-semibold ${primaryText}`}>
                        Diagnosis
                      </h3>
                      <p className={primaryText}>
                        <span className="font-medium">
                          Predicted Tumor Type:
                        </span>{" "}
                        {analysisResult.predictedClass}
                      </p>
                      <p className={secondaryText}>
                        <span className="font-medium">Confidence:</span>{" "}
                        {(
                          analysisResult.confidences?.[
                            analysisResult.predictedClass
                          ] * 100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>

                    <details
                      className={`${cardBg} border ${cardBorder} rounded-lg p-4`}
                    >
                      <summary
                        className={`cursor-pointer ${primaryText} font-semibold text-base`}
                      >
                        View Full Medical Report
                      </summary>
                      <pre
                        className={`whitespace-pre-wrap text-sm mt-4 ${secondaryText}`}
                      >
                        {analysisResult.insights}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <p className={secondaryText}>No result available yet.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
