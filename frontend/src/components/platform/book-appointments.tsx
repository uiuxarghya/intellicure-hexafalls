"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createAppointment } from "@/actions/appointments"; // adjust import
import { toast } from "sonner";
import { Doctor } from "@/types/doctors";
import { Textarea } from "../ui/textarea";

type Props = {
  patientId: string;
  doctors: Doctor[];
};

export default function BookAppointmentForm({ patientId, doctors }: Props) {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !date || !time) {
      toast.info("Missing info - All fields are required.");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours);
    scheduledAt.setMinutes(minutes);

    try {
      await createAppointment(patientId, selectedDoctor, scheduledAt, notes);
      toast.success("Appointment booked successfully!");
    } catch {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 w-full border rounded-2xl shadow-sm bg-muted"
    >
      <div>
        <Label htmlFor="doctor">Select Doctor</Label>
        <select
          id="doctor"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="w-full mt-1 border border-input rounded-md bg-background p-2"
        >
          <option value="">-- Choose a doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} ({doc.specilization || "General Practitioner"})
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="date">Select Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const maxDate = new Date();
                maxDate.setDate(today.getDate() + 30); // Only allow booking 7 days ahead

                return (
                  date < today || // Disable past dates
                  date > maxDate || // Disable too-far future dates
                  date.getDay() === 0 // Disable Sundays
                );
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="time">Select Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any specific concerns or questions?"
          className="mt-1"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Book Appointment
      </Button>
    </form>
  );
}
