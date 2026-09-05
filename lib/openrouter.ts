export async function callOpenRouter(systemPrompt: string, userMessage: string, maxTokens: number = 200) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
      'X-Title': 'Texora Marketplace', // Required by OpenRouter
    },
    body: JSON.stringify({
      model: 'google/gemma-4-31b-it:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.6,
      max_tokens: maxTokens
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
