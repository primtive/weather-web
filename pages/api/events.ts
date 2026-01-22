import type { NextApiRequest, NextApiResponse } from 'next';

const clients = new Set<NextApiResponse>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.add(res);
  console.log(`[SSE] Client connected (${clients.size})`);

  req.on('close', () => {
    clients.delete(res);
    console.log(`[SSE] Client disconnected (${clients.size})`);
  });
}

export function broadcastToClients(data: unknown) {
  for (const res of clients) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
