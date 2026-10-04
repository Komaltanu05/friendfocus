import type { Handler, HandlerEvent } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

// Gemma 4 26B A4B IT Model ID strictly as requested
const GEMMA_MODEL_ID = 'gemma-4-26b-a4b-it';

export interface TimelineItem {
  id: string;
  type: 'study' | 'break' | 'revision';
  title: string;
  timeRange: string;
  durationMinutes: number;
  taskDescription: string;
  tip?: string;
}

export interface StudyPlanResponse {
  modelUsed: string;
  situationSummary: string;
  studentDiagnosis: string;
  totalDurationMinutes: number;
  timeline: TimelineItem[];
  motivationalMessage: string;
  antiProcrastinationTip: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
    };
  }

  try {
    let body: any = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Invalid JSON request body.' }),
        };
      }
    }

    const { situation } = body;
    if (!situation || typeof situation !== 'string' || !situation.trim()) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Please enter your study situation.' }),
      };
    }

    const trimmedSituation = situation.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error:
            'Server configuration error: GEMINI_API_KEY is not set. Please configure GEMINI_API_KEY in your Netlify site environment variables.',
        }),
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are FriendFocus, an empathetic study mentor helping an overwhelmed student create a realistic short study plan.
The student's situation:
"${trimmedSituation}"

MODEL INSTRUCTION: You are Gemma 4 26B A4B IT (${GEMMA_MODEL_ID}).
Generate a concise, doable study plan.
Keep it realistic: focus only on high-yield mastery.

Break it into:
- Study blocks (laser-focused, bite-sized tasks)
- Short breaks (5 min water/rest)
- Final revision (self-quiz, active recall)
- Empathetic diagnosis (1-2 sentences)
- Short motivational message
- Anti-procrastination 2-minute starter tip

