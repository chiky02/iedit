'use client';

import { useEffect, useRef } from 'react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function isValidImageUrl(url: string) {
  return /^(https?:\/\/).+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

export function WysiwygEditor({ value, onChange }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  async function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const items = Array.from(event.clipboardData.items || []);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (imageItem) {
      event.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          document.execCommand('insertImage', false, dataUrl);
          editorRef.current?.focus();
          onChange(editorRef.current?.innerHTML || '');
        };
        reader.readAsDataURL(file);
      }
    }
  }

  function applyCommand(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || '');
  }

  function insertTable() {
    const rows = Number(window.prompt('Número de filas', '2')) || 2;
    const cols = Number(window.prompt('Número de columnas', '2')) || 2;
    const table = ['<table class="min-w-full border-collapse text-sm">'];
    for (let row = 0; row < rows; row += 1) {
      table.push('<tr>');
      for (let col = 0; col < cols; col += 1) {
        table.push('<td style="border:1px solid #d1d5db;padding:0.75rem;">Celda</td>');
      }
      table.push('</tr>');
    }
    table.push('</table>');
    document.execCommand('insertHTML', false, table.join(''));
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || '');
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-2">
        <button
          type="button"
          onClick={() => applyCommand('bold')}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Negrita
        </button>
        <button
          type="button"
          onClick={() => applyCommand('italic')}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Cursiva
        </button>
        <button
          type="button"
          onClick={() => applyCommand('formatBlock', 'H2')}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Título
        </button>
        <button
          type="button"
          onClick={() => applyCommand('insertUnorderedList')}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Lista
        </button>
        <button
          type="button"
          onClick={() => applyCommand('insertOrderedList')}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Lista ordenada
        </button>
        <button
          type="button"
          onClick={() => applyCommand('formatBlock', 'BLOCKQUOTE')}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Cita
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Ingresa la URL de la imagen');
            if (url) {
              const imageUrl = url.trim();
              if (isValidImageUrl(imageUrl)) {
                applyCommand('insertImage', imageUrl);
              } else {
                alert('Ingresa una URL de imagen válida (jpg, png, gif, webp, svg).');
              }
            }
          }}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Imagen
        </button>
        <button
          type="button"
          onClick={insertTable}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Tabla
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Ingresa la URL del enlace');
            if (url) applyCommand('createLink', url);
          }}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Enlace
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        onPaste={handlePaste}
        className="min-h-[190px] rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}
