import { myTheme } from "@/app/page";
import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";

// Función para convertir objetos en cadenas legibles
const formatObject = (obj: any, indent = 2): string => {
  if (typeof obj === 'string') {
    return `'${obj}'`;
  }

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const entries = Object.entries(obj).map(([key, value]) => {
      const formattedValue = typeof value === 'object' ? formatObject(value, indent + 2) : `'${value}'`;
      return `${key.includes('-') ? `'${key}'` : key}: ${formattedValue}`;
    });
    return `{\n${' '.repeat(indent)}${entries.join(`,\n${' '.repeat(indent)}`)}\n${' '.repeat(indent - 2)}}`;
  }

  if (Array.isArray(obj)) {
    const entries = obj.map((item) => formatObject(item, indent + 2));
    return `[${entries.join(', ')}]`;
  }

  return String(obj);
};

export default function ConsoleViewCodemirror({ consoleMessages }: { consoleMessages: any[] }) {
  const calculateSpaces = () => {
    const spacesArray = [];
    const Arraydiff = [];
    let totalLines = 0;

    for (let i = 0; i < consoleMessages.length; i++) {
      const line = consoleMessages[i].line;
      if (line !== undefined) {
        spacesArray.push(line);
      }
    }

    for (let i = 0; i < spacesArray.length; i++) {
      const space = spacesArray[i];
      const nextSpace = spacesArray[i + 1];

      if (nextSpace === undefined) break;
      let diff = nextSpace - space - 1;

      if (diff < 15) diff = 0;
      if (diff > 20) diff = 21;

      totalLines += diff;
      Arraydiff.push(diff);
    }

    if (spacesArray.length > 0) {
      Arraydiff.unshift(spacesArray[0] - 1);
    }

    return { totalLines, Arraydiff };
  };

  const { Arraydiff } = calculateSpaces();

  // Combinar todos los mensajes en una sola cadena formateada con espacios
  const formattedMessages = consoleMessages.map((msg, index) => {
    const formattedPayload = formatObject(msg.payload);

    // Añadir saltos de línea según el valor de Arraydiff
    const spaces = Arraydiff[index] !== 0 ? '\n'.repeat(Arraydiff[index]) : '';
    return spaces + formattedPayload;
  }).join('\n');

  return (
    <ReactCodeMirror
      value={formattedMessages}
      extensions={[
        javascript({ jsx: false, typescript: true }),
        EditorView.lineWrapping,
      ]}
      editable={false}
      theme={myTheme}
      autoFocus
      basicSetup={{
        autocompletion: false,
        indentOnInput: true,
        highlightActiveLineGutter: false,
        foldGutter: false
      }}
    />
  );
}
