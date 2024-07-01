'use client'
import { cn } from '@/lib/utils';
import { Plus, SquareSplitVertical } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Window from './window';

import autoAnimate from '@formkit/auto-animate';

interface NavigationProps {
  window: string;
  setDirection: Dispatch<SetStateAction<"horizontal" | "vertical">>;
  direction: "horizontal" | "vertical";
}

export interface Windows {
  windows: Window[];
}

export interface Window {
  name: string;
  codigo: string;
}

export default function Navigation({ window, setDirection, direction }: NavigationProps) {
  const [windows, setWindows] = useState<Window[]>([{ name: window, codigo: '' }]);
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  useEffect(() => {
    setWindows(currentWindows => {
      const newWindows = [...currentWindows];
      if (newWindows.length > 0) {
        newWindows[0].name = window;
      } else {
        newWindows.push({ name: window, codigo: '' });
      }
      return newWindows;
    });
  }, [window]);

  const addWindow = () => {
    setWindows([...windows, { name: 'Nueva pestaña', codigo: '' }])
  }

  const deleteWindow = (idx: number) => {
    setWindows(windows.filter((_, i) => i !== idx))
  }

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

      <ul className="flex h-full" ref={parent}>
        {windows.map((window, i) => (
          <Window key={i} name={window.name} onClick={() => deleteWindow(i)} />
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
