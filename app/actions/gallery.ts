"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addGalleryImage(url: string, category: string = "General") {
  if (!url) return { success: false };

  await prisma.galleryImage.create({
    data: {
      imageUrl: url,
      year: new Date().getFullYear(),
      category
    }
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  
  return { success: true };
}
