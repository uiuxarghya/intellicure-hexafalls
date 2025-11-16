"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Upload, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { AnalysisProgress } from "@/components/arthamed/analysis-progress";
import { FileUpload } from "@/components/arthamed/file-upload";
import { UploadedFiles } from "@/components/arthamed/uploaded-files";
import { analyzeMedicalImage } from "@/lib/gemini";
import Markdown from "react-markdown";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    keyFindings: string[];
  }>({ summary: "", keyFindings: [] });
  const [redirectRoute, setRedirectRoute] = useState<string | null>(null);

  const resetAnalysis = () => {
    uploadedFiles.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setUploadedFiles([]);
    setAnalysisProgress(0);
    setAnalysisStage("");
    setAnalysisComplete(false);
    setAnalysisResult({ summary: "", keyFindings: [] });
    setRedirectRoute(null);
  };

  const handleFileUpload = useCallback(async (files: File[]) => {
    setIsUploading(true);
    try {
      const newFiles: UploadedFile[] = await Promise.all(
        files.map(async (file) => {
          const preview = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined;

          return {
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            type: file.type,
            preview,
          };
        })
      );
      setUploadedFiles(newFiles);
      toast.success("Files uploaded", {
        description: `${files.length} file(s) ready for analysis.`,
      });
    } catch {
      toast.error("Upload failed", { description: "Please try again." });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  const handleStartAnalysis = async () => {
    if (!uploadedFiles.length) {
      toast.error("No files to analyze", {
        description: "Please upload at least one file.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisProgress(0);
    setAnalysisStage("");
    setRedirectRoute(null);

    const toastId = toast.loading("Starting analysis...");
    const file = uploadedFiles[0];

    try {
      setAnalysisStage("Reading file...");
      setAnalysisProgress(20);

      const fileBlob = await fetch(file.preview!).then((r) => r.blob());
      const buffer = await fileBlob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      setAnalysisStage("Processing...");
      setAnalysisProgress(50);

      const response = await analyzeMedicalImage(base64, file.type);

      if (!response) {
        throw new Error("No response from analysis API.");
      }
      const summary =
        response.match(/## Summary\n([\s\S]*?)## Condition/)?.[1]?.trim() ?? "";
      const condition =
        response.match(/## Condition\n(.+?)\n/)?.[1]?.trim() ?? "Unknown";
      const confidence =
        response.match(/## Confidence\n(.+?)\n/)?.[1]?.trim() ?? "Unknown";
      const reason =
        response.match(/## Reason\n([\s\S]*?)## Next Steps/)?.[1]?.trim() ?? "";
      const nextSteps =
        response.match(/## Next Steps\n([\s\S]*?)## Redirect/)?.[1]?.trim() ??
        "";
      // const redirect = response.match(/## Redirect\n(.+?)\n?/)?.[1]?.trim() ?? "None";

      let redirect: string;
      if (condition.includes("None")) {
        redirect = "/appointments";
      } else if (condition.includes("Alzheimer's")) {
        redirect = "/smritiyaan";
      } else if (condition.includes("Brain Tumor")) {
        redirect = "/neuro-setu";
      } else if (condition.includes("Pneumonia")) {
        redirect = "/shwaas-veda";
      } else {
        redirect = "None";
      }

      const summaryText = `🧾 Summary:\n${summary}\n\n🧠 Condition: ${condition} (${confidence})\n📋 Reason: ${reason}\n🩺 Next Steps: ${nextSteps}`;

      const steps = [
        { stage: "Parsing results...", progress: 75 },
        { stage: "Summarizing findings...", progress: 90 },
        { stage: "Finalizing output...", progress: 100 },
      ];

      for (const step of steps) {
        setAnalysisStage(step.stage);
        setAnalysisProgress(step.progress);
        await new Promise((res) => setTimeout(res, 600));
      }

      setAnalysisResult({ summary: summaryText, keyFindings: [] });

      try {
        await fetch("/api/textreport", {
          method: "POST",
          body: JSON.stringify({
            inputType: "PRESCRIPTION",
            prediction: condition,
            confidence: parseFloat(confidence),
            fullReport: response,
            fileName: file.name,
            fileUrl: file.preview,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Report saved");
      } catch (err) {
        if (err instanceof Error) {
          toast.error(`Failed to save report: ${err.message}`);
        }
      }

      setAnalysisComplete(true);
      setRedirectRoute(redirect !== "None" ? redirect : null);

      toast.success("Analysis completed", {
        id: toastId,
        description: "Condition detected and next steps suggested.",
      });
    } catch (err) {
      toast.error("API failed", {
        id: toastId,
        description: "Please try again later.",
      });
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-background dark:via-background dark:to-background">
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-12 w-full max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground dark:text-zinc-300 mb-4">
            <span className="text-emerald-600">Medical Document Simplifier</span>
          </h2>
          <p className="text-lg text-muted-foreground my-4">
            Decode your medical paperwork with AI: Upload prescriptions, test
            results, or clinical notes and get explanations in language you can
            actually understand.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-2">
            {[
              {
                icon: <Shield className="w-4 h-4 text-white" />,
                label: "Medical Jargon Simplifier",
                bgColor: "bg-green-600 dark:bg-green-700",
                hoverColor: "hover:bg-green-700 dark:hover:bg-green-800",
                borderColor: "border-green-600 dark:border-green-700",
              },
              {
                icon: <Zap className="w-4 h-4 text-white" />,
                label: "Instant Analysis",
                bgColor: "bg-blue-600 dark:bg-blue-700",
                hoverColor: "hover:bg-blue-700 dark:hover:bg-blue-800",
                borderColor: "border-blue-600 dark:border-blue-700",
              },
              {
                icon: <Users className="w-4 h-4 text-white" />,
                label: "Patient-Friendly",
                bgColor: "bg-purple-600 dark:bg-purple-700",
                hoverColor: "hover:bg-purple-700 dark:hover:bg-purple-800",
                borderColor: "border-purple-600 dark:border-purple-700",
              },
            ].map(({ icon, label, bgColor, hoverColor, borderColor }, i) => (
              <div
                key={i}
                className={`flex items-center space-x-2 ${bgColor} ${hoverColor} ${borderColor} rounded-full px-4 py-2 shadow-sm border transition-colors duration-200`}
              >
                {icon}
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-3xl">
          <Card className="shadow-lg border-0 bg-background">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Upload Medical Documents</span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground dark:text-zinc-400">
                Drag and drop files or browse. Accepted formats: PDF, JPG, PNG.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedFiles.length === 0 ? (
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isUploading={isUploading}
                  acceptedTypes={{
                    "application/pdf": [".pdf"],
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                  }}
                />
              ) : (
                <div className="mt-6">
                  <UploadedFiles
                    files={uploadedFiles}
                    onRemoveFile={handleRemoveFile}
                  />
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={handleStartAnalysis}
                      size="lg"
                      disabled={isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-8"
                    >
                      {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                      <Zap className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {isAnalyzing && (
          <div className="mt-8 w-full max-w-3xl">
            <AnalysisProgress
              progress={analysisProgress}
              stage={analysisStage}
              fileCount={uploadedFiles.length}
            />
          </div>
        )}

        {analysisComplete && (
          <div className="mt-8 bg-white/80 dark:bg-background shadow-lg rounded-xl p-6 w-full max-w-5xl space-y-4 border dark:border-zinc-800">
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
              Analysis Results
            </h3>
            <div className="text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              <Markdown>{analysisResult.summary}</Markdown>
            </div>

            {redirectRoute && (
              <Button
                onClick={() => router.push(redirectRoute)}
                className="mt-4 mr-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue to{" "}
                {redirectRoute
                  .replace("/", "")
                  .replace("-", " ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </Button>
            )}

            <Button
              onClick={resetAnalysis}
              variant="outline"
              className="mt-6 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
            >
              Analyze New Documents
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
