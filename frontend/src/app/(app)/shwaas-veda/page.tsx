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
import { IconLungs } from "@tabler/icons-react";
import {
  AlertCircle,
  AlertTriangle,
  Brain,
  CheckCircle,
  FileImage,
  HeartPulse,
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
  prediction: string;
  confidence: number;
  gemini_analysis: string;
  error?: string;
}

export default function ShwaasVedaApp() {
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
    setIsLoadingResult(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/pneumonia/predict`,
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
          testType: "PNEUMONIA",
          fileUrl: res.url,
          fileName: file.name,
          prediction: data.prediction,
          confidence: data.confidence,
          fullReport: data.gemini_analysis,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Data successfully saved to the database.");
    } catch {
      setAnalysisResult({
        prediction: "",
        confidence: 0,
        gemini_analysis: "",
        error: "Failed to analyze image. Please try again.",
      });
      toast.error("Failed to analyze image. Please try again.");
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
        const newProgress = Math.min(prev.progress + Math.random() * 15, 100);

        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, progress: 100, status: "completed" }; // ✅ No fetch call here
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

  // const getResultCardClasses = (prediction: string) => {
  //   const isPositive = prediction.toLowerCase().includes("pneumonia");
  //   return {
  //     bg: isPositive
  //       ? "bg-red-50 dark:bg-red-900/20"
  //       : "bg-emerald-50 dark:bg-emerald-900/20",
  //     border: isPositive
  //       ? "border-red-200 dark:border-red-800"
  //       : "border-emerald-200 dark:border-emerald-800",
  //     text: isPositive
  //       ? "text-red-800 dark:text-red-300"
  //       : "text-emerald-800 dark:text-emerald-300",
  //     icon: isPositive
  //       ? "text-red-600 dark:text-red-400"
  //       : "text-emerald-600 dark:text-emerald-400",
  //   };
  // };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 w-full max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground dark:text-zinc-300 mb-4">
              <span className="text-yellow-600">Pneumonia Classification via Chest XRay</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 mt-8">
              Detects pneumonia from chest X-rays with high accuracy, aiding in
              quick and efficient diagnosis.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                {
                  icon: <IconLungs className="w-4 h-4 text-white" />, // Using Lungs icon instead of Brain
                  label: "Radiologist-Level Accuracy",
                  bgColor: "bg-blue-600 dark:bg-blue-700",
                  hoverColor: "hover:bg-blue-700 dark:hover:bg-blue-800",
                  borderColor: "border-blue-600 dark:border-blue-700",
                },
                {
                  icon: <HeartPulse className="w-4 h-4 text-white" />, // Using Pulse icon for respiratory monitoring
                  label: "Respiratory Health Analysis",
                  bgColor: "bg-emerald-600 dark:bg-emerald-700",
                  hoverColor: "hover:bg-emerald-700 dark:hover:bg-emerald-800",
                  borderColor: "border-emerald-600 dark:border-emerald-700",
                },
                {
                  icon: <AlertTriangle className="w-4 h-4 text-white" />, // Warning icon for pneumonia detection
                  label: "Early Pneumonia Detection",
                  bgColor: "bg-yellow-600 dark:bg-yellow-700",
                  hoverColor: "hover:bg-yellow-700 dark:hover:bg-yellow-800",
                  borderColor: "border-yellow-600 dark:border-yellow-700",
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
              <CardTitle className="text-xl text-zinc-800 dark:text-white">
                Chest X-Ray Image Upload
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
                        Drop your Chest X-Ray image here
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
                        Upload completed! Analyzing image...
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

          {uploadState.status === "completed" && (
            <Card className="shadow-md mt-6 border-0 bg-white dark:bg-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="dark:text-white">Analysis Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingResult ? (
                  <p className="text-zinc-600 dark:text-zinc-400 animate-pulse">
                    Analyzing image, please wait...
                  </p>
                ) : analysisResult?.error ? (
                  <p className="text-red-600 dark:text-red-400">
                    {analysisResult.error}
                  </p>
                ) : analysisResult ? (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg border ${
                        analysisResult.prediction
                          .toLowerCase()
                          .includes("pneumonia")
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold ${
                          analysisResult.prediction
                            .toLowerCase()
                            .includes("pneumonia")
                            ? "text-red-800 dark:text-red-300"
                            : "text-emerald-800 dark:text-emerald-300"
                        }`}
                      >
                        Diagnosis
                      </h3>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        <span className="font-medium">Prediction:</span>{" "}
                        {analysisResult.prediction}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Confidence:</span>{" "}
                        {(analysisResult.confidence * 100).toFixed(2)}%
                      </p>
                    </div>

                    <details className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                      <summary className="cursor-pointer text-zinc-800 dark:text-white font-semibold text-base">
                        View Full Medical Report
                      </summary>
                      <div className="whitespace-pre-wrap text-sm mt-4 text-zinc-700 dark:text-zinc-300">
                        <Markdown>{analysisResult.gemini_analysis}</Markdown>
                      </div>
                    </details>
                  </div>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No result available yet.
                  </p>
                )}
              </CardContent>
              {analysisResult?.prediction &&
                (analysisResult.prediction
                  .toLowerCase()
                  .includes("pneumonia") ? (
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
                ) : null)}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
