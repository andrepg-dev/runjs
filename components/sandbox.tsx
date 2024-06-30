import useConsoleMessages from "@/hooks/useConsoleMessages";
import { useEffect, useRef } from "react";
import { generateConsoleScript } from "./console";
import ConsoleView from "./console-view";

const Sandbox = ({ code }: { code: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { consoleMessages } = useConsoleMessages({ iframeRef });

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

  return (
    <div className="overflow-y-auto min-h-full pl-3 relative w-full py-[13px]">
      <ConsoleView code={code} consoleMessages={consoleMessages} />

      {/* Iframe */}
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
