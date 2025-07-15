'use client';

import React from 'react';
import { useAppContext } from '@/lib/context/AppContext';
import HomeView from './HomeView';
import BeachListView from './BeachListView';
import BeachDetailView from './BeachDetailView';

interface SidebarContainerProps {
  className?: string;
}

export default function SidebarContainer({ className = '' }: SidebarContainerProps) {
  const { state } = useAppContext();
  const { currentSidebar } = state.ui;

  const renderCurrentView = () => {
    switch (currentSidebar) {
      case 'home':
        return <HomeView />;
      case 'beach-list':
        return <BeachListView />;
      case 'beach':
        return <BeachDetailView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div 
      className={`bg-white shadow-lg overflow-hidden transition-all duration-300 ${className}`}
      data-sidebar="wrapper"
    >
      {renderCurrentView()}
    </div>
  );
}