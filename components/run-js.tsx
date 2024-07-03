'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Editor from '@/components/code-mirror/editor';
import Sandbox from "@/components/sandbox";
import { formatCode } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';

interface RunJSProps {
  direction: 'horizontal' | 'vertical';
  code: string;
  onCodeChange: (code: string) => void;
  isActive: boolean;
}

export default function RunJS({ direction, code, onCodeChange, isActive }: RunJSProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const [codeDebounce] = useDebounce(currentCode, 500);

  const onChange = useCallback((val: any) => {
    setCurrentCode(val);
    onCodeChange(val);
  }, [onCodeChange]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'f') {
        setCurrentCode(formatCode(currentCode));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCode]);

  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  if (!isActive) return null;

  return (
    <ResizablePanelGroup
      direction={direction}
      className="flex w-full h-screen pt-[37px]"
    >
      <ResizablePanel className="flex w-full" defaultSize={50} minSize={10}>
        <Editor code={code} onChange={onChange} />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={50} minSize={10} className="flex">
        <Sandbox code={codeDebounce} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
