import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shippingInfo, paymentInfo, cartItems, couponCode } = body;

    if (!shippingInfo || !paymentInfo || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Missing checkout information' }, { status: 400 });
    }

    // 1. Calculate price totals on server-side to prevent client price spoofing
    const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    
    let discount = 0;
    if (couponCode === 'SAVE10') {
      discount = subtotal * 0.1;
    }

    const tax = (subtotal - discount) * 0.1;
    const total = subtotal - discount + tax;

    // 2. Generate unique order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `${dateStr}-${randomSuffix}`;

    // 3. Save order to local JSON DB
    const ordersFilePath = path.join(process.cwd(), 'src/data/orders.json');
    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
      try {
        const fileData = fs.readFileSync(ordersFilePath, 'utf8');
        orders = JSON.parse(fileData);
      } catch (e) {
        console.error('Failed to parse orders database, resetting...', e);
      }
    }

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Processing',
      shippingInfo: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        apartment: shippingInfo.apartment,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        phone: shippingInfo.phone
      },
      items: cartItems.map((item: CartItem) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      totals: {
        subtotal,
        discount,
        tax,
        total
      },
      tracking: 'Pending'
    };

    orders.unshift(newOrder); // Newest orders first
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      orderId,
      order: newOrder
    });
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to process checkout';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
export async function GET() {
  try {
    const ordersFilePath = path.join(process.cwd(), 'src/data/orders.json');
    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
      const fileData = fs.readFileSync(ordersFilePath, 'utf8');
      orders = JSON.parse(fileData);
    }
    return NextResponse.json(orders);
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to fetch orders';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
