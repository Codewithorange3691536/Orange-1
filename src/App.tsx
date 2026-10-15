import React, { useEffect } from 'react';
import { EditorProvider, useEditor } from './context/EditorContext';
import { Header } from './components/Header';
import { ArtlistNav } from './components/ArtlistNav';
import { BottomPageSwitcher } from './components/BottomPageSwitcher';
import { MediaPage } from './components/pages/MediaPage';
import { EditPage } from './components/pages/EditPage';
import { FusionPage } from './components/pages/FusionPage';
import { ColourPage } from './components/pages/ColourPage';
import { FairlightPage } from './components/pages/FairlightPage';
import { DeliveryPage } from './components/pages/DeliveryPage';
import { AiLabPage } from './components/pages/AiLabPage';
import { ProjectLibraryPage } from './components/pages/ProjectLibraryPage';
import { QuickExportModal } from './components/Modals/QuickExportModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { ToastContainer } from './components/ToastContainer';

const EditorLayout: React.FC = () => {
  const {
    activePage,
    setActivePage,
    returnToProjectManager,
    togglePlayPause,
    splitClipAtPlayhead,
    deleteSelectedClip,
    setSelectedTool,
    setIsShortcutsModalOpen,
    seekTo,
    currentTime
  } = useEditor();

  // Keyboard shortcut listener for studio editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'b' || e.key === 'B') {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          splitClipAtPlayhead();
        } else {
          setSelectedTool('blade');
        }
      } else if (e.key === 'a' || e.key === 'A') {
        setSelectedTool('select');
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedClip();
      } else if (e.key === 'j' || e.key === 'J') {
        seekTo(Math.max(0, currentTime - 1.5));
      } else if (e.key === 'k' || e.key === 'K') {
        togglePlayPause();
      } else if (e.key === 'l' || e.key === 'L') {
        seekTo(currentTime + 1.5);
      } else if (e.key === '?' || (e.key === '/' && (e.metaKey || e.ctrlKey))) {
        setIsShortcutsModalOpen(true);
      } else if (e.shiftKey) {
        if (e.key === '1') returnToProjectManager();
        if (e.key === '2') setActivePage('media');
        if (e.key === '4') setActivePage('edit');
        if (e.key === '5') setActivePage('fusion');
        if (e.key === '6') setActivePage('colour');
        if (e.key === '7') setActivePage('fairlight');
        if (e.key === '8') setActivePage('delivery');
        if (e.key === '9') setActivePage('ai');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, splitClipAtPlayhead, deleteSelectedClip, setSelectedTool, setIsShortcutsModalOpen, seekTo, currentTime, setActivePage, returnToProjectManager]);

  // If on Project Library page, render full Studio Project Manager view
  if (activePage === 'project-manager') {
    return (
      <div className="h-screen w-screen flex flex-col bg-[#0f1013] text-gray-100 overflow-hidden font-sans select-none antialiased">
        <ProjectLibraryPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f1013] text-gray-100 font-sans select-none antialiased">
      {/* Artlist AI Inspired Top Navigation & Dropdowns */}
      <ArtlistNav />
      {/* Top Studio Header */}
      <Header />

      {/* Main Studio Viewport (Dynamically switches active workflow page) */}
      <main className="flex-1 flex overflow-hidden relative">
        {activePage === 'media' && <MediaPage />}
        {activePage === 'edit' && <EditPage />}
        {activePage === 'fusion' && <FusionPage />}
        {activePage === 'colour' && <ColourPage />}
        {activePage === 'fairlight' && <FairlightPage />}
        {activePage === 'delivery' && <DeliveryPage />}
        {activePage === 'ai' && <AiLabPage />}
      </main>

      {/* Iconic Bottom Studio Workflow Page Switcher */}
      <BottomPageSwitcher />

      {/* Modals & Feedback Notifications */}
      <QuickExportModal />
      <ShortcutsModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}

export default App;
