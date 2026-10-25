import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Database,
  Workflow,
  Archive,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  Activity
} from 'lucide-react';
import { OverviewMetrics } from '../types';

interface OverviewDashboardProps {
  metrics: OverviewMetrics;
  onNavigateToCases: (filter?: string) => void;
  onNavigateToGraph: () => void;
  onNavigateToEvaluation: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  metrics,
  onNavigateToCases,
  onNavigateToGraph,
  onNavigateToEvaluation,
}) => {
  const completePercent = metrics.total_cases > 0
    ? Math.round((metrics.complete_cases / metrics.total_cases) * 100)
    : 0;

  const incompletePercent = metrics.total_cases > 0
    ? Math.round((metrics.incomplete_cases / metrics.total_cases) * 100)
    : 0;

  const notApplicablePercent = metrics.total_cases > 0
    ? Math.round((metrics.not_applicable_cases / metrics.total_cases) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Audit Status */}
      <div className="rounded-xl bg-[#101521] border border-[#1C2436] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h2 className="text-sm font-semibold text-white">Full Forensic Audit Run Complete</h2>
            <span className="text-[#929DB0] text-xs font-mono">· 518 Evaluation Cases Processed</span>
          </div>
          <p className="text-xs text-[#929DB0]">
            Deterministic rules and evidence correlations evaluated against 94 point-in-time artifacts across 7 production services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToCases('INCOMPLETE')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30 transition-colors"
          >
            <span>Review Incomplete ({metrics.incomplete_cases})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNavigateToEvaluation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B7CFF]/10 hover:bg-[#8B7CFF]/20 text-[#8B7CFF] text-xs font-medium border border-[#8B7CFF]/30 transition-colors"
          >
            <span>Evaluation Lab</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div
          onClick={() => onNavigateToCases('ALL')}
          className="p-4 rounded-xl bg-[#101521] border border-[#1C2436] hover:border-[#8B7CFF]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#929DB0] mb-2 text-xs">
            <span>Total Requests</span>
            <FileCheck2 className="w-4 h-4 text-[#8B7CFF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white group-hover:text-[#8B7CFF] transition-colors">
            {metrics.total_cases}
          </div>
          <div className="text-[11px] text-[#929DB0] mt-1 flex items-center gap-1">
            <span>100% of dataset evaluated</span>
          </div>
        </div>

        {/* Complete Cases */}
        <div
          onClick={() => onNavigateToCases('COMPLETE')}
          className="p-4 rounded-xl bg-[#101521] border border-[#1C2436] hover:border-emerald-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#929DB0] mb-2 text-xs">
            <span>Verified Complete</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {metrics.complete_cases}
          </div>
          <div className="text-[11px] text-[#929DB0] mt-1">
            <span>{completePercent}% full deletion assurance</span>
          </div>
        </div>

        {/* Incomplete Cases */}
        <div
          onClick={() => onNavigateToCases('INCOMPLETE')}
          className="p-4 rounded-xl bg-[#101521] border border-[#1C2436] hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#929DB0] mb-2 text-xs">
            <span>Incomplete / Ghost Data</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {metrics.incomplete_cases}
          </div>
          <div className="text-[11px] text-[#929DB0] mt-1">
            <span>Remediation plans generated</span>
          </div>
        </div>

        {/* Not Applicable Cases */}
        <div
          onClick={() => onNavigateToCases('NOT_APPLICABLE')}
          className="p-4 rounded-xl bg-[#101521] border border-[#1C2436] hover:border-[#929DB0]/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#929DB0] mb-2 text-xs">
            <span>Not Applicable</span>
            <HelpCircle className="w-4 h-4 text-[#929DB0]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#929DB0]">
            {metrics.not_applicable_cases}
          </div>
          <div className="text-[11px] text-[#929DB0] mt-1">
            <span>Opt-out, export, update requests</span>
          </div>
        </div>
      </div>

      {/* Risk Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Remaining Records */}
        <div className="p-4 rounded-xl bg-[#0E131F] border border-[#1C2436]">
          <div className="flex items-center gap-2 text-xs text-[#929DB0] mb-1">
            <Database className="w-3.5 h-3.5 text-coral-400 text-[#EF4444]" />
            <span>Residual Records</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {metrics.remaining_records_count}
          </div>
          <p className="text-[10px] text-[#929DB0] mt-1">
            Found in secondary SQL replicas & indexes
          </p>
        </div>

        {/* Exposed PII */}
        <div className="p-4 rounded-xl bg-[#0E131F] border border-[#1C2436]">
          <div className="flex items-center gap-2 text-xs text-[#929DB0] mb-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Exposed PII Violations</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {metrics.exposed_pii_count}
          </div>
          <p className="text-[10px] text-[#929DB0] mt-1">
            Direct identifiers in tickets & cohorts
          </p>
        </div>

        {/* Active Data Flows */}
        <div className="p-4 rounded-xl bg-[#0E131F] border border-[#1C2436]">
          <div className="flex items-center gap-2 text-xs text-[#929DB0] mb-1">
            <Workflow className="w-3.5 h-3.5 text-[#59D9FF]" />
            <span>Active Sync Flows</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {metrics.active_data_flows_count}
          </div>
          <p className="text-[10px] text-[#929DB0] mt-1">
            Connectors capable of data recreation
          </p>
        </div>

        {/* Restore Risks */}
        <div className="p-4 rounded-xl bg-[#0E131F] border border-[#1C2436]">
          <div className="flex items-center gap-2 text-xs text-[#929DB0] mb-1">
            <Archive className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>Backup Restore Risks</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {metrics.restore_risks_count}
          </div>
          <p className="text-[10px] text-[#929DB0] mt-1">
            Unblocked snapshots requiring restore block
          </p>
        </div>
      </div>

      {/* Two Column Section: Status Distribution & Real Deletion Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="p-5 rounded-xl bg-[#101521] border border-[#1C2436] lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Status Breakdown
            </h3>
            <span className="text-xs text-[#929DB0] font-mono">{metrics.total_cases} cases</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-emerald-400">COMPLETE</span>
                <span className="text-white">{metrics.complete_cases} ({completePercent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-[#151C2A] overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completePercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-amber-400">INCOMPLETE</span>
                <span className="text-white">{metrics.incomplete_cases} ({incompletePercent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-[#151C2A] overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${incompletePercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-[#929DB0]">NOT APPLICABLE</span>
                <span className="text-white">{metrics.not_applicable_cases} ({notApplicablePercent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-[#151C2A] overflow-hidden">
                <div
                  className="h-full bg-[#929DB0] rounded-full transition-all duration-500"
                  style={{ width: `${notApplicablePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1C2436] text-[11px] text-[#929DB0] space-y-1">
            <p className="flex items-center justify-between">
              <span>Evaluation Accuracy:</span>
              <strong className="text-white font-mono">{metrics.evaluation_status_accuracy}%</strong>
            </p>
            <p className="flex items-center justify-between">
              <span>Step F1 Score:</span>
              <strong className="text-white font-mono">{metrics.evaluation_step_f1}</strong>
            </p>
          </div>
        </div>

        {/* Forensic Insights & System Distribution */}
        <div className="p-5 rounded-xl bg-[#101521] border border-[#1C2436] lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Systems with Ghost Data Discovered
            </h3>
            <button
              onClick={onNavigateToGraph}
              className="text-xs text-[#8B7CFF] hover:underline flex items-center gap-1 font-mono"
            >
              <span>View in Identity Graph</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2436] space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-white font-medium">search_service</span>
                <span className="text-[#EF4444]">High Occurrence</span>
              </div>
              <p className="text-[11px] text-[#929DB0] leading-relaxed">
                Customer directory indices retained display names and email addresses long after primary accounts were closed.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2436] space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-white font-medium">failover_replica</span>
                <span className="text-[#EF4444]">Replication Drift</span>
              </div>
              <p className="text-[11px] text-[#929DB0] leading-relaxed">
                Asynchronous secondary databases missed primary delete worker events, holding active customer profiles.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2436] space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-white font-medium">integration_service</span>
                <span className="text-amber-400">Recreation Hazard</span>
              </div>
              <p className="text-[11px] text-[#929DB0] leading-relaxed">
                Active connectors and customer event bridges automatically re-ingested personal data during profile updates.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2436] space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-white font-medium">support_platform</span>
                <span className="text-amber-400">Exposed PII</span>
              </div>
              <p className="text-[11px] text-[#929DB0] leading-relaxed">
                Support messages and order delivery attachments retained customer emails and phone numbers instead of redacting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
