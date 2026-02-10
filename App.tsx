
import React, { useState } from 'react';
import Layout from './components/Layout';
import BrollTab from './components/BrollTab';
import VoiceOverTab from './components/VoiceOverTab';
import PosesTab from './components/PosesTab';
import ScriptTab from './components/ScriptTab';
import BrandingTab from './components/BrandingTab';
import LogoTab from './components/LogoTab';
import MentorTab from './components/MentorTab';
import VideoTab from './components/VideoTab';
import { TabName } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('broll');

  const renderContent = () => {
    switch (activeTab) {
      case 'broll': return <BrollTab />;
      case 'poses': return <PosesTab />;
      case 'script': return <ScriptTab />;
      case 'voiceover': return <VoiceOverTab />;
      case 'video': return <VideoTab />;
      case 'branding': return <BrandingTab />;
      case 'logo': return <LogoTab />;
      case 'mentor': return <MentorTab />;
      default: return <BrollTab />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
