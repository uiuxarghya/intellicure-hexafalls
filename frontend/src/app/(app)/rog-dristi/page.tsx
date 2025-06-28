"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Result = {
  predicted_disease: string;
  description: string;
  precautions: string[];
  medications: string[];
  diet: string[];
  workouts: string[];
};

export default function Page() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const symptomsArray = symptoms
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (symptomsArray.length === 0) {
      setError("Please enter at least one symptom.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/disease/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: symptomsArray }),
        }
      );

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong while fetching the prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-full w-full mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Rog Dristi</h1>
      <p className="text-gray-700 mb-4">
        Enter your symptoms below to get a disease prediction.
      </p>
      <Card>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter symptoms separated by commas (e.g., fever, cough, rashes)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="resize-none h-24"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Predict
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {result.predicted_disease}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{result.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precautions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {result.precautions.slice(1).map((precaution, i) => (
                  <li key={i}>{precaution}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.medications.map((med, i) => (
                <Badge key={i} variant="outline">
                  {med}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diet Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {result.diet.slice(1).map((diet, i) => (
                  <li key={i}>{diet}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wellness & Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {result.workouts.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
