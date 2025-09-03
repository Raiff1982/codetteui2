interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  activeFile: FileType | null;
  onSave: () => void;
  onCloseFile: () => void;
  onToggleAI: () => void;
  selectedLanguage: any;
  onLanguageChange: (language: any) => void;
  showBeginnerTips: boolean;
  onToggleBeginnerTips: () => void;
  onShowHelp: () => void;
  onToggleMusic: () => void;
  musicPlayerVisible: boolean;
  onShowHowTo: () => void;
  onShowSecurity: () => void;
  forceMobileLayout: boolean;
  onToggleMobileLayout: () => void;
  onToggleAutoFix: () => void;
  showAutoFix: boolean;
  onToggleChat: () => void;
  onTogglePerformanceOptimizer?: () => void;
  onToggleCommunityBuilder?: () => void;
  onToggleAccessibility?: () => void;
  onToggleDocumentation?: () => void;
  aiDrawerOpen?: boolean;
  focusMode?: boolean;
}

export function Header({
  theme,
  onToggleTheme,
  onToggleSidebar,
  onToggleTerminal,
  activeFile,
  onSave,
  onCloseFile,
  onToggleAI,
  selectedLanguage,
  onLanguageChange,
  showBeginnerTips,
  onToggleBeginnerTips,
  onShowHelp,
  onToggleMusic,
  musicPlayerVisible,
  onShowHowTo,
  onShowSecurity,
  forceMobileLayout,
  onToggleMobileLayout,
  onToggleAutoFix,
  showAutoFix,
  onToggleChat,
  onTogglePerformanceOptimizer = () => {},
  onToggleCommunityBuilder = () => {},
  onToggleAccessibility = () => {},
  onToggleDocumentation = () => {},
  aiDrawerOpen = false,
  focusMode = false
}: HeaderProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    // Check if backend is available
    fetch('/api/health')
      .then(response => response.ok ? setBackendConnected(true) : setBackendConnected(false))
      .catch(() => setBackendConnected(false));
  }, []);

  return (
    <header className="h-16 bg-gradient-to-r from-white/90 via-blue-50/70 to-purple-50/70 dark:from-gray-900/90 dark:via-blue-950/70 dark:to-purple-950/70 backdrop-blur-xl border-b border-blue-200/50 dark:border-purple-700/50 flex items-center justify-between px-6 relative z-30 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-white/60 dark:hover:bg-gray-700/60 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 animate-pulse">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">Codette</h1>
            <p className="text-xs bg-gradient-to-r from-gray-600 to-purple-600 bg-clip-text text-transparent font-medium">AI Development Environment</p>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-4">
        {/* Backend Status Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
          backendConnected 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-800/50'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50'
        }`}>
          <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-xs font-medium">
            {backendConnected ? 'AI Systems Online' : 'Frontend Demo Mode'}
          </span>
        </div>

        {activeFile && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-200 dark:to-blue-400 bg-clip-text text-transparent">
              {activeFile.name}
            </span>
            {activeFile.modified && (
              <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse shadow-lg" />
            )}
            <button
              onClick={onSave}
              disabled={!activeFile.modified}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
              title="Save File (⌘S)"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        )}

        <LanguageSelector
          currentLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Quick Access to New Features */}
        <div className="hidden lg:flex items-center space-x-2">
          <button
            onClick={onTogglePerformanceOptimizer}
            className="p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            title="Performance Optimizer (⌘⇧O)"
          >
            <TrendingUp className="w-4 h-4 text-green-600" />
          </button>
          
          <button
            onClick={onToggleCommunityBuilder}
            className="p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            title="Community Hub (⌘⇧B)"
          >
            <Users className="w-4 h-4 text-purple-600" />
          </button>
          
          <button
            onClick={onToggleAccessibility}
            className="p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            title="Accessibility Center (⌘⇧X)"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          
          <button
            onClick={onToggleDocumentation}
            className="p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            title="Documentation Maker"
          >
            <BookOpen className="w-4 h-4 text-orange-600" />
          </button>
        </div>
        
        <button
          onClick={onToggleChat}
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          title="Chat with Codette AI"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Chat</span>
        </button>

        <button
          onClick={onToggleAI}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${
            aiDrawerOpen
              ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
          }`}
          title="Toggle AI Panel (⌘⇧A)"
        >
          <Brain className="w-4 h-4" />
          <span className="text-sm font-medium">AI</span>
        </button>

        <button
          onClick={onToggleTerminal}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${
            terminalVisible
              ? 'bg-gradient-to-r from-gray-900 to-black text-white'
              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black'
          }`}
          title="Toggle Terminal (⌘`)"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Terminal</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2.5 hover:bg-white/60 dark:hover:bg-gray-700/60 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
}