"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addSponsor(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const designation = formData.get("designation") as string;
  const amount = parseFloat(formData.get("amount") as string) || 0;
  
  await prisma.sponsor.create({
    data: {
      name,
      location,
      designation,
      amount,
    }
  });

  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
  return { success: true };
}

export async function toggleSponsorVisibility(id: string, isVisible: boolean) {
  await prisma.sponsor.update({
    where: { id },
    data: { isVisible }
  });
  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}

export async function deleteSponsor(id: string) {
  await prisma.sponsor.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
}
