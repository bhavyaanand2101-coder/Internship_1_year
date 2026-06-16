import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Product {
  id: number;
  name: string;
  price: number;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    const filePath = path.join(process.cwd(), 'src/data/products.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileData) as Product[];

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to fetch product';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

