import { javascript } from '@codemirror/lang-javascript';
import ReactCodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { myTheme } from "@/theme/mytheme";

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function Editor({ code, onChange }: EditorProps) {
  return (
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
  )
}
