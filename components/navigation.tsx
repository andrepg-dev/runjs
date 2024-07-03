'use client'
import { cn } from '@/lib/utils';
import { Plus, SquareSplitVertical } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useCallback } from 'react';
import Window from './window';

interface NavigationProps {
  setDirection: Dispatch<SetStateAction<"horizontal" | "vertical">>;
  direction: "horizontal" | "vertical";
  setWindows: Dispatch<SetStateAction<Window[]>>;
  windows: Window[];
  setActiveWindow: Dispatch<SetStateAction<number>>;
  activeWindow: number;
}

export interface Window {
  name: string;
  code: string;
}

const updateLocalStorage = (windows: Window[], activeWindow: number) => {
  localStorage.setItem('windows', JSON.stringify(windows));
  localStorage.setItem('activeWindow', JSON.stringify(activeWindow));
};

export default function Navigation({ setWindows, windows, setDirection, direction, activeWindow, setActiveWindow }: NavigationProps) {
  const parent = useRef(null);

  useEffect(() => {
    // parent.current && autoAnimate(parent.current)
  }, [parent]);

  const addWindow = useCallback(() => {
    const newWindows = [...windows, { name: `Nueva pestaña`, code: `` }];
    setWindows(newWindows);
    setActiveWindow(newWindows.length - 1);
    updateLocalStorage(newWindows, newWindows.length - 1);
  }, [windows, setWindows, setActiveWindow]);

  const deleteWindow = useCallback((idx: number) => {
    const newWindows = windows.filter((_, i) => i !== idx);
    let newActiveWindow = activeWindow;

    if (activeWindow >= newWindows.length) {
      newActiveWindow = newWindows.length - 1;
    } else if (activeWindow > idx) {
      newActiveWindow = activeWindow - 1;
    }

    setWindows(newWindows.length ? newWindows : [{ name: `Nueva pestaña`, code: `` }]);
    setActiveWindow(newWindows.length ? newActiveWindow : 0);
    updateLocalStorage(newWindows.length ? newWindows : [{ name: `Nueva pestaña`, code: `` }], newWindows.length ? newActiveWindow : 0);
  }, [windows, activeWindow, setWindows, setActiveWindow]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyEvent = (key: string, callback: () => void) => {
        if (event.ctrlKey && event.key.toLowerCase() === key) {
          event.preventDefault();
          event.stopPropagation();
          callback();
        }
      };

      keyEvent('e', addWindow);
      keyEvent('q', () => deleteWindow(activeWindow));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindow, addWindow, deleteWindow]);

  return (
    <header className="h-[37px] min-h-[37px] max-w-full flex items-center border-b border-border bg-secondary fixed top-0 left-0 right-0">
      <button
        title="Cambiar orientación"
        onClick={() => {
          const newDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
          localStorage.setItem('direction', newDirection);
          setDirection(newDirection);
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
  );
}
