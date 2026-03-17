export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { regex } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    const payload = {
        contents: [{
            parts: [{
                text: `You are an elite Senior Staff Engineer explaining a Regular Expression to a junior developer. 
                Break down this regex: ${regex}. Deconstruct it piece by piece.
                Return strict, raw JSON ONLY (no markdown formatting or codeblocks). 
                The JSON must be an array of objects, where each object has two keys: 
                "token" (the specific part of the regex) and "explanation" (a 1-2 sentence plain English explanation).`
            }]
        }],
        generationConfig: {
            temperature: 0.1,
            response_mime_type: "application/json"
        }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        
        res.status(200).json(JSON.parse(textResponse));
    } catch (error) {
        res.status(500).json({ error: 'Failed to decompile regex', details: error.message });
    }
}
