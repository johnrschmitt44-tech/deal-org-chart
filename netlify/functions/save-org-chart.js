exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const { dealId, data } = event.queryStringParameters ?? {};
  if (!dealId || !data) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing dealId or data' }) };
  }

  const TOKEN = process.env.HUBSPOT_TOKEN;
  const res = await fetch(`https://api-na2.hubapi.com/crm/v3/objects/deals/${dealId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: { org_chart_data: data } }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { statusCode: res.status, headers, body: JSON.stringify({ error: err.message ?? `HTTP ${res.status}` }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
