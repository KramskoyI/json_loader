import type { UserRecord } from '../types/data';

export async function downloadJsonWithProgress<T>(
  url: string,
  signal: AbortSignal,
  onProgress: (value: number) => void,
): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Readable stream is not supported');
  }

  const totalBytes = Number(response.headers.get('content-length')) || 0;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    chunks.push(value);
    receivedBytes += value.length;

    if (totalBytes > 0) {
      onProgress(Math.round((receivedBytes / totalBytes) * 100));
    }
  }

  const bytes = new Uint8Array(receivedBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }

  onProgress(100);

  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

export function loadUsersFromFile(
  url: string,
  signal: AbortSignal,
  onProgress: (value: number) => void,
): Promise<UserRecord[]> {
  return downloadJsonWithProgress<UserRecord[]>(url, signal, onProgress);
}
