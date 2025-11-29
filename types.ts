export interface TradeInput {
  buyPrice: number;
  sellPrice: number;
  amount: number; // Can be total currency or total units based on mode
  mode: 'investment' | 'quantity'; // investment = Total $, quantity = Total Shares
  feePercentage: number;
}

export interface TradeResult {
  quantity: number;
  initialInvestment: number;
  grossSale: number;
  totalFees: number;
  netProfit: number;
  roi: number; // Return on Investment %
  breakEvenPrice: number;
  isProfitable: boolean;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}