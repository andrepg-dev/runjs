'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { generateConsoleScript } from "./console";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { myTheme } from "@/theme/mytheme";
import { viewTheme } from "@/theme/view-theme";
import { formatCode } from "@/lib/utils";

const Sandbox = ({ code }: { code: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [consoleMessages, setConsoleMessages] = useState<{ type: any; payload: any; line?: any }[]>([]);

  const isPrimitive = useCallback((item: any) =>
    ['string', 'number', 'boolean', 'symbol', 'bigint'].includes(typeof item) || item === null || item === undefined,
    []
  );
  
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
      let content = payload.map((item: string) => "'" + item + "'").join(' ');

      if (payload.some((item: any) => typeof item === 'number' || typeof item === 'boolean' || typeof item === 'bigint')) {
        content = payload.map((item: string) => item).join(' ');
      }

      if (payload.some((item: any) => !isPrimitive(item))) {
        content = payload.map((item: string) => formatCode(JSON.stringify(item), {
          brace_style: 'collapse'
        })).join(' ');
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

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    runCode();
  }, [code]);

  const runCode = useCallback(() => {
    const blob = new Blob([HTML(code)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [code])

  const allMessage = () => {
    return consoleMessages.map((msg) => {
      if (msg.type !== 'error') {
        return msg.payload;
      }
    }).join('\n');
  }

  const errorMessage = (code: any, msg: any) => {
    return code.split('\n').slice(
      msg.payload.line - 2 > -1 ? msg.payload.line - 2
        : msg.payload.line - 1, msg.payload.line + 4).join('\n')
  }

  return (
    <div className="overflow-y-auto min-h-full relative w-full py-[13px]">
      <ul id="console-list" className="flex ml-2">
        {consoleMessages.map((msg, index) => (
          <li key={index}>
            {msg.type === 'error' && (
              <div key={msg.payload.line} className="flex flex-col gap-4 text-[#ff6400]">
                <span className="text-[#d8eb2b]">{msg.payload.message}</span>
                <div className="flex gap-2">
                  <span>
                    {msg.payload.line - 2 > -1 && <br />}
                    {'>'}</span>
                  <div className="flex flex-col text-[#d8eb2b]">
                    {Array.of(
                      msg.payload.line - 1,
                      msg.payload.line,
                      msg.payload.line + 1,
                      msg.payload.line + 2,
                      msg.payload.line + 3,
                      msg.payload.line + 4,
                    ).map(item => (
                      <span key={item} className="text-nowrap">
                        {item > 0 && <>{item} |</>}
                      </span>
                    ))}
                  </div>
                  <ReactCodeMirror
                    value={errorMessage(code, msg)}
                    extensions={[
                      javascript({ jsx: false, typescript: true }),
                      EditorView.lineWrapping,
                    ]}
                    theme={myTheme}
                    editable={false}
                    autoFocus
                    basicSetup={{
                      autocompletion: false,
                      foldGutter: false,
                      lineNumbers: false,
                    }}
                    className="especial"
                  />
                </div>
              </div>
            )}
          </li>
        ))}

        {consoleMessages.every(item => item.type !== 'error') && (
          <ReactCodeMirror
            value={allMessage()}
            extensions={[
              javascript({ jsx: false, typescript: true }),
              EditorView.lineWrapping,
            ]}
            theme={viewTheme}
            editable={false}
            autoFocus
            basicSetup={{
              autocompletion: false,
              foldGutter: false,
            }}
            className="especial-2 overflow-y-auto min-h-full min-w-full relative text-base custom-line-height"
          />
        )}

      </ul >
      <iframe title="Sandbox" sandbox="allow-scripts" ref={iframeRef} className="invisible hidden" />
    </div >
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
