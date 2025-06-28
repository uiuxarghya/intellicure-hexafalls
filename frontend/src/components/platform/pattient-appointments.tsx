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
        setAppointments(data);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((appt) => {
        const isPast = new Date(appt.scheduledAt) < new Date();
        const dateStr = format(new Date(appt.scheduledAt), "PPPPp");

        return (
          <Card key={appt.id} className="border-muted rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">
                Appointment with{" "}
                <span className="font-semibold">{appt.doctor.name}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {appt.doctor.email}
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
