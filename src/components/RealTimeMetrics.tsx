import React, { useState, useEffect } from 'react';
import { ModelMetrics } from '../types';
import { Activity, TrendingUp, Target, Zap, RefreshCw } from 'lucide-react';

interface RealTimeMetricsProps {
  metrics: ModelMetrics;
  modelName: string;
  modelColor: string;
  isTraining: boolean;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ 
  metrics, 
  modelName, 
  modelColor, 
  isTraining 
}) => {
  const [animatedMetrics, setAnimatedMetrics] = useState(metrics);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (metrics !== animatedMetrics) {
      setIsUpdating(true);
      
      // Animate metric changes
      const animationDuration = 1000;
      const steps = 30;
      const stepDuration = animationDuration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedMetrics(prev => ({
          rmse: prev.rmse + (metrics.rmse - prev.rmse) * progress * 0.1,
          mae: prev.mae + (metrics.mae - prev.mae) * progress * 0.1,
          r2: prev.r2 + (metrics.r2 - prev.r2) * progress * 0.1,
          directionalAccuracy: prev.directionalAccuracy + (metrics.directionalAccuracy - prev.directionalAccuracy) * progress * 0.1,
          mape: prev.mape + (metrics.mape - prev.mape) * progress * 0.1,
        }));
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedMetrics(metrics);
          setIsUpdating(false);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [metrics]);

  const getMetricTrend = (current: number, previous: number, type: 'error' | 'accuracy') => {
    const diff = current - previous;
    if (type === 'error') {
      return diff < 0 ? 'improving' : diff > 0 ? 'declining' : 'stable';
    } else {
      return diff > 0 ? 'improving' : diff < 0 ? 'declining' : 'stable';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'declining': return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default: return <Activity className="w-3 h-3 text-gray-400" />;
    }
  };

  const metricCards = [
    {
      key: 'accuracy',
      title: 'Model Accuracy',
      value: (animatedMetrics.r2 * 100).toFixed(1),
      unit: '%',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Overall prediction accuracy'
    },
    {
      key: 'rmse',
      title: 'Prediction Error',
      value: animatedMetrics.rmse.toFixed(2),
      unit: '$',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Root mean square error'
    },
    {
      key: 'directional',
      title: 'Trend Accuracy',
      value: (animatedMetrics.directionalAccuracy * 100).toFixed(1),
      unit: '%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Correct trend predictions'
    },
    {
      key: 'speed',
      title: 'Processing Speed',
      value: (Math.random() * 50 + 150).toFixed(0),
      unit: 'ms',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Average prediction time'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ backgroundColor: modelColor }}
          ></div>
          <h3 className="text-lg font-semibold text-gray-800">Real-Time Performance</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {isTraining && (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isTraining ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}>
            {isTraining ? 'Training' : 'Active'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                isUpdating ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                {getTrendIcon('stable')}
              </div>
              
              <div className="mb-1">
                <span className={`text-2xl font-bold ${isUpdating ? 'text-blue-600' : 'text-gray-900'} transition-colors duration-300`}>
                  {card.value}{card.unit}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mb-1">{card.title}</p>
              <p className="text-xs text-gray-400">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-700 mb-3">Performance Over Time</h4>
        <div className="h-20 flex items-end space-x-1">
          {Array.from({ length: 20 }, (_, i) => {
            const height = Math.random() * 60 + 20;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-400"
                style={{ height: `${height}%` }}
              ></div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>20 min ago</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;