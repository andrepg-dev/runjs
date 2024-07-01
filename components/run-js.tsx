'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Editor from '@/components/code-mirror/editor';
import Sandbox from "@/components/sandbox";
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from "react";

interface RunJSProps {
  onChange: (val: string) => void;
  code: string;
  direction: 'horizontal' | 'vertical';
}

export default function RunJS({ direction, code, onChange }: RunJSProps) {
  const [codeDebounce] = useDebounce(code, 600);

  return (
    <ResizablePanelGroup
      direction={direction}
      className="flex w-full h-screen pt-[37px]"
    >
      <ResizablePanel className="flex w-full" defaultSize={80} minSize={10}>
        <Editor code={!codeDebounce ? code : codeDebounce} onChange={onChange} />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={75} minSize={10} className="flex">
        <Sandbox code={!codeDebounce ? code : codeDebounce} />
      </ResizablePanel>
    </ResizablePanelGroup>

  )
}
