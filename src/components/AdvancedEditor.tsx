import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Save, 
  Wand2, 
  Lightbulb, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Sparkles,
  Target,
  Code,
  FileText,
  Users,
  Atom,
  Mic,
  X,
  Shield
} from 'lucide-react';
import { FileType } from '../types/file';
import { aiCodeService, CodeSuggestion } from '../services/aiCodeService';
import { ContextualAIAssistant } from './ContextualAIAssistant';
import { SmartCodeCompletion } from './SmartCodeCompletion';
import { useAutoFix } from '../hooks/useAutoFix';

interface AdvancedEditorProps {
  file: FileType;
  onContentChange: (content: string) => void;
  onCursorChange?: (position: number) => void;
  onSave?: () => void;
  onClose?: () => void;
  theme?: 'light' | 'dark';
}

export function AdvancedEditor({ file, onContentChange, onCursorChange, onSave, onClose, theme }: AdvancedEditorProps) {
  const editorRef = useRef<any>(null);
  const { performAutoFix, autoFixEnabled } = useAutoFix();
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoCorrectEnabled, setAutoCorrectEnabled] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [codeQuality, setCodeQuality] = useState<any>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selectedText, setSelectedText] = useState('');
  const [showCompletions, setShowCompletions] = useState(false);
  const [showAutoFixNotification, setShowAutoFixNotification] = useState(false);
  const [autoFixResult, setAutoFixResult] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const language = aiCodeService.getLanguageFromExtension(file.name);
  const languageName = language?.name.toLowerCase() || 'plaintext';

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  useEffect(() => {
    if (editorRef.current && file.content) {
      analyzeCodeQuality();
    }
  }, [file.content]);

  const analyzeCodeQuality = async () => {
    if (!aiEnabled || !file.content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const quality = await aiCodeService.analyzeCodeQuality(file.content, languageName);
      setCodeQuality(quality);
    } catch (error) {
      console.warn('Code quality analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoFix = async () => {
    if (!autoFixEnabled || !file.content.trim()) return;
    
    try {
      const result = await performAutoFix(file.content, languageName);
      
      if (result.fixed) {
        onContentChange(result.fixed_code);
        setAutoFixResult(`Auto-fixed: ${result.fixes_applied.join(', ')}`);
        setShowAutoFixNotification(true);
        setTimeout(() => setShowAutoFixNotification(false), 3000);
      }
    } catch (error) {
      console.warn('Auto-fix failed:', error);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      lineHeight: 1.6,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      tabSize: 2,
      insertSpaces: true
    });

    // Add AI-powered autocomplete
    monaco.languages.registerCompletionItemProvider(languageName, {
      provideCompletionItems: async (model: any, position: any) => {
        if (!aiEnabled) return { suggestions: [] };

        const code = model.getValue();
        const offset = model.getOffsetAt(position);
        
        try {
          const aiSuggestions = await aiCodeService.getCodeCompletion(code, languageName, offset);
          
          return {
            suggestions: aiSuggestions.map(suggestion => ({
              label: suggestion.text,
              kind: monaco.languages.CompletionItemKind.Text,
              insertText: suggestion.text,
              detail: `AI Suggestion (${(suggestion.confidence * 100).toFixed(0)}% confidence)`,
              documentation: `Type: ${suggestion.type}`
            }))
          };
        } catch (error) {
          console.warn('AI completion failed:', error);
          return { suggestions: [] };
        }
      }
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => {
      optimizeCode();
    });

    // Ctrl/Cmd + Shift + F to auto-fix
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      handleAutoFix();
    });

    // Track cursor position and selection
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column });
      onCursorChange?.(editor.getModel().getOffsetAt(e.position));
    });

    editor.onDidChangeCursorSelection((e: any) => {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        const selectedText = editor.getModel().getValueInRange(selection);
        setSelectedText(selectedText);
      } else {
        setSelectedText('');
      }
    });

    // Smart completions trigger
    editor.onDidChangeModelContent(() => {
      const position = editor.getPosition();
      const model = editor.getModel();
      const lineContent = model.getLineContent(position.lineNumber);
      const wordAtPosition = model.getWordAtPosition(position);
      
      if (wordAtPosition && wordAtPosition.word.length > 2) {
        setShowCompletions(true);
      } else {
        setShowCompletions(false);
      }
    });

    // Auto-correct on selection change
    editor.onDidChangeCursorSelection(async (e: any) => {
      if (!autoCorrectEnabled) return;
      
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        const selectedText = editor.getModel().getValueInRange(selection);
        if (selectedText.trim()) {
          const corrections = await aiCodeService.getCodeCorrection(selectedText, languageName);
          if (corrections.length > 0) {
            setSuggestions(corrections);
            setShowSuggestions(true);
          }
        }
      }
    });
  };

  const handleSave = () => {
    if (onSave) {
      console.log('Save button clicked');
      onSave();
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 2000);
    }
  };

  const optimizeCode = async () => {
    if (!aiEnabled || !editorRef.current) return;
    
    setIsAnalyzing(true);
    try {
      const code = editorRef.current.getValue();
      const optimizations = await aiCodeService.getCodeOptimization(code, languageName);
      
      if (optimizations.length > 0) {
        setSuggestions(optimizations);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.warn('Code optimization failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: CodeSuggestion) => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const model = editor.getModel();
    
    if (suggestion.type === 'correction' || suggestion.type === 'optimization') {
      // Replace entire content for corrections/optimizations
      model.setValue(suggestion.text);
    } else {
      // Insert completion at cursor
      const position = editor.getPosition();
      editor.executeEdits('ai-suggestion', [{
        range: new (window as any).monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
        text: suggestion.text
      }]);
    }
    
    onContentChange(model.getValue());
    setShowSuggestions(false);
  };

  const getLanguageIcon = () => {
    if (!language) return <FileText className="w-4 h-4 text-gray-500" />;
    
    const iconClass = "w-4 h-4";
    switch (language.name.toLowerCase()) {
      case 'javascript':
      case 'jsx':
        return <Code className={`${iconClass} text-yellow-500`} />;
      case 'typescript':
      case 'tsx':
        return <Code className={`${iconClass} text-blue-500`} />;
      case 'python':
        return <Code className={`${iconClass} text-green-500`} />;
      case 'css':
      case 'scss':
        return <Code className={`${iconClass} text-blue-600`} />;
      case 'html':
        return <Code className={`${iconClass} text-orange-500`} />;
      case 'json':
        return <Code className={`${iconClass} text-green-600`} />;
      case 'rust':
        return <Code className={`${iconClass} text-orange-600`} />;
      case 'go':
        return <Code className={`${iconClass} text-cyan-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Enhanced Tab Bar */}
      <div className={`flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${isMobile ? 'px-3 py-2' : 'px-6 py-3'} language-badges`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {getLanguageIcon()}
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 dark:text-gray-300`}>
              {file.name}
            </span>
            {file.modified && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
            {onClose && (
              <button
                onClick={onClose}
                className={`${isMobile ? 'p-2' : 'p-1'} hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors touch-target`}
                title="Close file"
              >
                <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
          
          {language && !isMobile && (
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-105 cursor-pointer border border-transparent hover:border-blue-300 dark:hover:border-blue-600"
                onClick={() => console.log(`Language: ${language.name}`)}
                title={`${language.name} - Click for language options`}
              >
                {language.name}
              </button>
              {language.hasLSP && (
                <button 
                  className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-200 hover:scale-105 cursor-pointer border border-transparent hover:border-green-300 dark:hover:border-green-600 animate-pulse"
                  onClick={() => console.log('LSP Status: Active')}
                  title="Language Server Protocol - Active"
                >
                  LSP
                </button>
              )}
              {language.aiSupported && (
                <button 
                  className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200 hover:scale-105 cursor-pointer border border-transparent hover:border-purple-300 dark:hover:border-purple-600 relative overflow-hidden group"
                  onClick={() => console.log('AI Features: Enabled')}
                  title="AI-Powered Features - Click to configure"
                >
                  <span className="relative z-10">AI</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          )}
          
          {language && !isMobile && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Language detection active"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                .{language.extensions[0]}
              </span>
            </div>
          )}
        </div>
        
        <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-3'}`}>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${isMobile ? 'px-2 py-2' : 'px-4 py-2'} text-xs font-medium rounded-lg transition-all duration-200 ${isMobile ? '' : 'transform hover:scale-105'} touch-target ${
              aiEnabled 
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-xl' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500'
            }`}
            title="Toggle AI Assistance"
          >
            <Brain className="w-4 h-4" />
            <span className={isMobile ? 'hidden' : ''}>AI Assistant</span>
            {aiEnabled && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
          </button>
          
          <button
            onClick={() => setAutoCorrectEnabled(!autoCorrectEnabled)}
            className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${isMobile ? 'px-2 py-2' : 'px-4 py-2'} text-xs font-medium rounded-lg transition-all duration-200 ${isMobile ? '' : 'transform hover:scale-105'} touch-target ${
              autoCorrectEnabled 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500'
            }`}
            title="Toggle Auto-Correct"
          >
            <Wand2 className="w-4 h-4" />
            <span className={isMobile ? 'hidden' : ''}>Auto-Correct</span>
            {autoCorrectEnabled && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
          </button>
          
          <button
            onClick={optimizeCode}
            disabled={isAnalyzing || !aiEnabled}
            className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${isMobile ? 'px-2 py-2' : 'px-4 py-2'} text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isMobile ? '' : 'transform hover:scale-105'} shadow-lg hover:shadow-xl touch-target`}
            title="AI Code Optimization (⌘I)"
          >
            <Sparkles className="w-4 h-4" />
            <span className={isMobile ? 'hidden' : ''}>Optimize Code</span>
            {isAnalyzing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          </button>
          
          <button
            onClick={handleAutoFix}
            disabled={!autoFixEnabled || !file.content.trim()}
            className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${isMobile ? 'px-2 py-2' : 'px-4 py-2'} text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isMobile ? '' : 'transform hover:scale-105'} shadow-lg hover:shadow-xl touch-target`}
            title="Auto-Fix Code (⌘⇧F)"
          >
            <Wand2 className="w-4 h-4" />
            <span className={isMobile ? 'hidden' : ''}>Auto-Fix</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={!file.modified}
            className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${isMobile ? 'px-2 py-2' : 'px-4 py-2'} text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isMobile ? '' : 'transform hover:scale-105'} shadow-lg hover:shadow-xl touch-target`}
            title="Save File (⌘S)"
          >
            <Save className="w-4 h-4" />
            <span className={isMobile ? 'hidden' : ''}>Save File</span>
            {file.modified && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
          </button>
        </div>
      </div>
      
      {/* Language Info Tooltip */}
      {language && !isMobile && (
        <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700 ${isMobile ? 'px-3 py-1' : 'px-6 py-2'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                {getLanguageIcon()}
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300`}>
                  {language.name} detected
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Syntax Highlighting</span>
                </div>
                {language.hasLSP && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">IntelliSense</span>
                  </div>
                )}
                {language.aiSupported && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">AI Assistance</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Extensions: .{language.extensions.join(', .')}
            </div>
          </div>
        </div>
      )}
      
      {/* Code Quality Indicator */}
      {codeQuality && !isMobile && (
        <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700 ${isMobile ? 'px-3 py-1' : 'px-6 py-2'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300`}>
                  Complexity: {(codeQuality.complexity * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300`}>
                  Maintainability: {(codeQuality.maintainability * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            {codeQuality.suggestions.length > 0 && (
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
                  {codeQuality.suggestions.length} suggestion{codeQuality.suggestions.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Save Notification */}
      {showSaveNotification && (
        <div className={`absolute ${isMobile ? 'top-16 right-3' : 'top-20 right-6'} bg-green-500 text-white ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in`}>
          <CheckCircle className="w-5 h-5" />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>File saved successfully!</span>
        </div>
      )}
      
      {/* Auto-Fix Notification */}
      {showAutoFixNotification && (
        <div className={`absolute ${isMobile ? 'top-24 right-3' : 'top-28 right-6'} bg-purple-500 text-white ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in`}>
          <Wand2 className="w-5 h-5" />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{autoFixResult}</span>
        </div>
      )}
      
      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getMonacoLanguage(languageName)}
          value={file.content}
          onChange={(value) => onContentChange(value || '')}
          onMount={handleEditorDidMount}
          theme={theme === 'light' ? 'vs' : 'vs-dark'}
          options={{
            fontSize: isMobile ? 12 : 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            lineHeight: 1.6,
            minimap: { enabled: !isMobile },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true
            },
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            bracketPairColorization: { enabled: !isMobile },
            guides: {
              bracketPairs: !isMobile,
              indentation: true
            },
            inlineSuggest: { enabled: true },
            codeLens: !isMobile,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: isMobile ? 'mouseover' : 'always',
            lineNumbers: isMobile ? 'off' : 'on',
            glyphMargin: !isMobile,
            lineDecorationsWidth: isMobile ? 0 : 10,
            lineNumbersMinChars: isMobile ? 0 : 3,
            overviewRulerLanes: isMobile ? 0 : 3
          }}
        />
        
        {/* AI Suggestions Overlay */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-4 right-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-md z-40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800 dark:text-white">AI Suggestions</h4>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.type === 'completion' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      suggestion.type === 'correction' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {suggestion.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(suggestion.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  
                  <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2 overflow-x-auto">
                    {suggestion.text}
                  </pre>
                  
                  <button
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full px-3 py-2 bg-blue-500 text-gray-50 text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Apply Suggestion
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Smart Code Completion */}
        <SmartCodeCompletion
          currentCode={file.content}
          language={languageName}
          cursorPosition={file.content.length}
          onCompletion={(completion) => {
            if (editorRef.current) {
              const position = editorRef.current.getPosition();
              editorRef.current.executeEdits('smart-completion', [{
                range: new (window as any).monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                text: completion
              }]);
              onContentChange(editorRef.current.getValue());
            }
          }}
          visible={showCompletions}
        />
      </div>
    </div>
  );
}

function getMonacoLanguage(languageName: string): string {
  const languageMap: Record<string, string> = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'python': 'python',
    'java': 'java',
    'c++': 'cpp',
    'c': 'c',
    'rust': 'rust',
    'go': 'go',
    'php': 'php',
    'ruby': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'scala': 'scala',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'markdown': 'markdown',
    'sql': 'sql',
    'shell': 'shell',
    'powershell': 'powershell',
    'dockerfile': 'dockerfile',
    'r': 'r',
    'lua': 'lua',
    'perl': 'perl',
    'haskell': 'haskell',
    'dart': 'dart',
    'latex': 'latex'
  };
  
  return languageMap[languageName] || 'plaintext';
}