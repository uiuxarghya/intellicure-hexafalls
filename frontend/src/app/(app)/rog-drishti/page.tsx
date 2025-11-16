"use client";

import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  X,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const symptoms = [
  "itching",
  "skin rash",
  "nodal skin eruptions",
  "continuous sneezing",
  "shivering",
  "chills",
  "joint pain",
  "stomach pain",
  "acidity",
  "ulcers on tongue",
  "muscle wasting",
  "vomiting",
  "burning micturition",
  "spotting urination",
  "fatigue",
  "weight gain",
  "anxiety",
  "cold hands and feets",
  "mood swings",
  "weight loss",
  "restlessness",
  "lethargy",
  "patches in throat",
  "irregular sugar level",
  "cough",
  "high fever",
  "sunken eyes",
  "breathlessness",
  "sweating",
  "dehydration",
  "indigestion",
  "headache",
  "yellowish skin",
  "dark urine",
  "nausea",
  "loss of appetite",
  "pain behind the eyes",
  "back pain",
  "constipation",
  "abdominal pain",
  "diarrhoea",
  "mild fever",
  "yellow urine",
  "yellowing of eyes",
  "acute liver failure",
  "fluid overload",
  "swelling of stomach",
  "swelled lymph nodes",
  "malaise",
  "blurred and distorted vision",
  "phlegm",
  "throat irritation",
  "redness of eyes",
  "sinus pressure",
  "runny nose",
  "congestion",
  "chest pain",
  "weakness in limbs",
  "fast heart rate",
  "pain during bowel movements",
  "pain in anal region",
  "bloody stool",
  "irritation in anus",
  "neck pain",
  "dizziness",
  "cramps",
  "bruising",
  "obesity",
  "swollen legs",
  "swollen blood vessels",
  "puffy face and eyes",
  "enlarged thyroid",
  "brittle nails",
  "swollen extremeties",
  "excessive hunger",
  "extra marital contacts",
  "drying and tingling lips",
  "slurred speech",
  "knee pain",
  "hip joint pain",
  "muscle weakness",
  "stiff neck",
  "swelling joints",
  "movement stiffness",
  "spinning movements",
  "loss of balance",
  "unsteadiness",
  "weakness of one body side",
  "loss of smell",
  "bladder discomfort",
  "foul smell of urine",
  "continuous feel of urine",
  "passage of gases",
  "internal itching",
  "toxic look (typhos)",
  "depression",
  "irritability",
  "muscle pain",
  "altered sensorium",
  "red spots over body",
  "belly pain",
  "abnormal menstruation",
  "dischromic patches",
  "watering from eyes",
  "increased appetite",
  "polyuria",
  "family history",
  "mucoid sputum",
  "rusty sputum",
  "lack of concentration",
  "visual disturbances",
  "receiving blood transfusion",
  "receiving unsterile injections",
  "coma",
  "stomach bleeding",
  "distention of abdomen",
  "history of alcohol consumption",
  "blood in sputum",
  "prominent veins on calf",
  "palpitations",
  "painful walking",
  "pus filled pimples",
  "blackheads",
  "scurring",
  "skin peeling",
  "silver like dusting",
  "small dents in nails",
  "inflammatory nails",
  "blister",
  "red sore around nose",
  "yellow crust ooze",
];

interface Result {
  predicted_disease: string;
  confidence: number;
  description?: string;
}

export default function DiseasePredictorApp() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSymptomSelect = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/disease/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: selectedSymptoms }),
        }
      );

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setResult(data);
      setProgress(100);
    } catch {
      setError("Something went wrong while fetching the prediction.");
      clearInterval(progressInterval);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4 transition-colors">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Activity className="h-8 w-8 text-zinc-800 dark:text-zinc-200" />
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Disease Prediction through Symptoms
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            AI-powered disease prediction based on symptoms
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Activity className="h-5 w-5" />
              Symptom Analysis
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              Select the symptoms you&apos;re experiencing to get a disease
              prediction
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Symptom Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select Symptoms
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-[40px] p-3 bg-transparent dark:border-zinc-700"
                  >
                    <span className="text-left text-zinc-800 dark:text-zinc-200">
                      {selectedSymptoms.length === 0
                        ? "Search and select symptoms..."
                        : `${selectedSymptoms.length} sympt${
                            selectedSymptoms.length === 1 ? "" : "s"
                          } selected`}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-full p-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search symptoms..."
                      className="dark:placeholder-zinc-500"
                    />
                    <CommandList>
                      <CommandEmpty>No symptoms found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {symptoms.map((symptom) => (
                          <CommandItem
                            key={symptom}
                            value={symptom}
                            onSelect={() => handleSymptomSelect(symptom)}
                            className="dark:hover:bg-zinc-800"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSymptoms.includes(symptom)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {symptom}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Selected Symptoms ({selectedSymptoms.length})
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg min-h-[60px]">
                  {selectedSymptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                    >
                      {symptom}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeSymptom(symptom)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || selectedSymptoms.length === 0}
              className="w-full h-12 text-base"
            >
              {loading ? "Analyzing..." : "Analyze Symptoms"}
            </Button>

            {/* Progress Bar */}
            {loading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300">
                  <span>Analyzing symptoms...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert
                variant="destructive"
                className="dark:bg-red-900/20 dark:text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {result && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <CheckCircle2 className="h-5 w-5" />
                    Analysis Complete
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Predicted Disease:
                      </span>
                      <Badge
                        variant="outline"
                        className="text-base px-3 py-1 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300"
                      >
                        {result.predicted_disease}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Confidence:</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={result.confidence * 100}
                          className="w-20 h-2"
                        />
                        <span className="text-sm font-medium">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.description && (
                    <div className="pt-2 border-t border-green-200 dark:border-green-800">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {result.description}
                      </p>
                    </div>
                  )}

                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-800 dark:text-amber-300">
                      This is an AI prediction and should not replace
                      professional medical advice.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
