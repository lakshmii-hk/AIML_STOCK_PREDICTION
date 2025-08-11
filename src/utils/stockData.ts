import { StockData, PredictionData, ModelMetrics } from '../types';

// Indian stock symbols with NSE/BSE companies
export const STOCK_SYMBOLS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Oil & Gas' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'IT Services' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecom' },
  { symbol: 'ITC', name: 'ITC Ltd.', sector: 'FMCG' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Engineering' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Banking' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', sector: 'Paints' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', sector: 'Automotive' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', sector: 'Pharmaceuticals' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', sector: 'Jewellery' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', sector: 'IT Services' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', sector: 'Cement' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', sector: 'FMCG' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation', sector: 'Power' },
  { symbol: 'NTPC', name: 'NTPC Ltd.', sector: 'Power' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', sector: 'IT Services' },
];

// Generate realistic stock data in INR
export const generateStockData = (symbol: string, days: number = 252): StockData[] => {
  const data: StockData[] = [];
  const basePrice = getBasePriceForSymbol(symbol);
  let currentPrice = basePrice;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic price movements
    const volatility = 0.02;
    const trend = Math.sin(i / 20) * 0.001;
    const randomChange = (Math.random() - 0.5) * volatility;
    const priceChange = trend + randomChange;
    
    currentPrice *= (1 + priceChange);
    
    // Generate OHLC data
    const open = currentPrice;
    const variation = currentPrice * 0.03;
    const high = open + Math.random() * variation;
    const low = open - Math.random() * variation;
    const close = low + Math.random() * (high - low);
    
    currentPrice = close;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }
  
  return data;
};

// Generate predictions using different models
export const generatePredictions = (
  historicalData: StockData[],
  modelType: string,
  predictionDays: number = 30
): PredictionData[] => {
  const predictions: PredictionData[] = [];
  const lastPrice = historicalData[historicalData.length - 1].close;
  const startDate = new Date(historicalData[historicalData.length - 1].date);
  
  let currentPrice = lastPrice;
  
  for (let i = 1; i <= predictionDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Different prediction strategies based on model type
    let prediction;
    let confidence;
    
    switch (modelType) {
      case 'LSTM':
        // LSTM tends to follow trends with some momentum
        const momentum = calculateMomentum(historicalData, i);
        prediction = currentPrice * (1 + momentum + (Math.random() - 0.5) * 0.01);
        confidence = Math.max(0.6, 1 - (i / predictionDays) * 0.4);
        break;
        
      case 'RandomForest':
        // Random Forest is more conservative
        const avgChange = calculateAverageChange(historicalData);
        prediction = currentPrice * (1 + avgChange + (Math.random() - 0.5) * 0.005);
        confidence = Math.max(0.7, 1 - (i / predictionDays) * 0.3);
        break;
        
      case 'LinearRegression':
        // Linear regression follows a more linear trend
        const slope = calculateSlope(historicalData);
        prediction = currentPrice + slope * i + (Math.random() - 0.5) * 2;
        confidence = Math.max(0.5, 1 - (i / predictionDays) * 0.5);
        break;
        
      default: // Ensemble
        // Ensemble combines multiple approaches
        const ensemblePrediction = (
          lastPrice * (1 + calculateMomentum(historicalData, i)) +
          lastPrice * (1 + calculateAverageChange(historicalData)) +
          (lastPrice + calculateSlope(historicalData) * i)
        ) / 3;
        prediction = ensemblePrediction + (Math.random() - 0.5) * 1;
        confidence = Math.max(0.8, 1 - (i / predictionDays) * 0.2);
    }
    
    currentPrice = prediction;
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predicted: Number(prediction.toFixed(2)),
      confidence: Number(confidence.toFixed(3)),
    });
  }
  
  return predictions;
};

