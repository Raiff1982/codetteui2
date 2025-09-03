};

  if (files.length === 0) {
    return (
      <EmptyState
        icon={Folder}
        title="No Files Yet"
        description="Create your first file to start building your project"
        actionLabel="Open Folder"
        onAction={() => onFileCreate('new-project', 'folder')}
        className="h-full"
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-r border-blue-200/50 dark:border-purple-700/50">
      {/* Header */}
      <div className="p-4 border-b border-blue-200/50 dark:border-purple-700/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/80 dark:to-purple-950/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Files
          </h2>
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="p-2 hover:bg-white/60 dark:hover:bg-gray-600/60 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-lg hover:shadow-xl"
            title="Create new file or folder"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-purple-400" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-purple-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-blue-200/50 dark:border-purple-600/50 rounded-xl text-sm text-gray-800 dark:text-white placeholder-blue-400 dark:placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-all duration-200"
          />
        </div>
      </div>
      
      {/* Create Menu */}
      {showCreateMenu && (
        <div className="p-4 border-b border-blue-200/50 dark:border-purple-700/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/80 dark:to-purple-950/80 backdrop-blur-sm">
          <div className="space-y-2">
            <button
              onClick={() => {
                onFileCreate('new-file.txt', 'file');
                setShowCreateMenu(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/60 dark:hover:bg-gray-600/60 rounded-xl transition-all duration-200 text-left backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">New File</span>
            </button>
            <button
              onClick={() => {
                onFileCreate('new-folder', 'folder');
                setShowCreateMenu(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/60 dark:hover:bg-gray-600/60 rounded-xl transition-all duration-200 text-left backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Folder className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">New Folder</span>
            </button>
          </div>
        </div>
      )}
      
      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              isSelected={selectedFile?.id === file.id}
              onSelect={onFileSelect}
              onRename={onFileRename}
              onDelete={onFileDelete}
              level={0}
            />
          ))}
        </div>
        
        {filteredFiles.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No files match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}