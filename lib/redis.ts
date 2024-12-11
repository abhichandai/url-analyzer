async function setKey(key: string, value: string) {
  const response = await fetch(process.env.UPSTASH_REST_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REST_TOKEN!}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([
      'SET',
      key,
      value,
      'EX',
      1800
    ])
  });
  return response.json();
}

async function getKey(key: string) {
  const response = await fetch(process.env.UPSTASH_REST_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REST_TOKEN!}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([
      'GET',
      key
    ])
  });
  return response.json();
}

export { setKey, getKey };