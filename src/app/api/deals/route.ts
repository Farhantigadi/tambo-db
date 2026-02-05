import { NextRequest, NextResponse } from 'next/server';
import { db, deals, contacts } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allDeals = await db
      .select({
        id: deals.id,
        contactId: deals.contactId,
        title: deals.title,
        value: deals.value,
        stage: deals.stage,
        probability: deals.probability,
        expectedCloseDate: deals.expectedCloseDate,
        notes: deals.notes,
        createdAt: deals.createdAt,
        contactName: contacts.name,
        contactEmail: contacts.email,
        contactCompany: contacts.company,
      })
      .from(deals)
      .leftJoin(contacts, eq(deals.contactId, contacts.id));

    return NextResponse.json(allDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId, title, value, stage = 'prospecting', probability = 0, expectedCloseDate, notes } = body;

    if (!contactId || !title || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(deals).values({
      contactId,
      title,
      value,
      stage,
      probability,
      expectedCloseDate,
      notes,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}