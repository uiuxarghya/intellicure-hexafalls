import { getDoctors } from "@/actions/doctors";
import BookAppointmentForm from "@/components/platform/book-appointments";
import PatientAppointments from "@/components/platform/pattient-appointments";
import { getServerSession } from "@/lib/session";

export default async function BookPage() {
  const sessionData = await getServerSession();

  const user = sessionData?.user;
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-lg">You must be logged in to book an appointment.</p>
      </div>
    );
  }

  const doctors = await getDoctors();
  if (!doctors || doctors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-lg">No doctors available at the moment.</p>
      </div>
    );
  }
  return (
    <div className="max-w-full w-full mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
      <PatientAppointments patientId={user?.id} />
      <BookAppointmentForm doctors={doctors} patientId={user?.id} />
    </div>
  );
}
