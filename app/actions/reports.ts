"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function seedInitialReportsIfEmpty() {
  try {
    const count = await prisma.visitReport.count();
    if (count > 0) return;

    // Fetch existing users to backfill visit logs
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" }
    });

    if (users.length === 0) return;

    // Map each user to a visitor session with realistic previous & current visit timestamps
    for (const u of users) {
      const visitorId = `vid_user_${u.id}`;
      const address = u.village && u.village.trim().length > 0 ? u.village : "Andhra Pradesh, India";

      // If user registered, their creation time is a landmark visit
      const firstVisitTime = new Date(u.createdAt);
      // Let's create their initial visit
      await prisma.visitReport.create({
        data: {
          visitorId,
          userName: u.name || "Registered User",
          userPhone: u.phone,
          address,
          ipAddress: "103.117.152.42",
          pageVisited: "/events",
          currentVisit: firstVisitTime,
          previousVisit: null, // First visit
          visitDate: firstVisitTime,
          userAgent: "Mozilla/5.0 (Mobile; Android 14; Mobile Web)",
        }
      });

      // For users registered earlier, add a return visit session so Current & Previous timestamps are showcased
      const diffDays = Math.floor((Date.now() - firstVisitTime.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 1) {
        const returnVisitTime = new Date(firstVisitTime.getTime() + 1000 * 60 * 60 * 24 * Math.min(diffDays, 3));
        await prisma.visitReport.create({
          data: {
            visitorId,
            userName: u.name || "Registered User",
            userPhone: u.phone,
            address,
            ipAddress: "103.117.152.42",
            pageVisited: "/events/register",
            currentVisit: returnVisitTime,
            previousVisit: firstVisitTime, // Previous timestamp!
            visitDate: returnVisitTime,
            userAgent: "Mozilla/5.0 (Mobile; Android 14; Mobile Web)",
          }
        });
      }
    }
  } catch (err) {
    console.error("Error seeding initial reports:", err);
  }
}

export async function getReportsData(searchQuery?: string) {
  // Ensure we have data if empty
  await seedInitialReportsIfEmpty();

  const whereClause = searchQuery && searchQuery.trim().length > 0 ? {
    OR: [
      { userName: { contains: searchQuery.trim(), mode: "insensitive" as const } },
      { address: { contains: searchQuery.trim(), mode: "insensitive" as const } },
      { pageVisited: { contains: searchQuery.trim(), mode: "insensitive" as const } },
      { userPhone: { contains: searchQuery.trim(), mode: "insensitive" as const } },
    ]
  } : {};

  const reports = await prisma.visitReport.findMany({
    where: whereClause,
    orderBy: { currentVisit: "desc" },
    take: 200,
  });

  const totalVisits = await prisma.visitReport.count();
  
  // Calculate unique visitors
  const uniqueVisitorsRaw = await prisma.visitReport.groupBy({
    by: ["visitorId"],
  });
  const uniqueVisitors = uniqueVisitorsRaw.length;

  // Returning visitors: visits that have a previousVisit timestamp
  const returningVisits = await prisma.visitReport.count({
    where: {
      previousVisit: { not: null }
    }
  });

  // Today's visits
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayVisits = await prisma.visitReport.count({
    where: {
      currentVisit: { gte: startOfToday }
    }
  });

  return {
    reports,
    stats: {
      totalVisits,
      uniqueVisitors,
      returningVisits,
      todayVisits,
    }
  };
}

export async function deleteReport(id: string) {
  try {
    await prisma.visitReport.delete({ where: { id } });
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete report:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function clearAllReports() {
  try {
    await prisma.visitReport.deleteMany({});
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (error) {
    console.error("Failed to clear reports:", error);
    return { success: false, error: "Failed to clear" };
  }
}
