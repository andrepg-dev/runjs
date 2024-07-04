'use client'

import Navigation, { Window } from "@/components/navigation";
import RunJS from '@/components/run-js';
import { useState } from "react";


export default function NavigationAndEditor() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(localStorage.getItem('direction') as any ?? 'horizontal');
  const [windows, setWindows] = useState<Window[]>(JSON.parse(localStorage.getItem('windows') as string) as any ?? [{ name: 'Nueva pestaña', code: '' }]);
  const [activeWindow, setActiveWindow] = useState<number>(JSON.parse(localStorage.getItem('activeWindow') as string) as any ?? 0);

  return (
    <>
      <Navigation
        setWindows={setWindows}
        windows={windows}
        direction={direction}
        setDirection={setDirection}
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
      />

      {windows.map((window, index) => (
        <RunJS
          code={window.code}
          onCodeChange={(newCode) => {
            const newWindows = [...windows];
            newWindows[index].code = newCode;
            setWindows(newWindows);
            localStorage.setItem('windows', JSON.stringify(newWindows));
          }}
          isActive={activeWindow === index}
          key={index}
          direction={direction}
        />
      ))}

    </>
  )
}
