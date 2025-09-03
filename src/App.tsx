import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdvancedEditor } from './components/AdvancedEditor';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { FileExplorer } from './components/FileExplorer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AIPanel } from './components/AIPanel';
import { EnhancedAIPanel } from './components/EnhancedAIPanel';
import { DatabaseViewer } from './components/DatabaseViewer';
import { ResearchPaperViewer } from './components/ResearchPaperViewer';
import { QuantumVisualizer } from './components/QuantumVisualizer';
import { AIInsights } from './components/AIInsights';
import { CocoonsViewer } from './components/CocoonsViewer';
import { UltimateAIPanel } from './components/UltimateAIPanel';
import { QuantumCodeVisualizer } from './components/QuantumCodeVisualizer';
import { NeuralPredictionPanel } from './components/NeuralPredictionPanel';
import { EmotionalCodeAnalyzer } from './components/EmotionalCodeAnalyzer';
import { CodeEvolutionTracker } from './components/CodeEvolutionTracker';
import { AICodeAssistant } from './components/AICodeAssistant';
import { LanguageSelector } from './components/LanguageSelector';
import { FirstTimeUserGuide } from './components/FirstTimeUserGuide';
import { TooltipProvider } from './components/TooltipProvider';
import { BeginnerHelp } from './components/BeginnerHelp';
import { BeginnerModeToggle } from './components/BeginnerModeToggle';
import { ContextualAIAssistant } from './components/ContextualAIAssistant';
import { Footer } from './components/Footer';
import { HowToGuide } from './components/HowToGuide';
import { SecurityPanel } from './components/SecurityPanel';
import { MobileMenu } from './components/MobileMenu';
import { TouchGestures } from './components/TouchGestures';
import { RevolutionaryInterface } from './components/RevolutionaryInterface';
import { CommunityBuilder } from './components/CommunityBuilder';
import { AccessibilityEnhancer } from './components/AccessibilityEnhancer';
import { DocumentationMaker } from './components/DocumentationMaker';
import { CommandPalette } from './components/CommandPalette';
import { AIDrawer } from './components/AIDrawer';
import { StatusToasts } from './components/StatusToasts';
import { SkipLink } from './components/SkipLink';
import { EmptyState } from './components/EmptyState';
import { useTheme } from './hooks/useTheme';
import { useFileSystem } from './hooks/useFileSystem';
import { useFirstTimeUser } from './hooks/useFirstTimeUser';
import { useMusic } from './hooks/useMusic';
import { useAdvancedAI } from './hooks/useAdvancedAI';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useToasts } from './hooks/useToasts';
import { aiCodeService } from './services/aiCodeService';
import { backendIntegration } from './services/backendIntegration';
import { X, Crown, Sparkles, Music, Trophy, Shield, Activity, Atom, Brain, FileText, Folder, Code, Palette, TerminalIcon, HelpCircle, BookOpen, TrendingUp, Users, Eye, Database, Settings } from 'lucide-react';

// Lazy load heavy components
const LazyResearchPaperViewer = React.lazy(() => 
  import('./components/ResearchPaperViewer').then(module => ({ default: module.ResearchPaperViewer }))
);

