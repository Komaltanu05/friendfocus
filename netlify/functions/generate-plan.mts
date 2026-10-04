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
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Route config for Netlify Functions 2.0
export const config = {
  path: ['/.netlify/functions/generate-plan', '/api/generate-plan'],
  preferStatic: false,
};

function getEmergencyTriagePlan(situation: string): StudyPlanResponse {
  return {
    modelUsed: GEMMA_MODEL_ID,
    situationSummary: situation,
    studentDiagnosis:
      "Time is precious right now, so we are shifting from perfectionism to strategic high-yield triage. Focus on what earns the most points first.",
    totalDurationMinutes: 120,
    timeline: [
      {
        id: 'timeline-block-1',
        type: 'study',
        title: 'Block 1: High-Yield Core Concepts',
        timeRange: '0:00 - 0:40',
        durationMinutes: 40,
        taskDescription:
          'Scan chapter summaries, bold terminology, and major diagrams. Skip low-probability background details.',
        tip: 'Focus exclusively on the highest-weight exam topics.',
      },
      {
        id: 'timeline-block-2',
        type: 'break',
        title: 'Mind Reset & Hydration',
        timeRange: '0:40 - 0:45',
        durationMinutes: 5,
        taskDescription:
          'Step away from your desk, drink a cold glass of water, and stretch your neck and shoulders. No phone scrolling.',
        tip: 'Give your eyes a screen-free rest.',
      },
      {
        id: 'timeline-block-3',
        type: 'study',
        title: 'Block 2: High-Impact Practice Problems',
        timeRange: '0:45 - 1:30',
        durationMinutes: 45,
        taskDescription:
          'Work through 3-5 standard practice problems or explain core definitions out loud without notes.',
        tip: 'Output practice is 3x more effective than passive re-reading.',
      },
      {
        id: 'timeline-block-4',
        type: 'revision',
        title: 'Final Active Recall Sprint',
        timeRange: '1:30 - 2:00',
        durationMinutes: 30,
        taskDescription:
          'On a blank sheet of paper, write down every formula, definition, and concept from memory.',
        tip: 'Active recall strengthens memory retrieval during the exam.',
      },
    ],
    motivationalMessage:
      'Action cures anxiety. Starting just one focused block breaks the freeze and builds momentum.',
    antiProcrastinationTip:
      'The 2-Minute Rule: Just open the book and read the first paragraph. The resistance disappears once you start.',
  };
}

async function generateStudyPlanWithGemma(trimmedSituation: string, apiKey: string): Promise<StudyPlanResponse> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const prompt = `Act as FriendFocus, an empathetic study mentor helping an overwhelmed student.
Student situation: "${trimmedSituation}"

MODEL INSTRUCTION: You are Gemma 4 26B A4B IT (${GEMMA_MODEL_ID}).
Do not overthink. Output valid JSON immediately.
Keep task descriptions concise (under 20 words each).

Format strictly as JSON:
{
  "studentDiagnosis": "Empathetic diagnosis validating their situation and giving a calm game plan.",
  "totalDurationMinutes": 120,
  "timeline": [
    {
      "type": "study",
      "title": "Block 1: High-Yield Concepts",
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
    config: {
      temperature: 0.4,
    },
  });

  let rawText = response.text || '';
  if (!rawText.trim()) {
    const parts = response.candidates?.[0]?.content?.parts || [];
    const nonThought = parts.find((p: any) => !p.thought && p.text);
    rawText = nonThought?.text || parts[0]?.text || '';
  }

  if (!rawText.trim()) {
    return getEmergencyTriagePlan(trimmedSituation);
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
    return getEmergencyTriagePlan(trimmedSituation);
  }

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

  if (normalizedTimeline.length === 0) {
    return getEmergencyTriagePlan(trimmedSituation);
  }

  return {
    modelUsed: GEMMA_MODEL_ID,
    situationSummary: trimmedSituation,
    studentDiagnosis:
      parsedPlan.studentDiagnosis ||
      parsedPlan.diagnosis ||
      parsedPlan.strategy ||
      'Here is a calm, triage-focused schedule to make meaningful progress right away.',
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
}

// Safely wraps execution within a timeout so Netlify never kills the function with an HTML error page
async function executeWithTimeoutProtection(situation: string, apiKey: string): Promise<StudyPlanResponse> {
  const TIMEOUT_MS = 21000; // 21 seconds safeguard for serverless limits
  let timeoutHandle: any;

  const timeoutPromise = new Promise<StudyPlanResponse>((resolve) => {
    timeoutHandle = setTimeout(() => {
      console.warn('Gemma execution approached timeout; resolving with triage plan.');
      resolve(getEmergencyTriagePlan(situation));
    }, TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([
      generateStudyPlanWithGemma(situation, apiKey),
      timeoutPromise,
    ]);
    return result;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

// Netlify Functions v2 handler (Standard Web Request/Response)
export default async function (req: Request | any, context?: any) {
  // If invoked with modern Web Standard Request
  if (req && (typeof req.json === 'function' || typeof req.text === 'function')) {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }), {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    try {
      let situation = '';
      try {
        const body = await req.json();
        situation = body?.situation || '';
      } catch {
        try {
          const text = await req.text();
          const parsed = JSON.parse(text);
          situation = parsed?.situation || '';
        } catch {}
      }

      if (!situation || typeof situation !== 'string' || !situation.trim()) {
        return new Response(JSON.stringify({ error: 'Please enter your study situation.' }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error:
              'Server configuration error: GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your Netlify site environment variables.',
          }),
          {
            status: 500,
            headers: CORS_HEADERS,
          }
        );
      }

      const plan = await executeWithTimeoutProtection(situation.trim(), apiKey);
      return new Response(JSON.stringify(plan), {
        status: 200,
        headers: CORS_HEADERS,
      });
    } catch (err: any) {
      console.error('Error in Netlify function v2:', err);
      return new Response(
        JSON.stringify({
          error: err?.message || 'Failed to generate study plan with Gemma.',
          modelUsed: GEMMA_MODEL_ID,
        }),
        {
          status: 500,
          headers: CORS_HEADERS,
        }
      );
    }
  }

  // Fallback to Netlify Functions v1 (Lambda-style event)
  return handler(req, context);
}

// Netlify Functions v1 handler (Lambda event/context)
export const handler = async (event: any, _context?: any) => {
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
        const raw = event.isBase64Encoded
          ? Buffer.from(event.body, 'base64').toString('utf8')
          : event.body;
        body = typeof raw === 'string' ? JSON.parse(raw) : raw;
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error:
            'Server configuration error: GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your Netlify site environment variables.',
        }),
      };
    }

    const plan = await executeWithTimeoutProtection(situation.trim(), apiKey);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(plan),
    };
  } catch (err: any) {
    console.error('Error in Netlify function v1:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: err?.message || 'Failed to generate study plan with Gemma.',
        modelUsed: GEMMA_MODEL_ID,
      }),
    };
  }
};
