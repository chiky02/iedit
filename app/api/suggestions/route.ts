import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

type HeadersList = Awaited<ReturnType<typeof headers>>;

function buildFingerprint(headersList: HeadersList) {
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '';
  const ua = headersList.get('user-agent') || '';
  return createHash('sha256').update(`${ip}|${ua}`).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : '';
    const remitente = typeof body.remitente === 'string' ? body.remitente.trim() : null;
    const email = typeof body.email === 'string' ? body.email.trim() : null;

    if (!mensaje || mensaje.length < 10) {
      return NextResponse.json({ error: 'El mensaje debe tener al menos 10 caracteres.' }, { status: 400 });
    }

    const fingerprint = buildFingerprint(await headers());
    const recent = await prisma.sugerencia.findFirst({
      where: {
        sourceHash: fingerprint,
        createdAt: {
          gt: new Date(Date.now() - 1000 * 60 * 2),
        },
      },
    });

    if (recent) {
      return NextResponse.json({ error: 'Espera unos minutos antes de enviar otra sugerencia.' }, { status: 429 });
    }

    await prisma.sugerencia.create({
      data: {
        mensaje,
        remitente: remitente || null,
        email: email || null,
        anonimidad: !remitente && !email,
        sourceHash: fingerprint,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en API de sugerencias:', error);
    return NextResponse.json({ error: 'Error interno al procesar la sugerencia.' }, { status: 500 });
  }
}
