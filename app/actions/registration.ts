"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function submitRegistration(data: any) {
  // Find or create user
  let user = await prisma.user.findUnique({ where: { phone: data.phone } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.name || data.captainName || "Team Captain",
        phone: data.phone,
        village: data.location,
      }
    });
  }

  // Generate Unique ID: BKV00 + MR + 0 + 1234
  const prefix = data.sportType ? data.sportType.substring(0, 2).toUpperCase() : "XX";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const registrationNo = `BKV00${prefix}0${randomNum}`;

  const reg = await prisma.registration.create({
    data: {
      registrationNo,
      eventId: data.eventId,
      userId: user.id,
      sportSubCategory: data.sportSubCategory || "",
      age: data.age || 0,
      gender: data.gender || "Not Specified",
      emergencyContact: data.phone, // using phone as fallback
      isTeamRegistration: data.isTeamRegistration,
      teamName: data.teamName,
      captainName: data.captainName,
      viceCaptainName: data.viceCaptainName,
      coachName: data.coachName,
      playerNames: data.playerNames || [],
      finalFee: data.finalFee,
      paymentStatus: data.paymentMode === 'UPI' ? "PENDING" : "FREE",
      paymentProofUrl: data.proofUrl,
    }
  });

  return { success: true, regId: reg.id };
}

export async function findRegistration(query: { regNo?: string; name?: string; phone?: string; dob?: string }) {
  if (query.regNo) {
    const reg = await prisma.registration.findUnique({
      where: { registrationNo: query.regNo },
      include: { event: true, user: true }
    });
    return reg;
  }
  
  // Search by name, phone, DOB (Age approximation or just match user)
  if (query.phone && query.name) {
    const user = await prisma.user.findFirst({
      where: {
        phone: query.phone,
        name: { contains: query.name, mode: "insensitive" }
      }
    });
    if (user) {
      const reg = await prisma.registration.findFirst({
        where: { userId: user.id },
        include: { event: true, user: true },
        orderBy: { registeredAt: 'desc' }
      });
      return reg;
    }
  }
  
  return null;
}
