const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const apiKey = process.env.OPENAI_API_KEY;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
              role: 'user',
              content:
                'Create a 64x64 pixel SVG image of your own complex design. You have full creative control. Return only the base64-encoded image in a data:image/svg+xml;base64, url pasteable format as a code block with NO additional text.',
            },
          ],
        }),
      });

      const data = await response.json();
      const svgXML = data.choices[0].message.content;

      res.status(200).json({ svg: svgXML });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate SVG' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
