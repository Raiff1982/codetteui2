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
import { AboutModal } from './components/AboutModal';
import { MusicPlayer } from './components/MusicPlayer';
import { MusicPlayerMini } from './components/MusicPlayerMini';
import { HowToGuide } from './components/HowToGuide';
import { SecurityPanel } from './components/SecurityPanel';
import { MobileMenu } from './components/MobileMenu';
import { TouchGestures } from './components/TouchGestures';
import { RevolutionaryInterface } from './components/RevolutionaryInterface';
import { MTVStyleMusicPlayer } from './components/MTVStyleMusicPlayer';
import { EthicalAIPanel } from './components/EthicalAIPanel';
import { CodeHealthDashboard } from './components/CodeHealthDashboard';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { AutoFixPanel } from './components/AutoFixPanel';
import { CodetteChat } from './components/CodetteChat';
import { useTheme } from './hooks/useTheme';
import { useFileSystem } from './hooks/useFileSystem';
import { useFirstTimeUser } from './hooks/useFirstTimeUser';
import { useMusic } from './hooks/useMusic';
import { useAdvancedAI } from './hooks/useAdvancedAI';
import { aiCodeService } from './services/aiCodeService';
import { backendIntegration } from './services/backendIntegration';
import { X, Crown, Sparkles, Music, Trophy, Shield, Activity, Atom, Brain } from 'lucide-react';

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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    <TouchGestures
      onSwipeRight={() => isMobile && setSidebarCollapsed(false)}
      onSwipeLeft={() => isMobile && setSidebarCollapsed(true)}
      onSwipeUp={() => isMobile && setTerminalVisible(true)}
      onSwipeDown={() => isMobile && setTerminalVisible(false)}
    >
      <TooltipProvider showBeginnerTips={showBeginnerTips}>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
          onShowHowTo={() => setShowHowToGuide(true)}
          onShowSecurity={() => setShowSecurityPanel(true)}
          forceMobileLayout={forceMobileLayout}
          onToggleMobileLayout={() => setForceMobileLayout(!forceMobileLayout)}
          onToggleAutoFix={() => setShowAutoFix(!showAutoFix)}
          showAutoFix={showAutoFix}
          onToggleChat={() => setShowCodetteChat(!showCodetteChat)}
        />
        
        <div className={`flex flex-1 overflow-hidden ${isMobile ? 'mobile-stack' : ''}`}>
          <Sidebar 
            collapsed={sidebarCollapsed}
            onCollapse={() => setSidebarCollapsed(true)}
          >
            <div className="file-explorer">
              <FileExplorer
                files={files}
                activeFile={activeFile}
                onFileSelect={openFile}
                onFileCreate={createFile}
                onFileDelete={deleteFile}
              />
            </div>
          </Sidebar>
          
          <div className={`flex-1 flex flex-col ${isMobile ? 'min-h-0' : ''}`}>
            <div className="flex-1 relative">
              {activeFile ? (
                <div className={`flex h-full ${isMobile ? 'flex-col space-y-2' : ''}`}>
                  <div className="flex-1 editor-area">
                    <AdvancedEditor
                      file={activeFile}
                      onContentChange={(content) => updateFileContent(activeFile.id, content)}
                      onCursorChange={(position) => setCursorPosition(position)}
                      onSave={() => saveFile(activeFile.id)}
                      onClose={() => closeFile(activeFile.id)}
                      theme={theme}
                    />
                  </div>
                  
                  {aiPanelVisible && !isMobile && (
                    <div 
                      className="border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
                      style={{ 
                        width: isTablet ? 350 : Math.min(aiPanelWidth, window.innerWidth * 0.4),
                        maxWidth: '450px',
                        minWidth: '300px'
                      }}
                    >
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
                        <div className={`${isTablet ? 'w-full border-b' : 'flex-1 border-r'} border-gray-200 dark:border-gray-700 overflow-hidden`}>
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
                        <div className={`${isTablet ? 'w-full border-b' : 'flex-1 border-r'} border-gray-200 dark:border-gray-700 overflow-hidden`}>
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
                    </div>
                  )}
                  
                  {/* Mobile AI Panel - Bottom Sheet */}
                  {aiPanelVisible && isMobile && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
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
                    />
                  )}
                  
                  {aiPanelVisible && !isMobile && (
                    <div
                      className="absolute top-0 right-0 h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-20 overflow-hidden"
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
                className="border-t border-gray-200 dark:border-gray-700 terminal-toggle"
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
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 h-64">
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

        {/* First Time User Experience */}
        <FirstTimeUserGuide
          isFirstTime={isFirstTime}
          onComplete={completeTour}
        />
        
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
        />
        
        <SecurityPanel
          isVisible={showSecurityPanel}
          onClose={() => setShowSecurityPanel(false)}
          currentCode={activeFile?.content || ''}
          language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
          onSecurityFix={(fixedCode) => {
            if (activeFile) {
              updateFileContent(activeFile.id, fixedCode);
            }
          }}
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
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
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
          />
        )}
        
        {/* Floating Advanced Panels */}
        {showEthicalAI && (
          <div className="fixed inset-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="h-full">
              <EthicalAIPanel
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
                  }
                }}
              />
            </div>
            <button
              onClick={() => setShowEthicalAI(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {showCodeHealth && activeFile && (
          <div className="fixed inset-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <CodeHealthDashboard
                currentCode={activeFile.content}
                language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
              />
            </div>
            <button
              onClick={() => setShowCodeHealth(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {showPerformanceMonitor && activeFile && (
          <div className="fixed inset-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <PerformanceMonitor
                currentCode={activeFile.content}
                language={selectedLanguage?.name.toLowerCase() || 'plaintext'}
              />
            </div>
            <button
              onClick={() => setShowPerformanceMonitor(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {showQuantumVisualizer && (
          <div className="fixed inset-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Atom className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quantum Code Visualizer</h2>
                </div>
                <button
                  onClick={() => setShowQuantumVisualizer(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
          <div className="fixed inset-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quantum Cocoons</h2>
                </div>
                <button
                  onClick={() => setShowCocoonsViewer(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
          onClose={() => {
            setShowMobileMenu(false);
            if (isMobile) setSidebarCollapsed(true);
          }}
          onToggleAI={() => setAiPanelVisible(!aiPanelVisible)}
          onToggleMusic={() => setMusicPlayerVisible(!musicPlayerVisible)}
          onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
          onToggleSecurity={() => setShowSecurityPanel(!showSecurityPanel)}
          onShowHelp={() => setShowBeginnerHelp(true)}
          onShowHowTo={() => setShowHowToGuide(true)}
          aiPanelVisible={aiPanelVisible}
          musicPlayerVisible={musicPlayerVisible}
          terminalVisible={terminalVisible}
          showSecurityPanel={showSecurityPanel}
          onToggleEthicalAI={() => setShowEthicalAI(!showEthicalAI)}
          onToggleCodeHealth={() => setShowCodeHealth(!showCodeHealth)}
          onToggleQuantumVisualizer={() => setShowQuantumVisualizer(!showQuantumVisualizer)}
          onToggleCocoonsViewer={() => setShowCocoonsViewer(!showCocoonsViewer)}
          onTogglePerformanceMonitor={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
          showEthicalAI={showEthicalAI}
          showCodeHealth={showCodeHealth}
          showQuantumVisualizer={showQuantumVisualizer}
          showCocoonsViewer={showCocoonsViewer}
          showPerformanceMonitor={showPerformanceMonitor}
          forceMobileLayout={forceMobileLayout}
          onToggleMobileLayout={() => setForceMobileLayout(!forceMobileLayout)}
          codingStreak={codingStreak}
          totalLinesCodedToday={totalLinesCodedToday}
          onToggleMTVMusicPlayer={() => setShowMTVMusicPlayer(!showMTVMusicPlayer)}
          onToggleRevolutionaryInterface={() => setShowRevolutionaryInterface(!showRevolutionaryInterface)}
          showMTVMusicPlayer={showMTVMusicPlayer}
          showRevolutionaryInterface={showRevolutionaryInterface}
          onToggleAutoFix={() => setShowAutoFix(!showAutoFix)}
          showAutoFix={showAutoFix}
          onToggleChat={() => setShowCodetteChat(!showCodetteChat)}
          isMobile={isMobile}
        />
        
      </div>
    </TooltipProvider>
    </TouchGestures>
    </ErrorBoundary>
  );
}

export default App;