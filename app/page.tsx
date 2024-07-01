'use client'
import Window from "@/components/window";
import { javascript } from '@codemirror/lang-javascript';
import ReactCodeMirror from "@uiw/react-codemirror";
import { FlipHorizontal, FoldHorizontal, FoldVertical, Menu, Plus, Rows2, SquareSplitVertical } from "lucide-react";

import { EditorView } from "@codemirror/view";
import { useDebounce } from 'use-debounce';

import jsbeautify from 'js-beautify';


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";


import Sandbox from "@/components/sandbox";
import { myTheme } from "@/theme/mytheme";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [value, setValue] = useState('');
  const [code] = useDebounce(value, 500)
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  useEffect(() => {
    localStorage.getItem('code') && setValue(localStorage.getItem('code') as string)
  }, [])

  useEffect(() => {
    localStorage.getItem('direction') && setDirection(localStorage.getItem('direction') as 'horizontal' | 'vertical')
  }, [])

  const onChange = useCallback((val: any) => {
    localStorage.setItem('code', val)
    setValue(val);
  }, []);

  function formatCode() {
    const res = jsbeautify(value, {
      indent_size: 2,
      wrap_line_length: 80,
      end_with_newline: true,
      space_in_empty_paren: true,
      brace_style: 'preserve-inline',
    });
    setValue(res);
  }
  // Detectar si se ha tocado la combinacion de teclas alt + shift + f para formatear el código
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() == 'f') {
        formatCode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [formatCode])

  return (
    <main className="h-screen overflow-hidden flex flex-col relative">
      <header className="h-[37px] min-h-[37px] w-full flex items-center border-b border-border bg-secondary fixed top-0 left-0 right-0">
        <button
          title="Cambiar orientación"
          onClick={() => {
            localStorage.setItem('direction', direction === 'horizontal' ? 'vertical' : 'horizontal')
            setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal')
          }}
          className="h-full px-4 bg-secondary flex items-center justify-center text-gray-400 border-border border-r hover:bg-accent opacity-60">
          <SquareSplitVertical className={cn(direction === 'horizontal' && 'rotate-90', 'transition')} />
        </button>
        <Window name={value.slice(0, 30)} />
        <button onClick={() => alert('Not now son')} className="h-full px-3 flex items-center justify-center hover:bg-accent text-white" title="Nueva pestaña">
          <Plus strokeWidth={2} size={16} />
        </button>
      </header>

      <ResizablePanelGroup
        direction={direction}
        className="flex w-full h-screen pt-[37px]"
      >
        <ResizablePanel className="flex w-full" defaultSize={80} minSize={10}>
          <ReactCodeMirror
            value={code}
            extensions={[
              javascript({ jsx: false, typescript: true }),
              EditorView.lineWrapping
            ]}
            theme={myTheme}
            autoFocus
            basicSetup={{
              autocompletion: false,
            }}
            className="border-r border-border overflow-y-auto min-h-full w-screen pl-3 relative text-base"
            onChange={onChange}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={75} minSize={10} className="flex">
          <Sandbox code={code} />
        </ResizablePanel>
      </ResizablePanelGroup>

    </main>

  )
}

