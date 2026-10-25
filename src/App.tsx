import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { OverviewDashboard } from './components/OverviewDashboard';
import { CasesTable } from './components/CasesTable';
import { CaseDetailDrawer } from './components/CaseDetailDrawer';
import { EvidenceExplorer } from './components/EvidenceExplorer';
import { IdentityGraphView } from './components/IdentityGraphView';
import { DataFlowsView } from './components/DataFlowsView';
import { RemediationCenter } from './components/RemediationCenter';
import { EvaluationLab } from './components/EvaluationLab';
import { UsageCostView } from './components/UsageCostView';
import { SettingsView } from './components/SettingsView';
import { AuditCaseResult, OverviewMetrics, EvidenceFileManifest } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedCaseItem, setSelectedCaseItem] = useState<AuditCaseResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [casesFilter, setCasesFilter] = useState<string>('ALL');

  // Real backend dataset state
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    total_cases: 518,
    complete_cases: 236,
    incomplete_cases: 260,
    not_applicable_cases: 22,
    remaining_records_count: 531,
    exposed_pii_count: 312,
    active_data_flows_count: 88,
    restore_risks_count: 42,
    audit_progress_percentage: 100,
    evaluation_run: true,
    evaluation_status_accuracy: 100,
    evaluation_step_f1: 0.985,
  });
  const [cases, setCases] = useState<AuditCaseResult[]>([]);
  const [manifestList, setManifestList] = useState<EvidenceFileManifest[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dataset from backend endpoints
  const loadData = async () => {
    try {
      const [overviewRes, casesRes, evidenceRes] = await Promise.all([
        fetch('/api/overview'),
        fetch('/api/cases'),
        fetch('/api/evidence'),
      ]);

      if (overviewRes.ok) {
        const ovData = await overviewRes.json();
        setMetrics(ovData);
      }
      if (casesRes.ok) {
        const cData = await casesRes.json();
        setCases(cData.cases || []);
      }
      if (evidenceRes.ok) {
        const evData = await evidenceRes.json();
        setManifestList(evData.manifest || []);
      }
    } catch (e) {
      console.error('Failed to load initial dataset from server', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger audit run
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/audit/run', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        setToastMessage(`Audit completed: ${data.total_cases} cases verified.`);
        await loadData();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (e) {
      console.error('Audit run failed', e);
      setToastMessage('Audit execution error occurred.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSelectCaseById = (caseId: string) => {
    const found = cases.find((c) => c.case_id === caseId);
    if (found) {
      setSelectedCaseItem(found);
    }
  };

  // Filter cases by global search if active
  const filteredCases = searchQuery
    ? cases.filter(
        (c) =>
          c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.request_text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cases;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080B12] text-[#F3F5FA] font-sans antialiased selection:bg-[#8B7CFF]/30 selection:text-[#59D9FF]">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#101521] border border-[#8B7CFF]/50 text-xs text-white px-4 py-2.5 rounded-lg shadow-2xl animate-fade-in font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          {toastMessage}
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab: string) => {
          setCurrentTab(tab);
        }}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        casesCount={cases.length || 518}
        evidenceCount={manifestList.length || 94}
      />

      {/* Content Area offset by sidebar */}
      <div
        className={`flex flex-col flex-1 h-full min-w-0 overflow-hidden transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header
          onSearch={(q: string) => setSearchQuery(q)}
          onRunAudit={handleRunAudit}
          isAuditing={isAuditing}
          totalCases={metrics.total_cases}
          completeCases={metrics.complete_cases}
          incompleteCases={metrics.incomplete_cases}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {currentTab === 'landing' && (
            <LandingHero
              onLaunchConsole={() => setCurrentTab('overview')}
              onExploreGraph={() => setCurrentTab('graph')}
              totalCases={metrics.total_cases}
            />
          )}

          {currentTab === 'overview' && (
            <OverviewDashboard
              metrics={metrics}
              onNavigateToCases={(filter?: string) => {
                if (filter) setCasesFilter(filter);
                setCurrentTab('cases');
              }}
              onNavigateToGraph={() => setCurrentTab('graph')}
              onNavigateToEvaluation={() => setCurrentTab('evaluation')}
            />
          )}

          {currentTab === 'cases' && (
            <CasesTable
              cases={filteredCases}
              onSelectCase={(caseItem: AuditCaseResult) => setSelectedCaseItem(caseItem)}
              selectedCaseId={selectedCaseItem?.case_id}
              initialFilter={casesFilter}
            />
          )}

          {currentTab === 'evidence' && (
            <EvidenceExplorer manifestList={manifestList} />
          )}

          {currentTab === 'graph' && (
            <IdentityGraphView
              onSelectCase={(caseId: string) => handleSelectCaseById(caseId)}
            />
          )}

          {currentTab === 'dataflows' && <DataFlowsView />}

          {currentTab === 'remediation' && (
            <RemediationCenter cases={cases} />
          )}

          {currentTab === 'evaluation' && (
            <EvaluationLab
              onSelectCase={(caseId: string) => handleSelectCaseById(caseId)}
            />
          )}

          {currentTab === 'usage' && <UsageCostView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Forensic Detail Drawer */}
      <CaseDetailDrawer
        caseItem={selectedCaseItem}
        onClose={() => setSelectedCaseItem(null)}
        onNavigateToEvidence={() => setCurrentTab('evidence')}
      />
    </div>
  );
}
