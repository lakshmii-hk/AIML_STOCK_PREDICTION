export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionData {
  date: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

export interface ModelMetrics {
  rmse: number;
  mae: number;
  r2: number;
  directionalAccuracy: number;
  mape: number;
}

export interface ModelConfig {
  name: string;
  type: 'LSTM' | 'RandomForest' | 'LinearRegression' | 'Ensemble';
  color: string;
  icon: string;
}

export interface StockSymbol {
  symbol: string;
  name: string;
  sector: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}