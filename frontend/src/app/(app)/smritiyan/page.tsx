"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertCircle,
  BarChart2,
  Brain,
  CheckCircle,
  FileImage,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";

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

export default function SmritiyanApp() {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    status: "idle",
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    });
    setAnalysisResult(null);
  }, []);

  const fetchAnalysisResult = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/alzheimers/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setAnalysisResult(data);

      await fetch("/api/testresult", {
        method: "POST",
        body: JSON.stringify({
          testType: "ALZHEIMERS",
          fileUrl: "",
          fileName: "",
          prediction: data.predictedClass,
          confidence: data.confidences[data.predictedClass],
          fullReport: data.insights,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Data successfully saved to the database.");
    } catch {
      setAnalysisResult({
        predictedClass: "",
        confidences: {},
        insights: "",
        error: "Failed to analyze image. Please try again.",
      });
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const simulateUpload = useCallback(() => {
    if (!uploadState.file) return;

    setUploadState((prev) => ({ ...prev, status: "uploading", progress: 0 }));
    setAnalysisResult(null);

    const interval = setInterval(() => {
      setUploadState((prev) => {
        const newProgress = Math.min(prev.progress + Math.random() * 15, 100);

        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            progress: 100,
            status: "completed", // ✅ no fetchAnalysisResult here
          };
        }

        return { ...prev, progress: newProgress };
      });
    }, 200);
  }, [uploadState.file]);

  useEffect(() => {
    if (uploadState.status === "completed" && uploadState.file) {
      fetchAnalysisResult(uploadState.file);
    }
  }, [uploadState.status, uploadState.file, fetchAnalysisResult]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) handleFileSelect(files[0]);
    },
    [handleFileSelect]
  );

  const resetUpload = () => {
    setUploadState({ file: null, progress: 0, status: "idle" });
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const getUploadAreaClasses = () => {
    const baseClasses =
      "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200";

    if (isDragOver)
      return `${baseClasses} border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20`;
    if (uploadState.status === "error")
      return `${baseClasses} border-red-300 bg-red-50 dark:bg-red-900/20`;
    return `${baseClasses} border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 hover:border-emerald-300 dark:hover:border-emerald-500`;
  };

  const getStageColorClasses = (stage: string) => {
    switch (stage) {
      case "Non Demented":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-800 dark:text-green-300",
          icon: "text-green-600 dark:text-green-400",
          cardBg: "bg-green-100 dark:bg-green-900/30",
          cardBorder: "border-green-300 dark:border-green-700",
        };
      case "Very Mild Dementia":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-800 dark:text-yellow-300",
          icon: "text-yellow-600 dark:text-yellow-400",
          cardBg: "bg-yellow-100 dark:bg-yellow-900/30",
          cardBorder: "border-yellow-300 dark:border-yellow-700",
        };
      case "Mild Dementia":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-800",
          text: "text-orange-800 dark:text-orange-300",
          icon: "text-orange-600 dark:text-orange-400",
          cardBg: "bg-orange-100 dark:bg-orange-900/30",
          cardBorder: "border-orange-300 dark:border-orange-700",
        };
      default:
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-300",
          icon: "text-red-600 dark:text-red-400",
          cardBg: "bg-red-100 dark:bg-red-900/30",
          cardBorder: "border-red-300 dark:border-red-700",
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 w-full max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground dark:text-zinc-300 mb-4">
              <span className="text-pink-600">Alzheimer&apos;s Detection via MRI Grading</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 mt-8">
              Streamline dementia diagnosis: Upload brain scans for instant,
              AI-powered Alzheimer&apos;s staging with clinical-grade accuracy.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                {
                  icon: <Brain className="w-4 h-4 text-white" />,
                  label: "Clinical-Grade Accuracy",
                  bgColor: "bg-indigo-600 dark:bg-indigo-700",
                  hoverColor: "hover:bg-indigo-700 dark:hover:bg-indigo-800",
                  borderColor: "border-indigo-600 dark:border-indigo-700",
                },
                {
                  icon: <Activity className="w-4 h-4 text-white" />,
                  label: "Dementia Stage Detection",
                  bgColor: "bg-teal-600 dark:bg-teal-700",
                  hoverColor: "hover:bg-teal-700 dark:hover:bg-teal-800",
                  borderColor: "border-teal-600 dark:border-teal-700",
                },
                {
                  icon: <BarChart2 className="w-4 h-4 text-white" />,
                  label: "Cognitive Decline Tracking",
                  bgColor: "bg-rose-600 dark:bg-rose-700",
                  hoverColor: "hover:bg-rose-700 dark:hover:bg-rose-800",
                  borderColor: "border-rose-600 dark:border-rose-700",
                },
              ].map(({ icon, label, bgColor, hoverColor, borderColor }, i) => (
                <div
                  key={i}
                  className={`flex items-center space-x-2 ${bgColor} ${hoverColor} ${borderColor} rounded-full px-4 py-2 shadow-sm border transition-colors duration-200 cursor-default`}
                >
                  {icon}
                  <span className="text-sm font-medium text-white">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-md border-0 bg-card dark:bg-card/80 max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-foreground">
                MRI Image Upload
              </CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Supported formats: JPEG, PNG | Max size: 10MB
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={getUploadAreaClasses()}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileSelect(e.target.files[0])
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadState.status === "uploading"}
                />

                {uploadState.file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileImage className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {uploadState.file.name}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-zinc-400 dark:text-zinc-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Drop your MRI image here
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        or click to browse files
                      </p>
                    </div>
                  </>
                )}
              </div>

              {uploadState.status === "error" && uploadState.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadState.error}</AlertDescription>
                </Alert>
              )}

              {uploadState.file && uploadState.status !== "error" && (
                <div className="space-y-4">
                  {uploadState.status === "uploading" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadState.progress)}%</span>
                      </div>
                      <Progress value={uploadState.progress} />
                    </div>
                  )}

                  {uploadState.status === "completed" && (
                    <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                        {isAnalyzing
                          ? "Analyzing image..."
                          : "Upload completed!"}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3 pt-2">
                    {uploadState.status === "idle" && (
                      <Button onClick={simulateUpload} className="flex-1">
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

          {isAnalyzing && (
            <Card className="shadow-md mt-6 border-0 bg-card dark:bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <span>Analyzing Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 dark:bg-emerald-400 h-full animate-pulse"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Processing MRI scan for Alzheimer&apos;s biomarkers...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResult && !isAnalyzing && (
            <Card className="shadow-md mt-6 border-0 bg-card dark:bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain
                    className={`w-5 h-5 ${
                      getStageColorClasses(analysisResult.predictedClass).icon
                    }`}
                  />
                  <span>Analysis Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult.error ? (
                  <p className="text-red-600 dark:text-red-400">
                    {analysisResult.error}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg border ${
                        getStageColorClasses(analysisResult.predictedClass)
                          .cardBg
                      } ${
                        getStageColorClasses(analysisResult.predictedClass)
                          .cardBorder
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold ${
                          getStageColorClasses(analysisResult.predictedClass)
                            .text
                        }`}
                      >
                        Diagnosis
                      </h3>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        <span className="font-medium">Stage:</span>{" "}
                        {analysisResult.predictedClass}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Confidence:</span>{" "}
                        {(
                          analysisResult.confidences[
                            analysisResult.predictedClass
                          ] * 100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>

                    <details className="bg-background border rounded-lg p-4">
                      <summary className="cursor-pointer font-semibold">
                        View Full Medical Report
                      </summary>
                      <div className="whitespace-pre-wrap text-sm mt-4 text-zinc-700 dark:text-zinc-300">
                        <Markdown>{analysisResult.insights}</Markdown>
                      </div>
                    </details>
                  </div>
                )}
              </CardContent>
              {analysisResult &&
                [
                  "Mild Dementia",
                  "Moderate Dementia",
                  "Very Mild Dementia",
                ].includes(analysisResult.predictedClass) && (
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      onClick={() => {
                        window.location.href = "/appointments";
                      }}
                      className="w-full"
                    >
                      Book Appointment
                    </Button>
                  </CardFooter>
                )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
