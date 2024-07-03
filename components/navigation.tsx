'use client'
import { cn } from '@/lib/utils';
import { Plus, SquareSplitVertical } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Window from './window';

import autoAnimate from '@formkit/auto-animate';

interface NavigationProps {
  setDirection: Dispatch<SetStateAction<"horizontal" | "vertical">>;
  direction: "horizontal" | "vertical";
  setWindows: Dispatch<SetStateAction<Window[]>>;
  windows: Window[];
  setActiveWindow: Dispatch<SetStateAction<number>>;
  activeWindow: number;
}

export interface Windows {
  windows: Window[];
}

export interface Window {
  name: string;
  code: string;
}

export default function Navigation({ setWindows, windows, setDirection, direction, activeWindow, setActiveWindow }: NavigationProps) {
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const addWindow = () => {
    setWindows([...windows, { name: `Nueva pestaña ${windows.length + 1}`, code: `` }])
    setActiveWindow(windows.length);
    localStorage.setItem('activeWindow', JSON.stringify(windows.length));
    localStorage.setItem('windows', JSON.stringify([...windows, { name: `Nueva pestaña ${windows.length + 1}`, code: `` }]));
  }

  const deleteWindow = (idx: number) => {
    setWindows(windows.filter((_, i) => i !== idx));
    localStorage.setItem('windows', JSON.stringify(windows.filter((_, i) => i !== idx)));

    if (activeWindow === idx && windows.length > 1) {
      setActiveWindow(0);
    } else if (activeWindow > idx) {
      setActiveWindow(activeWindow - 1);
    }

    if (windows.length === 1) {
      setWindows([{ name: `Nueva pestaña`, code: `` }]);
      setActiveWindow(0);
      localStorage.setItem('windows', JSON.stringify([{ name: `Nueva pestaña`, code: `` }]));
      localStorage.setItem('activeWindow', JSON.stringify(0));
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {

      if (event.ctrlKey && event.key.toLowerCase() === 'u') {
        event.stopPropagation();
        deleteWindow(activeWindow);
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'y') {
        event.stopPropagation();
        addWindow();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindow, windows, deleteWindow])

  return (
    <header className="h-[37px] min-h-[37px] max-w-full flex items-center border-b border-border bg-secondary fixed top-0 left-0 right-0">
      <button
        title="Cambiar orientación"
        onClick={() => {
          localStorage.setItem('direction', direction === 'horizontal' ? 'vertical' : 'horizontal')
          setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal')
        }}
        className="h-full px-4 bg-secondary flex items-center justify-center text-gray-400 border-border border-r hover:bg-accent opacity-60 !border-none !outline-none no-focus-visible">
        <SquareSplitVertical className={cn(direction === 'horizontal' && 'rotate-90', 'transition')} />
      </button>

      <ul className="flex h-full max-w-[95%] overflow-hidden" ref={parent}>
        {windows.map((window, i) => (
          <Window
            key={i}
            name={window.name}
            onClick={() => {
              setActiveWindow(i);
              localStorage.setItem('activeWindow', JSON.stringify(i));
            }}
            onClose={() => deleteWindow(i)}
            isActive={activeWindow === i}
          />
        ))}
      </ul>

      <button
        onClick={addWindow}
        className="h-full px-3 flex items-center justify-center hover:bg-accent text-white !border-none !outline-none no-focus-visible" title="Nueva pestaña"
      >
        <Plus strokeWidth={2} size={16} />
      </button>
    </header>
  )
}
