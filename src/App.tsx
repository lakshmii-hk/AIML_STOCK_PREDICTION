import React, { useState, useEffect } from 'react';
import { Brain, BarChart3, TrendingUp, Zap, LogOut } from 'lucide-react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import InteractiveChart from './components/InteractiveChart';
import RealTimeMetrics from './components/RealTimeMetrics';
import ModelComparison from './components/ModelComparison';
import StockSelector from './components/StockSelector';
import PredictionSummary from './components/PredictionSummary';
import PredictionControls from './components/PredictionControls';
import { 
  generateStockData, 
  generatePredictions, 
  calculateModelMetrics, 
  STOCK_SYMBOLS 
} from './utils/stockData';
import { StockData, PredictionData, ModelMetrics, User } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'dashboard'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [selectedModel, setSelectedModel] = useState('LSTM');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionDays, setPredictionDays] = useState(30);

  const modelConfigs = {
    'LSTM': { color: '#8b5cf6', name: 'LSTM Neural Network' },
    'RandomForest': { color: '#10b981', name: 'Random Forest' },
    'LinearRegression': { color: '#f59e0b', name: 'Linear Regression' },
    'Ensemble': { color: '#ef4444', name: 'Ensemble Model' },
  };

  // Initialize data when user logs in
  useEffect(() => {
    if (user && currentPage === 'dashboard') {
      const initializeData = async () => {
        setIsLoading(true);
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const initialStockData = generateStockData(selectedStock, 252);
        setStockData(initialStockData);
        
        await trainModel(initialStockData, selectedModel);
        setIsLoading(false);
      };

      initializeData();
    }
  }, [user, currentPage]);

  // Retrain model when stock or model changes
  useEffect(() => {
    if (stockData.length > 0 && !isLoading && user) {
      trainModel(stockData, selectedModel);
    }
  }, [selectedModel, predictionDays]);

  const handleLogin = (username: string) => {
    setUser({ username, isAuthenticated: true });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    // Reset all data
    setStockData([]);
    setPredictions([]);
    setMetrics(null);
  };

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleStockChange = async (newStock: string) => {
    setSelectedStock(newStock);
    setIsLoading(true);
    
    const newStockData = generateStockData(newStock, 252);
    setStockData(newStockData);
    
    await trainModel(newStockData, selectedModel);
    setIsLoading(false);
  };

  const trainModel = async (data: StockData[], modelType: string) => {
    setIsTraining(true);
    
    // Simulate model training time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate predictions
    const newPredictions = generatePredictions(data, modelType, predictionDays);
    setPredictions(newPredictions);
    
    // Calculate metrics using historical data (simulate validation)
    const historicalPrices = data.slice(-30).map(d => d.close);
    const validationPredictions = generatePredictions(data.slice(-60, -30), modelType, 30);
    const validationPredictedPrices = validationPredictions.map(p => p.predicted);
    
    const modelMetrics = calculateModelMetrics(historicalPrices, validationPredictedPrices);
    setMetrics(modelMetrics);
    
    setIsTraining(false);
  };

  const handleRetrain = () => {
    if (stockData.length > 0) {
      trainModel(stockData, selectedModel);
    }
  };

  const currentPrice = stockData.length > 0 ? stockData[stockData.length - 1].close : 0;
  const previousPrice = stockData.length > 1 ? stockData[stockData.length - 2].close : currentPrice;
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;

  // Render different pages based on current state
  if (currentPage === 'home') {
    return <HomePage onGetStarted={handleGetStarted} />;
  }

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={handleBackToHome} />;
  }

  // Dashboard loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <Brain className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Initializing AI Models</h2>
          <p className="text-gray-600 mb-4">Preparing advanced neural networks and training algorithms...</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Loading market data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Training models</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Stock Predictor
                </h1>
                <p className="text-sm text-gray-600">Advanced Machine Learning for Indian Markets</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="w-4 h-4" />
                <span>AI Powered</span>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {selectedModel} Active
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="xl:col-span-1 space-y-6">
            <StockSelector
              availableStocks={STOCK_SYMBOLS}
              selectedStock={selectedStock}
              onStockChange={handleStockChange}
              currentPrice={currentPrice}
              priceChange={priceChange}
            />
            
            <PredictionControls
              onPredictionDaysChange={setPredictionDays}
              onRetrain={handleRetrain}
              isTraining={isTraining}
              predictionDays={predictionDays}
            />
            
            <ModelComparison
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            <PredictionSummary
              predictions={predictions}
              currentPrice={currentPrice}
              modelName={modelConfigs[selectedModel as keyof typeof modelConfigs].name}
              modelColor={modelConfigs[selectedModel as keyof typeof modelConfigs].color}
            />
            
            <InteractiveChart
              stockData={stockData}
              predictions={predictions}
              selectedModel={selectedModel}
              modelColor={modelConfigs[selectedModel as keyof typeof modelConfigs].color}
            />
            
            {metrics && (
              <RealTimeMetrics
                metrics={metrics}
                modelName={modelConfigs[selectedModel as keyof typeof modelConfigs].name}
                modelColor={modelConfigs[selectedModel as keyof typeof modelConfigs].color}
                isTraining={isTraining}
              />
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Training Indicator */}
      {isTraining && (
        <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-6 border border-gray-200 max-w-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Brain className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Training in Progress</p>
              <p className="text-sm text-gray-600">
                Optimizing {modelConfigs[selectedModel as keyof typeof modelConfigs].name}...
              </p>
              <div className="mt-2 w-32 bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>Real-time Predictions</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Brain className="w-4 h-4" />
                <span>AI/ML Powered</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Built with cutting-edge AI/ML algorithms • Interactive data visualization • Real-time model training
            </p>
            
            {/* Developer Credits */}
            <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Developed by</p>
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">LAKSHMI H K - 1DA22CS077</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-purple-700">LIKITHA H M - 1DA22CS081</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400">
              Data simulated for demonstration purposes • Not intended for actual trading decisions • Always consult financial advisors
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;