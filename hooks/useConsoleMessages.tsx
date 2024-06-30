'use client'

import React, { SetStateAction, useEffect, useState } from 'react'

interface ConsoleMessage {
  iframeRef: any;
}

export default function useConsoleMessage({ iframeRef }: ConsoleMessage) {
  const [consoleMessages, setConsoleMessages] = useState<{ type: any; payload: any; line?: any }[]>([]);

  useEffect(() => {
    const isPrimitive = (item: any) => {
      return ['string', 'number', 'boolean', 'symbol', 'bigint'].includes(typeof item) || item === null || item === undefined;
    };

    const clearConsole = () => {
      setConsoleMessages([]);
    };

    const handlers: Record<any, any> = {
      system: (payload: any) => {
        if (payload === 'clear') {
          clearConsole();
        }
      },
      error: (payload: any) => {
        const { line, column, message } = payload;
        setConsoleMessages((prev: any) => [...prev, { type: 'error', payload: { line, column, message } }]);
      },
      default: (payload: any, type: any, line: any) => {
        let content = payload.map((item: string) => item).join(' ');

        if (payload.some((item: any) => !isPrimitive(item))) {
          content = payload.map((item: string) => JSON.stringify(item)).join(' ');
        }

        setConsoleMessages((prev: any) => [...prev, { type, payload: content, line }]);
      },
      loop: (payload: any) => {
        clearConsole();
        const { message } = payload;
        setConsoleMessages((prev: any) => [...prev, { type: 'loop', payload: { message } }]);
      },
    };

    const handleMessage = (event: MessageEvent) => {
      const { console: ConsoleData } = event.data;
      if (!ConsoleData) return;

      const { payload, type, line } = ConsoleData;

      if (event.source === iframeRef.current?.contentWindow) {
        const handler = handlers[type] || handlers.default;
        handler(payload, type, line);
      } else if (type === 'loop') {
        handlers.loop(payload);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  return { consoleMessages, setConsoleMessages };
}
