import React, { useState } from 'react';
import { ModelMetrics } from '../types';
import { BarChart3, TrendingUp, Award, Zap } from 'lucide-react';

interface ModelComparisonProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelComparison: React.FC<ModelComparisonProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const [showComparison, setShowComparison] = useState(false);

  const modelPerformance = {
    'LSTM': {
      accuracy: 87.5,
      speed: 65,
      complexity: 90,
      stability: 82,
      color: '#8b5cf6',
      pros: ['Excellent for time series', 'Captures long-term patterns', 'High accuracy'],
      cons: ['Computationally intensive', 'Requires large datasets']
    },
    'RandomForest': {
      accuracy: 82.3,
      speed: 95,
      complexity: 40,
      stability: 95,
      color: '#10b981',
      pros: ['Fast training', 'Robust to outliers', 'Feature importance'],
      cons: ['May overfit', 'Less effective for sequences']
    },
    'LinearRegression': {
      accuracy: 71.8,
      speed: 98,
      complexity: 20,
      stability: 88,
      color: '#f59e0b',
      pros: ['Very fast', 'Interpretable', 'Simple to implement'],
      cons: ['Limited complexity', 'Assumes linear relationships']
    },
    'Ensemble': {
      accuracy: 91.2,
      speed: 45,
      complexity: 85,
      stability: 93,
      color: '#ef4444',
      pros: ['Highest accuracy', 'Combines strengths', 'Robust predictions'],
      cons: ['Slower training', 'Complex to interpret']
    }
  };

  const MetricBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${value}%`, 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Model Comparison</h3>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          {showComparison ? 'Hide Details' : 'Compare All'}
        </button>
      </div>

      {!showComparison ? (
        // Quick Model Selector
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(modelPerformance).map(([model, data]) => (
            <button
              key={model}
              onClick={() => onModelChange(model)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedModel === model
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: data.color }}
                ></div>
                <span className="font-medium text-gray-900">{model}</span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                Accuracy: {data.accuracy}%
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedModel === model && (
                  <>
                    <Award className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Active</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Detailed Comparison
        <div className="space-y-6">
          {Object.entries(modelPerformance).map(([model, data]) => (
            <div
              key={model}
              className={`p-5 rounded-lg border-2 transition-all duration-300 ${
                selectedModel === model
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: data.color }}
                  ></div>
                  <h4 className="text-lg font-semibold text-gray-900">{model}</h4>
                </div>
                
                <button
                  onClick={() => onModelChange(model)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedModel === model
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {selectedModel === model ? 'Active' : 'Select'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Performance Metrics
                  </h5>
                  <MetricBar label="Accuracy" value={data.accuracy} color={data.color} />
                  <MetricBar label="Speed" value={data.speed} color={data.color} />
                  <MetricBar label="Stability" value={data.stability} color={data.color} />
                </div>

                {/* Pros and Cons */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Characteristics</h5>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Strengths:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {data.pros.map((pro, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-orange-700 mb-1">Considerations:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {data.cons.map((con, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelComparison;