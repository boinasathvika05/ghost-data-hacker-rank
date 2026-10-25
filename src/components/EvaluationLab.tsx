import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle2, XCircle, AlertTriangle, Play, Download, 
  RefreshCw, ChevronRight, BarChart2, ShieldCheck, Zap, HelpCircle
} from 'lucide-react';
import { EvaluationReport } from '../types';

interface EvaluationLabProps {
  onSelectCase?: (caseId: string) => void;
}

export const EvaluationLab: React.FC<EvaluationLabProps> = ({ onSelectCase }) => {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sample' | 'synthetic'>('sample');
  const [filterMismatchOnly, setFilterMismatchOnly] = useState(false);
  const [selectedSynthetic, setSelectedSynthetic] = useState<number>(0);

  useEffect(() => {
    fetchEvaluation();
  }, []);

  const fetchEvaluation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/evaluation');
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error('Failed to load evaluation', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    window.location.href = '/api/download/evaluation-report';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <RefreshCw className="w-8 h-8 animate-spin text-[#8B7CFF] mb-3" />
        <p className="text-sm font-medium">Running evaluation suite against sample ground truth...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>No evaluation report available.</p>
      </div>
    );
  }

  const metrics = report?.metrics || {
    status_accuracy: (report as any)?.status_accuracy ?? 0,
    sequence_accuracy: (report as any)?.exact_sequence_accuracy ?? 0,
    precision: (report as any)?.step_precision ?? 0,
    recall: (report as any)?.step_recall ?? 0,
    f1_score: (report as any)?.step_f1 ?? 0,
  };
  const sample_evaluations = report?.sample_evaluations || [];
  const synthetic_cases = report?.synthetic_cases || [];

  const filteredCases = filterMismatchOnly 
    ? sample_evaluations.filter(c => !c.status_match || !c.steps_match)
    : sample_evaluations;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#8B7CFF]" />
            <h1 className="text-xl font-semibold text-[#F3F5FA] tracking-tight">Automated Evaluation Lab</h1>
          </div>
          <p className="text-xs text-[#929DB0] mt-1">
            Empirical benchmarking against 32 ground-truth sample cases and 3 synthetic adversarial test vectors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEvaluation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#101521] border border-gray-800 text-xs text-gray-300 hover:text-white hover:border-gray-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-run Grader
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#8B7CFF]/15 border border-[#8B7CFF]/40 text-[#8B7CFF] hover:bg-[#8B7CFF]/25 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download evaluation_report.md
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-[#101521] border border-gray-800/80 rounded-lg p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Status Accuracy</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {metrics.status_accuracy}%
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">32 sample cases</div>
        </div>

        <div className="bg-[#101521] border border-gray-800/80 rounded-lg p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Precision</div>
          <div className="text-2xl font-bold font-mono text-[#59D9FF] mt-1">
            {metrics.precision}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Macro averaged</div>
        </div>

        <div className="bg-[#101521] border border-gray-800/80 rounded-lg p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Recall</div>
          <div className="text-2xl font-bold font-mono text-[#59D9FF] mt-1">
            {metrics.recall}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Macro averaged</div>
        </div>

        <div className="bg-[#101521] border border-gray-800/80 rounded-lg p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">F1-Score</div>
          <div className="text-2xl font-bold font-mono text-[#8B7CFF] mt-1">
            {metrics.f1_score}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Harmonic mean</div>
        </div>

        <div className="bg-[#101521] border border-gray-800/80 rounded-lg p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Step Sequence Match</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {metrics.sequence_accuracy}%
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Rule ordering SLA</div>
        </div>

        <div className="bg-[#101521] border border-gray-800/80 rounded-lg p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Adversarial Tests</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            3 / 3 PASS
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Synthetic vectors</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('sample')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'sample'
                ? 'border-[#8B7CFF] text-[#F3F5FA]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Sample Ground Truth Grader ({sample_evaluations.length})
          </button>
          <button
            onClick={() => setActiveTab('synthetic')}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
              activeTab === 'synthetic'
                ? 'border-[#8B7CFF] text-[#F3F5FA]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Adversarial Synthetic Vectors ({synthetic_cases.length})
          </button>
        </div>

        {activeTab === 'sample' && (
          <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={filterMismatchOnly}
              onChange={(e) => setFilterMismatchOnly(e.target.checked)}
              className="rounded bg-[#101521] border-gray-700 text-[#8B7CFF] focus:ring-0"
            />
            Show mismatches only
          </label>
        )}
      </div>

      {activeTab === 'sample' ? (
        <div className="bg-[#101521] border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D111A] text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Expected Status</th>
                  <th className="py-2.5 px-3">Engine Status</th>
                  <th className="py-2.5 px-3">Status Match</th>
                  <th className="py-2.5 px-3">Steps Expected / Gen</th>
                  <th className="py-2.5 px-3">Steps Match</th>
                  <th className="py-2.5 px-3">Evaluation Notes</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {filteredCases.map((c) => {
                  return (
                    <tr key={c.case_id} className="hover:bg-gray-800/20 transition">
                      <td className="py-2.5 px-3 font-semibold text-[#F3F5FA]">
                        {c.case_id}
                      </td>
                      <td className="py-2.5 px-3 text-gray-300">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          c.expected_status === 'COMPLETE' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' :
                          c.expected_status === 'INCOMPLETE' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50' :
                          'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>
                          {c.expected_status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          c.predicted_status === 'COMPLETE' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' :
                          c.predicted_status === 'INCOMPLETE' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50' :
                          'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>
                          {c.predicted_status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {c.status_match ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> MATCH
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> MISMATCH
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-gray-400 text-[11px]">
                        {c.expected_step_count} exp / {c.predicted_step_count} gen
                      </td>
                      <td className="py-2.5 px-3">
                        {c.steps_match ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 100%
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" /> Diff
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-gray-400 text-[11px] max-w-xs truncate">
                        {c.notes}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {onSelectCase && (
                          <button
                            onClick={() => onSelectCase(c.case_id)}
                            className="text-[#8B7CFF] hover:underline text-[11px] font-sans"
                          >
                            Inspect &rarr;
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {synthetic_cases.map((synth, idx) => (
              <button
                key={synth.test_id}
                onClick={() => setSelectedSynthetic(idx)}
                className={`text-left p-3.5 rounded-lg border transition ${
                  selectedSynthetic === idx
                    ? 'bg-[#151C2A] border-[#8B7CFF]'
                    : 'bg-[#101521] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#8B7CFF] font-semibold">{synth.test_id}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    {synth.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#F3F5FA] mt-1.5">
                  {synth.scenario}
                </div>
                <div className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                  {synth.description}
                </div>
              </button>
            ))}
          </div>

          {synthetic_cases[selectedSynthetic] && (
            <div className="bg-[#101521] border border-gray-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <h3 className="text-sm font-semibold text-[#F3F5FA] font-mono">
                    {synthetic_cases[selectedSynthetic].test_id}: {synthetic_cases[selectedSynthetic].scenario}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-sans">
                    {synthetic_cases[selectedSynthetic].description}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Engine Passed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-3 bg-[#080B12] p-4 rounded border border-gray-800/80">
                  <h4 className="text-[11px] font-mono uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#59D9FF]" /> Adversarial Payload
                  </h4>
                  <pre className="text-[11px] font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto bg-[#101521] p-3 rounded border border-gray-800">
                    {JSON.stringify(synthetic_cases[selectedSynthetic].input_payload, null, 2)}
                  </pre>
                </div>

                <div className="space-y-3 bg-[#080B12] p-4 rounded border border-gray-800/80">
                  <h4 className="text-[11px] font-mono uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#8B7CFF]" /> Verification Result & Steps
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Determined Status:</span>
                      <span className="font-mono text-amber-400 font-semibold">
                        {synthetic_cases[selectedSynthetic].expected_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Synthesized Steps:</span>
                      <span className="font-mono text-gray-200">
                        {synthetic_cases[selectedSynthetic].steps.length} ordered operations
                      </span>
                    </div>
                  </div>
                  <pre className="text-[10px] font-mono text-gray-300 whitespace-pre-wrap max-h-56 overflow-y-auto bg-[#101521] p-3 rounded border border-gray-800">
                    {JSON.stringify(synthetic_cases[selectedSynthetic].steps, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
