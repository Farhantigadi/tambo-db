import { NextResponse } from 'next/server';
import { db, deals } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const stageStats = await db
      .select({
        stage: deals.stage,
        count: sql<number>`count(*)`,
        totalValue: sql<number>`sum(${deals.value})`
      })
      .from(deals)
      .groupBy(deals.stage);

    const stages = ['prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost'];
    const stageData = stages.map(stage => {
      const found = stageStats.find(s => s.stage === stage);
      return {
        stage,
        count: found?.count || 0,
        totalValue: found?.totalValue || 0
      };
    });

    // Calculate conversion rates
    const totalDeals = stageData.reduce((sum, stage) => sum + stage.count, 0);
    const conversions = [];
    
    for (let i = 0; i < stageData.length - 1; i++) {
      const current = stageData[i];
      const next = stageData[i + 1];
      const rate = current.count > 0 ? Math.round((next.count / current.count) * 100) : 0;
      
      conversions.push({
        from: current.stage,
        to: next.stage,
        rate: rate
      });
    }

    const theme = {
      globalBg: '#000000',
      starfield: true,
      starfieldImage: '/assets/space-stars.svg',
      // frontend: render starfield as a top-layer canvas/SVG with these suggestions
      starfieldZIndex: 9999,
      starfieldPointerEvents: 'none',
      starfieldBlendMode: 'screen', // optional hint: use CSS mix-blend-mode or canvas composite
      hero: {
        // removed any white fallback; keep layered gradients over transparent/black only
        background:
          'radial-gradient(circle at 20% 20%, rgba(110,100,255,0.18) 0%, rgba(76,29,149,0.08) 30%, transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.6))',
        accent: '#6b8cff',
        overlay: 'rgba(0,0,0,0.6)',
        zIndex: 10
      },
      cta: {
        background: 'transparent',
        accent: '#6b8cff',
        zIndex: 20
      }
    };

    return NextResponse.json({
      stages: stageData,
      conversions,
      totalDeals,
      totalValue: stageData.reduce((sum, stage) => sum + stage.totalValue, 0),
      theme
    });
  } catch (error) {
    console.error('Error fetching pipeline funnel:', error);
    return NextResponse.json({ error: 'Failed to fetch pipeline funnel' }, { status: 500 });
  }
}