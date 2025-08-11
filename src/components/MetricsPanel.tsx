import React from 'react';
import { ModelMetrics } from '../types';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';

interface MetricsPanelProps {
  metrics: ModelMetrics;
  modelName: string;
  modelColor: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, modelName, modelColor }) => {
  const getMetricStatus = (value: number, type: 'error' | 'accuracy') => {
    if (type === 'error') {
      return value < 2 ? 'excellent' : value < 5 ? 'good' :  value < 10 ? 'fair' : 'poor';
    } else {
      return value > 0.9 ? 'excellent' : value > 0.7 ? 'good' : value > 0.5 ? 'fair' : 'poor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const metricItems = [
    {
      label: 'RMSE',
      value: metrics.rmse,
      description: 'Root Mean Square Error',
      icon: Target,
      type: 'error' as const,
      unit: '$',
    },
    {
      label: 'MAE',
      value: metrics.mae,
      description: 'Mean Absolute Error',
      icon: BarChart3,
      type: 'error' as const,
      unit: '$',
    },
    {
      label: 'R²',
      value: metrics.r2,
      description: 'Coefficient of Determination',
      icon: TrendingUp,
      type: 'accuracy' as const,
      unit: '',
    },
    {
      label: 'Directional Accuracy',
      value: metrics.directionalAccuracy,
      description: 'Correct Trend Predictions',
      icon: TrendingUp,
      type: 'accuracy' as const,
      unit: '%',
      displayValue: (metrics.directionalAccuracy * 100).toFixed(1),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: modelColor }}
        ></div>
        <h3 className="text-lg font-semibold text-gray-800">{modelName} Performance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metricItems.map((item, index) => {
          const Icon = item.icon;
          const status = getMetricStatus(item.value, item.type);
          const statusColor = getStatusColor(status);
          const displayValue = item.displayValue || item.value.toString();

          return (
            <div key={index} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                  {status}
                </span>
              </div>
              
              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {item.unit}{displayValue}
                </span>
              </div>
              
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Model Interpretation</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>RMSE:</strong> Lower values indicate better accuracy. Current RMSE of ${metrics.rmse} suggests predictions are typically within this range.
          </p>
          <p>
            <strong>R²:</strong> Values closer to 1 indicate better model fit. Current R² of {metrics.r2} explains {(metrics.r2 * 100).toFixed(1)}% of price variance.
          </p>
          <p>
            <strong>Directional Accuracy:</strong> {((metrics.directionalAccuracy * 100).toFixed(1))}% of trend directions are predicted correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;