const LazyDatabaseViewer = React.lazy(() => 
  import('./components/DatabaseViewer').then(module => ({ default: module.DatabaseViewer }))
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
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [aiPanelVisible, setAiPanelVisible] = useState(false);
  const [aiPanelWidth, setAiPanelWidth] = useState(450);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null);
  const [showBeginnerHelp, setShowBeginnerHelp] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHowToGuide, setShowHowToGuide] = useState(false);
  const [musicPlayerVisible, setMusicPlayerVisible] = useState(false);
  const [musicPlayerMinimized, setMusicPlayerMinimized] = useState(false);
  const [showDatabaseViewer, setShowDatabaseViewer] = useState(false);
  const [showResearchPapers, setShowResearchPapers] = useState(false);
  const [showUltimateAI, setShowUltimateAI] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [forceMobileLayout, setForceMobileLayout] = useState(false);
  const [showRevolutionaryInterface, setShowRevolutionaryInterface] = useState(false);
  const [showMTVMusicPlayer, setShowMTVMusicPlayer] = useState(false);
  const [showEthicalAI, setShowEthicalAI] = useState(false);
  const [showCodeHealth, setShowCodeHealth] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [showQuantumVisualizer, setShowQuantumVisualizer] = useState(false);
  const [showCocoonsViewer, setShowCocoonsViewer] = useState(false);
  const [showAutoFix, setShowAutoFix] = useState(false);
  const [codingStreak, setCodingStreak] = useState(0);
  const [totalLinesCodedToday, setTotalLinesCodedToday] = useState(0);
  const [showCodetteChat, setShowCodetteChat] = useState(false);
  const [showZkFetch, setShowZkFetch] = useState(false);
  const [showStreamlinedOnboarding, setShowStreamlinedOnboarding] = useState(false);
  const [showPerformanceOptimizer, setShowPerformanceOptimizer] = useState(false);
  const [showCommunityBuilder, setShowCommunityBuilder] = useState(false);
  const [showAccessibilityEnhancer, setShowAccessibilityEnhancer] = useState(false);
  const [showDocumentationMaker, setShowDocumentationMaker] = useState(false);
  
  const { playerState } = useMusic();
  const { 
    runQuantumOptimization, 
    conveneAegisCouncil, 
    storeDreamMemory,
    isProcessing: aiProcessing 
  } = useAdvancedAI();
  
  const {
    isFirstTime,
    showBeginnerTips,
    tourCompleted,
    completeTour,
    enableBeginnerMode,
    disableBeginnerMode
  } = useFirstTimeUser();

  // UI State
  const [focusMode, setFocusMode] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Toast system
  const { toasts, dismissToast, success, error, info, loading } = useToasts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isFirstTime && !tourCompleted) {
      setShowStreamlinedOnboarding(true);
    }
  }, [isFirstTime, tourCompleted]);

  // Commands for command palette
  const commands = [
    {
      id: 'new-file',
      title: 'New File',
      description: 'Create a new file',
      category: 'file' as const,
      shortcut: '⌘N',
      action: () => {
        createFile('untitled.txt', 'file');
        success('File Created', 'New file ready for editing');
      }
    },
    {
      id: 'new-js-file',
      title: 'New JavaScript File',
      description: 'Create a new JavaScript file',
      category: 'file' as const,
      action: () => {
        createFile('script.js', 'file');
        success('JavaScript File Created', 'Ready for coding');
      }
    },
    {
      id: 'new-folder',
      title: 'New Folder',
      description: 'Create a new folder',
      category: 'file' as const,
      action: () => {
        createFile('new-folder', 'folder');
        success('Folder Created', 'New folder added to project');
      }
    },
    {
      id: 'toggle-ai',
      title: 'Toggle AI Assistant',
      description: 'Open or close the AI assistant drawer',
      category: 'ai' as const,
      shortcut: '⌘⇧A',
      action: () => {
        setAiDrawerOpen(!aiDrawerOpen);
        info(aiDrawerOpen ? 'AI Assistant Closed' : 'AI Assistant Opened');
      }
    },
    {
      id: 'toggle-terminal',
      title: 'Toggle Terminal',
      description: 'Show or hide the integrated terminal',
      category: 'view' as const,
      shortcut: '⌘`',
      action: () => {
        setTerminalVisible(!terminalVisible);
        info(terminalVisible ? 'Terminal Hidden' : 'Terminal Opened');
      }
    },
    {
      id: 'toggle-music',
      title: 'Toggle Music Player',
      description: 'Open the adaptive music player',
      category: 'view' as const,
      shortcut: '⌘⇧M',
      action: () => {
        setMusicPlayerVisible(!musicPlayerVisible);
        info(musicPlayerVisible ? 'Music Player Hidden' : 'Music Player Opened');
      }
    },
    {
      id: 'focus-mode',
      title: 'Toggle Focus Mode',
      description: 'Enter zen mode for distraction-free coding',
      category: 'view' as const,
      shortcut: '⌘⇧F',
      action: () => {
        setFocusMode(!focusMode);
        if (!focusMode) {
          setSidebarCollapsed(true);
          setTerminalVisible(false);
          setAiDrawerOpen(false);
          success('Focus Mode Activated', 'Distractions hidden for deep coding');
        } else {
          setSidebarCollapsed(false);
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
      action: () => {
        setShowPerformanceOptimizer(true);
        loading('Loading Performance Optimizer', 'Initializing monitoring tools', { category: 'performance' });
      }
    },
    {
      id: 'community-hub',
      title: 'Community Hub',
      description: 'Connect with ethical developers',
      category: 'view' as const,
      shortcut: '⌘⇧B',
      action: () => {
        setShowCommunityBuilder(true);
        loading('Loading Community Hub', 'Connecting to developer network', { category: 'general' });
      }
    },
    {
      id: 'accessibility-center',
      title: 'Accessibility Center',
      description: 'Configure accessibility settings',
      category: 'settings' as const,
      shortcut: '⌘⇧X',
      action: () => {
        setShowAccessibilityEnhancer(true);
        info('Accessibility Center Opened', 'Configure inclusive settings');
      }
    },
    {
      id: 'research-papers',
      title: 'Research Papers',
      description: 'Browse academic research and papers',
      category: 'view' as const,
      action: () => {
        setShowResearchPapers(true);
        loading('Loading Research Papers', 'Accessing academic database', { category: 'general' });
      }
    },
    {
      id: 'database-viewer',
      title: 'Database Viewer',
      description: 'Connect and explore databases',
      category: 'view' as const,
      action: () => {
        setShowDatabaseViewer(true);
        loading('Loading Database Viewer', 'Initializing database tools', { category: 'general' });
      }
    },
    {
      id: 'documentation-maker',
      title: 'Documentation Maker',
      description: 'Generate ethical documentation',
      category: 'view' as const,
      action: () => {
        setShowDocumentationMaker(true);
        loading('Loading Documentation Maker', 'Preparing documentation tools', { category: 'ai' });
      }
    },
    {
      id: 'beginner-help',
      title: 'Beginner Help',
      description: 'Get help for new developers',
      category: 'help' as const,
      action: () => {
        setShowBeginnerHelp(true);
        info('Beginner Help Opened', 'Welcome to coding!');
      }
    },
    {
      id: 'how-to-guide',
      title: 'How-To Guide',
      description: 'Complete feature tutorials',
      category: 'help' as const,
      action: () => {
        setShowHowToGuide(true);
        info('How-To Guide Opened', 'Learn Codette features');
      }
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      category: 'settings' as const,
      shortcut: '⌘T',
      action: () => {
        toggleTheme();
        info('Theme Changed', `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }
    }
  ];

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCommandPalette: () => setCommandPaletteOpen(true),
    onFocusMode: () => {
      setFocusMode(!focusMode);
      if (!focusMode) {
        setSidebarCollapsed(true);
        setTerminalVisible(false);
        setAiDrawerOpen(false);
        success('Focus Mode Activated', 'Press ⌘⇧F to exit');
      } else {
        setSidebarCollapsed(false);
        info('Focus Mode Deactivated', 'Interface restored');
      }
    },
    onAIDrawer: () => {
      setAiDrawerOpen(!aiDrawerOpen);
      info(aiDrawerOpen ? 'AI Assistant Closed' : 'AI Assistant Opened');
    },
    onTerminal: () => {
      setTerminalVisible(!terminalVisible);
      info(terminalVisible ? 'Terminal Hidden' : 'Terminal Opened');
    },
    onSave: () => {
      if (activeFile) {
        saveFile(activeFile.id);
        success('File Saved', `${activeFile.name} saved successfully`);
      }
    }
  });

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768 || forceMobileLayout);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-collapse sidebar on mobile (only if actually mobile, not forced)
      if (width < 768 && !forceMobileLayout) {
        setSidebarCollapsed(true);
      }
      
      // Adjust panel sizes for tablets
      if (width >= 768 && width < 1024) {
        setAiPanelWidth(350);
        setTerminalHeight(250);
      } else if (width >= 1024) {
        setAiPanelWidth(450);
        setTerminalHeight(300);
      }
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Disable keyboard shortcuts on mobile
    if (isMobile) return;
    
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (activeFile) {
        saveFile(activeFile.id);
      }
    }
    
    // Ctrl/Cmd + W to close file
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
      e.preventDefault();
      if (activeFile) {
        closeFile(activeFile.id);
      }
    }
    
    // Ctrl/Cmd + ` to toggle terminal
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
      e.preventDefault();
      setTerminalVisible(!terminalVisible);
    }
    
    // Ctrl/Cmd + Shift + A to toggle AI panel
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      setAiPanelVisible(!aiPanelVisible);
    }
    
    // Ctrl/Cmd + Shift + M to toggle music player
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
      e.preventDefault();
      setMusicPlayerVisible(!musicPlayerVisible);
    }
    
    // Ctrl/Cmd + Shift + D to toggle database viewer
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      setShowDatabaseViewer(!showDatabaseViewer);
    }
    
    // Ctrl/Cmd + Shift + P to toggle research papers
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      setShowResearchPapers(!showResearchPapers);
    }
    
    // Ctrl/Cmd + Shift + U to toggle ultimate AI panel
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'U') {
      e.preventDefault();
      setShowUltimateAI(!showUltimateAI);
    }
    
    // Ctrl/Cmd + Shift + L to open language selector
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      // Focus on language selector if available
    }
    
    // Ctrl/Cmd + Shift + Z to toggle zkfetch panel
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
      e.preventDefault();
      setShowZkFetch(!showZkFetch);
    }
    
    // Ctrl/Cmd + Shift + O for Performance Optimizer
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
      e.preventDefault();
      setShowPerformanceOptimizer(!showPerformanceOptimizer);
    }
    
    // Ctrl/Cmd + Shift + B for Community Builder
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
      e.preventDefault();
      setShowCommunityBuilder(!showCommunityBuilder);
    }
    
    // Ctrl/Cmd + Shift + X for Accessibility
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
      e.preventDefault();
      setShowAccessibilityEnhancer(!showAccessibilityEnhancer);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, terminalVisible, aiPanelVisible, musicPlayerVisible, showUltimateAI]);

  // Track coding activity for gamification
  useEffect(() => {
    if (activeFile?.content) {
      const lines = activeFile.content.split('\n').filter(line => line.trim()).length;
      setTotalLinesCodedToday(lines);
      
      // Update coding streak
      const lastCodingDate = localStorage.getItem('codette-last-coding-date');
      const today = new Date().toDateString();
      
      if (lastCodingDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastCodingDate === yesterday.toDateString()) {
          setCodingStreak(prev => prev + 1);
        } else {
          setCodingStreak(1);
        }
        
        localStorage.setItem('codette-last-coding-date', today);
        localStorage.setItem('codette-coding-streak', codingStreak.toString());
      }
    }
  }, [activeFile?.content]);

  useEffect(() => {
    if (activeFile) {
      const language = aiCodeService.getLanguageFromExtension(activeFile.name);
      setSelectedLanguage(language);
    }
  }, [activeFile]);

  // Keyboard shortcuts for advanced features
  useEffect(() => {
    const handleAdvancedKeyDown = (e: KeyboardEvent) => {
      if (isMobile) return;
      
      // Ctrl/Cmd + Shift + E for Ethical AI
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setShowEthicalAI(!showEthicalAI);
      }
      
      // Ctrl/Cmd + Shift + H for Code Health
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        setShowCodeHealth(!showCodeHealth);
      }
      
      // Ctrl/Cmd + Shift + Q for Quantum Visualizer
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Q') {
        e.preventDefault();
        setShowQuantumVisualizer(!showQuantumVisualizer);
      }
      
      // Ctrl/Cmd + Shift + C for Cocoons Viewer
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setShowCocoonsViewer(!showCocoonsViewer);
      }
      
      // Ctrl/Cmd + Shift + F for Auto-Fix
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setShowAutoFix(!showAutoFix);
      }
    };

    document.addEventListener('keydown', handleAdvancedKeyDown);
    return () => document.removeEventListener('keydown', handleAdvancedKeyDown);
  }, [showEthicalAI, showCodeHealth, showQuantumVisualizer, showCocoonsViewer, isMobile]);

  return (
    <ErrorBoundary>
      <SkipLink />
    <TouchGestures
      onSwipeRight={() => isMobile && setSidebarCollapsed(false)}
      onSwipeLeft={() => isMobile && setSidebarCollapsed(true)}
      onSwipeUp={() => isMobile && setTerminalVisible(true)}
      onSwipeDown={() => isMobile && setTerminalVisible(false)}
    >
      <TooltipProvider showBeginnerTips={showBeginnerTips}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 transition-all duration-500">
        <Header 
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => isMobile ? setShowMobileMenu(true) : setSidebarCollapsed(!sidebarCollapsed)}
          onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
          activeFile={activeFile}
          onSave={() => activeFile && saveFile(activeFile.id)}
          onCloseFile={() => activeFile && closeFile(activeFile.id)}
          onToggleAI={() => setAiPanelVisible(!aiPanelVisible)}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          showBeginnerTips={showBeginnerTips}
          onToggleBeginnerTips={showBeginnerTips ? disableBeginnerMode : enableBeginnerMode}
          onShowHelp={() => setShowBeginnerHelp(true)}
          onToggleMusic={() => setMusicPlayerVisible(!musicPlayerVisible)}
          musicPlayerVisible={musicPlayerVisible}
          onToggleUltimateAI={() => setShowUltimateAI(!showUltimateAI)}
          showUltimateAI={showUltimateAI}
          <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 transition-all duration-500 motion-reduce:transition-none">
            
            {/* Focus Mode Indicator */}
            {focusMode && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Focus Mode Active
                </div>
              </div>
            )}

          onShowSecurity={() => setShowSecurityPanel(true)}
          forceMobileLayout={forceMobileLayout}
          onToggleMobileLayout={() => setForceMobileLayout(!forceMobileLayout)}
          onToggleAutoFix={() => setShowAutoFix(!showAutoFix)}
          showAutoFix={showAutoFix}
          onToggleChat={() => setShowCodetteChat(!showCodetteChat)}
              onToggleAI={() => setAiDrawerOpen(!aiDrawerOpen)}
              aiDrawerOpen={aiDrawerOpen}
              focusMode={focusMode}
        />
        
        <div className={`flex flex-1 overflow-hidden ${isMobile ? 'mobile-stack' : ''}`}>
              {!focusMode && (
                <Sidebar 
                  collapsed={sidebarCollapsed}
                  onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                  isMobile={isMobile}
                />
              )}
              <FileExplorer
                files={files}
                {!focusMode && (
                  <FileExplorer 
                    files={files}
                    activeFile={activeFile}
              {activeFile ? (
                <div className={`flex h-full ${isMobile ? 'flex-col space-y-2' : ''}`}>
                  <div className="flex-1 editor-area">
            {!focusMode && (
              <StatusBar 
                activeFile={activeFile}
                isMobile={isMobile}
                theme={theme}
                focusMode={focusMode}
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
            <StatusToasts
              toasts={toasts}
              onDismiss={dismissToast}
            />
                      onSave={() => saveFile(activeFile.id)}
                      onClose={() => closeFile(activeFile.id)}
                      theme={theme}
                    />
                  </div>
                  
                  {aiPanelVisible && !isMobile && (
                    <div 
                      className="border-l border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/30 backdrop-blur-xl shadow-2xl overflow-hidden"
                      style={{ 
                        width: isTablet ? 350 : Math.min(aiPanelWidth, window.innerWidth * 0.4),
                        maxWidth: '450px',
                        minWidth: '300px'
                      }}
                    >
                      <LazyLoadWrapper name="AI Panel">
                        {showUltimateAI ? (
                          <UltimateAIPanel
                            currentCode={activeFile.content}
                            language={selectedLanguage?.name.toLowerCase() || 'typescript'}
                            cursorPosition={cursorPosition}
                            onCodeGenerated={(code, title) => {
                              if (title) {
                                const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.${selectedLanguage?.extensions[0] || 'ts'}`;
                                createFile(fileName, 'file');
                                setTimeout(() => {
                                  const newFile = files.find(f => f.name === fileName);
                                  if (newFile) {
                                    updateFileContent(newFile.id, code);
                                    openFile(newFile);
                                  }
                                }, 100);
                              } else {
                                updateFileContent(activeFile.id, code);
                              }
                            }}
                          />
                        ) : (
                        <div className={`h-full flex ${isTablet ? 'flex-col' : 'flex-row'} overflow-hidden`}>
                        <div className={`${isTablet ? 'w-full border-b' : 'flex-1 border-r'} border-purple-200/30 dark:border-purple-700/30 overflow-hidden`}>
                          <AIPanel 
                            currentCode={activeFile.content}
                            language={selectedLanguage?.name.toLowerCase() || 'typescript'}
                            onCodeGenerated={(code, title) => {
                              if (title) {
                                // Create new file with generated code
                                const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.${selectedLanguage?.extensions[0] || 'ts'}`;
                                createFile(fileName, 'file');
                                // Find the newly created file and update its content
                                setTimeout(() => {
                                  const newFile = files.find(f => f.name === fileName);
                                  if (newFile) {
                                    updateFileContent(newFile.id, code);
                                    openFile(newFile);
                                  }
                                }, 100);
                              } else {
                                // Update current file
                                updateFileContent(activeFile.id, code);
                              }
                            }}
                          />
                        </div>
                        <div className={`${isTablet ? 'w-full border-b' : 'flex-1 border-r'} border-purple-200/30 dark:border-purple-700/30 overflow-hidden`}>
                          <AICodeAssistant
                            currentCode={activeFile.content}
                            language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
                            onCodeChange={(content) => updateFileContent(activeFile.id, content)}
                          />
                        </div>
                        <div className={`${isTablet ? 'w-full' : 'flex-1'} overflow-hidden`}>
                          <ContextualAIAssistant
                            currentCode={activeFile.content}
                            language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
                            cursorPosition={{ line: 1, column: 1 }}
                            selectedText=""
                            onCodeSuggestion={(code) => updateFileContent(activeFile.id, code)}
                            onExplanationRequest={(explanation) => console.log('Explanation:', explanation)}
                          />
                        </div>
                      </div>
                        )}
                      </LazyLoadWrapper>
                    </div>
                  )}
                  
                  {/* Mobile AI Panel - Bottom Sheet */}
                  {aiPanelVisible && isMobile && (
                    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-purple-50/50 to-blue-50/50 dark:from-gray-900 dark:via-purple-950/50 dark:to-blue-950/50 backdrop-blur-xl border-t border-purple-200/50 dark:border-purple-700/50 z-50 max-h-96 overflow-y-auto shadow-2xl">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-800 dark:text-white">AI Assistant</h3>
                          <button
                            onClick={() => setAiPanelVisible(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                        <AICodeAssistant
                          currentCode={activeFile.content}
                          language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
                          onCodeChange={(content) => updateFileContent(activeFile.id, content)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full overflow-hidden">
                  {showRevolutionaryInterface ? (
                    <RevolutionaryInterface
                      currentCode={activeFile?.content || ''}
                      language={selectedLanguage?.name.toLowerCase() || 'typescript'}
                      onCodeGenerated={(code, title) => {
                        if (title) {
                          const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.${selectedLanguage?.extensions[0] || 'ts'}`;
                          createFile(fileName, 'file');
                          setTimeout(() => {
                            const newFile = files.find(f => f.name === fileName);
                            if (newFile) {
                              updateFileContent(newFile.id, code);
                              openFile(newFile);
                            }
                          }, 100);
                        } else {
                          // Create new file for generated code
                          createFile('ai-generated.ts', 'file');
                          setTimeout(() => {
                            const newFile = files.find(f => f.name === 'ai-generated.ts');
                            if (newFile) {
                              updateFileContent(newFile.id, code);
                              openFile(newFile);
                            }
                          }, 100);
                        }
                      }}
                      isNewUser={isFirstTime}
                    />
                  ) : (
                    <WelcomeScreen 
                      onCreateFile={createFile}
                      onOpenMusic={() => setMusicPlayerVisible(true)}
                      onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                    />
                  )}
                  
                  {terminalVisible && !focusMode && (
                    <div
                      className="absolute top-0 right-0 h-full border-l border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-br from-white/95 via-purple-50/80 to-blue-50/80 dark:from-gray-900/95 dark:via-purple-950/80 dark:to-blue-950/80 backdrop-blur-xl shadow-2xl z-20 overflow-hidden"
                      style={{ 
                        width: isTablet ? 350 : Math.min(aiPanelWidth, window.innerWidth * 0.4),
                        maxWidth: '450px',
                        minWidth: '300px'
                      }}
                    >
                      <div className="h-full flex flex-col">
                        <div className={`${isTablet ? 'h-full' : 'h-1/2'} ${!isTablet ? 'border-b border-gray-200 dark:border-gray-700' : ''} overflow-hidden`}>
                          {showUltimateAI ? (
                            <UltimateAIPanel
                              currentCode=""
                              language="typescript"
                              cursorPosition={0}
                              onCodeGenerated={(code, title) => {
                                if (title) {
                                  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.ts`;
                                  createFile(fileName, 'file');
                                  setTimeout(() => {
                                    const newFile = files.find(f => f.name === fileName);
                                    if (newFile) {
                                      updateFileContent(newFile.id, code);
                                      openFile(newFile);
                                    }
                                  }, 100);
                                }
                              }}
                            />
                          ) : (
                            <EnhancedAIPanel 
                              onCodeGenerated={(code, title) => {
                                if (title) {
                                  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.ts`;
                                  createFile(fileName, 'file');
                                  setTimeout(() => {
                                    const newFile = files.find(f => f.name === fileName);
                                    if (newFile) {
                                      updateFileContent(newFile.id, code);
                                      openFile(newFile);
                                    }
                                  }, 100);
                                }
                              }}
                            />
                          )}
                        </div>
                        {!isTablet && (
                          <div className="h-1/2 flex overflow-hidden">
                          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
                            <DatabaseViewer />
                          </div>
                          <div className="w-1/2 overflow-hidden">
                            <ResearchPaperViewer />
                          </div>
                        </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {terminalVisible && !isMobile && (
              <div 
                className="border-t border-purple-200/50 dark:border-purple-700/50 terminal-toggle bg-gradient-to-r from-gray-900/95 via-purple-950/95 to-blue-950/95 backdrop-blur-xl shadow-2xl"
                style={{ height: isTablet ? 250 : terminalHeight }}
              >
                <Terminal 
                  onClose={() => setTerminalVisible(false)}
                  height={isTablet ? 250 : terminalHeight}
                  onHeightChange={isTablet ? () => {} : setTerminalHeight}
                />
              </div>
            )}
            
            {/* Mobile Terminal - Bottom Sheet */}
            {terminalVisible && isMobile && (
              <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-purple-950/80 to-blue-950/80 backdrop-blur-xl border-t border-purple-700/50 z-50 h-64 shadow-2xl">
                <Terminal 
                  onClose={() => setTerminalVisible(false)}
                  height={256}
                  onHeightChange={() => {}}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="hidden">
          <StatusBar 
            activeFile={activeFile}
            theme={theme}
            terminalVisible={terminalVisible}
            aiPanelVisible={aiPanelVisible}
          />
        </div>

        {/* Streamlined Onboarding */}
        <StreamlinedOnboarding
          isVisible={showStreamlinedOnboarding}
          onComplete={() => {
            setShowStreamlinedOnboarding(false);
            completeTour();
          }}
          onCreateFile={createFile}
          onToggleAI={() => setAiPanelVisible(true)}
          onToggleMusic={() => setMusicPlayerVisible(true)}
          onShowEthicalAI={() => setShowEthicalAI(true)}
        />
        
        {/* Performance Optimizer */}
        {showPerformanceOptimizer && (
          <div className="fixed inset-4 z-50">
            <LazyLoadWrapper name="Performance Optimizer">
              <PerformanceOptimizer />
            </LazyLoadWrapper>
            <button
              onClick={() => setShowPerformanceOptimizer(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {/* Community Builder */}
        {showCommunityBuilder && (
          <div className="fixed inset-4 z-50">
            <LazyLoadWrapper name="Community Builder">
              <CommunityBuilder />
            </LazyLoadWrapper>
            <button
              onClick={() => setShowCommunityBuilder(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {/* Accessibility Enhancer */}
        <AccessibilityEnhancer
          isVisible={showAccessibilityEnhancer}
          onClose={() => setShowAccessibilityEnhancer(false)}
        />
        
        {/* Documentation Maker */}
        {showDocumentationMaker && activeFile && (
          <div className="fixed inset-4 z-50">
            <LazyLoadWrapper name="Documentation Maker">
              <DocumentationMaker
                currentCode={activeFile.content}
                language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
                onDocumentationGenerated={(docs) => {
                  const fileName = `${activeFile.name.split('.')[0]}-docs.md`;
                  createFile(fileName, 'file');
                  setTimeout(() => {
                    const newFile = files.find(f => f.name === fileName);
                    if (newFile) {
                      updateFileContent(newFile.id, docs);
                      openFile(newFile);
                    }
                  }, 100);
                }}
              />
            </LazyLoadWrapper>
            <button
              onClick={() => setShowDocumentationMaker(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {/* First Time User Experience */}
        {!showStreamlinedOnboarding && (
          <FirstTimeUserGuide
            isFirstTime={isFirstTime}
            onComplete={completeTour}
          />
        )}
        
        <BeginnerHelp
          isVisible={showBeginnerHelp}
          onClose={() => setShowBeginnerHelp(false)}
        />
        
        <HowToGuide
          isVisible={showHowToGuide}
          onClose={() => setShowHowToGuide(false)}
        />
        
        <AboutModal
          isVisible={showAboutModal}
          onClose={() => setShowAboutModal(false)}
          <React.Suspense fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading Research Papers...</p>
              </div>
            </div>
          }>
            <LazyResearchPaperViewer 
              onClose={() => setShowResearchPapers(false)}
              isMobile={isMobile}
            />
          </React.Suspense>
          onClose={() => setShowSecurityPanel(false)}
          currentCode={activeFile?.content || ''}
          language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
          onSecurityFix={(fixedCode) => {
          <React.Suspense fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading Database Viewer...</p>
              </div>
            </div>
          }>
            <LazyDatabaseViewer 
              onClose={() => setShowDatabaseViewer(false)}
              isMobile={isMobile}
            />
          </React.Suspense>
        />
        
        {/* Music Player */}
        {musicPlayerVisible && !musicPlayerMinimized && !isMobile && (
          <MusicPlayer
            isMinimized={false}
            onToggleMinimize={() => setMusicPlayerMinimized(true)}
            onClose={() => setMusicPlayerVisible(false)}
            currentLanguage={selectedLanguage?.name.toLowerCase() || 'typescript'}
            codeComplexity={activeFile ? Math.min(activeFile.content.length / 1000, 1) : 0.5}
          />
        )}
        
        {/* Mobile Music Player - Bottom Sheet */}
        {musicPlayerVisible && isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:via-purple-950/50 dark:to-pink-950/50 backdrop-blur-xl border-t border-purple-200/50 dark:border-purple-700/50 z-50 max-h-80 overflow-y-auto shadow-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Music Player</h3>
                <button
                  onClick={() => setMusicPlayerVisible(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <MusicPlayerMini
                onExpand={() => {}}
                onClose={() => setMusicPlayerVisible(false)}
              />
            </div>
          </div>
        )}
        
        {/* Revolutionary MTV-Style Interface */}
        
        {/* Auto-Fix Panel */}
        <AutoFixPanel
          isVisible={showAutoFix}
          onClose={() => setShowAutoFix(false)}
          currentCode={activeFile?.content || ''}
          language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
          onCodeFixed={(fixedCode, explanation) => {
            if (activeFile) {
              updateFileContent(activeFile.id, fixedCode);
              // Show success notification
              alert(`Auto-fix applied: ${explanation}`);
            }
          }}
        />
        
        {/* Codette Chat */}
        <CodetteChat
          isVisible={showCodetteChat}
          onClose={() => setShowCodetteChat(false)}
          currentCode={activeFile?.content || ''}
          language={selectedLanguage?.name.toLowerCase() || 'typescript'}
          onCodeGenerated={(code, title) => {
            if (title) {
              const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.${selectedLanguage?.extensions[0] || 'ts'}`;
              createFile(fileName, 'file');
              setTimeout(() => {
                const newFile = files.find(f => f.name === fileName);
                if (newFile) {
                  updateFileContent(newFile.id, code);
                  openFile(newFile);
                }
              }, 100);
            } else if (activeFile) {
              updateFileContent(activeFile.id, code);
            } else {
              // Create new file if no active file
              createFile('codette-generated.ts', 'file');
              setTimeout(() => {
                const newFile = files.find(f => f.name === 'codette-generated.ts');
                if (newFile) {
                  updateFileContent(newFile.id, code);
                  openFile(newFile);
                }
              }, 100);
            }
          }}
        />
        
        {/* MTV-Style Music Player */}
        {showMTVMusicPlayer && (
          <MTVStyleMusicPlayer
            isVisible={showMTVMusicPlayer}
            onClose={() => setShowMTVMusicPlayer(false)}
            currentLanguage={selectedLanguage?.name.toLowerCase() || 'typescript'}
            codeComplexity={activeFile ? Math.min(activeFile.content.length / 1000, 1) : 0.5}
                      const newFile = files.find(f => f.name === fileName);
                      if (newFile) {
          <React.Suspense fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading Performance Optimizer...</p>
              </div>
            </div>
          }>
            <LazyPerformanceOptimizer 
                      }
                    }, 100);
                  } else if (activeFile) {
                    updateFileContent(activeFile.id, code);
                  }
                }}
              />
            </div>
            <button
              onClick={() => setShowEthicalAI(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {showCodeHealth && activeFile && (
          <div className="fixed inset-4 bg-gradient-to-br from-white/95 via-blue-50/80 to-purple-50/80 dark:from-gray-800/95 dark:via-blue-950/80 dark:to-purple-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 dark:border-blue-700/50 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <CodeHealthDashboard
                currentCode={activeFile.content}
                language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
              />
            </div>
            <button
              onClick={() => setShowCodeHealth(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {showPerformanceMonitor && activeFile && (
          <div className="fixed inset-4 bg-gradient-to-br from-white/95 via-orange-50/80 to-red-50/80 dark:from-gray-800/95 dark:via-orange-950/80 dark:to-red-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-200/50 dark:border-orange-700/50 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <PerformanceMonitor
                currentCode={activeFile.content}
                language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
              />
            </div>
            <button
              onClick={() => setShowPerformanceMonitor(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {showQuantumVisualizer && (
          <div className="fixed inset-4 bg-gradient-to-br from-white/95 via-purple-50/80 to-indigo-50/80 dark:from-gray-800/95 dark:via-purple-950/80 dark:to-indigo-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200/50 dark:border-purple-700/50 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Atom className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quantum Code Visualizer</h2>
                </div>
                <button
                  onClick={() => setShowQuantumVisualizer(false)}
                  className="p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <QuantumVisualizer />
              {activeFile && (
                <div className="mt-6">
                  <QuantumCodeVisualizer
                    currentCode={activeFile.content}
                    language={selectedLanguage?.name.toLowerCase() || 'typescript'}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        {showCocoonsViewer && (
          <div className="fixed inset-4 bg-gradient-to-br from-white/95 via-pink-50/80 to-purple-50/80 dark:from-gray-800/95 dark:via-pink-950/80 dark:to-purple-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-200/50 dark:border-pink-700/50 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quantum Cocoons</h2>
                </div>
                <button
                  onClick={() => setShowCocoonsViewer(false)}
                  className="p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <CocoonsViewer />
            </div>
          </div>
        )}
        
        {/* Mini Music Player */}
        {musicPlayerVisible && musicPlayerMinimized && playerState.currentTrack && !isMobile && (
          <MusicPlayerMini
            onExpand={() => setMusicPlayerMinimized(false)}
            onClose={() => setMusicPlayerVisible(false)}
          />
        )}
        
        {/* Copyright Watermark */}
        <div className={`copyright-watermark ${isMobile ? 'mobile-hidden' : ''} z-0`}>
          © 2025 Raiff's Bits
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu
          isOpen={showMobileMenu}
          <React.Suspense fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading Community Hub...</p>
              </div>
            </div>
          }>
            <LazyCommunityBuilder 
            if (isMobile) setSidebarCollapsed(true);
          }}
          onToggleAI={() => setAiPanelVisible(!aiPanelVisible)}
          </React.Suspense>
          onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
          onToggleSecurity={() => setShowSecurityPanel(!showSecurityPanel)}
          onShowHelp={() => setShowBeginnerHelp(true)}
          onShowHowTo={() => setShowHowToGuide(true)}
          <React.Suspense fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading Accessibility Center...</p>
              </div>
            </div>
          }>
            <LazyAccessibilityEnhancer 
          terminalVisible={terminalVisible}
          showSecurityPanel={showSecurityPanel}
          onToggleEthicalAI={() => setShowEthicalAI(!showEthicalAI)}
          </React.Suspense>
          onToggleQuantumVisualizer={() => setShowQuantumVisualizer(!showQuantumVisualizer)}
          onToggleCocoonsViewer={() => setShowCocoonsViewer(!showCocoonsViewer)}
          onTogglePerformanceMonitor={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
          showEthicalAI={showEthicalAI}
          <React.Suspense fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading Documentation Maker...</p>
              </div>
            </div>
          }>
            <LazyDocumentationMaker 
          showCocoonsViewer={showCocoonsViewer}
          showPerformanceMonitor={showPerformanceMonitor}
          forceMobileLayout={forceMobileLayout}
          </React.Suspense>
    </TooltipProvider>
    </TouchGestures>
    </ErrorBoundary>
          </React.Suspense>
}

export default App;