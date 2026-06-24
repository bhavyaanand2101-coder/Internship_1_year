import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
  description: string;
}

/**
 * GET Handler.
 * Retrieves, filters, and sorts products from a local JSON database file.
 * Handles parameters: gender, category, color, size, price constraints, search keywords, and sorting criteria.
 */
export async function GET(request: Request) {
  try {
    // 1. Extract query parameters from request URL
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    // 2. Read products from local JSON database file
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    let products = JSON.parse(fileData) as Product[];

    // 3. Apply search filters dynamically
    
    // Gender Filter: Match search term or fallback to include 'unisex'
    if (gender && gender !== 'all') {
      products = products.filter((p) => 
        p.gender.toLowerCase() === gender.toLowerCase() || 
        p.gender.toLowerCase() === 'unisex'
      );
    }
    
    // Category Filter (e.g. Shirts, Pants)
    if (category && category !== 'all') {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Color Tag Filter
    if (color && color !== 'all') {
      products = products.filter((p) => 
        p.colors.some((c: string) => c.toLowerCase() === color.toLowerCase())
      );
    }
    
    // Size Tag Filter
    if (size && size !== 'all') {
      products = products.filter((p) => 
        p.sizes.some((s: string) => s.toLowerCase() === size.toLowerCase())
      );
    }
    
    // Price Boundary Filters
    if (priceMin) {
      products = products.filter((p) => p.price >= parseFloat(priceMin));
    }
    if (priceMax) {
      products = products.filter((p) => p.price <= parseFloat(priceMax));
    }
    
    // Substring Search Filter: lookups matching title or description strings
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p) => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // 4. Apply sorting algorithms
    if (sort === 'priceLowHigh') {
      products.sort((a, b) => a.price - b.price); // Ascending price order
    } else if (sort === 'priceHighLow') {
      products.sort((a, b) => b.price - a.price); // Descending price order
    } else if (sort === 'newest') {
      products.sort((a, b) => b.id - a.id); // Sort by newest IDs first
    }

    return NextResponse.json(products);
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to fetch products';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}


