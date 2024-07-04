'use client'

import { useEffect, useRef, useState } from "react";
import { consoleScript } from "./console";

enum SandboxType {
  evaluate = 'sandbox:evaluate',
  log = 'sandbox:log',
  console = 'sandbox:consolelog',
  error = 'sandbox:error'
}

interface IData {
  count: number;
  initial?: boolean;
  message: string[];
  type: SandboxType;
  position: { line: number, column: number }
}

export default function Sandbox({ code }: { code: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [data, setData] = useState<IData[]>()

  useEffect(() => {
    const handler: { [key: string]: (e: IData) => void } = {
      'sandbox:consolelog': (e: IData) => {
        if (e.count >= 1999) return
        console.log(e)
      },
      'sandbox:error': (e: IData) => {
        console.error(e)
      }
    }

    const handle = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow) {
        const eventHandler = handler[event.data.type]

        if (eventHandler) {
          eventHandler(event.data)
        }
      }
    }

    // Get the data from the iframe
    window.addEventListener('message', handle)
  }, [])

  useEffect(() => {
    const blob = new Blob([HTML], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);

    if (iframeRef.current) {
      iframeRef.current.src = blobUrl;
    }
  }, []);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: SandboxType.evaluate,
        expression: code,
        line: 1,
        lastExpression: true
      }, '*');
    }
  }, [code]);

  return (
    <div>
      <iframe ref={iframeRef} className="hidden" />
    </div>
  );
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  ${consoleScript()}  
</body>
</html>
`;
