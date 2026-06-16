import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  productIds: number[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  image: string;
  category: string;
  gender: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collectionId = parseInt(id, 10);

    const collectionsPath = path.join(process.cwd(), 'src/data/collections.json');
    const collectionsData = fs.readFileSync(collectionsPath, 'utf8');
    const collections = JSON.parse(collectionsData) as Collection[];

    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const productsPath = path.join(process.cwd(), 'src/data/products.json');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData) as Product[];

    const collectionProducts = products.filter((p) => collection.productIds.includes(p.id));

    return NextResponse.json({
      ...collection,
      products: collectionProducts
    });
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to fetch collection details';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

