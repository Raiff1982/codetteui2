import React, { useState, useEffect, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FileExplorer } from './components/FileExplorer';
import { AdvancedEditor } from './components/AdvancedEditor';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TouchGestures } from './components/TouchGestures';
import { TooltipProvider } from './components/TooltipProvider';
import { CommandPalette } from './components/CommandPalette';
import { AIDrawer } from './components/AIDrawer';
import { StatusToasts } from './components/StatusToasts';
import { SkipLink } from './components/SkipLink';
import { EmptyState } from './components/EmptyState';
import { useTheme } from './hooks/useTheme';
import { useFileSystem } from './hooks/useFileSystem';
import { useFirstTimeUser } from './hooks/useFirstTimeUser';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCommandPalette } from './hooks/useCommandPalette';
import { useToasts } from './hooks/useToasts';
import { useFocusMode } from './hooks/useFocusMode';
import { aiCodeService } from './services/aiCodeService';
import { 
  FileText, 
  Folder, 
  Code, 
  Palette, 
  Terminal as TerminalIcon, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Eye, 
  Settings, 
  Brain, 
  Atom, 
  Shield, 
  Music,
  Zap,
  Activity
} from 'lucide-react';

// Lazy load heavy components
const LazyBeginnerHelp = React.lazy(() => 
  import('./components/BeginnerHelp').then(module => ({ default: module.BeginnerHelp }))
);

const LazyHowToGuide = React.lazy(() => 
  import('./components/HowToGuide').then(module => ({ default: module.HowToGuide }))
);

const LazyAboutModal = React.lazy(() => 
  import('./components/AboutModal').then(module => ({ default: module.AboutModal }))
);

const LazyMusicPlayer = React.lazy(() => 
  import('./components/MusicPlayer').then(module => ({ default: module.MusicPlayer }))
);

const LazyPerformanceOptimizer = React.lazy(() => 
  import('./components/PerformanceOptimizer').then(module => ({ default: module.PerformanceOptimizer }))
);

const LazyCommunityBuilder = React.lazy(() => 
  import('./components/CommunityBuilder').then(module => ({ default: module.CommunityBuilder }))
);

const LazyAccessibilityEnhancer = React.lazy(() => 
  import('./components/AccessibilityEnhancer').then(module => ({ default: module.AccessibilityEnhancer }))
);

const LazyDocumentationMaker = React.lazy(() => 
  import('./components/DocumentationMaker').then(module => ({ default: module.DocumentationMaker }))
);

