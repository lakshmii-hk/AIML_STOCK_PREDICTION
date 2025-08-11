import React from 'react';
import { PredictionData } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react';

interface PredictionSummaryProps {
  predictions: PredictionData[];
  currentPrice: number;
  modelName: string;
  modelColor: string;
}

const PredictionSummary: React.FC<PredictionSummaryProps> = ({
  predictions,
  currentPrice,
  modelName,
  modelColor,
}) => {
  if (predictions.length === 0) return null;

  const nextDayPrediction = predictions[0];
  const weekPrediction = predictions[6] || predictions[predictions.length - 1];
  const monthPrediction = predictions[29] || predictions[predictions.length - 1];

  const calculateChange = (predicted: number, current: number) => {
    const change = ((predicted - current) / current) * 100;
    return {
      percentage: change,
      direction: change >= 0 ? 'up' : 'down',
      color: change >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: change >= 0 ? 'bg-green-50' : 'bg-red-50',
    };
  };

  const nextDayChange = calculateChange(nextDayPrediction.predicted, currentPrice);
  const weekChange = calculateChange(weekPrediction.predicted, currentPrice);
  const monthChange = calculateChange(monthPrediction.predicted, currentPrice);

  const averageConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: modelColor }}
        ></div>
        <h3 className="text-lg font-semibold text-gray-800">Prediction Summary</h3>
        <div className="ml-auto flex items-center space-x-2">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            Avg. Confidence: {(averageConfidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Next Day */}
        <div className={`p-4 rounded-lg border ${
          nextDayChange.direction === 'up' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">Next Day</h4>
            {nextDayChange.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{nextDayPrediction.predicted.toFixed(2)}
          </p>
          <p className={`text-sm font-medium ${nextDayChange.color}`}>
            {nextDayChange.percentage >= 0 ? '+' : ''}{nextDayChange.percentage.toFixed(2)}%
          </p>
          <div className="mt-2 bg-white rounded px-2 py-1">
            <span className="text-xs text-gray-500">
              Confidence: {(nextDayPrediction.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* One Week */}
        <div className={`p-4 rounded-lg border ${
          weekChange.direction === 'up' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">1 Week</h4>
            {weekChange.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{weekPrediction.predicted.toFixed(2)}
          </p>
          <p className={`text-sm font-medium ${weekChange.color}`}>
            {weekChange.percentage >= 0 ? '+' : ''}{weekChange.percentage.toFixed(2)}%
          </p>
          <div className="mt-2 bg-white rounded px-2 py-1">
            <span className="text-xs text-gray-500">
              Confidence: {(weekPrediction.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* One Month */}
        <div className={`p-4 rounded-lg border ${
          monthChange.direction === 'up' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">1 Month</h4>
            {monthChange.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{monthPrediction.predicted.toFixed(2)}
          </p>
          <p className={`text-sm font-medium ${monthChange.color}`}>
            {monthChange.percentage >= 0 ? '+' : ''}{monthChange.percentage.toFixed(2)}%
          </p>
          <div className="mt-2 bg-white rounded px-2 py-1">
            <span className="text-xs text-gray-500">
              Confidence: {(monthPrediction.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <h4 className="font-medium text-gray-700">Risk Assessment</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Volatility Risk</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.abs(monthChange.percentage) * 5)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {Math.abs(monthChange.percentage) > 10 ? 'High' : 
                 Math.abs(monthChange.percentage) > 5 ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Model Confidence</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${averageConfidence * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {(averageConfidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <p>
            <strong>Disclaimer:</strong> These predictions are generated by the {modelName} model and should not be considered as financial advice. 
            Past performance does not guarantee future results. Always consult with a financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;