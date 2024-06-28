import { ChevronRight, X } from "lucide-react";

export default function Window({ name }: { name: string }) {
  return (
    <div className="w-[188px] border-r border-border h-full bg-background flex items-center justify-between text-[11px] px-1 text-center align-middle z-50 pt-1 relative"
      style={{ fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif` }}
    >
      <div className="flex items-center overflow-hidden">
        <ChevronRight size={12} strokeWidth={3} className="mb-[1px]" />
        <span className="max-w-[24ch] truncate" title={name}>{name}</span>
      </div>

      <button className="aspect-square hover:bg-accent p-1 rounded" title="Cerrar">
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  )
}
