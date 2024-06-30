'use client'
import { useEffect, useRef, useState } from "react";

export default function ConsoleView({ code, consoleMessages }: { code: string, consoleMessages: any[] }) {
  const [spaces, setSpaces] = useState<Array<number>>([])
  const [totalLinesWithSpace, setTotalLinesWithSpace] = useState<number>(0)
  const ulRef = useRef<HTMLUListElement>(null);

  // Lineas totales del codigo y respuesta más el espacio de cada respuesta
  const totalLines: any = consoleMessages.reduce((acc, msg) => {
    // Verificar si payload es un string, si no, convertirlo a string.
    const payloadStr = typeof msg.payload === 'string' ? msg.payload : JSON.stringify(msg.payload);
    const result = acc + payloadStr.split('\n').length;
    return result;
  }, 0);

  useEffect(() => {
    const spacesArray = [];
    const Arraydiff = [];
    let totalLines = 0;

    for (let i = 0; i < consoleMessages.length; i++) {
      const line = consoleMessages[i].line;
      line && spacesArray.push(line)
    }


    for (let i = 0; i < spacesArray.length; i++) {
      const space = spacesArray[i];
      const nexSpace = spacesArray[i + 1];

      if (!nexSpace) break;
      let diff = nexSpace - space - 1;

      if (diff < 15) diff = 0;
      if (diff > 20) diff = 21;

      totalLines += diff;
      Arraydiff.push(diff)
    }

    Arraydiff.unshift(spacesArray[0] - 1)
    setTotalLinesWithSpace(totalLines)
    setSpaces(Arraydiff)

  }, [consoleMessages]);

  useEffect(() => {
    const spacesArray = []
    for (let i = 0; i < consoleMessages.length; i++) {
      const line = consoleMessages[i].line;
      line && spacesArray.push(line)
    }
  }, []);

  return (
    <ul id="console-list" className="flex" ref={ulRef}>
      <div className="flex flex-col text-[#78887a] text-right mr-4 select-none">
        {Array.from({ length: (totalLines + totalLinesWithSpace + spaces[0]) || 1 }).fill(0).map((_, index) => (
          <span key={index} className="text-nowrap">{index + 1}</span>
        ))}
      </div>
      <div>

        {consoleMessages.map((msg, index) => (
          <li key={msg.line}>

            {msg.type !== 'error' && (
              <div className="flex gap-4">
                <span className={`text-wrap whitespace-pre-wrap text-green-500`}>
                  {spaces[index] !== 0 && Array.from({ length: spaces[index] }).map((_, idx) => (<>
                    <br key={idx} />
                  </>))}
                  {msg.payload}
                </span>
              </div>
            )}

            {msg.type === 'error' && (
              <div key={msg.payload.line} className="flex flex-col gap-4 text-[#ff6400]">
                <span>{msg.payload.message}</span>
                <div className="flex gap-2">
                  <div className="flex flex-col text-yellow-300 select-none">
                    {Array.of(
                      msg.payload.line,
                      msg.payload.line + 1,
                      msg.payload.line + 2,
                    ).map((item, index) => (
                      <span key={index} className="text-nowrap">
                        {item} |
                      </span>
                    ))}
                  </div>
                  <span className="whitespace-pre-wrap">
                    {code.split('\n').slice(msg.payload.line - 1, msg.payload.line + 2).join('\n')}
                  </span>
                </div>
              </div>
            )}
          </li>
        ))}
      </div>
    </ul>
  )
}
