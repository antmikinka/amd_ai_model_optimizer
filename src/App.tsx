import { useState } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  ChevronRight,
  ChevronDown,
  Menu,
  Search,
  Settings,
  Bell,
  FileBox,
  Network
} from 'lucide-react';
import PartitioningSummary from './components/PartitioningSummary';
import PartitioningGraph from './components/PartitioningGraph';
import NpuInsightsSummary from './components/NpuInsightsSummary';
import NpuInsightsOriginalGraph from './components/NpuInsightsOriginalGraph';
import NpuInsightsOptimizedGraph from './components/NpuInsightsOptimizedGraph';
import PerformanceSummary from './components/PerformanceSummary';
import PerformanceTimeline from './components/PerformanceTimeline';
import ModelDetailsIO from './components/ModelDetailsIO';
import ModelArchitecture from './components/ModelArchitecture';
import DeploymentMatrix from './components/DeploymentMatrix';
import ModelConversionFlow from './components/ModelConversionFlow';
import CliBuilder from './components/CliBuilder';
import LifecycleGlossary from './components/LifecycleGlossary';

type Section = 'DEPLOYMENT' | 'MODEL_DETAILS' | 'PARTITIONING' | 'NPU_INSIGHTS' | 'PERFORMANCE';
type Page = 'Lifecycle & Glossary' | 'Overview Matrix' | 'Conversion Wizard' | 'CLI Tools' | 'Architecture & Tensors' | 'Inputs & Outputs' | 'Summary' | 'Graph' | 'Original Graph' | 'Optimized Graph' | 'Timeline';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('MODEL_DETAILS');
  const [activePage, setActivePage] = useState<Page>('Architecture & Tensors');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    {
      name: 'DEPLOYMENT',
      label: 'DEPLOYMENT',
      icon: Network,
      pages: ['Lifecycle & Glossary', 'Overview Matrix', 'Conversion Wizard', 'CLI Tools']
    },
    {
      name: 'MODEL_DETAILS',
      label: 'MODEL DETAILS',
      icon: FileBox,
      pages: ['Architecture & Tensors', 'Inputs & Outputs']
    },
    {
      name: 'PARTITIONING',
      icon: LayoutDashboard,
      pages: ['Summary', 'Graph']
    },
    {
      name: 'NPU_INSIGHTS',
      label: 'NPU INSIGHTS',
      icon: Cpu,
      pages: ['Summary', 'Original Graph', 'Optimized Graph']
    },
    {
      name: 'PERFORMANCE',
      icon: Activity,
      pages: ['Summary', 'Timeline']
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'DEPLOYMENT':
        if (activePage === 'Lifecycle & Glossary') return <LifecycleGlossary />;
        if (activePage === 'Overview Matrix') return <DeploymentMatrix />;
        if (activePage === 'Conversion Wizard') return <ModelConversionFlow />;
        return <CliBuilder />;
      case 'MODEL_DETAILS':
        if (activePage === 'Architecture & Tensors') return <ModelArchitecture />;
        return <ModelDetailsIO />;
      case 'PARTITIONING':
        return activePage === 'Summary' ? <PartitioningSummary /> : <PartitioningGraph />;
      case 'NPU_INSIGHTS':
        if (activePage === 'Summary') return <NpuInsightsSummary />;
        if (activePage === 'Original Graph') return <NpuInsightsOriginalGraph />;
        return <NpuInsightsOptimizedGraph />;
      case 'PERFORMANCE':
        return activePage === 'Summary' ? <PerformanceSummary /> : <PerformanceTimeline />;
      default:
        return <div>Select a page</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {isSidebarOpen && <span className="font-bold text-white text-lg tracking-tight">AI Analyzer</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navigation.map((item) => (
            <div key={item.name} className="mb-2">
              <button
                onClick={() => {
                  setActiveSection(item.name as Section);
                  setActivePage(item.pages[0] as Page);
                  if (!isSidebarOpen) setIsSidebarOpen(true);
                }}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.name 
                    ? 'text-white bg-slate-800' 
                    : 'hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={20} className={`mr-3 ${activeSection === item.name ? 'text-indigo-400' : ''}`} />
                {isSidebarOpen && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.label || item.name}</span>
                    <ChevronDown size={16} className={`transition-transform ${activeSection === item.name ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </button>
              
              {isSidebarOpen && activeSection === item.name && (
                <div className="mt-1 mb-4 space-y-1">
                  {item.pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setActivePage(page as Page)}
                      className={`w-full flex items-center pl-11 pr-4 py-2 text-sm transition-colors ${
                        activePage === page
                          ? 'text-indigo-400 font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              U
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs text-slate-500">Local Session</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center text-sm text-slate-500">
            <span>{activeSection.replace('_', ' ')}</span>
            <ChevronRight size={16} className="mx-2" />
            <span className="font-medium text-slate-900">{activePage}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
              <Bell size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
