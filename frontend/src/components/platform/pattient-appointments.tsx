"use client";

import { getPatientAppointments } from "@/actions/appointments"; // Replace with your real path
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Appointment } from "@/types/appointments"; // Adjust import based on your setup
import { format } from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  patientId: string;
};

export default function PatientAppointments({ patientId }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getPatientAppointments(patientId);
        // Ensure doctor.name and doctor.specilization are always strings
        const sanitizedData = data.map((appt) => ({
          ...appt,
          doctor: {
            ...appt.doctor,
            name: appt.doctor.name ?? "",
            specilization: appt.doctor.specilization ?? "",
          },
        }));
        setAppointments(sanitizedData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [patientId]);

  if (loading) {
    return (
      <p className="text-muted-foreground text-center mt-10">
        Loading appointments...
      </p>
    );
  }

  if (!appointments.length) {
    return <p className="text-center mt-10">No appointments found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-1">Your Appointments</h2>
      {appointments.map((appt) => {
        const isPast = new Date(appt.scheduledAt) < new Date();
        const dateStr = format(new Date(appt.scheduledAt), "PPPPp");

        return (
          <Card key={appt.id} className="border-muted rounded-2xl bg-muted">
            <CardHeader>
              <CardTitle className="text-base">
                Appointment with{" "}
                <span className="font-semibold">{appt.doctor.name}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {appt.doctor.specilization}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Scheduled for:{" "}
                <span className="text-foreground">{dateStr}</span>
              </div>
              {appt.notes && <div className="text-sm">Notes: {appt.notes}</div>}
              <Separator />
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    appt.status === "CONFIRMED"
                      ? "default"
                      : appt.status === "CANCELLED"
                      ? "destructive"
                      : appt.status === "COMPLETED"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {appt.status}
                </Badge>
                {isPast && appt.status === "PENDING" && (
                  <span className="text-xs text-red-500">Missed</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
