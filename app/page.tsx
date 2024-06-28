'use client'
import Window from "@/components/window";
import { javascript } from '@codemirror/lang-javascript';
import ReactCodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Menu, Plus } from "lucide-react";

import { EditorView } from "@codemirror/view";
import { createTheme } from '@uiw/codemirror-themes';

import { tags as t } from '@lezer/highlight';

import { useDebounce } from 'use-debounce';

import jsbeautify from 'js-beautify';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";


const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#0c1021', // Azul
    foreground: '#fbde2d', // Amarillo
    caret: '#a7a7a7', // Gris
    selection: '#253b76', // Azul oscuro
    selectionMatch: 'transparent',
    gutterBackground: '#0c1021',
    gutterForeground: '#78887a', // Gris transparente para los elementos
    gutterBorder: 'red',
    gutterActiveForeground: '#838A84', // Gris transparente para los elementos
    lineHighlight: 'transparent', // Linea seleccionada
    fontFamily: 'inherit',
  },
  styles: [
    { tag: t.comment, color: '#aeaeae' }, // Color gris de comentarios
    { tag: t.definition(t.typeName), color: 'green' },
    { tag: t.variableName, color: '#ff6411' }, // Naranja
    { tag: t.string, color: '#61ce3c' }, // Verde
    { tag: t.number, color: '#fbde2d' }, //Amarillo
    { tag: t.function(t.variableName), color: '#8da6ce' }, // Azul 8da6ce
    { tag: t.propertyName, color: '#FFF' }, // Blanco
    { tag: t.bracket, color: '#FFF' }, // Blanco
    { tag: t.squareBracket, color: '#FFF' }, // Blanco
    { tag: t.definition(t.variableName), color: '#8da6ce' },
    { tag: t.separator, color: '#FFF' }, // Blanco
    { tag: t.derefOperator, color: '#FFF' }, // Blanco
    { tag: t.null, color: '#d8fa3c' }, // Amarillo lima
  ],
});

import Sandbox from "@/components/sandbox";
import { useCallback, useEffect, useRef, useState } from "react";


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
            className="border-r border-border overflow-y-auto min-h-full w-screen pl-3 relative"
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

