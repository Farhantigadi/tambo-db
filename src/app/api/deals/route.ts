import { NextRequest, NextResponse } from 'next/server';
import { db, deals, contacts } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const deal = await db
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
        .leftJoin(contacts, eq(deals.contactId, contacts.id))
        .where(eq(deals.id, parseInt(id)))
        .limit(1);

      if (deal.length === 0) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }

      return NextResponse.json(deal[0]);
    }

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, contactId, title, value, stage, probability, expectedCloseDate, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
    }

    await db.update(deals).set({
      contactId,
      title,
      value,
      stage,
      probability,
      expectedCloseDate,
      notes,
    }).where(eq(deals.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, stage, probability, notes, expectedCloseDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
    }

    const updateData: Record<string, string | number | Date | null | undefined> = {};
    if (stage !== undefined) updateData.stage = stage;
    if (probability !== undefined) updateData.probability = probability;
    if (notes !== undefined) updateData.notes = notes;
    if (expectedCloseDate !== undefined) updateData.expectedCloseDate = expectedCloseDate;

    await db.update(deals).set(updateData).where(eq(deals.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
    }

    await db.delete(deals).where(eq(deals.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}