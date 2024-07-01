import { useEffect, useRef, useState } from "react";
import { generateConsoleScript } from "./console";

const Sandbox = ({ code }: { code: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
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
        setConsoleMessages((prev) => [...prev, { type: 'error', payload: { line, column, message } }]);
      },
      default: (payload: any, type: any, line: any) => {
        let content = payload.map((item: string) => `'${item}'`).join(' ');

        if (payload.some((item: any) => typeof item === 'number')) {
          content = payload.map((item: string) => item).join(' ');
        }

        if (payload.some((item: any) => !isPrimitive(item))) {
          content = payload.map((item: string) => JSON.stringify(item)).join(' ');
        }

        setConsoleMessages((prev) => [...prev, { type, payload: content, line }]);
      },
      loop: (payload: any) => {
        clearConsole();
        const { message } = payload;
        setConsoleMessages((prev) => [...prev, { type: 'loop', payload: { message } }]);
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

  useEffect(() => {
    runCode();
  }, [code]);

  const runCode = () => {
    const blob = new Blob([HTML(code)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  // Lineas totales del codigo y respuesta más el espacio de cada respuesta
  const totalLines: any = consoleMessages.reduce((acc, msg) => {
    // Verificar si payload es un string, si no, convertirlo a string.
    const payloadStr = typeof msg.payload === 'string' ? msg.payload : JSON.stringify(msg.payload);
    return acc + payloadStr.split('\n').length;
  }, 0);

  return (
    <div className="overflow-y-auto min-h-full pl-3 relative w-full py-[13px]">
      <ul id="console-list" className="flex">
        <div className="flex flex-col text-[#78887a] text-right mr-4 select-none">
          {consoleMessages.every(item => item.type !== 'error') && Array(totalLines).fill(0).map((_, index) => (
            <span key={index} className="text-nowrap">{index + 1}</span>
          ))}
        </div>

        <div>
          {consoleMessages.map((msg, index) => (
            <li key={index}>
              {msg.type === 'error' && (
                <div key={msg.payload.line} className="flex flex-col gap-4 text-[#ff6400]">
                  <span>{msg.payload.message}</span>
                  <div className="flex gap-2">
                    <div className="flex flex-col text-yellow-300 select-none">
                      {Array.of(
                        msg.payload.line,
                        msg.payload.line + 1,
                        msg.payload.line + 2,
                      ).map(item => (
                        <span key={item} className="text-nowrap">
                          {item} |
                        </span>
                      ))}
                    </div>
                    <span className="whitespace-pre-wrap text-wrap">
                      {code.split('\n').slice(msg.payload.line - 1, msg.payload.line + 2).join('\n')}
                    </span>
                  </div>
                </div>
              )}

              {consoleMessages.every(item => item.type !== 'error') && (
                <div key={msg.line} className="flex gap-4">
                  <span className={`text-wrap whitespace-pre-wrap text-green-500`}>
                    {msg.payload}
                  </span>
                </div>
              )}
            </li>
          ))}
        </div>
      </ul>
      <iframe title="Sandbox" sandbox="allow-scripts" ref={iframeRef} className="invisible hidden" />
    </div>
  );
};

export default Sandbox;

export const HTML = (code: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sandbox</title>
    ${generateConsoleScript()}
</head>
<body>
    <script type="module">${code}</script>
</body>
</html>`;
