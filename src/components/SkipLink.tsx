import React from 'react';

export function SkipLink() {
  return (
    <a
      href="#main-editor"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      Skip to main editor
    </a>
  );
}