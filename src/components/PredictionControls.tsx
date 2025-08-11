import React, { useState } from 'react';
import { Calendar, Settings, Play, Pause, RotateCcw } from 'lucide-react';

interface PredictionControlsProps {
  onPredictionDaysChange: (days: number) => void;
  onRetrain: () => void;
  isTraining: boolean;
  predictionDays: number;
}

const PredictionControls: React.FC<PredictionControlsProps> = ({
  onPredictionDaysChange,
  onRetrain,
  isTraining,
  predictionDays,
}) => {
  const [localDays, setLocalDays] = useState(predictionDays);
  const [autoRetrain, setAutoRetrain] = useState(false);

  const handleDaysChange = (days: number) => {
    setLocalDays(days);
    onPredictionDaysChange(days);
  };

  const predictionPresets = [
    { label: '1 Week', days: 7 },
    { label: '2 Weeks', days: 14 },
    { label: '1 Month', days: 30 },
    { label: '3 Months', days: 90 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Prediction Controls</h3>
      </div>

      {/* Prediction Period */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Prediction Period
        </label>
        
        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {predictionPresets.map((preset) => (
            <button
              key={preset.days}
              onClick={() => handleDaysChange(preset.days)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                localDays === preset.days
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Days Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Custom Period</span>
            <span className="text-sm font-medium text-gray-900">{localDays} days</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="1"
              max="180"
              value={localDays}
              onChange={(e) => handleDaysChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 day</span>
              <span>6 months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Training Controls */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Model Training
        </label>
        
        <div className="space-y-3">
          <button
            onClick={onRetrain}
            disabled={isTraining}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg font-medium transition-all duration-200 ${
              isTraining
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isTraining ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Training Model...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Retrain Model</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Auto-Retrain</p>
              <p className="text-xs text-gray-500">Automatically retrain when data changes</p>
            </div>
            <button
              onClick={() => setAutoRetrain(!autoRetrain)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                autoRetrain ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  autoRetrain ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="border-t border-gray-200 pt-4">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            <span>Advanced Settings</span>
            <div className="ml-2 transform transition-transform group-open:rotate-180">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Confidence Threshold
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                defaultValue="0.8"
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Learning Rate
              </label>
              <select className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="0.001">0.001 (Conservative)</option>
                <option value="0.01" selected>0.01 (Balanced)</option>
                <option value="0.1">0.1 (Aggressive)</option>
              </select>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PredictionControls;