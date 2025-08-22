import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  X, 
  Plus, 
  Settings, 
  ChevronUp,
  Palette,
  Code,
  Play,
  Square
} from 'lucide-react';

interface TerminalSession {
  id: string;
  name: string;
  type: 'bash' | 'python' | 'node' | 'java' | 'powershell' | 'cmd' | 'rust' | 'go' | 'php';
  history: Array<{ command: string; output: string; type: 'command' | 'output' | 'error' | 'success' }>;
  currentDirectory: string;
  isActive: boolean;
  environment: Record<string, string>;
}

interface TerminalType {
  id: string;
  name: string;
  prompt: string;
  color: string;
  icon: string;
  extensions: string[];
  interpreter: string;
}

const terminalTypes: TerminalType[] = [
  {
    id: 'bash',
    name: 'Bash',
    prompt: '$',
    color: 'text-green-400',
    icon: '🐚',
    extensions: ['.sh', '.bash'],
    interpreter: 'bash'
  },
  {
    id: 'python',
    name: 'Python',
    prompt: '>>>',
    color: 'text-blue-400',
    icon: '🐍',
    extensions: ['.py', '.pyw'],
    interpreter: 'python3'
  },
  {
    id: 'node',
    name: 'Node.js',
    prompt: '>',
    color: 'text-green-500',
    icon: '⬢',
    extensions: ['.js', '.mjs', '.ts'],
    interpreter: 'node'
  },
  {
    id: 'java',
    name: 'Java',
    prompt: 'java>',
    color: 'text-orange-500',
    icon: '☕',
    extensions: ['.java', '.class'],
    interpreter: 'java'
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    prompt: 'PS>',
    color: 'text-blue-300',
    icon: '💙',
    extensions: ['.ps1', '.psm1'],
    interpreter: 'powershell'
  },
  {
    id: 'cmd',
    name: 'Command Prompt',
    prompt: 'C:>',
    color: 'text-gray-300',
    icon: '⚫',
    extensions: ['.bat', '.cmd'],
    interpreter: 'cmd'
  },
  {
    id: 'rust',
    name: 'Rust',
    prompt: 'rust>',
    color: 'text-orange-400',
    icon: '🦀',
    extensions: ['.rs'],
    interpreter: 'rustc'
  },
  {
    id: 'go',
    name: 'Go',
    prompt: 'go>',
    color: 'text-cyan-400',
    icon: '🐹',
    extensions: ['.go'],
    interpreter: 'go'
  },
  {
    id: 'php',
    name: 'PHP',
    prompt: 'php>',
    color: 'text-purple-400',
    icon: '🐘',
    extensions: ['.php'],
    interpreter: 'php'
  }
];

interface MultiTerminalProps {
  onClose: () => void;
  height: number;
  onHeightChange: (height: number) => void;
}

