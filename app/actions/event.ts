"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
  const dedicationName = formData.get("dedicationName") as string;
  const description = formData.get("description") as string;
  const bannerImage = formData.get("bannerImage") as string;
  const venue = formData.get("venue") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const entryFee = parseFloat(formData.get("entryFee") as string) || 0;
  
  let subCategories: string[] = [];
  let ageGroups: string[] = [];
  let sportTypes: string[] = [];
  try {
    subCategories = JSON.parse(formData.get("subCategories") as string || "[]");
    ageGroups = JSON.parse(formData.get("ageGroups") as string || "[]");
    sportTypes = JSON.parse(formData.get("sportTypes") as string || "[]");
  } catch(e) {}
  
  await prisma.event.create({
    data: {
      title,
      slug,
      dedicationName,
      sportType: sportTypes,
      subCategories,
      ageGroups,
      description,
      bannerImage,
      venue,
      startDate,
      endDate,
      entryFee,
      status: "UPCOMING",
    }
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEventStatus(id: string, status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED") {
  await prisma.event.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}

export async function updateEvent(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const dedicationName = formData.get("dedicationName") as string;
  const description = formData.get("description") as string;
  const venue = formData.get("venue") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const entryFee = parseFloat(formData.get("entryFee") as string) || 0;
  
  let subCategories: string[] = [];
  let ageGroups: string[] = [];
  let sportTypes: string[] = [];
  try {
    const rawSub = formData.get("subCategories");
    const rawAge = formData.get("ageGroups");
    const rawSport = formData.get("sportTypes");
    if (rawSub) subCategories = JSON.parse(rawSub as string);
    if (rawAge) ageGroups = JSON.parse(rawAge as string);
    if (rawSport) sportTypes = JSON.parse(rawSport as string);
  } catch(e) {}

  await prisma.event.update({
    where: { id },
    data: {
      title,
      dedicationName,
      ...(sportTypes.length > 0 && { sportType: sportTypes }),
      ...(subCategories.length > 0 && { subCategories }),
      ...(ageGroups.length > 0 && { ageGroups }),
      description,
      venue,
      startDate,
      endDate,
      entryFee,
    }
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}
