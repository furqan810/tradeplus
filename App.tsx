import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Hash, 
  Percent,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TradeInput, TradeResult } from './types';
import ResultChart from './components/ResultChart';
import AIAnalysis from './components/AIAnalysis';

const App: React.FC = () => {
  const [input, setInput] = useState<TradeInput>({
    buyPrice: 100,
    sellPrice: 150,
    amount: 1000,
    mode: 'investment',
    feePercentage: 0.1, // 0.1% default fee
  });

  const [result, setResult] = useState<TradeResult | null>(null);

  const calculateTrade = useMemo(() => {
    const { buyPrice, sellPrice, amount, mode, feePercentage } = input;

    // Avoid division by zero
    if (buyPrice <= 0 || amount <= 0) return null;

    let quantity = 0;
    let initialInvestment = 0;

    if (mode === 'investment') {
      initialInvestment = amount;
      quantity = amount / buyPrice;
    } else {
      quantity = amount;
      initialInvestment = quantity * buyPrice;
    }

    const grossSale = quantity * sellPrice;
    
    // Fees are usually applied on both Buy and Sell sides
    const buyFee = initialInvestment * (feePercentage / 100);
    const sellFee = grossSale * (feePercentage / 100);
    const totalFees = buyFee + sellFee;

    const netProfit = grossSale - initialInvestment - totalFees;
    const roi = (netProfit / initialInvestment) * 100;
    
    // Break even is when Net Profit = 0
    // 0 = (Qty * P_be) - Investment - (Investment*Rate) - (Qty * P_be * Rate)
    // Investment + Investment*Rate = Qty * P_be * (1 - Rate)
    // P_be = (Investment * (1 + Rate)) / (Qty * (1 - Rate))
    const rate = feePercentage / 100;
    const breakEvenPrice = (initialInvestment * (1 + rate)) / (quantity * (1 - rate));

    return {
      quantity,
      initialInvestment,
      grossSale,
      totalFees,
      netProfit,
      roi,
      breakEvenPrice,
      isProfitable: netProfit >= 0
    };
  }, [input]);

  useEffect(() => {
    setResult(calculateTrade);
  }, [calculateTrade]);

  const handleInputChange = (field: keyof TradeInput, value: number | string) => {
    setInput(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
              TradePulse
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500">
            LIVE CALCULATION
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                  Parameters
                </h2>
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button 
                    onClick={() => setInput(p => ({...p, mode: 'investment'}))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${input.mode === 'investment' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Amount ($)
                  </button>
                  <button 
                    onClick={() => setInput(p => ({...p, mode: 'quantity'}))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${input.mode === 'quantity' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Quantity
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {/* Dynamic Input based on Mode */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    {input.mode === 'investment' ? 'Total Investment ($)' : 'Share Quantity'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {input.mode === 'investment' ? <DollarSign className="w-4 h-4 text-slate-500"/> : <Hash className="w-4 h-4 text-slate-500"/>}
                    </div>
                    <input
                      type="number"
                      value={input.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="block w-full pl-10 bg-slate-800 border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-500 transition-all"
                    />
                  </div>
                </div>

                {/* Buy Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Buy Price ($)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-4 h-4 text-slate-500"/>
                    </div>
                    <input
                      type="number"
                      value={input.buyPrice}
                      onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                      className="block w-full pl-10 bg-slate-800 border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                  </div>
                </div>

                {/* Sell Price */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-slate-400">Sell Price ($)</label>
                    <span className={`text-xs ${input.sellPrice > input.buyPrice ? 'text-emerald-400' : 'text-red-400'}`}>
                      {input.sellPrice > input.buyPrice ? 'Long' : 'Loss'} Scenario
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-4 h-4 text-slate-500"/>
                    </div>
                    <input
                      type="number"
                      value={input.sellPrice}
                      onChange={(e) => handleInputChange('sellPrice', e.target.value)}
                      className="block w-full pl-10 bg-slate-800 border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                  </div>
                  {/* Slider for quick visual adjustments */}
                  <input 
                    type="range" 
                    min={input.buyPrice * 0.5} 
                    max={input.buyPrice * 2} 
                    step={input.buyPrice * 0.01}
                    value={input.sellPrice}
                    onChange={(e) => handleInputChange('sellPrice', e.target.value)}
                    className="w-full mt-2 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Fees */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Fee Rate (%)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Percent className="w-4 h-4 text-slate-500"/>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={input.feePercentage}
                      onChange={(e) => handleInputChange('feePercentage', e.target.value)}
                      className="block w-full pl-10 bg-slate-800 border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <button 
                  onClick={() => setInput({buyPrice: 100, sellPrice: 150, amount: 1000, mode: 'investment', feePercentage: 0.1})}
                  className="w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset to Defaults
                </button>

              </div>
            </div>
          </motion.div>

          {/* Right Column: Results */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-6"
          >
            {result ? (
              <>
                {/* Main Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* PNL Card */}
                  <div className={`p-6 rounded-2xl border ${result.isProfitable ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'} backdrop-blur-sm relative overflow-hidden group`}>
                    <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity ${result.isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.isProfitable ? <TrendingUp size={48} /> : <TrendingDown size={48} />}
                    </div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Net Profit / Loss</p>
                    <div className={`text-3xl font-bold mt-2 ${result.isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.netProfit >= 0 ? '+' : ''}${Math.abs(result.netProfit).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm font-medium">
                      <span className={result.roi >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                        {result.roi.toFixed(2)}%
                      </span>
                      <span className="text-slate-500">ROI</span>
                    </div>
                  </div>

                  {/* Final Value Card */}
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Return Value</p>
                    <div className="text-3xl font-bold text-white mt-2">
                      ${(result.grossSale - result.totalFees).toFixed(2)}
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                      After ${(result.totalFees).toFixed(2)} in fees
                    </p>
                  </div>

                   {/* Break Even Card */}
                   <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Break-Even Price</p>
                    <div className="text-3xl font-bold text-indigo-400 mt-2">
                      ${result.breakEvenPrice.toFixed(2)}
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                      Price needed to cover fees
                    </p>
                  </div>
                </div>

                {/* Summary Strip */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-wrap gap-6 items-center justify-between text-sm">
                   <div className="flex flex-col">
                      <span className="text-slate-500 text-xs">Quantity</span>
                      <span className="font-mono text-slate-200">{result.quantity.toFixed(4)} Units</span>
                   </div>
                   <div className="hidden md:block w-px h-8 bg-slate-800"></div>
                   <div className="flex flex-col">
                      <span className="text-slate-500 text-xs">Initial Investment</span>
                      <span className="font-mono text-slate-200">${result.initialInvestment.toFixed(2)}</span>
                   </div>
                   <div className="hidden md:block w-px h-8 bg-slate-800"></div>
                   <div className="flex flex-col">
                      <span className="text-slate-500 text-xs">Gross Sale</span>
                      <span className="font-mono text-slate-200">${result.grossSale.toFixed(2)}</span>
                   </div>
                </div>

                {/* Charts Area */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Capital Visualization</h3>
                  <ResultChart result={result} />
                </div>

                {/* AI Section */}
                <AIAnalysis result={result} />
                
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600">
                Enter positive values to see results
              </div>
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default App;