import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/collections.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const collections = JSON.parse(fileData);

    return NextResponse.json(collections);
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to fetch collections';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

