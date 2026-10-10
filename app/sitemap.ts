import { MetadataRoute } from 'next';
import prisma from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bharathiyakridavaibhavam.onrender.com";

  // Fetch dynamic events
  const events = await prisma.event.findMany({
    select: { slug: true, createdAt: true }
  });

  const eventUrls = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.createdAt,
    changeFrequency: 'weekly' as any,
    priority: 0.8,
  }));

  const staticUrls = [
    '',
    '/events',
    '/sponsors',
    '/find-registration',
    '/gallery',
    '/hall-of-fame',
    // SEO Aliases
    '/chavatagunta',
    '/bulletYouth',
    '/vedurukuppam',
    '/tirupati'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as any,
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...eventUrls];
}
