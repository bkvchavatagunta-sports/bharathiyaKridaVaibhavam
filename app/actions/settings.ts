"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" }
  });

  if (!settings) {
    return await prisma.siteSettings.create({
      data: {
        id: "global",
        phone: "+91 75696 04988",
        email: "bkv.chavatagunta@gmail.com",
        latitude: "13.43995",
        longitude: "79.31484",
        address: "Chavatagunta, Vedurukuppam, Tirupati",
      }
    });
  }

  return settings;
}

export async function updateSettings(formData: FormData) {
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;
  const address = formData.get("address") as string;

  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: { phone, email, latitude, longitude, address },
    create: {
      id: "global",
      phone,
      email,
      latitude,
      longitude,
      address,
    }
  });

  revalidatePath("/", "layout");
  return { success: true };
}
