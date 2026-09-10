import { NextRequest, NextResponse } from 'next/server';
import { chatWithAIHealthAssistant } from '@/lib/gemini';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, language } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Valid message is required' }, { status: 400 });
    }

    // Optional context: fetch user abnormal findings or active medicines to ground the AI response
    let context = '';
    try {
      const reports = db.getReports();
      const recentReport = reports[0];
      if (recentReport) {
        const abnormal = recentReport.findings.map(f => `${f.test}: ${f.value} ${f.unit || ''} (${f.status})`).join(', ');
        context += `Recent Report (${recentReport.fileName}): ${abnormal}\n`;
      }
      const medicines = db.getMedicines();
      if (medicines.length > 0) {
        context += `Active Medicines: ${medicines.map(m => `${m.name} ${m.strength} (${m.frequency})`).join(', ')}`;
      }
    } catch {
      // Ignore context assembly errors
    }

    const result = await chatWithAIHealthAssistant({
      message,
      history,
      language: language || 'en',
      context,
    });

    return NextResponse.json({
      success: true,
      reply: result.reply,
      replyHi: result.replyHi,
      isLiveAI: result.isLiveAI,
      suggestedQuestions: result.suggestedQuestions || [],
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai-chat:', error);
    return NextResponse.json(
      { error: (error as Error)?.message || 'AI Assistant processing failed' },
      { status: 500 }
    );
  }
}
