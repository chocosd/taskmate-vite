import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    fetch: (url, options = {}) =>
        fetch(url, {
            ...options,
        }),
    ...(import.meta.env.DEV && { dangerouslyAllowBrowser: true }),
});

const systemPrompt = import.meta.env.VITE_AI_SYSTEM_PROMPT;

export async function generateTasksFromPrompt(prompt: string): Promise<string[]> {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Goal: ${prompt}\nTasks:\n` },
        ],
        temperature: 0.6,
    });

    const content = response.choices[0].message.content ?? '';

    if (content.startsWith('Error')) {
        throw new Error(content);
    }

    return content
        .split('\n')
        .filter(Boolean)
        .map((line) => line.replace(/^[-*\d.]+\s*/, '').trim());
}