Respond with valid JSON formatted like this:
{
  "studentDiagnosis": "Empathetic diagnosis validating their situation and giving a calm game plan.",
  "totalDurationMinutes": 120,
  "timeline": [
    {
      "type": "study",
      "title": "Block 1: High-Yield Chapters",
      "timeRange": "0:00 - 0:35",
      "durationMinutes": 35,
      "taskDescription": "Specific actionable steps to do right now",
      "tip": "Micro advice for focus"
    },
    {
      "type": "break",
      "title": "Rest & Recharge",
      "timeRange": "0:35 - 0:40",
      "durationMinutes": 5,
      "taskDescription": "Stand up, drink water, stay off social media",
      "tip": "Rest your eyes"
    },
    {
      "type": "revision",
      "title": "Final Active Recall",
      "timeRange": "1:35 - 2:00",
      "durationMinutes": 25,
      "taskDescription": "Test yourself on key definitions and formulas on blank paper",
      "tip": "Testing cements memory"
    }
  ],
  "motivationalMessage": "Action cures anxiety. Starting one small thing breaks the freeze.",
  "antiProcrastinationTip": "Count 5-4-3-2-1 and read just the first heading. Friction disappears once you start."
}`;

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL_ID,
      contents: prompt,
    });

    const rawText = response.text || '';
    if (!rawText.trim()) {
      throw new Error('Gemma returned an empty response.');
    }

    let parsedPlan: any;
    try {
      let cleaned = rawText.trim();
      const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fenceMatch) {
        cleaned = fenceMatch[1].trim();
      } else {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          cleaned = cleaned.substring(start, end + 1);
        }
      }
      parsedPlan = JSON.parse(cleaned);
    } catch (parseError) {
      console.warn('JSON parsing from Gemma fallback in Netlify function:', parseError);
      parsedPlan = {
        studentDiagnosis: "We've formulated a balanced triage schedule to lower your stress and make immediate progress.",
        totalDurationMinutes: 120,
        timeline: [
          {
            type: 'study',
            title: 'Block 1: High-Yield Material',
            timeRange: '0:00 - 0:40',
            durationMinutes: 40,
            taskDescription: rawText.slice(0, 240) || 'Focus only on the highest-weight concepts and chapter summaries.',
            tip: 'Skim summaries first before reading in-depth.',
          },
          {
            type: 'break',
            title: 'Hydration & Mind Reset',
            timeRange: '0:40 - 0:45',
            durationMinutes: 5,
            taskDescription: 'Drink a glass of cold water, stretch shoulders, breathe deeply.',
            tip: 'Step away from your desk completely.',
          },
          {
            type: 'study',
            title: 'Block 2: Practice & Core Application',
            timeRange: '0:45 - 1:30',
            durationMinutes: 45,
            taskDescription: 'Solve 3-5 standard practice problems or test flashcards.',
            tip: 'Solve without looking at solutions first.',
          },
          {
            type: 'revision',
            title: 'Final Revision: Active Recall',
            timeRange: '1:30 - 2:00',
            durationMinutes: 30,
            taskDescription: 'Write down key formulas and main concepts on a blank sheet from memory.',
            tip: 'If you can explain it simply, you know it.',
          },
        ],
        motivationalMessage: 'Action cures anxiety. Starting just one small task will break the paralysis.',
        antiProcrastinationTip: "Use the 5-Minute Rule: commit to working on just one paragraph for 5 minutes. You can stop if you want to—but usually you won't.",
      };
    }

    // Normalize rawList into TimelineItem[]
    const rawList = parsedPlan.timeline || parsedPlan.plan || parsedPlan.schedule || [];
    const normalizedTimeline: TimelineItem[] = Array.isArray(rawList)
      ? rawList.map((item: any, index: number) => {
          let type: 'study' | 'break' | 'revision' = 'study';
          const rawType = String(item.type || item.category || '').toLowerCase();
          const rawTitle = String(item.title || item.focus || item.name || '').toLowerCase();

          if (rawType.includes('break') || rawTitle.includes('break') || rawTitle.includes('rest')) {
            type = 'break';
          } else if (
            rawType.includes('revision') ||
            rawType.includes('recall') ||
            rawTitle.includes('revision') ||
            rawTitle.includes('recall') ||
            rawTitle.includes('quiz')
          ) {
            type = 'revision';
          } else if (index === rawList.length - 1 && rawList.length > 2) {
            type = 'revision';
          }

          let durationMinutes = 30;
          if (typeof item.durationMinutes === 'number') {
            durationMinutes = item.durationMinutes;
          } else if (typeof item.duration === 'string') {
            const match = item.duration.match(/\d+/);
            if (match) durationMinutes = parseInt(match[0], 10);
          } else if (typeof item.duration === 'number') {
            durationMinutes = item.duration;
          }

          return {
            id: item.id || `timeline-block-${index + 1}`,
            type,
            title: item.title || item.focus || item.name || `Phase ${index + 1}`,
            timeRange: item.timeRange || (typeof item.time === 'string' ? item.time : `${durationMinutes}m`),
            durationMinutes,
            taskDescription:
              item.taskDescription ||
              item.activity ||
              item.description ||
              item.focus ||
              'Focus on active study steps.',
            tip: item.tip || item.tips || undefined,
          };
        })
      : [];

    const finalPlan: StudyPlanResponse = {
      modelUsed: GEMMA_MODEL_ID,
      situationSummary: trimmedSituation,
      studentDiagnosis:
        parsedPlan.studentDiagnosis ||
        parsedPlan.diagnosis ||
        parsedPlan.strategy ||
        "Here is a calm, triage-focused schedule to make meaningful progress right away.",
      totalDurationMinutes:
        typeof parsedPlan.totalDurationMinutes === 'number'
          ? parsedPlan.totalDurationMinutes
          : normalizedTimeline.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) || 120,
      timeline: normalizedTimeline,
      motivationalMessage:
        parsedPlan.motivationalMessage ||
        parsedPlan.motivation ||
        parsedPlan.quote ||
        'Action cures anxiety. Starting one small task breaks the freeze.',
      antiProcrastinationTip:
        parsedPlan.antiProcrastinationTip ||
        parsedPlan.hack ||
        parsedPlan.tip ||
        'The 2-Minute Rule: Just open the book and read one sentence.',
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(finalPlan),
    };
  } catch (error: any) {
    console.error('Error generating plan in Netlify function:', error);
    const errorMessage = error?.message || 'Failed to generate study plan with Gemma.';
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: errorMessage,
        modelUsed: GEMMA_MODEL_ID,
      }),
    };
  }
};

export default handler;