export function MultiTerminal({ onClose, height, onHeightChange }: MultiTerminalProps) {
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: '1',
      name: 'Main Terminal',
      type: 'bash',
      history: [
        { command: '', output: 'Welcome to Codette Multi-Terminal v2.0.0', type: 'success' },
        { command: '', output: 'Type "help" for available commands', type: 'output' }
      ],
      currentDirectory: '/home/project',
      isActive: true,
      environment: { PATH: '/usr/local/bin:/usr/bin:/bin' }
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Record<string, string[]>>({ '1': [] });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showNewTerminalMenu, setShowNewTerminalMenu] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeTerminalType = terminalTypes.find(t => t.id === activeSession?.type);

  const createNewTerminal = (type: TerminalType) => {
    const newSession: TerminalSession = {
      id: Date.now().toString(),
      name: `${type.name} Terminal`,
      type: type.id as any,
      history: [
        { command: '', output: `${type.name} Terminal initialized`, type: 'success' },
        { command: '', output: `Type "${type.interpreter} --help" for help`, type: 'output' }
      ],
      currentDirectory: '/home/project',
      isActive: false,
      environment: getEnvironmentForType(type.id)
    };

    setSessions(prev => prev.map(s => ({ ...s, isActive: false })).concat({ ...newSession, isActive: true }));
    setActiveSessionId(newSession.id);
    setCommandHistory(prev => ({ ...prev, [newSession.id]: [] }));
    setShowNewTerminalMenu(false);
  };

  const closeTerminal = (sessionId: string) => {
    if (sessions.length === 1) return; // Keep at least one terminal
    
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (sessionId === activeSessionId && filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const getEnvironmentForType = (type: string): Record<string, string> => {
    const baseEnv = { PATH: '/usr/local/bin:/usr/bin:/bin' };
    
    switch (type) {
      case 'python':
        return { ...baseEnv, PYTHONPATH: '/usr/local/lib/python3.11/site-packages' };
      case 'node':
        return { ...baseEnv, NODE_PATH: '/usr/local/lib/node_modules' };
      case 'java':
        return { ...baseEnv, JAVA_HOME: '/usr/lib/jvm/default-java', CLASSPATH: '.' };
      case 'rust':
        return { ...baseEnv, CARGO_HOME: '/usr/local/cargo', RUSTUP_HOME: '/usr/local/rustup' };
      case 'go':
        return { ...baseEnv, GOPATH: '/home/project/go', GOROOT: '/usr/local/go' };
      default:
        return baseEnv;
    }
  };

  const getCommands = (terminalType: string) => {
    const baseCommands = {
      help: () => ({
        output: `Available commands for ${terminalType}:
  help          - Show this help message
  clear         - Clear terminal
  ls            - List files
  pwd           - Show current directory
  cd <dir>      - Change directory
  exit          - Close this terminal
  env           - Show environment variables`,
        type: 'output' as const
      }),
      clear: () => {
        if (activeSession) {
          setSessions(prev => prev.map(s => 
            s.id === activeSessionId ? { ...s, history: [] } : s
          ));
        }
        return null; // Don't add output for clear command
      },
      ls: () => ({
        output: 'src/  backend/  package.json  README.md  index.html  node_modules/',
        type: 'output' as const
      }),
      pwd: () => ({
        output: activeSession?.currentDirectory || '/home/project',
        type: 'output' as const
      }),
      env: () => ({
        output: Object.entries(activeSession?.environment || {})
          .map(([key, value]) => `${key}=${value}`)
          .join('\n'),
        type: 'output' as const
      }),
      exit: () => {
        closeTerminal(activeSessionId);
        return null; // Don't add output for exit command
      }
    };

    const languageCommands = {
      python: {
        ...baseCommands,
        python: (args: string[]) => ({
          output: args.length > 0 ? `Executing: python ${args.join(' ')}` : 'Python 3.11.0 (main, Oct 24 2022, 18:26:48)',
          type: 'success' as const
        }),
        pip: (args: string[]) => ({
          output: `pip ${args.join(' ')} - Package management simulated`,
          type: 'success' as const
        }),
        'python3': (args: string[]) => ({
          output: args.length > 0 ? `Executing: python3 ${args.join(' ')}` : 'Python 3.11.0',
          type: 'success' as const
        })
      },
      node: {
        ...baseCommands,
        node: (args: string[]) => ({
          output: args.length > 0 ? `Executing: node ${args.join(' ')}` : 'Node.js v18.17.0',
          type: 'success' as const
        }),
        npm: (args: string[]) => ({
          output: `npm ${args.join(' ')} - Package management simulated`,
          type: 'success' as const
        }),
        yarn: (args: string[]) => ({
          output: `yarn ${args.join(' ')} - Yarn package manager simulated`,
          type: 'success' as const
        }),
        npx: (args: string[]) => ({
          output: `npx ${args.join(' ')} - Package execution simulated`,
          type: 'success' as const
        })
      },
      java: {
        ...baseCommands,
        java: (args: string[]) => ({
          output: args.length > 0 ? `Executing: java ${args.join(' ')}` : 'Java 17.0.2 2022-01-18 LTS',
          type: 'success' as const
        }),
        javac: (args: string[]) => ({
          output: `javac ${args.join(' ')} - Java compilation simulated`,
          type: 'success' as const
        }),
        mvn: (args: string[]) => ({
          output: `mvn ${args.join(' ')} - Maven build simulated`,
          type: 'success' as const
        }),
        gradle: (args: string[]) => ({
          output: `gradle ${args.join(' ')} - Gradle build simulated`,
          type: 'success' as const
        })
      },
      powershell: {
        ...baseCommands,
        'Get-ChildItem': () => ({
          output: 'Directory: /home/project\n\nMode  LastWriteTime  Length  Name\n----  -------------  ------  ----\nd----  8/13/2025 11:00 PM         src\nd----  8/13/2025 11:00 PM         backend',
          type: 'output' as const
        }),
        'Get-Location': () => ({
          output: activeSession?.currentDirectory || '/home/project',
          type: 'output' as const
        }),
        'Write-Host': (args: string[]) => ({
          output: args.join(' '),
          type: 'output' as const
        })
      },
      rust: {
        ...baseCommands,
        rustc: (args: string[]) => ({
          output: `rustc ${args.join(' ')} - Rust compilation simulated`,
          type: 'success' as const
        }),
        cargo: (args: string[]) => ({
          output: `cargo ${args.join(' ')} - Cargo build system simulated`,
          type: 'success' as const
        })
      },
      go: {
        ...baseCommands,
        go: (args: string[]) => ({
          output: `go ${args.join(' ')} - Go command simulated`,
          type: 'success' as const
        }),
        'go run': (args: string[]) => ({
          output: `Running Go program: ${args.join(' ')}`,
          type: 'success' as const
        }),
        'go build': (args: string[]) => ({
          output: `Building Go program: ${args.join(' ')}`,
          type: 'success' as const
        })
      },
      php: {
        ...baseCommands,
        php: (args: string[]) => ({
          output: args.length > 0 ? `Executing: php ${args.join(' ')}` : 'PHP 8.2.0 (cli)',
          type: 'success' as const
        }),
        composer: (args: string[]) => ({
          output: `composer ${args.join(' ')} - Composer package manager simulated`,
          type: 'success' as const
        })
      }
    };

    const commands = languageCommands[terminalType as keyof typeof languageCommands] || baseCommands;
    
    // Add common Unix commands to all terminal types
    const commonCommands = {
      echo: (args: string[]) => ({
        output: args.join(' '),
        type: 'output' as const
      }),
      date: () => ({
        output: new Date().toString(),
        type: 'output' as const
      }),
      whoami: () => ({
        output: 'codette-user',
        type: 'output' as const
      }),
      uname: () => ({
        output: 'Linux codette-container 5.15.0',
        type: 'output' as const
      }),
      cat: (args: string[]) => ({
        output: args.length > 0 ? `Contents of ${args[0]} would be displayed here` : 'cat: missing file operand',
        type: args.length > 0 ? 'output' as const : 'error' as const
      }),
      mkdir: (args: string[]) => ({
        output: args.length > 0 ? `Directory '${args[0]}' created` : 'mkdir: missing operand',
        type: args.length > 0 ? 'success' as const : 'error' as const
      }),
      touch: (args: string[]) => ({
        output: args.length > 0 ? `File '${args[0]}' created` : 'touch: missing file operand',
        type: args.length > 0 ? 'success' as const : 'error' as const
      })
    };
    
    return { ...commands, ...commonCommands };
  };

  const executeCommand = (command: string, sessionId: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const [cmd, ...args] = trimmed.split(' ');
    const commands = getCommands(session.type);
    const commandFunc = commands[cmd as keyof typeof commands];

    // Add command to history
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, history: [...s.history, { command: trimmed, output: '', type: 'command' }] }
        : s
    ));

    // Execute command
    if (commandFunc) {
      const result = commandFunc(args);
      if (result && result.output !== undefined && cmd !== 'clear') {
        setSessions(prev => prev.map(s => 
          s.id === sessionId 
            ? { ...s, history: [...s.history, { command: '', output: result.output, type: result.type }] }
            : s
        ));
      } else if (cmd === 'clear') {
        // Clear command already handled in the command function
        return;
      }
    } else {
      // Try language-specific execution
      const output = executeLanguageCommand(cmd, args, session.type);
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, history: [...s.history, { command: '', output, type: 'output' }] }
          : s
      ));
    }

    // Update command history
    setCommandHistory(prev => ({
      ...prev,
      [sessionId]: [trimmed, ...(prev[sessionId] || []).slice(0, 49)]
    }));
    setHistoryIndex(-1);
  };

  const executeLanguageCommand = (cmd: string, args: string[], terminalType: string): string => {
    // Handle direct language interpreter calls
    if (cmd === 'python' || cmd === 'python3') {
      if (args.length === 0) {
        return 'Python 3.11.0 (main, Oct 24 2022, 18:26:48)\nType "help", "copyright", "credits" or "license" for more information.\n>>>';
      } else {
        return `Executing: python ${args.join(' ')}\n[Python execution simulated]`;
      }
    }
    
    if (cmd === 'node') {
      if (args.length === 0) {
        return 'Welcome to Node.js v18.17.0.\nType ".help" for more information.\n>';
      } else {
        return `Executing: node ${args.join(' ')}\n[Node.js execution simulated]`;
      }
    }
    
    if (cmd === 'java') {
      if (args.length === 0) {
        return 'Usage: java [options] <mainclass> [args...]\nType "java -help" for more information.';
      } else {
        return `Executing: java ${args.join(' ')}\n[Java execution simulated]`;
      }
    }
    
    switch (terminalType) {
      case 'python':
        if (cmd.startsWith('print(') || cmd.includes('=') || cmd.startsWith('import')) {
          return `>>> ${cmd}\n${simulatePythonExecution(cmd)}`;
        }
        break;
      case 'node':
        if (cmd.startsWith('console.') || cmd.includes('=') || cmd.startsWith('const')) {
          return `> ${cmd}\n${simulateNodeExecution(cmd)}`;
        }
        break;
      case 'java':
        if (cmd.startsWith('System.out.') || cmd.includes('class')) {
          return `java> ${cmd}\n${simulateJavaExecution(cmd)}`;
        }
        break;
    }
    
    return `Command not found: ${cmd}. Type "help" for available commands.`;
  };

  const simulatePythonExecution = (cmd: string): string => {
    if (cmd.startsWith('print(')) {
      const match = cmd.match(/print\(['"](.+)['"]\)/);
      return match ? match[1] : 'None';
    }
    if (cmd.includes('=')) {
      return ''; // Variable assignment
    }
    if (cmd.startsWith('import')) {
      return ''; // Import statement
    }
    return 'None';
  };

  const simulateNodeExecution = (cmd: string): string => {
    if (cmd.startsWith('console.log(')) {
      const match = cmd.match(/console\.log\(['"](.+)['"]\)/);
      return match ? match[1] : 'undefined';
    }
    if (cmd.includes('=')) {
      return 'undefined'; // Variable assignment
    }
    return 'undefined';
  };

  const simulateJavaExecution = (cmd: string): string => {
    if (cmd.startsWith('System.out.println(')) {
      const match = cmd.match(/System\.out\.println\(['"](.+)['"]\)/);
      return match ? match[1] : '';
    }
    return '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input, activeSessionId);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const sessionHistory = commandHistory[activeSessionId] || [];
      if (historyIndex < sessionHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(sessionHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const sessionHistory = commandHistory[activeSessionId] || [];
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(sessionHistory[newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Handle terminal resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const terminalElement = terminalRef.current;
      if (!terminalElement) return;
      
      const rect = terminalElement.getBoundingClientRect();
      const newHeight = rect.bottom - e.clientY;
      const clampedHeight = Math.max(200, Math.min(800, newHeight));
      onHeightChange(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onHeightChange]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeSessionId]);

  return (
    <div ref={terminalRef} className="h-full flex flex-col relative bg-gray-900">
      {/* Resize Handle */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 transition-colors z-10 group"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronUp className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      {/* Terminal Tabs */}
      <div className="flex items-center bg-gray-800 border-b border-gray-700 overflow-x-auto">
        <div className="flex items-center space-x-1 p-2">
          {sessions.map(session => {
            const terminalType = terminalTypes.find(t => t.id === session.type);
            return (
              <div
                key={session.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg cursor-pointer transition-all ${
                  session.id === activeSessionId
                    ? 'bg-gray-900 text-white border-t-2 border-blue-500'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setActiveSessionId(session.id)}
              >
                <span className="text-sm">{terminalType?.icon}</span>
                <span className="text-sm font-medium">{session.name}</span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTerminal(session.id);
                    }}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          
          {/* New Terminal Button */}
          <div className="relative">
            <button
              onClick={() => setShowNewTerminalMenu(!showNewTerminalMenu)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="New Terminal"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            {showNewTerminalMenu && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 z-20 min-w-48">
                <div className="px-3 py-2 text-xs font-medium text-gray-400 border-b border-gray-600">
                  Select Terminal Type
                </div>
                {terminalTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => createNewTerminal(type)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg">{type.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{type.name}</div>
                      <div className="text-xs text-gray-400">{type.interpreter}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Terminal Controls */}
        <div className="flex items-center space-x-2 ml-auto p-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Close All Terminals"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {activeSession && (
        <div className="flex-1 bg-black overflow-y-auto">
          <div className="p-4 font-mono text-sm">
            {/* Terminal Header */}
            <div className="mb-4 pb-2 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{activeTerminalType?.icon}</span>
                <div>
                  <div className="text-white font-medium">{activeSession.name}</div>
                  <div className="text-gray-400 text-xs">
                    {activeTerminalType?.name} • {activeSession.currentDirectory}
                  </div>
                </div>
              </div>
            </div>

            {/* Command History */}
            {activeSession.history.map((entry, index) => (
              <div key={index} className="mb-1">
                {entry.type === 'command' ? (
                  <div className="flex items-center space-x-2">
                    <span className={activeTerminalType?.color || 'text-green-400'}>
                      {activeTerminalType?.prompt || '$'}
                    </span>
                    <span className="text-white">{entry.command}</span>
                  </div>
                ) : (
                  <div className={
                    entry.type === 'error' ? 'text-red-400' :
                    entry.type === 'success' ? 'text-green-400' :
                    'text-gray-300'
                  }>
                    {entry.output.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Current Input Line */}
            <div className="flex items-center space-x-2">
              <span className={activeTerminalType?.color || 'text-green-400'}>
                {activeTerminalType?.prompt || '$'}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none flex-1 text-white"
                placeholder={`Type ${activeTerminalType?.name.toLowerCase()} commands...`}
                autoComplete="off"
              />
              <span className="terminal-cursor text-white">|</span>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            Active: <span className="text-white font-medium">{activeTerminalType?.name}</span>
          </span>
          <span className="text-gray-400">
            Sessions: <span className="text-white font-medium">{sessions.length}</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            Directory: <span className="text-white font-medium">{activeSession?.currentDirectory}</span>
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}