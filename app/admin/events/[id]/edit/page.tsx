import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { EditEventForm } from "./EditEventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = await prisma.event.findUnique({ where: { id: resolvedParams.id } });
  
  if (!event) notFound();

  return <EditEventForm event={event} />;
}
