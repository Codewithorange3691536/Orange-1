import React from 'react';
import { useEditor } from '../context/EditorContext';
import { Info, Sparkles } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toastMessage } = useEditor();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-16 right-5 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-[#181a24] border border-[#3b4154] text-gray-100 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-medium">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
