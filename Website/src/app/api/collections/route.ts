import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET Handler.
 * Retrieves mock collection directory structures by parsing a local JSON database file.
 * Returns collection arrays as standard HTTP JSON responses.
 */
export async function GET() {
  try {
    // 1. Locate absolute path to the local collection metadata database file
    const filePath = path.join(process.cwd(), 'src/data/collections.json');
    
    // 2. Read file content synchronously in UTF-8 format
    const fileData = fs.readFileSync(filePath, 'utf8');
    
    // 3. Deserialize file contents to JSON objects
    const collections = JSON.parse(fileData);

    // 4. Dispatch deserialized objects inside HTTP response body
    return NextResponse.json(collections);
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to fetch collections';
    // Return standard HTTP 500 server exception payloads upon read failures
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}


