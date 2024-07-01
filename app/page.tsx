'use client'
import Window from "@/components/window";
import { javascript } from '@codemirror/lang-javascript';
import ReactCodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Menu, Plus } from "lucide-react";

import { EditorView } from "@codemirror/view";


import { useDebounce } from 'use-debounce';

import jsbeautify from 'js-beautify';


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";


import Sandbox from "@/components/sandbox";
import { useCallback, useEffect, useRef, useState } from "react";
import { myTheme } from "@/theme/mytheme";


export default function Home() {
  const [value, setValue] = useState('');
  const [code] = useDebounce(value, 500)
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    localStorage.getItem('code') && setValue(localStorage.getItem('code') as string)
  }, [])

  const onChange = useCallback((val: any) => {
    localStorage.setItem('code', val)
    setValue(val);
  }, []);

  function formatCode() {
    const res = jsbeautify(value, {
      indent_size: 2,
    })
    setValue(res + '\n')
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
        <button className="h-full px-4 bg-secondary flex items-center justify-center text-gray-400 border-border border-r hover:bg-accent">
          <Menu />
        </button>
        <Window name={value.slice(0, 30)} />
        <button onClick={() => alert('Not now son')} className="h-full px-3 flex items-center justify-center hover:bg-accent text-white" title="Nueva pestaña">
          <Plus strokeWidth={2} size={16} />
        </button>
      </header>


      <ResizablePanelGroup
        direction="horizontal"
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
            ref={editorRef}
            basicSetup={{
              autocompletion: false,
              indentOnInput: true
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

