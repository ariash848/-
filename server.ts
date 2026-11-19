import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Fal Interpretation Endpoint
app.post('/api/fal/interpret', async (req, res) => {
  try {
    const { intention, ghazalTitle, ghazalVerses } = req.body;
    
    const prompt = `شما لسان‌الغیب خواجه حافظ شیرازی هستید. کاربر با این نیت فال گرفته است: "${intention || 'خیر و سعادت'}".
غزل آمده به این شرح است:
${ghazalTitle}
${Array.isArray(ghazalVerses) ? ghazalVerses.join('\n') : ghazalVerses}

لطفاً با لحنی عارفانه، دلنشین، اصیل و امیدوارکننده (به زبان فارسی معیار روان و ادبی)، تفسیر این فال را در سه بخش بنویسید:
1. معنا و مفهوم کلی غزل (در رابطه با نیت کاربر)
2. پند و اندیشه حافظ برای این نیت
3. فال‌نامه و نتیجه نهایی (پیش‌بینی آینده با رویکرد عرفانی و مثبت)

پاسخ را در قالب ساختار JSON با کلیدهای زیر برگردانید:
{
  "meaning": "...",
  "advice": "...",
  "prediction": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'شما مفسر برجسته دیوان حافظ و عارف آشنا به اسرار شعر حافظ هستید.',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        meaning: text,
        advice: 'بر تو باد صبر و توکل بر خالق هستی.',
        prediction: 'عاقبت کار نیکو و روشن خواهد بود ان‌شاءالله.',
      };
    }

    res.json(data);
  } catch (error: any) {
    console.error('Fal interpret error:', error);
    res.status(500).json({ error: error.message || 'خطا در پردازش فال' });
  }
});

// 2. Hafez Chatbot Endpoint
app.post('/api/hafez/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const systemInstruction = `تو خواجه شمس‌الدین محمد حافظ شیرازی، شاعر و عارف بزرگ قرن هشتم هستی. با لحنی دلنشین، پندآموز، شیرین‌زبان و با استفاده از اصطلاحات اصیل عرفانی (رند، صاقی، پیر مغان، می، عشق) به پرسش‌های کاربران پاسخ بده. گاهی در پاسخ خود ابیاتی مناسب از دیوان خودت بیاور. پاسخ‌ها گرم، الهام‌بخش و تسلی‌بخش باشد.`;

    const contents = [
      ...(history || []).map((h: any) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || 'در این باره خاموشی بهتر است که راز دل در پرده نیکوتر است.' });
  } catch (error: any) {
    console.error('Hafez chat error:', error);
    res.status(500).json({ error: error.message || 'خطا در ارتباط با هم‌نشین حافظ' });
  }
});

// 3. TTS Endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, style } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style: style || 'A warm, poetic, and soothing Persian recitation voice with mystical resonance',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio generated from TTS model');
    }

    res.json({ audio: base64Audio, mimeType: 'audio/wav' });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    res.status(500).json({ error: error.message || 'خطا در تولید صوت' });
  }
});

// Setup Vite middleware in development or serve static in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
