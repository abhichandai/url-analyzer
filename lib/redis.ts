// lib/redis.ts

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
  const data = await response.json();
  console.log('Upstash GET response:', data);  // Add this line
  return data;
}

export { setKey, getKey };