import { type ClassValue, clsx } from "clsx"
import { js_beautify } from "js-beautify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCode(value: string, options?: js_beautify.JSBeautifyOptions): string {
  const res = js_beautify(value, {
    indent_size: 2,
    wrap_line_length: 80,
    end_with_newline: true,
    space_in_empty_paren: true,
    brace_style: 'preserve-inline',
    ...options
  });
  return res;
}