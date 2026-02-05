import { db, deals, contacts } from '@/db';

export async function seedDeals() {
  try {
    // Get existing contacts
    const existingContacts = await db.select().from(contacts).limit(5);
    
    if (existingContacts.length === 0) {
      console.log('No contacts found. Please add contacts first.');
      return;
    }

    const sampleDeals = [
      {
        contactId: existingContacts[0]?.id || 1,
        title: 'Enterprise Software License',
        value: '50000.00',
        stage: 'negotiation' as const,
        probability: 75,
        expectedCloseDate: new Date('2024-02-15'),
        notes: 'Large enterprise deal, decision maker engaged'
      },
      {
        contactId: existingContacts[1]?.id || 2,
        title: 'Consulting Services Q1',
        value: '25000.00',
        stage: 'qualification' as const,
        probability: 50,
        expectedCloseDate: new Date('2024-01-30'),
        notes: 'Need to understand budget and timeline'
      },
      {
        contactId: existingContacts[2]?.id || 3,
        title: 'SaaS Subscription',
        value: '12000.00',
        stage: 'prospecting' as const,
        probability: 25,
        expectedCloseDate: new Date('2024-03-01'),
        notes: 'Initial interest shown, need follow-up'
      }
    ];

    await db.insert(deals).values(sampleDeals);
    console.log('Sample deals created successfully');
  } catch (error) {
    console.error('Error seeding deals:', error);
  }
}