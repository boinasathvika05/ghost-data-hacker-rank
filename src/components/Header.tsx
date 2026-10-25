import React, { useState } from 'react';
import { Search, Play, Download, ShieldCheck, RefreshCw, FileText, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onRunAudit: () => Promise<void>;
  isAuditing: boolean;
  totalCases: number;
  completeCases: number;
  incompleteCases: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onRunAudit,
  isAuditing,
  totalCases,
  completeCases,
  incompleteCases,
}) => {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="h-16 bg-[#080B12]/80 backdrop-blur-md border-b border-[#151C2A] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-[#929DB0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search by case ID, email, or keyword..."
          className="w-full bg-[#101521] border border-[#1C2436] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#929DB0] focus:outline-none focus:border-[#8B7CFF] transition-colors"
        />
      </div>

      {/* Challenge Title & Link */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-[#929DB0]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>HackerRank Orchestrate (Oct 2026)</span>
        <span className="text-[#1C2436]">|</span>
        <a
          href="https://wwww.hackerrank.com/contests/hackerrank-orchestrate-october26/challenges/ghost-data-still-exists"
          target="_blank"
          rel="noreferrer"
          className="text-[#8B7CFF] hover:underline flex items-center gap-1 font-mono text-[11px]"
        >
          ghost-data-still-exists
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Quick metrics text */}
        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-[#929DB0]">
          <span>
            Total: <strong className="text-white">{totalCases}</strong>
          </span>
          <span className="text-[#1C2436]">·</span>
          <span>
            Complete: <strong className="text-emerald-400">{completeCases}</strong>
          </span>
          <span className="text-[#1C2436]">·</span>
          <span>
            Incomplete: <strong className="text-amber-400">{incompleteCases}</strong>
          </span>
        </div>

        {/* Audit Run Button */}
        <button
          onClick={onRunAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#8B7CFF] hover:bg-[#7866FF] text-white text-xs font-medium shadow-md shadow-[#8B7CFF]/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Auditing 518 Cases...' : 'Execute Audit'}</span>
        </button>

        {/* Quick Download Menu */}
        <a
          href="/api/download/output.csv"
          download="output.csv"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151C2A] hover:bg-[#1C2436] text-xs text-white border border-[#2A344A] transition-colors"
          title="Download submission output.csv"
        >
          <Download className="w-3.5 h-3.5 text-[#59D9FF]" />
          <span>output.csv</span>
        </a>
      </div>
    </header>
  );
};
