import { createParser, type EventSourceMessage } from 'eventsource-parser'

export interface StreamRequestOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  onMessage: (message: EventSourceMessage) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export async function streamRequest(options: StreamRequestOptions): Promise<void> {
  const {
    url,
    method = 'POST',
    headers = {},
    body,
    onMessage,
    onError,
    onComplete
  } = options;

  const parser = createParser({
    onEvent: (event: EventSourceMessage) => {
      onMessage(event);
    },
    onError: (error: Error) => {
      console.log("sseParser error", error);
      onError?.(error);
    }
  });

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const reader = response?.body?.getReader();

    if (!reader) {
      onError?.(new Error('No reader available'));
      return;
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const data = new TextDecoder().decode(value);
      parser.feed(data);
    }
  } catch (error) {
    onError?.(error as Error);
  } finally {
    onComplete?.();
  }
}
