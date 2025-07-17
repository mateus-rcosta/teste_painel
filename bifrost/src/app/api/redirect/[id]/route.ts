import { NextRequest, NextResponse } from 'next/server'
import { userAgent } from 'next/server'
import { prisma } from '@/lib/prisma';
import { appendToSheet } from '@/lib/googleSheets';
import { UTM } from '@/type/utm';
import { url } from '@/type/url';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const url = await prisma.url.findFirst({
    where: {
      id,
      deletedAt: null,
      estaAtivo: true,
    },
  }) as url;

  if (!url) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/404`)
  };

  const { isBot, browser, device, os, engine } = userAgent(req);
  const deviceInfo = {
    isBot,
    browserName: browser?.name,
    browserVersion: browser?.version,
    deviceType: device?.type,
    osName: os?.name,
    osVersion: os?.version,
    engineName: engine?.name,
    engineVersion: engine?.version,
  };

  const timezone = req.headers.get('x-timezone') || 'Unknown';
  await prisma.acesso.create({
    data: {
      urlId: url.id,
      device: deviceInfo,
      timezone,
    },
  });

  const utm: UTM = url.utms;

  const row = [
    utm?.source || 'null',
    utm?.medium || 'null',
    utm?.campaign || 'null',
    utm?.term || 'null',
    utm?.content || 'null',
    timezone,
    new Date().toISOString(),
    url.target,
    deviceInfo.isBot?.toString() || 'null',
    deviceInfo.browserName || 'null',
    deviceInfo.browserVersion || 'null',
    deviceInfo.deviceType || 'null',
    deviceInfo.osName || 'null',
    deviceInfo.osVersion || 'null',
    deviceInfo.engineName || 'null',
    deviceInfo.engineVersion || 'null',
  ]

  appendToSheet(row)

  // const utms = url.utms as Record<string, string>;
  // const searchParams = new URLSearchParams(utms).toString();
  // const finalTarget = searchParams ? `${url.target}?${searchParams}` : url.target;
  return NextResponse.json({ redirectUrl: url.target });
}
