'use client'

import Navigation from "@/components/navigation";
import RunJS from '@/components/run-js';
import { formatCode } from '@/lib/utils';
import { useCallback, useEffect, useState } from "react";

export default function NavigationAndEditor() {
  const [code, setCode] = useState('');
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  useEffect(() => {
    localStorage.getItem('code') && setCode(localStorage.getItem('code') as string)
  }, [])

  useEffect(() => {
    localStorage.getItem('direction') && setDirection(localStorage.getItem('direction') as 'horizontal' | 'vertical')
  }, [])

  const onChange = useCallback((val: any) => {
    localStorage.setItem('code', val)
    setCode(val);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() == 'f') {
        setCode(formatCode(code));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code])

  return (
    <>
      <Navigation
        window={'Nueva pestaña'}
        direction={direction}
        setDirection={setDirection}
      />

      <RunJS
        code={code}
        direction={direction}
        onChange={onChange}
      />
    </>
  )
}
