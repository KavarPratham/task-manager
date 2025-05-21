import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client'; // Import status type if needed

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const url = new URL(req.url);
  const statusParam = url.searchParams.get('status');
  const importantParam = url.searchParams.get('important');

  const where: {  
    userId: string;
    status?: Status;
    important?: boolean;
  } = { userId };

  if (statusParam) {
    where.status = statusParam as Status; // cast to enum
  }
  if (importantParam !== null) {
    where.important = importantParam === 'true';
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { title, description, status, important }: {
    title: string;
    description?: string;
    status: Status;
    important: boolean;
  } = await req.json();

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      important,
      userId,
    },
  });

  return NextResponse.json(task, { status: 201 });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { id, title, description, status, important }: {
    id: string;
    title?: string;
    description?: string;
    status?: Status;
    important?: boolean;
  } = await req.json();

  const data: {
    title?: string;
    description?: string;
    status?: Status;
    important?: boolean;
  } = {};
  
  if (title !== undefined)       data.title = title;
  if (description !== undefined) data.description = description;
  if (status !== undefined)      data.status = status;
  if (important !== undefined)   data.important = important;

  const task = await prisma.task.updateMany({
    where: {
      id,
      userId,
    },
    data,
  });

  if (task.count === 0) {
    return new Response('Not Found or Unauthorized', { status: 404 });
  }

  return NextResponse.json({ id, ...data });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { id }: { id: string } = await req.json();

  await prisma.task.deleteMany({
    where: { id, userId },
  });

  return new Response(null, { status: 204 });
}
