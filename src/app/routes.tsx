import { createBrowserRouter } from 'react-router';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Cases from '../pages/Cases';
import CaseDetail from '../pages/CaseDetail';
import FIRAnalyzer from '../pages/FIRAnalyzer';
import EvidenceManagement from '../pages/EvidenceManagement';
import CCTVIntelligence from '../pages/CCTVIntelligence';
import AudioAnalyzer from '../pages/AudioAnalyzer';
import SuspectNetwork from '../pages/SuspectNetwork';
import CrimeHeatmap from '../pages/CrimeHeatmap';
import TimelineBuilder from '../pages/TimelineBuilder';
import Chatbot from '../pages/Chatbot';
import ReportGenerator from '../pages/ReportGenerator';
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'cases', Component: Cases },
      { path: 'cases/:id', Component: CaseDetail },
      { path: 'fir-analyzer', Component: FIRAnalyzer },
      { path: 'evidence', Component: EvidenceManagement },
      { path: 'cctv', Component: CCTVIntelligence },
      { path: 'audio', Component: AudioAnalyzer },
      { path: 'network', Component: SuspectNetwork },
      { path: 'heatmap', Component: CrimeHeatmap },
      { path: 'timeline', Component: TimelineBuilder },
      { path: 'chat', Component: Chatbot },
      { path: 'reports', Component: ReportGenerator },
      { path: 'settings', Component: Settings },
    ],
  },
]);
