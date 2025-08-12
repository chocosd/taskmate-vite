import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    fetch: (url, options = {}) =>
        fetch(url, {
            ...options,
        }),
    ...(import.meta.env.DEV && { dangerouslyAllowBrowser: true }),
});

export interface ProofVerificationResult {
    isValid: boolean;
    confidence: number;
    reasoning: string;
    suggestions?: string[];
}

export async function verifyProofWithChatGPT(
    taskTitle: string,
    taskDescription: string,
    file: File
): Promise<ProofVerificationResult> {
    try {
        // Convert file to base64 for sending to ChatGPT
        const base64File = await fileToBase64(file);

        // Create the verification prompt
        const verificationPrompt = `
You are a task completion verification assistant. Your job is to analyze a submitted document and determine if it provides sufficient proof that the task was completed.

TASK TO VERIFY:
Title: ${taskTitle}
Description: ${taskDescription}

INSTRUCTIONS:
1. Analyze the submitted document carefully
2. Determine if the document provides clear evidence that the task was completed
3. Consider the following criteria:
   - Does the document show actual work done?
   - Is it relevant to the task description?
   - Does it demonstrate completion of the specific requirements?
   - Is it authentic and not generic?

4. Provide your assessment in the following JSON format:
{
  "isValid": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "Detailed explanation of your assessment",
  "suggestions": ["Any suggestions for improvement if applicable"]
}

Be thorough but fair in your assessment. If the proof is insufficient, explain what would be needed for better verification.
`;

        // Send to ChatGPT with the file
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: verificationPrompt,
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Please verify this proof document against the task requirements.',
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${file.type};base64,${base64File}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
            temperature: 0.3,
        });

        const resultText = response.choices[0]?.message?.content;

        if (!resultText) {
            throw new Error('No response from ChatGPT');
        }

        // Parse the JSON response
        try {
            const result = JSON.parse(
                resultText
            ) as ProofVerificationResult;
            return result;
        } catch (parseError) {
            // If JSON parsing fails, create a fallback result
            console.error(
                'Failed to parse ChatGPT response:',
                parseError
            );
            return {
                isValid: false,
                confidence: 0.0,
                reasoning:
                    'Unable to parse verification result. Please try again.',
            };
        }
    } catch (error) {
        console.error('Proof verification error:', error);
        throw new Error(`Proof verification failed: ${error}`);
    }
}

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix to get just the base64 string
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
}

// Alternative function for text-based documents
export async function verifyTextProofWithChatGPT(
    taskTitle: string,
    taskDescription: string,
    proofText: string
): Promise<ProofVerificationResult> {
    try {
        const verificationPrompt = `
You are a task completion verification assistant. Your job is to analyze submitted proof text and determine if it provides sufficient evidence that the task was completed.

TASK TO VERIFY:
Title: ${taskTitle}
Description: ${taskDescription}

SUBMITTED PROOF:
${proofText}

INSTRUCTIONS:
1. Analyze the submitted proof text carefully
2. Determine if the text provides clear evidence that the task was completed
3. Consider the following criteria:
   - Does the text describe actual work done?
   - Is it relevant to the task description?
   - Does it demonstrate completion of the specific requirements?
   - Is it authentic and not generic?

4. Provide your assessment in the following JSON format:
{
  "isValid": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "Detailed explanation of your assessment",
  "suggestions": ["Any suggestions for improvement if applicable"]
}

Be thorough but fair in your assessment. If the proof is insufficient, explain what would be needed for better verification.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: verificationPrompt,
                },
            ],
            max_tokens: 1000,
            temperature: 0.3,
        });

        const resultText = response.choices[0]?.message?.content;

        if (!resultText) {
            throw new Error('No response from ChatGPT');
        }

        try {
            const result = JSON.parse(
                resultText
            ) as ProofVerificationResult;
            return result;
        } catch (parseError) {
            console.error(
                'Failed to parse ChatGPT response:',
                parseError
            );
            return {
                isValid: false,
                confidence: 0.0,
                reasoning:
                    'Unable to parse verification result. Please try again.',
            };
        }
    } catch (error) {
        console.error('Text proof verification error:', error);
        throw new Error(`Proof verification failed: ${error}`);
    }
}
