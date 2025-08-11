import React from 'react';
import { ModelConfig } from '../types';
import { Brain, TreePine, TrendingUp, Layers } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  isTraining: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  isTraining,
}) => {
  const models: ModelConfig[] = [
    {
      name: 'LSTM',
      type: 'LSTM',
      color: '#8b5cf6',
      icon: 'brain',
    },
    {
      name: 'Random Forest',
      type: 'RandomForest',
      color: '#10b981',
      icon: 'tree',
    },
    {
      name: 'Linear Regression',
      type: 'LinearRegression',
      color: '#f59e0b',
      icon: 'trending',
    },
    {
      name: 'Ensemble',
      type: 'Ensemble',
      color: '#ef4444',
      icon: 'layers',
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'brain': return Brain;
      case 'tree': return TreePine;
      case 'trending': return TrendingUp;
      case 'layers': return Layers;
      default: return Brain;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select ML Model</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {models.map((model) => {
          const Icon = getIcon(model.icon);
          const isSelected = selectedModel === model.type;
          
          return (
            <button
              key={model.type}
              onClick={() => onModelChange(model.type)}
              disabled={isTraining}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left group ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              } ${isTraining ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: `${model.color}20` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: model.color }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{model.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {getModelDescription(model.type)}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-600 font-medium">
                    {isTraining ? 'Training...' : 'Active'}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Model Characteristics</h4>
        <div className="text-sm text-blue-700">
          {getDetailedDescription(selectedModel)}
        </div>
      </div>
    </div>
  );
};

const getModelDescription = (type: string): string => {
  switch (type) {
    case 'LSTM':
      return 'Deep learning for sequential patterns';
    case 'RandomForest':
      return 'Ensemble method with decision trees';
    case 'LinearRegression':
      return 'Linear relationship modeling';
    case 'Ensemble':
      return 'Combines multiple model predictions';
    default:
      return 'Advanced machine learning model';
  }
};

const getDetailedDescription = (type: string): string => {
  switch (type) {
    case 'LSTM':
      return 'Long Short-Term Memory networks excel at capturing long-term dependencies in sequential data. Ideal for time series with complex temporal patterns and memory requirements.';
    case 'RandomForest':
      return 'Random Forest uses multiple decision trees to make predictions. It handles feature interactions well and provides robust predictions with built-in feature importance.';
    case 'LinearRegression':
      return 'Linear Regression models the relationship between features and target as a linear function. Simple, interpretable, and works well when relationships are approximately linear.';
    case 'Ensemble':
      return 'Ensemble methods combine predictions from multiple models to achieve better performance than individual models. Reduces overfitting and improves generalization.';
    default:
      return 'Select a model to see detailed information about its characteristics and use cases.';
  }
};

export default ModelSelector;