import React, { useState } from 'react';
import { StockSymbol } from '../types';
import { Search, TrendingUp, ChevronDown } from 'lucide-react';

interface StockSelectorProps {
  availableStocks: StockSymbol[];
  selectedStock: string;
  onStockChange: (symbol: string) => void;
  currentPrice: number;
  priceChange: number;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  availableStocks,
  selectedStock,
  onStockChange,
  currentPrice,
  priceChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = availableStocks.filter(
    stock =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStockInfo = availableStocks.find(stock => stock.symbol === selectedStock);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Selection</h3>
      
      {/* Current Selection Display */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-gray-900">{selectedStock}</h4>
            <p className="text-sm text-gray-600">{selectedStockInfo?.name}</p>
            <p className="text-xs text-gray-500">{selectedStockInfo?.sector}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₹{currentPrice.toFixed(2)}</p>
            <p className={`text-sm font-medium flex items-center ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${priceChange < 0 ? 'rotate-180' : ''}`} />
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Stock Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
        >
          <span className="text-gray-700">Change Stock Symbol</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Stock List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    onStockChange(stock.symbol);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full p-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
                    stock.symbol === selectedStock ? 'bg-blue-50 border-blue-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{stock.sector}</p>
                      {stock.symbol === selectedStock && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Volume</p>
          <p className="text-lg font-semibold text-gray-900">
            {(Math.random() * 10 + 1).toFixed(1)}M
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Volatility</p>
          <p className="text-lg font-semibold text-gray-900">
            {(Math.random() * 5 + 15).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Market Cap</p>
          <p className="text-lg font-semibold text-gray-900">
            ₹{(Math.random() * 500 + 100).toFixed(0)}K Cr
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockSelector;