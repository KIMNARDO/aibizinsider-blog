/**
 * aibizinsider.com - Blog Thumbnail Generator
 *
 * Google Gemini API (Imagen 4 / Gemini native) 를 사용해
 * 1200x630 YouTube-style 블로그 대표이미지를 생성합니다.
 *
 * 필수: npm install @google/genai
 * 환경변수: GEMINI_API_KEY
 *
 * 사용법:
 *   node generate-thumbnails.js --prompt "AI robot in modern office"
 *   node generate-thumbnails.js --batch prompts.json
 *   node generate-thumbnails.js --prompt "tech startup" --engine gemini
 *   node generate-thumbnails.js --prompt "tech startup" --count 3
 *
 * prompts.json 형식:
 *   [
 *     { "slug": "ai-startup-funding", "prompt": "futuristic startup office with holographic displays" },
 *     { "slug": "gpt-5-release", "prompt": "advanced neural network visualization" }
 *   ]
 */

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY 환경변수가 필요합니다.');
  console.error('발급: https://aistudio.google.com/apikey');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const OUTPUT_DIR = path.join(__dirname, '..', 'thumbnails');

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}
function hasFlag(name) {
  return args.includes(`--${name}`);
}

const ENGINE = getArg('engine') || 'imagen';  // 'imagen' or 'gemini'
const SINGLE_PROMPT = getArg('prompt');
const BATCH_FILE = getArg('batch');
const COUNT = parseInt(getArg('count') || '1', 10);
const DRY_RUN = hasFlag('dry-run');

// ---------------------------------------------------------------------------
// Imagen 4 engine (purpose-built image generation)
// Model: imagen-4.0-generate-001
// Supports: aspectRatio, numberOfImages, personGeneration
// ---------------------------------------------------------------------------
async function generateWithImagen(prompt, outputPath, count) {
  console.log(`  [imagen-4] Generating ${count} image(s)...`);

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: Math.min(count, 4),
      aspectRatio: '16:9',    // closest standard to 1200x630 (1.905:1)
      personGeneration: 'allow_adult',
    },
  });

  const saved = [];
  let idx = 1;
  for (const generatedImage of response.generatedImages) {
    const imgBytes = generatedImage.image.imageBytes;
    const buffer = Buffer.from(imgBytes, 'base64');

    const filePath = count > 1
      ? outputPath.replace('.png', `-${idx}.png`)
      : outputPath;

    fs.writeFileSync(filePath, buffer);
    const sizeKB = Math.round(buffer.length / 1024);
    console.log(`  Saved: ${path.basename(filePath)} (${sizeKB} KB)`);
    saved.push(filePath);
    idx++;
  }

  return saved;
}

// ---------------------------------------------------------------------------
// Gemini native image generation engine
// Model: gemini-3.1-flash-image-preview
// Supports: aspectRatio, imageSize via config
// ---------------------------------------------------------------------------
async function generateWithGemini(prompt, outputPath) {
  console.log('  [gemini-3.1-flash] Generating image...');

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: '16:9',
        imageSize: '2K',
      },
    },
  });

  const saved = [];
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64');
      fs.writeFileSync(outputPath, buffer);
      const sizeKB = Math.round(buffer.length / 1024);
      console.log(`  Saved: ${path.basename(outputPath)} (${sizeKB} KB)`);
      saved.push(outputPath);
    } else if (part.text) {
      console.log(`  Model note: ${part.text.substring(0, 120)}`);
    }
  }

  return saved;
}

// ---------------------------------------------------------------------------
// Core generation dispatcher
// ---------------------------------------------------------------------------
async function generateThumbnail(prompt, slug, count) {
  const safeName = slug || prompt.substring(0, 40).replace(/[^a-zA-Z0-9가-힣_-]/g, '_').toLowerCase();
  const outputPath = path.join(OUTPUT_DIR, `${safeName}-thumbnail.png`);

  console.log(`\n--- ${safeName} ---`);
  console.log(`  Prompt: "${prompt}"`);

  if (DRY_RUN) {
    console.log('  [DRY RUN] Skipping API call');
    return [];
  }

  try {
    if (ENGINE === 'gemini') {
      return await generateWithGemini(prompt, outputPath);
    } else {
      return await generateWithImagen(prompt, outputPath, count);
    }
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    if (err.message.includes('API_KEY')) {
      console.error('  Hint: API 키를 확인하세요. https://aistudio.google.com/apikey');
    }
    if (err.message.includes('SAFETY') || err.message.includes('blocked')) {
      console.error('  Hint: 프롬프트가 안전 필터에 의해 차단되었습니다. 프롬프트를 수정해 주세요.');
    }
    return [];
  }
}

// ---------------------------------------------------------------------------
// Thumbnail prompt enhancer
// Blog thumbnail 품질을 높이기 위한 기본 스타일 접미사
// ---------------------------------------------------------------------------
function enhancePrompt(rawPrompt) {
  const suffix = 'Professional blog thumbnail style, clean modern design, '
    + 'high contrast, vibrant colors, no text overlays, no watermarks, '
    + 'photorealistic, 16:9 widescreen composition, editorial quality';
  return `${rawPrompt}. ${suffix}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output dir: ${OUTPUT_DIR}`);
  }

  console.log(`Engine: ${ENGINE}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  let jobs = [];

  // Single prompt mode
  if (SINGLE_PROMPT) {
    jobs.push({ slug: null, prompt: enhancePrompt(SINGLE_PROMPT) });
  }

  // Batch mode (JSON file)
  if (BATCH_FILE) {
    const filePath = path.resolve(BATCH_FILE);
    if (!fs.existsSync(filePath)) {
      console.error(`Batch file not found: ${filePath}`);
      process.exit(1);
    }
    const entries = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (const entry of entries) {
      jobs.push({
        slug: entry.slug,
        prompt: enhancePrompt(entry.prompt),
      });
    }
    console.log(`Loaded ${entries.length} prompts from ${path.basename(filePath)}`);
  }

  if (jobs.length === 0) {
    console.log('\nUsage:');
    console.log('  node generate-thumbnails.js --prompt "AI robot in office"');
    console.log('  node generate-thumbnails.js --batch prompts.json');
    console.log('  node generate-thumbnails.js --prompt "startup" --engine gemini');
    console.log('  node generate-thumbnails.js --prompt "startup" --count 3');
    console.log('  node generate-thumbnails.js --prompt "test" --dry-run');
    console.log('\nOptions:');
    console.log('  --prompt  "text"    Single image prompt');
    console.log('  --batch   file.json Batch file with [{slug, prompt}, ...]');
    console.log('  --engine  imagen    "imagen" (default) or "gemini"');
    console.log('  --count   1         Number of variants per prompt (imagen only, max 4)');
    console.log('  --dry-run           Print prompts without calling API');
    process.exit(0);
  }

  // Rate limiting: 1 request per 2 seconds to stay within free tier limits
  const DELAY_MS = 2000;
  const allSaved = [];

  for (let i = 0; i < jobs.length; i++) {
    const { slug, prompt } = jobs[i];
    console.log(`\n[${i + 1}/${jobs.length}]`);

    const saved = await generateThumbnail(prompt, slug, COUNT);
    allSaved.push(...saved);

    // Delay between requests (skip after last)
    if (i < jobs.length - 1 && !DRY_RUN) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n========================================`);
  console.log(`Done. Generated ${allSaved.length} thumbnail(s).`);
  if (allSaved.length > 0) {
    console.log(`Location: ${OUTPUT_DIR}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
