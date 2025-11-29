import React, { useState } from 'react';
import { TradeResult, AnalysisStatus } from '../types';
import { getTradeAnalysis } from '../services/geminiService';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAnalysisProps {
  result: TradeResult;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ result }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);

  const handleAnalyze = async () => {
    setStatus(AnalysisStatus.LOADING);
    try {
      const text = await getTradeAnalysis(result);
      setAnalysis(text);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (e) {
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-indigo-900/30 to-slate-900/30 border border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-indigo-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          AI Trade Insight
        </h3>
        
        {status === AnalysisStatus.IDLE && (
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2"
          >
            Generate Insight
          </button>
        )}
      </div>

      <div className="min-h-[80px]">
        {status === AnalysisStatus.IDLE && (
          <p className="text-slate-400 text-sm">
            Click above to get a Gemini-powered analysis of this trade setup, including risk assessment and psychological tips.
          </p>
        )}

        {status === AnalysisStatus.LOADING && (
          <div className="flex items-center gap-3 text-indigo-300 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing market scenario...</span>
          </div>
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>Could not generate analysis. Check API Key configuration.</span>
          </div>
        )}

        <AnimatePresence>
          {status === AnalysisStatus.SUCCESS && analysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-indigo-50 leading-relaxed text-sm"
            >
              {analysis}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAnalysis;