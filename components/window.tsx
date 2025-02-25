import { cn } from "@/lib/utils";
import { ChevronRight, X } from "lucide-react";

interface Window {
  name: string;
  onClick: () => void;
  onClose: () => void;
  isActive: boolean;
  index: number;
}

export default function Window({ name, onClick, isActive, onClose, index }: Window) {
  let sliceName = name.trim().slice(0, 30)

  return (
    <li
      onClick={onClick}
      title={`Alt + ${index + 1}`}
      className={cn(
        'min-w-[188px] max-w-[188px] w-[188px] cursor-pointer border-r border-border h-full flex items-center justify-between text-[11px] px-1 text-center align-middle z-50 pt-1 relative',
        isActive && 'bg-background'
      )}
      style={{ fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif` }}
    >
      <div className="flex items-center overflow-hidden">
        <ChevronRight size={12} strokeWidth={3} className="mb-[1px]" />
        <span className="max-w-[30ch] truncate" title={sliceName}>{sliceName}</span>
      </div>

      <button
        className="aspect-square hover:bg-accent p-1 rounded"
        title="Cerrar | Alt + W"
        onClick={(e) => { e.stopPropagation(); onClose() }}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </li>
  )
}