function ComponentLoader({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center p-8 h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Loading {name}...
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Initializing advanced features
        </p>
      </div>
    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const { 
    files, 
    activeFile, 
    openFile, 
    closeFile, 
    createFile, 
    deleteFile, 
    updateFileContent, 
    saveFile 
  } = useFileSystem();
  
  const {
    isFirstTime,
    showBeginnerTips,
    tourCompleted,
    completeTour,
    enableBeginnerMode,
    disableBeginnerMode
  } = useFirstTimeUser();

  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const { 
    isOpen: commandPaletteOpen, 
    setIsOpen: setCommandPaletteOpen,
    commands,
    registerCommands,
    executeCommand
  } = useCommandPalette();
  const { toasts, success, error, info, loading, dismissToast } = useToasts();

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Modal states (lazy loaded)
  const [showBeginnerHelp, setShowBeginnerHelp] = useState(false);
  const [showHowToGuide, setShowHowToGuide] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showPerformanceOptimizer, setShowPerformanceOptimizer] = useState(false);
  const [showCommunityBuilder, setShowCommunityBuilder] = useState(false);
  const [showAccessibilityEnhancer, setShowAccessibilityEnhancer] = useState(false);
  const [showDocumentationMaker, setShowDocumentationMaker] = useState(false);

  useEffect(() => {
    // Update theme and ensure smooth transitions
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add('theme-transition');
    document.documentElement.style.colorScheme = theme;
    
    const removeTransition = () => document.documentElement.classList.remove('theme-transition');
    const transitionTimeout = setTimeout(removeTransition, 1000);
    
    return () => {
      clearTimeout(transitionTimeout);
      removeTransition();
    };
  }, [theme]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (activeFile) {
      const language = aiCodeService.getLanguageFromExtension(activeFile.name);
      setSelectedLanguage(language);
    }
  }, [activeFile]);

  // Register commands for command palette
  useEffect(() => {
    const appCommands = [
      {
        id: 'new-file',
        title: 'New File',
        description: 'Create a new file',
        category: 'file' as const,
        shortcut: '⌘N',
        action: () => createFile('untitled.txt', 'file')
      },
      {
        id: 'new-js-file',
        title: 'New JavaScript File',
        description: 'Create a new JavaScript file',
        category: 'file' as const,
        action: () => createFile('script.js', 'file')
      },
      {
        id: 'new-folder',
        title: 'New Folder',
        description: 'Create a new folder',
        category: 'file' as const,
        action: () => createFile('new-folder', 'folder')
      },
      {
        id: 'toggle-ai',
        title: 'Toggle AI Assistant',
        description: 'Open or close the AI assistant drawer',
        category: 'ai' as const,
        shortcut: '⌘⇧A',
        action: () => setAiDrawerOpen(!aiDrawerOpen)
      },
      {
        id: 'toggle-terminal',
        title: 'Toggle Terminal',
        description: 'Show or hide the integrated terminal',
        category: 'view' as const,
        shortcut: '⌘`',
        action: () => setTerminalVisible(!terminalVisible)
      },
      {
        id: 'toggle-music',
        title: 'Toggle Music Player',
        description: 'Open the adaptive music player',
        category: 'view' as const,
        shortcut: '⌘⇧M',
        action: () => setShowMusicPlayer(true)
      },
      {
        id: 'focus-mode',
        title: 'Toggle Focus Mode',
        description: 'Enter zen mode for distraction-free coding',
        category: 'view' as const,
        shortcut: '⌘⇧F',
        action: () => {
          const result = toggleFocusMode({
            sidebarCollapsed,
            terminalVisible,
            aiPanelVisible: aiDrawerOpen
          });
          
          if (result.action === 'enter') {
            setSidebarCollapsed(true);
            setTerminalVisible(false);
            setAiDrawerOpen(false);
            success('Focus Mode Activated', 'Press ⌘⇧F to exit');
          } else if (result.previousState) {
            setSidebarCollapsed(result.previousState.sidebarCollapsed);
            setTerminalVisible(result.previousState.terminalVisible);
            setAiDrawerOpen(result.previousState.aiPanelVisible);
            info('Focus Mode Deactivated', 'Interface restored');
          }
        }
      },
      {
        id: 'performance-optimizer',
        title: 'Performance Optimizer',
        description: 'Open real-time performance monitoring',
        category: 'view' as const,
        shortcut: '⌘⇧O',
        action: () => setShowPerformanceOptimizer(true)
      },
      {
        id: 'community-hub',
        title: 'Community Hub',
        description: 'Connect with ethical developers',
        category: 'view' as const,
        shortcut: '⌘⇧B',
        action: () => setShowCommunityBuilder(true)
      },
      {
        id: 'accessibility-center',
        title: 'Accessibility Center',
        description: 'Configure accessibility settings',
        category: 'settings' as const,
        shortcut: '⌘⇧X',
        action: () => setShowAccessibilityEnhancer(true)
      },
      {
        id: 'documentation-maker',
        title: 'Documentation Maker',
        description: 'Generate AI-powered documentation',
        category: 'view' as const,
        action: () => setShowDocumentationMaker(true)
      },
      {
        id: 'beginner-help',
        title: 'Beginner Help',
        description: 'Get help for new developers',
        category: 'help' as const,
        action: () => setShowBeginnerHelp(true)
      },
      {
        id: 'how-to-guide',
        title: 'How-To Guide',
        description: 'Complete feature tutorials',
        category: 'help' as const,
        action: () => setShowHowToGuide(true)
      },
      {
        id: 'toggle-theme',
        title: 'Toggle Theme',
        description: 'Switch between light and dark mode',
        category: 'settings' as const,
        shortcut: '⌘T',
        action: toggleTheme
      }
    ];

    registerCommands(appCommands);
  }, [
    createFile, aiDrawerOpen, terminalVisible, sidebarCollapsed,
    toggleFocusMode, success, info, registerCommands, toggleTheme
  ]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCommandPalette: () => setCommandPaletteOpen(true),
    onFocusMode: () => {
      const result = toggleFocusMode({
        sidebarCollapsed,
        terminalVisible,
        aiPanelVisible: aiDrawerOpen
      });
      
      if (result.action === 'enter') {
        setSidebarCollapsed(true);
        setTerminalVisible(false);
        setAiDrawerOpen(false);
        success('Focus Mode Activated', 'Press ⌘⇧F to exit');
      } else if (result.previousState) {
        setSidebarCollapsed(result.previousState.sidebarCollapsed);
        setTerminalVisible(result.previousState.terminalVisible);
        setAiDrawerOpen(result.previousState.aiPanelVisible);
        info('Focus Mode Deactivated', 'Interface restored');
      }
    },
    onAIDrawer: () => setAiDrawerOpen(!aiDrawerOpen),
    onTerminal: () => setTerminalVisible(!terminalVisible),
    onSave: () => {
      if (activeFile) {
        saveFile(activeFile.id);
        success('File Saved', `${activeFile.name} saved successfully`);
      }
    }
  });

  const handleFileCreate = (name: string, type: 'file' | 'folder') => {
    const newFile = createFile(name, type);
    if (type === 'file') {
      success('File Created', `${name} created successfully`);
    } else {
      info('Folder Created', `${name} folder created`);
    }
  };

  const handleCodeGenerated = (code: string, title?: string) => {
    if (activeFile) {
      updateFileContent(activeFile.id, code);
      success('Code Generated', title || 'AI-generated code applied');
    } else {
      const newFile = createFile(title || 'ai-generated.js', 'file');
      updateFileContent(newFile.id, code);
      success('Code Generated', `${title || 'AI-generated code'} created as new file`);
    }
  };

  return (
    <ErrorBoundary>
      <SkipLink />
      <TouchGestures>
        <TooltipProvider showBeginnerTips={showBeginnerTips}>
          <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/40 transition-colors duration-500 motion-reduce:transition-none">
            
            {/* Focus Mode Indicator */}
            {isFocusMode && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-full shadow-lg z-50 flex items-center space-x-3">
                <Eye className="w-4 h-4" />
                <span className="font-medium">Focus Mode Active</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
            
            <Header 
              theme={theme}
              onToggleTheme={toggleTheme}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
              activeFile={activeFile}
              onSave={() => {
                if (activeFile) {
                  saveFile(activeFile.id);
                  success('File Saved', `${activeFile.name} saved successfully`);
                }
              }}
              onCloseFile={() => activeFile && closeFile(activeFile.id)}
              onToggleAI={() => setAiDrawerOpen(!aiDrawerOpen)}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              showBeginnerTips={showBeginnerTips}
              onToggleBeginnerTips={() => showBeginnerTips ? disableBeginnerMode() : enableBeginnerMode()}
              onShowHelp={() => setShowBeginnerHelp(true)}
              onToggleMusic={() => setShowMusicPlayer(true)}
              musicPlayerVisible={showMusicPlayer}
              onShowHowTo={() => setShowHowToGuide(true)}
              onShowSecurity={() => info('Security Panel', 'Security features integrated into AI drawer')}
              forceMobileLayout={false}
              onToggleMobileLayout={() => {}}
              onToggleAutoFix={() => info('Auto-Fix', 'Auto-fix features integrated into editor')}
              showAutoFix={false}
              onToggleChat={() => info('Chat', 'Chat features coming soon')}
              onTogglePerformanceOptimizer={() => setShowPerformanceOptimizer(true)}
              onToggleCommunityBuilder={() => setShowCommunityBuilder(true)}
              onToggleAccessibility={() => setShowAccessibilityEnhancer(true)}
              onToggleDocumentation={() => setShowDocumentationMaker(true)}
              aiDrawerOpen={aiDrawerOpen}
              focusMode={isFocusMode}
            />
            
            <div className={`flex flex-1 overflow-hidden ${isMobile ? 'mobile-stack' : ''}`}>
              {!isFocusMode && (
                <Sidebar 
                  collapsed={sidebarCollapsed}
                  onCollapse={() => setSidebarCollapsed(true)}
                >
                  <FileExplorer
                    files={files}
                    activeFile={activeFile}
                    onFileSelect={openFile}
                    onFileCreate={handleFileCreate}
                    onFileDelete={deleteFile}
                  />
                </Sidebar>
              )}
              
              <main 
                id="main-editor"
                className="flex-1 flex flex-col overflow-hidden"
                tabIndex={-1}
              >
                {activeFile ? (
                  <AdvancedEditor
                    file={activeFile}
                    onContentChange={(content) => updateFileContent(activeFile.id, content)}
                    onSave={() => {
                      saveFile(activeFile.id);
                      success('File Saved', `${activeFile.name} saved successfully`);
                    }}
                    onClose={() => closeFile(activeFile.id)}
                    theme={theme}
                  />
                ) : (
                  <WelcomeScreen 
                    onCreateFile={handleFileCreate}
                    onOpenMusic={() => {
                      console.log('Music player requested from welcome screen');
                      setShowMusicPlayer(true);
                    }}
                  />
                )}
                
                {terminalVisible && !isFocusMode && (
                  <Terminal
                    onClose={() => setTerminalVisible(false)}
                    height={terminalHeight}
                    onHeightChange={setTerminalHeight}
                  />
                )}
              </main>
            </div>
            
            {!isFocusMode && (
              <StatusBar
                activeFile={activeFile}
                theme={theme}
                terminalVisible={terminalVisible}
                aiPanelVisible={aiDrawerOpen}
              />
            )}

            {/* Command Palette */}
            <CommandPalette
              isOpen={commandPaletteOpen}
              onClose={() => setCommandPaletteOpen(false)}
              commands={commands}
            />

            {/* AI Drawer */}
            <AIDrawer
              isOpen={aiDrawerOpen}
              onClose={() => setAiDrawerOpen(false)}
              activeFile={activeFile}
            />

            {/* Status Toasts */}
            <div aria-live="polite" aria-label="Status notifications" className="sr-only">
              Status updates will be announced here
            </div>
            <StatusToasts 
              toasts={toasts}
              onDismiss={dismissToast}
            />

            {/* Lazy Loaded Modals */}
            {showBeginnerHelp && (
              <Suspense fallback={<ComponentLoader name="Beginner Help" />}>
                <LazyBeginnerHelp
                  isVisible={showBeginnerHelp}
                  onClose={() => setShowBeginnerHelp(false)}
                />
              </Suspense>
            )}

            {showHowToGuide && (
              <Suspense fallback={<ComponentLoader name="How-To Guide" />}>
                <LazyHowToGuide
                  isVisible={showHowToGuide}
                  onClose={() => setShowHowToGuide(false)}
                />
              </Suspense>
            )}

            {showAboutModal && (
              <Suspense fallback={<ComponentLoader name="About" />}>
                <LazyAboutModal
                  isVisible={showAboutModal}
                  onClose={() => setShowAboutModal(false)}
                />
              </Suspense>
            )}

            {showMusicPlayer && (
              <Suspense fallback={<ComponentLoader name="Music Player" />}>
                <LazyMusicPlayer
                  isMinimized={false}
                  onToggleMinimize={() => {}}
                  onClose={() => setShowMusicPlayer(false)}
                  currentLanguage={selectedLanguage?.name || 'typescript'}
                  codeComplexity={activeFile ? Math.min(activeFile.content.length / 1000, 1) : 0}
                />
              </Suspense>
            )}

            {showPerformanceOptimizer && (
              <Suspense fallback={<ComponentLoader name="Performance Optimizer" />}>
                <LazyPerformanceOptimizer />
              </Suspense>
            )}

            {showCommunityBuilder && (
              <Suspense fallback={<ComponentLoader name="Community Hub" />}>
                <LazyCommunityBuilder />
              </Suspense>
            )}

            {showAccessibilityEnhancer && (
              <Suspense fallback={<ComponentLoader name="Accessibility Center" />}>
                <LazyAccessibilityEnhancer
                  isVisible={showAccessibilityEnhancer}
                  onClose={() => setShowAccessibilityEnhancer(false)}
                />
              </Suspense>
            )}

            {showDocumentationMaker && activeFile && (
              <Suspense fallback={<ComponentLoader name="Documentation Maker" />}>
                <LazyDocumentationMaker
                  currentCode={activeFile.content}
                  language={selectedLanguage?.name || 'typescript'}
                  onDocumentationGenerated={handleCodeGenerated}
                />
              </Suspense>
            )}
          </div>
        </TooltipProvider>
      </TouchGestures>
    </ErrorBoundary>
  );
}

export default App;