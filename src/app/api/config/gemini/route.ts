import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey, generateWithFallbackModel } from '@/lib/gemini';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');
const ENV_FILE = path.join(process.cwd(), '.env.local');

function saveKeyToDisk(key: string) {
  // Save to config.json
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let config: Record<string, unknown> = {};
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch {
      config = {};
    }
  }
  config.geminiApiKey = key.trim();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');

  // Also sync to .env.local
  try {
    let envContent = '';
    if (fs.existsSync(ENV_FILE)) {
      envContent = fs.readFileSync(ENV_FILE, 'utf-8');
    }
    if (envContent.includes('GEMINI_API_KEY=')) {
      envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${key.trim()}`);
    } else {
      envContent += `\nGEMINI_API_KEY=${key.trim()}\n`;
    }
    fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
  } catch (err) {
    console.warn('Could not sync to .env.local:', err);
  }

  // Also set process.env
  process.env.GEMINI_API_KEY = key.trim();
}

export async function GET() {
  try {
    const key = getGeminiApiKey();
    if (!key) {
      return NextResponse.json({ success: true, hasKey: false, maskedKey: '' });
    }
    const masked = key.length > 8 ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : '****';
    return NextResponse.json({
      success: true,
      hasKey: true,
      maskedKey: masked,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to check Gemini configuration' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid Google Gemini API Key' },
        { status: 400 }
      );
    }

    const cleanKey = apiKey.trim();

    // Verify key by running a fast ping test with available Gemini models
    let verifiedModel = '';
    try {
      const genAI = new GoogleGenerativeAI(cleanKey);
      const { result, modelName } = await generateWithFallbackModel(genAI, 'Health ping: reply with "READY"');
      const text = result.response.text();
      if (!text) {
        throw new Error('No response from Gemini');
      }
      verifiedModel = modelName;
    } catch (testErr: unknown) {
      const errMsg = testErr instanceof Error ? testErr.message : String(testErr);
      return NextResponse.json(
        { error: `Gemini API key verification failed: ${errMsg}. Please check if the key is correct and has Gemini API enabled.` },
        { status: 400 }
      );
    }

    // Save key
    saveKeyToDisk(cleanKey);

    const masked = cleanKey.length > 8 ? `${cleanKey.substring(0, 6)}...${cleanKey.substring(cleanKey.length - 4)}` : '****';

    return NextResponse.json({
      success: true,
      message: `Google Gemini (${verifiedModel}) Connected successfully! Multimodal OCR and clinical chat are now fully active.`,
      hasKey: true,
      maskedKey: masked,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to update Gemini key' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    saveKeyToDisk('');
    return NextResponse.json({
      success: true,
      message: 'Gemini API Key removed',
      hasKey: false,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to delete Gemini key' },
      { status: 500 }
    );
  }
}
