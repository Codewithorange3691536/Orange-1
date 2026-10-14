import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderPlus,
  Plus,
  HardDrive,
  Cloud,
  Server,
  Search,
  Grid,
  List,
  Sliders,
  Play,
  Copy,
  Edit2,
  Trash2,
  Download,
  Upload,
  Settings,
  ChevronRight,
  Database,
  Film,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  RotateCcw,
  Scissors,
  Network,
  Palette,
  Rocket
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { ProjectItem, StudioPage } from '../../types/editor';

export const ProjectLibraryPage: React.FC = () => {
  const {
    projects,
    projectLibraries,
    activeLibraryId,
    setActiveLibraryId,
    openProject,
    createProject,
    addProjectLibrary,
    resetProjectLibrariesToDefault,
    deleteProject,
    duplicateProject,
    renameProject,
    exportProjectFile,
    importProjectFile,
    currentProject,
    showToast
  } = useEditor();

  // If any library in memory or stale storage contains Blackmagic or old paths, auto-reset to clean Studio defaults
  useEffect(() => {
    const hasStaleBranding = projectLibraries.some(
      (lib) =>
        /blackmagic/i.test(lib.name) ||
        /blackmagic/i.test(lib.path) ||
        /davinci/i.test(lib.path) ||
        /resolve/i.test(lib.path)
    );
    if (hasStaleBranding) {
      resetProjectLibrariesToDefault();
    }
  }, [projectLibraries, resetProjectLibrariesToDefault]);

  // Local UI state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-untitled');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [thumbnailSize, setThumbnailSize] = useState<number>(240); // px width
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'local' | 'network' | 'cloud'>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'modified' | 'name' | 'resolution' | 'fps'>('modified');

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewLibraryModalOpen, setIsNewLibraryModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; projectId: string } | null>(null);

  // Form states
  const [newProjectName, setNewProjectName] = useState('Untitled Project');
  const [newProjectResolution, setNewProjectResolution] = useState('3840 x 2160 UHD');
  const [newProjectFps, setNewProjectFps] = useState(24);
  const [newProjectColorScience, setNewProjectColorScience] = useState('Studio YRGB Color Managed');

  const [newLibName, setNewLibName] = useState('');
  const [newLibType, setNewLibType] = useState<'local' | 'network' | 'cloud'>('local');
  const [newLibPath, setNewLibPath] = useState('/Volumes/Studio_RAID_01/Studio_Projects');
  const [targetStudioPage, setTargetStudioPage] = useState<StudioPage>('media');
  const [autoOpenWorkspace, setAutoOpenWorkspace] = useState(true);

  const handleLibTypeChange = (type: 'local' | 'network' | 'cloud') => {
    setNewLibType(type);
    if (type === 'local') {
      setNewLibPath('/Volumes/Studio_RAID_01/Studio_Projects');
    } else if (type === 'network') {
      setNewLibPath('postgresql://studio:admin@192.168.1.50:5432/studio_db');
    } else {
      setNewLibPath('https://cloud.greatediting.studio/workspace');
    }
  };

  const [renameTargetId, setRenameTargetId] = useState<string>('');
  const [renameTargetValue, setRenameTargetValue] = useState<string>('');
  const [folders, setFolders] = useState<string[]>(['Commercials & Ads', 'Feature Films', 'Short Form & Reels']);
  const [newFolderName, setNewFolderName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active selected project object
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Filter projects by active library, folder, search query and library type tab
  const filteredProjects = projects
    .filter((project) => {
      // Library match
      if (activeLibraryId && project.libraryId !== activeLibraryId) {
        if (selectedTab !== 'all') {
          const lib = projectLibraries.find((l) => l.id === project.libraryId);
          if (lib && (lib.type as string) !== selectedTab) return false;
        }
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          project.name.toLowerCase().includes(q) ||
          project.resolution.toLowerCase().includes(q) ||
          (project.notes && project.notes.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'resolution') return a.resolution.localeCompare(b.resolution);
      if (sortBy === 'fps') return b.fps - a.fps;
      // Default modified date
      return 0;
    });

  // Handle right click on project card
  const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    setSelectedProjectId(projectId);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      projectId
    });
  };

  // Close context menu on outside click
  const handleContainerClick = () => {
    if (contextMenu) setContextMenu(null);
  };

  // Handle Import Project (.drp file or JSON)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.project) {
          importProjectFile(parsed.project);
        } else {
          importProjectFile(parsed);
        }
      } catch {
        // Fallback: create project with file name
        importProjectFile({
          name: file.name.replace(/\.[^/.]+$/, ''),
          resolution: '3840 x 2160 UHD',
          fps: 24
        });
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const currentLibrary = projectLibraries.find((l) => l.id === activeLibraryId) || projectLibraries[0];

  return (
    <div
      onClick={handleContainerClick}
      className="flex-1 flex flex-col h-full bg-[#131519] text-gray-200 select-none overflow-hidden relative font-sans"
    >
      {/* Studio Window Title Bar */}
      <div className="h-11 bg-[#17191f] border-b border-[#252831] flex items-center justify-between px-3 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Window Buttons */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ec6a5e] border border-[#d04e43] inline-block shadow-inner" />
            <span className="w-3 h-3 rounded-full bg-[#f4be4f] border border-[#d89e36] inline-block shadow-inner" />
            <span className="w-3 h-3 rounded-full bg-[#62c554] border border-[#48a83a] inline-block shadow-inner" />
          </div>

          {/* Title & Branding */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500">
              <Film className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-200 tracking-wide text-xs">
              Project Manager — Great Editing Studio
            </span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded">
              v19.0 Studio • Zero Login
            </span>
          </div>
        </div>

        {/* Center: Search & Filter Toolbar */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0e11] border border-[#2c303c] rounded pl-8 pr-7 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0d0e11] border border-[#2c303c] rounded px-2 py-1 text-xs">
            <span className="text-[10px] text-gray-500 uppercase font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-300 focus:outline-none cursor-pointer text-xs"
            >
              <option value="modified" className="bg-[#17191f]">Date Modified</option>
              <option value="name" className="bg-[#17191f]">Name (A-Z)</option>
              <option value="resolution" className="bg-[#17191f]">Resolution</option>
              <option value="fps" className="bg-[#17191f]">Frame Rate</option>
            </select>
          </div>
        </div>

        {/* Right Controls: View Switcher & Sliders */}
        <div className="flex items-center gap-2">
          {/* Thumbnail Size Zoom Slider */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0d0e11] border border-[#2c303c] rounded px-2 py-1">
            <span className="text-[10px] text-gray-400 font-mono">Size</span>
            <input
              type="range"
              min="160"
              max="360"
              value={thumbnailSize}
              onChange={(e) => setThumbnailSize(Number(e.target.value))}
              className="w-20 accent-indigo-500 h-1 bg-[#23262e] rounded cursor-pointer"
              title="Zoom Project Thumbnails"
            />
          </div>

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-[#0d0e11] border border-[#2c303c] rounded p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-[#282c38] text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Thumbnail Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'list' ? 'bg-[#282c38] text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Detail List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Sidebar */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className={`px-2 py-1 rounded border text-xs flex items-center gap-1.5 transition-colors ${
              isSidebarOpen
                ? 'bg-[#232733] border-indigo-500/50 text-indigo-300'
                : 'bg-[#0d0e11] border-[#2c303c] text-gray-400 hover:text-gray-200'
            }`}
            title="Toggle Project Libraries Sidebar"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Libraries</span>
          </button>

          {/* Toggle Inspector */}
          <button
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            className={`p-1.5 rounded border text-xs flex items-center justify-center transition-colors ${
              isInspectorOpen
                ? 'bg-[#232733] border-indigo-500/50 text-indigo-300'
                : 'bg-[#0d0e11] border-[#2c303c] text-gray-400 hover:text-gray-200'
            }`}
            title="Toggle Project Details Inspector"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Project Libraries & Databases */}
        {isSidebarOpen && (
          <aside className="w-64 bg-[#14161c] border-r border-[#242732] flex flex-col shrink-0">
            {/* Header with Add Library Button */}
            <div className="p-3 border-b border-[#242732] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-xs tracking-wide text-gray-200 uppercase">
                  Project Libraries
                </span>
              </div>
              <button
                onClick={() => setIsNewLibraryModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium shadow-sm transition-colors"
                title="Add or Connect Project Library"
              >
                <Plus className="w-3 h-3" />
                <span>Add Library</span>
              </button>
            </div>

            {/* Library Type Tabs: All, Local, Network, Cloud */}
            <div className="grid grid-cols-4 border-b border-[#242732] bg-[#0e1014] p-1 text-[11px]">
              {(['all', 'local', 'network', 'cloud'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-1 rounded capitalize font-medium transition-colors ${
                    selectedTab === tab
                      ? 'bg-[#222634] text-white shadow-xs'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List of Libraries */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-gray-500 font-semibold tracking-wider">
                Connected Databases
              </div>
              {projectLibraries
                .filter((lib) => selectedTab === 'all' || lib.type === selectedTab)
                .map((lib) => {
                  const isActive = activeLibraryId === lib.id;
                  const Icon = lib.type === 'cloud' ? Cloud : lib.type === 'network' ? Server : HardDrive;

                  // Defensive runtime sanitization
                  const displayName = (lib.name || '')
                    .replace(/Blackmagic\s+Cloud\s+Team/gi, 'Studio Cloud Workspace')
                    .replace(/Blackmagic\s+Cloud/gi, 'Studio Cloud')
                    .replace(/Blackmagic/gi, 'Studio')
                    .replace(/DaVinci\s+Resolve\s+Studio/gi, 'Great Editing Studio')
                    .replace(/DaVinci\s+Resolve/gi, 'Great Editing')
                    .replace(/DaVinci/gi, 'Studio');

                  const displayPath = (lib.path || '')
                    .replace(/cloud\.blackmagicdesign\.com\/team-studio/gi, 'cloud.greatediting.studio/team-workspace')
                    .replace(/cloud\.blackmagicdesign\.com/gi, 'cloud.greatediting.studio')
                    .replace(/blackmagicdesign\.com/gi, 'greatediting.studio')
                    .replace(/blackmagic/gi, 'greatediting')
                    .replace(/\/Users\/Studio\/Library\/DaVinci Resolve\/Resolve Project Library/gi, '/Users/Studio/Library/Great Editing/Project Library')
                    .replace(/\/Volumes\/Studio_RAID_01\/Resolve_DB/gi, '/Volumes/Studio_RAID_01/Studio_Projects')
                    .replace(/DaVinci\s+Resolve/gi, 'Great Editing')
                    .replace(/Resolve_DB/gi, 'Studio_Projects');

                  return (
                    <div
                      key={lib.id}
                      onClick={() => setActiveLibraryId(lib.id)}
                      className={`group p-2.5 rounded-md cursor-pointer border transition-all ${
                        isActive
                          ? 'bg-[#1e2330] border-indigo-500/80 text-white shadow-sm'
                          : 'bg-[#181a22] border-transparent hover:border-[#2f3442] hover:bg-[#1d202a] text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`w-4 h-4 ${
                              lib.type === 'cloud'
                                ? 'text-sky-400'
                                : lib.type === 'network'
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                            }`}
                          />
                          <span className="font-semibold text-xs tracking-tight">{displayName}</span>
                        </div>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" title="Active Library" />
                        )}
                      </div>

                      <div className="text-[10px] text-gray-400 font-mono truncate" title={displayPath}>
                        {displayPath}
                      </div>

                      <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                        <span className="capitalize">{lib.type} Disk</span>
                        <span className="text-gray-400 font-mono">{lib.size}</span>
                      </div>
                    </div>
                  );
                })}

              {/* Folders Section */}
              <div className="pt-3">
                <div className="px-2 py-1 flex items-center justify-between text-[10px] uppercase font-mono text-gray-500 font-semibold tracking-wider">
                  <span>Folders</span>
                  <button
                    onClick={() => setIsNewFolderModalOpen(true)}
                    className="hover:text-gray-300 p-0.5"
                    title="Create New Folder"
                  >
                    <FolderPlus className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-0.5">
                  <div
                    onClick={() => setSelectedFolder('all')}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs ${
                      selectedFolder === 'all'
                        ? 'bg-[#222634] text-white font-medium'
                        : 'text-gray-400 hover:bg-[#191b22] hover:text-gray-200'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-400" />
                    <span>All Projects</span>
                  </div>
                  {folders.map((folder) => (
                    <div
                      key={folder}
                      onClick={() => setSelectedFolder(folder)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs ${
                        selectedFolder === folder
                          ? 'bg-[#222634] text-white font-medium'
                          : 'text-gray-400 hover:bg-[#191b22] hover:text-gray-200'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-blue-400" />
                      <span className="truncate">{folder}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Footer: Library Info & Optimization */}
            <div className="p-2.5 bg-[#0e1014] border-t border-[#242732] text-[11px] text-gray-400">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-gray-300">Database Status</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px]">
                  <ShieldCheck className="w-3 h-3" /> Connected
                </span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono truncate mb-2">
                Studio Schema v19.0.4 • SQLite / PostgreSQL
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => showToast('Database optimized and re-indexed.')}
                  className="flex-1 py-1 px-1.5 bg-[#1a1c24] hover:bg-[#232733] border border-[#2d313e] rounded text-[10px] text-gray-300 transition-colors"
                >
                  Optimize
                </button>
                <button
                  onClick={() => showToast('Database backup archive created.')}
                  className="flex-1 py-1 px-1.5 bg-[#1a1c24] hover:bg-[#232733] border border-[#2d313e] rounded text-[10px] text-gray-300 transition-colors"
                >
                  Backup
                </button>
                <button
                  onClick={resetProjectLibrariesToDefault}
                  title="Reset to Studio Cloud Workspace"
                  className="py-1 px-2 bg-[#1a1c24] hover:bg-[#232733] border border-[#2d313e] rounded text-[10px] text-gray-400 hover:text-sky-300 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Reset
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Center Main Stage: Projects Grid / List */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#101217]">
          {/* Subheader status bar */}
          <div className="px-4 py-2 bg-[#14161c] border-b border-[#20232c] flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-gray-300 font-semibold">
                {(currentLibrary?.name || '')
                  .replace(/Blackmagic\s+Cloud\s+Team/gi, 'Studio Cloud Workspace')
                  .replace(/Blackmagic/gi, 'Studio')
                  .replace(/DaVinci/gi, 'Studio') || 'Local Database'}
              </span>
              <span>/</span>
              <span className="text-gray-400">
                {selectedFolder === 'all' ? 'All Projects' : selectedFolder}
              </span>
              <span className="text-[10px] bg-[#222530] text-gray-300 px-1.5 py-0.2 rounded font-mono">
                {filteredProjects.length} Projects
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-gray-400">Double-click any project to open instantly</span>
            </div>
          </div>

          {/* Project View Area */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {viewMode === 'grid' ? (
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))`
                }}
              >
                {/* Quick Untitled Blank Project Tile */}
                <div
                  onClick={() => setSelectedProjectId('proj-untitled')}
                  onDoubleClick={() => openProject('proj-untitled')}
                  onContextMenu={(e) => handleContextMenu(e, 'proj-untitled')}
                  className={`group relative flex flex-col bg-[#161820] rounded-lg overflow-hidden border cursor-pointer transition-all duration-150 ${
                    selectedProjectId === 'proj-untitled'
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg scale-[1.02]'
                      : 'border-[#262935] hover:border-[#3d4253] hover:bg-[#1a1c26]'
                  }`}
                >
                  <div className="aspect-video w-full bg-[#0a0b0e] relative flex items-center justify-center overflow-hidden border-b border-[#242732]">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-indigo-400 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[#1b1e28] flex items-center justify-center border border-[#2b3040] group-hover:border-indigo-500">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold">Blank Project</span>
                    </div>
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-emerald-400">
                      Empty Canvas
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="font-semibold text-xs text-gray-200 group-hover:text-white truncate">
                      Untitled Project
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400 font-mono">
                      <span>3840 x 2160 UHD</span>
                      <span>24 fps</span>
                    </div>
                  </div>
                </div>

                {/* Filtered Project Cards */}
                {filteredProjects
                  .filter((p) => p.id !== 'proj-untitled')
                  .map((project) => {
                    const isSelected = selectedProjectId === project.id;

                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                        onDoubleClick={() => openProject(project.id)}
                        onContextMenu={(e) => handleContextMenu(e, project.id)}
                        className={`group relative flex flex-col bg-[#161820] rounded-lg overflow-hidden border cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg scale-[1.02]'
                            : 'border-[#262935] hover:border-[#3d4253] hover:bg-[#1a1c26]'
                        }`}
                      >
                        {/* Thumbnail with overlay badges */}
                        <div className="aspect-video w-full bg-[#0d0e12] relative overflow-hidden border-b border-[#242732]">
                          <img
                            src={project.thumbnail}
                            alt={project.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Dark gradient shadow */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                          {/* Hover Play Icon */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                            <div className="w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] font-mono text-gray-200 border border-white/10">
                              {project.resolution}
                            </span>
                            {project.colorManaged && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-[9px] font-mono text-purple-300">
                                YRGB
                              </span>
                            )}
                          </div>

                          {/* Bottom Badges */}
                          <div className="absolute bottom-1.5 right-2 flex items-center gap-1.5 text-[10px] font-mono text-gray-300 bg-black/70 px-1.5 py-0.2 rounded">
                            <Clock className="w-2.5 h-2.5 text-gray-400" />
                            <span>
                              {project.duration > 0
                                ? `00:00:${Math.floor(project.duration).toString().padStart(2, '0')}:00`
                                : '00:00:00:00'}
                            </span>
                          </div>
                        </div>

                        {/* Project Info Footer */}
                        <div className="p-2.5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="font-semibold text-xs text-gray-100 group-hover:text-white truncate">
                              {project.name}
                            </div>
                            {project.notes && (
                              <div className="text-[10px] text-gray-400 truncate mt-0.5">
                                {project.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#222530] text-[10px] text-gray-400 font-mono">
                            <span>{project.fps} fps</span>
                            <span>{project.modifiedAt}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              /* List View Table */
              <div className="w-full bg-[#161820] border border-[#262935] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12141a] text-gray-400 text-[11px] font-mono border-b border-[#262935] select-none">
                    <tr>
                      <th className="py-2.5 px-3">Project Name</th>
                      <th className="py-2.5 px-3">Format & Resolution</th>
                      <th className="py-2.5 px-3">FPS</th>
                      <th className="py-2.5 px-3">Clips / Tracks</th>
                      <th className="py-2.5 px-3">Date Modified</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232632]">
                    {filteredProjects.map((project) => {
                      const isSelected = selectedProjectId === project.id;
                      return (
                        <tr
                          key={project.id}
                          onClick={() => setSelectedProjectId(project.id)}
                          onDoubleClick={() => openProject(project.id)}
                          onContextMenu={(e) => handleContextMenu(e, project.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#1e2332] text-white'
                              : 'hover:bg-[#1a1d26] text-gray-300'
                          }`}
                        >
                          <td className="py-2 px-3 flex items-center gap-2.5">
                            <img
                              src={project.thumbnail}
                              alt={project.name}
                              className="w-10 h-6 object-cover rounded bg-black shrink-0 border border-[#2b3040]"
                            />
                            <div>
                              <div className="font-semibold text-xs">{project.name}</div>
                              <div className="text-[10px] text-gray-400">{project.notes || 'Studio Project'}</div>
                            </div>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-gray-300">
                            {project.resolution}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-gray-300">
                            {project.fps} fps
                          </td>
                          <td className="py-2 px-3 text-[11px] text-gray-400">
                            {project.clipsCount} clips • {project.tracksCount} tracks
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-gray-400">
                            {project.modifiedAt}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openProject(project.id);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium"
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Right Inspector Panel */}
        {isInspectorOpen && selectedProject && (
          <aside className="w-72 bg-[#14161c] border-l border-[#242732] flex flex-col shrink-0 p-3 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-2 border-b border-[#242732] mb-3">
              <span className="font-semibold text-xs uppercase tracking-wide text-gray-300">
                Project Inspector
              </span>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="aspect-video w-full rounded-md overflow-hidden bg-black border border-[#2c303c] mb-3 relative">
              <img
                src={selectedProject.thumbnail}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1.5 px-1 bg-black/80 rounded text-[9px] font-mono text-emerald-400">
                {selectedProject.resolution}
              </div>
            </div>

            <h3 className="font-bold text-sm text-white mb-1">{selectedProject.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{selectedProject.notes || 'No description added'}</p>

            {/* Technical Specifications */}
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-[#1b1d25] rounded border border-[#272b38]">
                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">
                  Timeline Master Settings
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className="text-gray-400">Resolution:</span>
                  <span className="text-gray-200 font-mono text-right">{selectedProject.resolution}</span>
                  <span className="text-gray-400">Framerate:</span>
                  <span className="text-gray-200 font-mono text-right">{selectedProject.fps} fps</span>
                  <span className="text-gray-400">Color Science:</span>
                  <span className="text-gray-200 text-right">Studio YRGB</span>
                  <span className="text-gray-400">Audio Sample:</span>
                  <span className="text-gray-200 text-right">48.0 kHz 24-bit</span>
                </div>
              </div>

              <div className="p-2 bg-[#1b1d25] rounded border border-[#272b38]">
                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">
                  Metadata & Storage
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-200 text-right">{selectedProject.createdAt}</span>
                  <span className="text-gray-400">Modified:</span>
                  <span className="text-gray-200 text-right">{selectedProject.modifiedAt}</span>
                  <span className="text-gray-400">Clips Count:</span>
                  <span className="text-gray-200 font-mono text-right">{selectedProject.clipsCount}</span>
                  <span className="text-gray-400">Tracks Count:</span>
                  <span className="text-gray-200 font-mono text-right">{selectedProject.tracksCount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons in Inspector */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => openProject(selectedProject.id)}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open in Studio Editor</span>
              </button>
              <button
                onClick={() => exportProjectFile(selectedProject.id)}
                className="w-full py-1.5 bg-[#1e212b] hover:bg-[#272b38] border border-[#2c3140] text-gray-300 rounded text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Project Archive (.drp)</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Action Bar */}
      <footer className="h-14 bg-[#14161c] border-t border-[#252831] px-4 flex items-center justify-between z-20 shadow-xl">
        {/* Left Side: Export, Import, Delete, Settings */}
        <div className="flex items-center gap-2">
          {/* Export Project Archive */}
          <button
            onClick={() => exportProjectFile(selectedProjectId)}
            disabled={!selectedProject}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e212b] hover:bg-[#282c38] disabled:opacity-40 text-gray-300 border border-[#2e3342] rounded text-xs font-medium transition-colors"
            title="Export Project Archive (.drp / JSON)"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Project...</span>
          </button>

          {/* Import Project Archive */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e212b] hover:bg-[#282c38] text-gray-300 border border-[#2e3342] rounded text-xs font-medium transition-colors"
            title="Import Project (.drp / JSON)"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import Project...</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".drp,.json"
            className="hidden"
          />

          {/* Delete Project */}
          <button
            onClick={() => {
              if (selectedProject) {
                if (window.confirm(`Are you sure you want to delete '${selectedProject.name}'?`)) {
                  deleteProject(selectedProject.id);
                }
              }
            }}
            disabled={!selectedProject || selectedProject.id === 'proj-untitled'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e212b] hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-700/60 disabled:opacity-40 text-gray-300 border border-[#2e3342] rounded text-xs font-medium transition-colors"
            title="Delete Selected Project"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          {/* Project Settings Gear */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 bg-[#1e212b] hover:bg-[#282c38] text-gray-300 border border-[#2e3342] rounded transition-colors"
            title="Master Project Settings"
          >
            <Settings className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Right Side: New Folder, New Project, Open Primary Button */}
        <div className="flex items-center gap-2">
          {/* New Folder */}
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e212b] hover:bg-[#282c38] text-gray-300 border border-[#2e3342] rounded text-xs font-medium transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">New Folder</span>
          </button>

          {/* New Project */}
          <button
            onClick={() => {
              setNewProjectName('Untitled Project');
              setIsNewProjectModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252a38] hover:bg-[#303647] text-white border border-[#394054] rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Project</span>
          </button>

          {/* Open Primary Button */}
          <button
            onClick={() => openProject(selectedProjectId)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-md shadow-lg shadow-indigo-950/50 hover:shadow-indigo-700/30 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open</span>
          </button>
        </div>
      </footer>

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-48 bg-[#181a24] border border-[#2d3142] rounded shadow-2xl py-1 text-xs text-gray-200 select-none animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            onClick={() => {
              openProject(contextMenu.projectId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Open Project</span>
          </button>
          <button
            onClick={() => {
              duplicateProject(contextMenu.projectId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate Project</span>
          </button>
          <button
            onClick={() => {
              const target = projects.find((p) => p.id === contextMenu.projectId);
              if (target) {
                setRenameTargetId(target.id);
                setRenameTargetValue(target.name);
                setIsRenameModalOpen(true);
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Rename Project...</span>
          </button>
          <button
            onClick={() => {
              exportProjectFile(contextMenu.projectId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Project (.drp)</span>
          </button>
          <div className="h-px bg-[#2d3142] my-1" />
          <button
            onClick={() => {
              deleteProject(contextMenu.projectId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white text-rose-400 flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Project</span>
          </button>
        </div>
      )}

      {/* MODAL: New Project */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#161820] border border-[#2d3142] rounded-lg shadow-2xl p-5 select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a38] mb-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Create New Project</h3>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Master_Commercial_4K"
                  className="w-full bg-[#0d0e12] border border-[#2e3342] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Timeline Resolution</label>
                <select
                  value={newProjectResolution}
                  onChange={(e) => setNewProjectResolution(e.target.value)}
                  className="w-full bg-[#0d0e12] border border-[#2e3342] rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="3840 x 2160 UHD">3840 x 2160 Ultra HD (4K Standard)</option>
                  <option value="1920 x 1080 FHD">1920 x 1080 Full HD (1080p Standard)</option>
                  <option value="4096 x 2160 DCI 4K">4096 x 2160 DCI 4K Cinema Scope</option>
                  <option value="1080 x 1920 Vertical">1080 x 1920 Vertical (TikTok / Reels 9:16)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Timeline Frame Rate</label>
                  <select
                    value={newProjectFps}
                    onChange={(e) => setNewProjectFps(Number(e.target.value))}
                    className="w-full bg-[#0d0e12] border border-[#2e3342] rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={24}>24.00 fps (Cinema)</option>
                    <option value={23.976}>23.976 fps (NTSC Cinema)</option>
                    <option value={29.97}>29.97 fps (Broadcast)</option>
                    <option value={30}>30.00 fps (Web / Mobile)</option>
                    <option value={60}>60.00 fps (High Motion / Gaming)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Color Science</label>
                  <select
                    value={newProjectColorScience}
                    onChange={(e) => setNewProjectColorScience(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-[#2e3342] rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Studio YRGB Color Managed">Studio YRGB Color Managed</option>
                    <option value="Studio YRGB">Studio YRGB</option>
                    <option value="ACEScc">ACEScc ACES 1.3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-[#262a38]">
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-4 py-1.5 rounded bg-[#20232d] hover:bg-[#282c38] text-gray-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  createProject(newProjectName, newProjectResolution, newProjectFps);
                  setIsNewProjectModalOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
              >
                Create & Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add / Connect Project Library */}
      {isNewLibraryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#161820] border border-[#2d3142] rounded-xl shadow-2xl p-6 select-none animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262a38] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Add Project Library</h3>
                  <p className="text-[11px] text-gray-400">Create or connect a database library & launch studio workspace</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewLibraryModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-[#20232e] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Library Name Input */}
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Library Name <span className="text-gray-500 font-normal">(e.g. Cinema 8K Commercials)</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Cinema 8K Commercial Library"
                  value={newLibName}
                  onChange={(e) => setNewLibName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const libName = newLibName.trim() || `${newLibType === 'cloud' ? 'Studio Cloud' : newLibType === 'network' ? 'Studio Network' : 'Studio Fast RAID'} Library`;
                      addProjectLibrary(libName, newLibType, newLibPath, autoOpenWorkspace, targetStudioPage);
                      setIsNewLibraryModalOpen(false);
                      setNewLibName('');
                    }
                  }}
                  className="w-full bg-[#0d0e12] border border-[#2e3342] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-xs shadow-inner"
                />
              </div>

              {/* Database Location Type */}
              <div>
                <label className="block text-gray-300 font-medium mb-1.5">Database Location Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'local' as const,
                      label: 'Local Disk',
                      sub: 'NVMe / SSD Volume',
                      icon: HardDrive,
                      activeColor: 'border-amber-500 bg-amber-500/10 text-amber-300'
                    },
                    {
                      id: 'network' as const,
                      label: 'Network Host',
                      sub: 'PostgreSQL Server',
                      icon: Server,
                      activeColor: 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    },
                    {
                      id: 'cloud' as const,
                      label: 'Studio Cloud',
                      sub: 'Studio Cloud • Synced',
                      icon: Cloud,
                      activeColor: 'border-sky-500 bg-sky-500/10 text-sky-300'
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = newLibType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleLibTypeChange(item.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? `${item.activeColor} ring-1 ring-white/10 shadow-md font-medium`
                            : 'bg-[#101217] border-[#292d3b] text-gray-400 hover:text-gray-200 hover:border-[#3a3f52]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3.5 h-3.5" />
                          <span className="font-semibold text-xs">{item.label}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono block leading-tight">{item.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File Path / Network Host */}
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  File Path / Network Host URL
                </label>
                <input
                  type="text"
                  value={newLibPath}
                  onChange={(e) => setNewLibPath(e.target.value)}
                  placeholder="/Volumes/Projects/Studio_Projects"
                  className="w-full bg-[#0d0e12] border border-[#2e3342] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>

              {/* Next Page / Workflow Selector */}
              <div className="p-3 bg-[#111319] rounded-lg border border-[#242835]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-200 font-medium text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Next Studio Page to Open:</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono">Instant Transition</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                  {[
                    { id: 'media' as const, label: 'Media', icon: Film, color: 'text-blue-400' },
                    { id: 'edit' as const, label: 'Edit', icon: Scissors, color: 'text-amber-400' },
                    { id: 'fusion' as const, label: 'Fusion', icon: Network, color: 'text-purple-400' },
                    { id: 'colour' as const, label: 'Colour', icon: Palette, color: 'text-emerald-400' },
                    { id: 'fairlight' as const, label: 'Fairlight', icon: Sliders, color: 'text-cyan-400' },
                    { id: 'delivery' as const, label: 'Delivery', icon: Rocket, color: 'text-rose-400' },
                    { id: 'ai' as const, label: 'AI Tools', icon: Sparkles, color: 'text-fuchsia-400' }
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = targetStudioPage === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTargetStudioPage(p.id)}
                        className={`flex flex-col items-center justify-center p-1.5 rounded-md border text-[10px] transition-all ${
                          isSelected
                            ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold shadow-xs'
                            : 'bg-[#161820] border-[#292d3b] text-gray-400 hover:text-gray-200 hover:bg-[#1e212b]'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 mb-1 ${p.color}`} />
                        <span className="truncate">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Full access to Media, Edit, Fusion, Colour, Fairlight, Delivery & AI Tools (MiniMax H3).</span>
                </p>
              </div>

              {/* Instant Auto-Open Toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1 text-gray-300">
                <input
                  type="checkbox"
                  checked={autoOpenWorkspace}
                  onChange={(e) => setAutoOpenWorkspace(e.target.checked)}
                  className="rounded bg-[#0d0e12] border-[#2e3342] text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[11px]">Open Studio Workspace immediately upon clicking Create Library</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-[#262a38]">
              <button
                type="button"
                onClick={() => setIsNewLibraryModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#20232d] hover:bg-[#282c38] text-gray-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const libName = newLibName.trim() || `${newLibType === 'cloud' ? 'Studio Cloud' : newLibType === 'network' ? 'Studio Network' : 'Studio Fast RAID'} Library`;
                  addProjectLibrary(libName, newLibType, newLibPath, true, targetStudioPage);
                  setIsNewLibraryModalOpen(false);
                  setNewLibName('');
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 hover:shadow-indigo-700/40 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Create Library & Open Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Rename Project */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#161820] border border-[#2d3142] rounded-lg shadow-2xl p-5 select-none animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-sm text-white mb-3">Rename Project</h3>
            <input
              type="text"
              autoFocus
              value={renameTargetValue}
              onChange={(e) => setRenameTargetValue(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#2e3342] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="px-3 py-1.5 rounded bg-[#20232d] hover:bg-[#282c38] text-gray-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (renameTargetId && renameTargetValue.trim()) {
                    renameProject(renameTargetId, renameTargetValue.trim());
                    setIsRenameModalOpen(false);
                  }
                }}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: New Folder */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#161820] border border-[#2d3142] rounded-lg shadow-2xl p-5 select-none animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-sm text-white mb-3">Create New Folder</h3>
            <input
              type="text"
              autoFocus
              placeholder="e.g. YouTube Series 2026"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-[#0d0e12] border border-[#2e3342] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-3 py-1.5 rounded bg-[#20232d] hover:bg-[#282c38] text-gray-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    setFolders((prev) => [...prev, newFolderName.trim()]);
                    setIsNewFolderModalOpen(false);
                    setNewFolderName('');
                    showToast(`Folder '${newFolderName}' created`);
                  }
                }}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Project Settings */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#161820] border border-[#2d3142] rounded-lg shadow-2xl p-5 select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a38] mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Master Project Settings</h3>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#101217] rounded border border-[#242732]">
                <h4 className="font-semibold text-gray-200 mb-2">Master Settings</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">Timeline Resolution</label>
                    <span className="font-mono text-gray-200">{selectedProject?.resolution || '3840 x 2160 UHD'}</span>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Timeline Frame Rate</label>
                    <span className="font-mono text-gray-200">{selectedProject?.fps || 24} fps</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#101217] rounded border border-[#242732]">
                <h4 className="font-semibold text-gray-200 mb-2">Color Management</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Color Science:</span>
                    <span className="text-gray-200">Studio YRGB Color Managed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Color Processing Mode:</span>
                    <span className="text-gray-200">HDR Wide Gamut Intermediate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Output Color Space:</span>
                    <span className="text-gray-200">Rec.709 Gamma 2.4</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#101217] rounded border border-[#242732]">
                <h4 className="font-semibold text-gray-200 mb-2">Fairlight Audio Processing</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Audio Sample Rate:</span>
                  <span className="text-gray-200 font-mono">48.000 kHz (Studio Standard)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-[#262a38]">
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-1.5 rounded bg-[#20232d] hover:bg-[#282c38] text-gray-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Project settings applied.');
                  setIsSettingsModalOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
