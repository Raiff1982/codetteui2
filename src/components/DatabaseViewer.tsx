import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { supabase } from '../services/supabase';
import { 
  Database, 
  Table, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Brain,
  Activity,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DatabaseRecord {
  id: string;
  table: string;
  data: any;
  timestamp: string;
}

export function DatabaseViewer() {
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    // Check backend/database connection
    fetch('/api/health')
      .then(response => response.ok ? setBackendConnected(true) : setBackendConnected(false))
      .catch(() => setBackendConnected(false));
  }, []);

  const dataScroll = useAutoScroll({ 
    speed: 40, 
    pauseOnHover: true,
    resetOnInteraction: true,
    enableBidirectional: true
  });

  const [selectedTable, setSelectedTable] = useState('signals');
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableStats, setTableStats] = useState<Record<string, any>>({});

  const tables = [
    { name: 'signals', icon: Zap, description: 'AI signal processing records' },
    { name: 'memory', icon: Activity, description: 'DreamCore memory entries' },
    { name: 'benchmark_results', icon: TrendingUp, description: 'Performance benchmarks' },
    { name: 'user_feedback', icon: Users, description: 'User study feedback' },
    { name: 'api_metrics', icon: BarChart3, description: 'API performance metrics' },
    { name: 'competitor_analysis', icon: Target, description: 'Competitive analysis' },
    { name: 'ethical_code_generations', icon: Shield, description: 'Ethical AI code analysis' },
    { name: 'cocoons', icon: Brain, description: 'Quantum cocoons' },
    { name: 'quantum_cocoons', icon: Brain, description: 'Enhanced quantum cocoons' },
    { name: 'emotional_webs', icon: Activity, description: 'Emotional connection networks' }
  ];

  useEffect(() => {
    loadTableData();
    loadTableStats();
  }, [selectedTable]);

  const loadTableData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedRecords: DatabaseRecord[] = (data || []).map(record => ({
        id: record.id || record.session_id || Date.now().toString(),
        table: selectedTable,
        data: record,
        timestamp: record.created_at || record.timestamp || new Date().toISOString()
      }));

      setRecords(formattedRecords);
    } catch (error) {
      console.error('Failed to load table data:', error);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTableStats = async () => {
    try {
      const { count } = await supabase
        .from(selectedTable)
        .select('*', { count: 'exact', head: true });

      setTableStats(prev => ({
        ...prev,
        [selectedTable]: {
          total_records: count || 0,
          last_updated: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Failed to load table stats:', error);
    }
  };

  const exportTableData = async () => {
    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*');

      if (error) throw error;

      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTable}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const recordString = JSON.stringify(record.data).toLowerCase();
    return recordString.includes(searchLower);
  });

  const getTableIcon = (tableName: string) => {
    const table = tables.find(t => t.name === tableName);
    return table ? table.icon : Table;
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'string' && value.length > 100) return value.slice(0, 100) + '...';
    return String(value);
  };

  const getRecordStatusColor = (record: DatabaseRecord) => {
    // Determine status based on table and data
    if (selectedTable === 'benchmark_results') {
      const improvement = record.data.improvement || 0;
      return improvement > 0.1 ? 'text-green-600' : improvement > 0 ? 'text-yellow-600' : 'text-red-600';
    }
    
    if (selectedTable === 'ethical_code_generations') {
      const score = record.data.ethical_score || 0;
      return score > 0.8 ? 'text-green-600' : score > 0.6 ? 'text-yellow-600' : 'text-red-600';
    }
    
    return 'text-blue-600';
  };
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Database Explorer
                {!backendConnected && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                    Demo Mode
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {backendConnected ? 'Real-time data from Supabase' : 'Requires Supabase connection'}
              </p>
            </div>
          </div>
          
          {!backendConnected && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Database Connection Required</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                The database viewer requires Supabase connection to display real AI analysis data. 
                This interface shows how the data would be presented.
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadTableData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={exportTableData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {tables.map(table => {
            const IconComponent = table.icon;
            return (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table.name)}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-all text-left ${
                  selectedTable === table.name
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">{table.name}</p>
                  <p className="text-xs opacity-75">{tableStats[table.name]?.total_records || 0} records</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredRecords.length} / {records.length}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Table Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Table className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-800 dark:text-white">Total Records</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {tableStats[selectedTable]?.total_records || 0}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-800 dark:text-white">Filtered</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{filteredRecords.length}</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-800 dark:text-white">Last Updated</span>
            </div>
            <p className="text-sm font-bold text-purple-600">
              {tableStats[selectedTable]?.last_updated 
                ? new Date(tableStats[selectedTable].last_updated).toLocaleTimeString()
                : 'Never'
              }
            </p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-800 dark:text-white">Table</span>
            </div>
            <p className="text-lg font-bold text-orange-600 capitalize">
              {selectedTable.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Records Display */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {React.createElement(getTableIcon(selectedTable), { 
                className: "w-5 h-5 text-blue-600" 
              })}
              <h3 className="font-semibold text-gray-800 dark:text-white capitalize">
                {selectedTable.replace('_', ' ')} Records
              </h3>
            </div>
          </div>
          
          <div 
            ref={dataScroll.elementRef}
            className="max-h-96 overflow-y-auto relative"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading records...</span>
              </div>
            ) : filteredRecords.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map((record, index) => (
                  <div key={record.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getRecordStatusColor(record)}`} />
                        <span className="font-medium text-gray-800 dark:text-white">
                          Record #{index + 1}
                        </span>
                        {record.data.mode && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            {record.data.mode}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(record.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
                        {formatValue(record.data)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No records found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {searchTerm ? 'Try adjusting your search' : 'Records will appear here as you use the AI features'}
                </p>
              </div>
            )}
            
            {/* Auto-scroll indicator */}
            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
              <div className={`w-2 h-2 rounded-full ${dataScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {dataScroll.isPaused ? 'Paused' : 'Auto'}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Analytics */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Real-time Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Signals</p>
              <p className="text-lg font-bold text-blue-600">{tableStats.signals?.total_records || 0}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Memories</p>
              <p className="text-lg font-bold text-green-600">{tableStats.memory?.total_records || 0}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Benchmarks</p>
              <p className="text-lg font-bold text-purple-600">{tableStats.benchmark_results?.total_records || 0}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Ethics</p>
              <p className="text-lg font-bold text-orange-600">{tableStats.ethical_code_generations?.total_records || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}