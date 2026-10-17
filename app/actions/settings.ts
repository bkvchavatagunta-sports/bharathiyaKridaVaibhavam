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
        upiId: "bkv@ybl",
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
  const upiId = (formData.get("upiId") as string)?.trim() || "bkv@ybl";

  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: { phone, email, latitude, longitude, address, upiId },
    create: {
      id: "global",
      phone,
      email,
      latitude,
      longitude,
      address,
      upiId,
    }
  });

  revalidatePath("/", "layout");
  revalidatePath("/events", "layout");
  return { success: true };
}
