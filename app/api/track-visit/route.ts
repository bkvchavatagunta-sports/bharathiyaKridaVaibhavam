import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { visitorId, pathname, userName, address } = body;

    if (!visitorId || typeof visitorId !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Skip tracking api routes or admin pages
    if (pathname && (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/admin"))) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Extract client IP address
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || "127.0.0.1";

    const userAgent = (req.headers.get("user-agent") || "").substring(0, 255);

    // Detect geo or location headers if provided by reverse proxy/CDN
    const city = req.headers.get("x-vercel-ip-city") || req.headers.get("cf-ipcity");
    const country = req.headers.get("x-vercel-ip-country-region") || req.headers.get("cf-ipcountry");
    const geoInfo = city && country ? `${city}, ${country}` : city || country || null;

    const resolvedAddress = address && address.trim().length > 0 
      ? address.trim() 
      : geoInfo 
        ? `${geoInfo} (${ip})` 
        : ip === "127.0.0.1" || ip === "::1"
          ? "Local Network"
          : ip;

    // Check for previous visit records for this visitorId
    const lastVisit = await prisma.visitReport.findFirst({
      where: { visitorId },
      orderBy: { currentVisit: "desc" },
    });

    const now = new Date();

    if (lastVisit) {
      const diffMs = now.getTime() - new Date(lastVisit.currentVisit).getTime();
      // If within 3 minutes on the same or adjacent page, update currentVisit rather than flooding records
      if (diffMs < 3 * 60 * 1000) {
        await prisma.visitReport.update({
          where: { id: lastVisit.id },
          data: {
            currentVisit: now,
            pageVisited: pathname || lastVisit.pageVisited,
            ...(userName && userName !== "Guest Visitor" && { userName }),
            ...(address && { address: resolvedAddress }),
          }
        });
        return NextResponse.json({ ok: true, updated: true });
      }

      // New visit session: previousVisit becomes the previous record's currentVisit
      await prisma.visitReport.create({
        data: {
          visitorId,
          userName: userName || lastVisit.userName || "Guest Visitor",
          address: resolvedAddress,
          ipAddress: ip,
          pageVisited: pathname || "/",
          currentVisit: now,
          previousVisit: lastVisit.currentVisit,
          visitDate: now,
          userAgent,
        }
      });
      return NextResponse.json({ ok: true, created: true, returning: true });
    }

    // First time visitor with this visitorId:
    // Check if there was an earlier visit from the same IP address
    const lastByIp = await prisma.visitReport.findFirst({
      where: { ipAddress: ip },
      orderBy: { currentVisit: "desc" },
    });

    await prisma.visitReport.create({
      data: {
        visitorId,
        userName: userName || (lastByIp && lastByIp.userName !== "Guest Visitor" ? lastByIp.userName : "Guest Visitor"),
        address: resolvedAddress,
        ipAddress: ip,
        pageVisited: pathname || "/",
        currentVisit: now,
        previousVisit: lastByIp ? lastByIp.currentVisit : null,
        visitDate: now,
        userAgent,
      }
    });

    return NextResponse.json({ ok: true, created: true });
  } catch (error) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
