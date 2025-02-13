import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const { searchParams } = new URL(request.url);

  const session = await getServerSession(request);
  
  const filename = session.user.name
 
  const blob = await put(filename, request.body, {
    access: 'public',
  });
 
  return NextResponse.json(blob);
}