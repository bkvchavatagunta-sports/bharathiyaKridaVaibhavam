"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addHeroImage(imageUrl: string) {
  if (!imageUrl) return { error: "Image URL is required" };
  
  await prisma.heroImage.create({
    data: { imageUrl }
  });

  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}

export async function deleteHeroImage(id: string) {
  await prisma.heroImage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}
