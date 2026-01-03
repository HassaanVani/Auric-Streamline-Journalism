import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const perplexityAI = process.env.PERPLEXITY_API_KEY
    ? new GoogleGenerativeAI(process.env.PERPLEXITY_API_KEY)
    : null;

function getModel(usePerplexity = false) {
    const ai = usePerplexity ? perplexityAI : genAI;
    if (!ai) {
        throw new Error(`${usePerplexity ? 'PERPLEXITY' : 'GEMINI'}_API_KEY not configured`);
    }
    return ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

function getSearchModel() {
    if (!genAI) throw new Error('GEMINI_API_KEY not configured');
    return genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        tools: [{ googleSearch: {} }]
    });
}

export async function searchResearch(query) {
    const model = getSearchModel();
    const prompt = `You are a research assistant for investigative journalists. 
Search for current, factual information about: "${query}"

Provide a comprehensive summary with:
1. Key facts and findings
2. Important dates and figures
3. Relevant sources and organizations
4. Any controversies or different perspectives

Format your response as structured research notes.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map(chunk => ({
        title: chunk.web?.title || 'Source',
        url: chunk.web?.uri || ''
    })) || [];

    return {
        summary: response.text(),
        sources,
        searchedAt: new Date().toISOString()
    };
}

export async function generateQuestions(contact, story, researchContext) {
    const model = getModel();
    const prompt = `You are an expert journalism interview coach.

Generate interview questions for:
- Contact: ${contact?.name || 'Source'} (${contact?.role || 'Expert'} at ${contact?.affiliation || 'Organization'})
- Story: ${story?.title || 'Investigation'}
- Research context: ${researchContext || 'General investigation'}

Create 5-7 targeted questions that:
1. Start with background/rapport-building
2. Progress to key analytical questions
3. End with forward-looking or impact questions
4. Include follow-up prompts for each

Return as JSON array:
[{"category": "Background|Analysis|Impact|Follow-up", "question": "...", "followUp": "...", "priority": "high|medium|low"}]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return questions.map((q, i) => ({ id: i + 1, ...q }));
    }
    
    return [{ id: 1, category: 'General', question: text, followUp: '', priority: 'medium' }];
}

export async function generateEmail(recipient, purpose, tone, senderName) {
    const model = getModel();
    const prompt = `You are an expert at crafting professional journalist outreach emails.

Write an email for:
- Recipient: ${recipient?.name || 'Contact'} (${recipient?.role || ''} at ${recipient?.affiliation || ''})
- Purpose: ${purpose || 'Interview request'}
- Tone: ${tone || 'professional'}
- Sender: ${senderName || 'Journalist'}

Create a concise, compelling email that:
1. Has a clear, specific subject line
2. Establishes credibility quickly
3. Makes a specific, time-bounded ask
4. Is respectful of the recipient's time

Return as JSON: {"subject": "...", "body": "..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    
    return { subject: 'Interview Request', body: text };
}

export async function reviewArticle(content) {
    const model = getModel();
    const prompt = `You are an expert editorial reviewer for investigative journalism.

Review this article for style, clarity, and journalistic standards:
"""
${content?.substring(0, 8000) || ''}
"""

Provide:
1. 3-5 specific style/clarity suggestions (with original text and suggested revision)
2. Readability assessment

Return as JSON:
{
  "suggestions": [{"type": "clarity|tone|grammar|style", "original": "...", "suggestion": "...", "reason": "..."}],
  "readability": {"grade": "A-F", "readingLevel": "Xth Grade", "avgSentenceLength": N, "passiveVoice": "X%"}
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
            suggestions: (parsed.suggestions || []).map((s, i) => ({ id: i + 1, ...s })),
            readability: parsed.readability || { grade: 'B', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '10%' }
        };
    }
    
    return {
        suggestions: [],
        readability: { grade: 'B', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '10%' }
    };
}

export async function factCheck(claims) {
    const model = getSearchModel();
    const claimsList = Array.isArray(claims) ? claims : [claims];
    
    const prompt = `You are a fact-checker for investigative journalism.

Verify these claims using current, authoritative sources:
${claimsList.map((c, i) => `${i + 1}. "${c}"`).join('\n')}

For each claim, determine:
- Status: "verified" (confirmed by reliable sources), "disputed" (conflicting information), "unverified" (cannot confirm), "false" (contradicted by evidence)
- Source: The authoritative source for verification

Return as JSON array:
[{"claim": "...", "status": "verified|disputed|unverified|false", "source": "...", "notes": "..."}]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    
    return claimsList.map(claim => ({ claim, status: 'unverified', source: 'Pending verification' }));
}

export function isAIConfigured() {
    return !!process.env.GEMINI_API_KEY;
}