// Calculate model accuracy metrics
export const calculateModelMetrics = (
  actual: number[],
  predicted: number[]
): ModelMetrics => {
  const n = Math.min(actual.length, predicted.length);
  
  // RMSE (Root Mean Square Error)
  const mse = actual.slice(0, n).reduce((sum, act, i) => {
    return sum + Math.pow(act - predicted[i], 2);
  }, 0) / n;
  const rmse = Math.sqrt(mse);
  
  // MAE (Mean Absolute Error)
  const mae = actual.slice(0, n).reduce((sum, act, i) => {
    return sum + Math.abs(act - predicted[i]);
  }, 0) / n;
  
  // R² (Coefficient of Determination)
  const actualMean = actual.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
  const totalSumSquares = actual.slice(0, n).reduce((sum, val) => {
    return sum + Math.pow(val - actualMean, 2);
  }, 0);
  const residualSumSquares = actual.slice(0, n).reduce((sum, act, i) => {
    return sum + Math.pow(act - predicted[i], 2);
  }, 0);
  const r2 = 1 - (residualSumSquares / totalSumSquares);
  
  // Directional Accuracy
  let correctDirections = 0;
  for (let i = 1; i < n; i++) {
    const actualDirection = actual[i] > actual[i - 1];
    const predictedDirection = predicted[i] > predicted[i - 1];
    if (actualDirection === predictedDirection) {
      correctDirections++;
    }
  }
  const directionalAccuracy = correctDirections / (n - 1);
  
  // MAPE (Mean Absolute Percentage Error)
  const mape = actual.slice(0, n).reduce((sum, act, i) => {
    return sum + Math.abs((act - predicted[i]) / act);
  }, 0) / n;
  
  return {
    rmse: Number(rmse.toFixed(2)),
    mae: Number(mae.toFixed(2)),
    r2: Number(r2.toFixed(3)),
    directionalAccuracy: Number(directionalAccuracy.toFixed(3)),
    mape: Number((mape * 100).toFixed(2)),
  };
};

// Helper functions
const getBasePriceForSymbol = (symbol: string): number => {
  const basePrices: { [key: string]: number } = {
    'RELIANCE': 2450,
    'TCS': 3650,
    'HDFCBANK': 1580,
    'INFY': 1420,
    'ICICIBANK': 950,
    'HINDUNILVR': 2680,
    'SBIN': 580,
    'BHARTIARTL': 850,
    'ITC': 420,
    'KOTAKBANK': 1750,
    'LT': 2850,
    'AXISBANK': 1050,
    'ASIANPAINT': 3250,
    'MARUTI': 9850,
    'SUNPHARMA': 1180,
    'TITAN': 3150,
    'WIPRO': 480,
    'ULTRACEMCO': 8950,
    'NESTLEIND': 22500,
    'POWERGRID': 245,
    'NTPC': 285,
    'TECHM': 1250,
  };
  return basePrices[symbol] || 1000;
};

const calculateMomentum = (data: StockData[], dayOffset: number): number => {
  if (data.length < 10) return 0;
  
  const recent = data.slice(-10);
  const momentum = recent.reduce((sum, item, index) => {
    if (index === 0) return sum;
    return sum + (item.close - recent[index - 1].close) / recent[index - 1].close;
  }, 0) / 9;
  
  return momentum * Math.exp(-dayOffset * 0.1);
};

const calculateAverageChange = (data: StockData[]): number => {
  if (data.length < 2) return 0;
  
  const changes = data.slice(-20).map((item, index, array) => {
    if (index === 0) return 0;
    return (item.close - array[index - 1].close) / array[index - 1].close;
  }).slice(1);
  
  return changes.reduce((sum, change) => sum + change, 0) / changes.length;
};

const calculateSlope = (data: StockData[]): number => {
  if (data.length < 2) return 0;
  
  const recent = data.slice(-20);
  const n = recent.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = recent.reduce((sum, item) => sum + item.close, 0);
  const sumXY = recent.reduce((sum, item, index) => sum + index * item.close, 0);
  const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
  
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
};