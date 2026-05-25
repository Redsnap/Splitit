import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const { base64, mediaType } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: 'Extract all purchased line items and the purchase date from this receipt or order. Return ONLY a JSON object, no markdown. Format: {"date":"YYYY-MM-DD or empty string if not found","items":[{"name":"item name","price":unit_price_number,"qty":quantity_integer}]}. Unit price not line total. Default qty=1. Exclude subtotals, taxes, fees, discounts, delivery, tips, totals from items.' }
      ]}]
    });
    res.status(200).json({ content: response.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}