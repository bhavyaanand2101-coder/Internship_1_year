import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const contactsFilePath = path.join(process.cwd(), 'src/data/contacts.json');
    let contacts = [];
    if (fs.existsSync(contactsFilePath)) {
      try {
        const fileData = fs.readFileSync(contactsFilePath, 'utf8');
        contacts = JSON.parse(fileData);
      } catch (e) {
        console.error('Failed to parse contacts database, resetting...', e);
      }
    }

    const newContactInquiry = {
      id: Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phone: phone || '',
      message
    };

    contacts.push(newContactInquiry);
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully!',
      inquiryId: newContactInquiry.id
    });
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to submit contact request';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
export async function GET() {
  try {
    const contactsFilePath = path.join(process.cwd(), 'src/data/contacts.json');
    let contacts = [];
    if (fs.existsSync(contactsFilePath)) {
      const fileData = fs.readFileSync(contactsFilePath, 'utf8');
      contacts = JSON.parse(fileData);
    }
    return NextResponse.json(contacts);
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to fetch contacts';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
