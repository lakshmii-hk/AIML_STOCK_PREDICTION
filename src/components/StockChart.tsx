import React from 'react';
import { StockData, PredictionData } from '../types';

interface StockChartProps {
  stockData: StockData[];
  predictions: PredictionData[];
  selectedModel: string;
  modelColor: string;
}

const StockChart: React.FC<StockChartProps> = ({
  stockData,
  predictions,
  selectedModel,
  modelColor,
}) => {
  // Calculate chart dimensions and scaling
  const chartWidth = 800;
  const chartHeight = 400;
  const padding = 40;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;

  // Combine historical and prediction data for scaling
  const allData = [...stockData, ...predictions.map(p => ({ close: p.predicted, date: p.date }))];
  const minPrice = Math.min(...allData.map(d => d.close));
  const maxPrice = Math.max(...allData.map(d => d.close));
  const priceRange = maxPrice - minPrice;

  // Scale functions
  const scaleX = (index: number) => padding + (index / (allData.length - 1)) * plotWidth;
  const scaleY = (price: number) => padding + ((maxPrice - price) / priceRange) * plotHeight;

  // Generate path for historical data
  const historyPath = stockData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.close)}`)
    .join(' ');

  // Generate path for predictions
  const predictionPath = predictions
    .map((d, i) => {
      const xPos = scaleX(stockData.length - 1 + i);
      const yPos = scaleY(d.predicted);
      return `${i === 0 ? `M ${scaleX(stockData.length - 1)} ${scaleY(stockData[stockData.length - 1].close)} L` : 'L'} ${xPos} ${yPos}`;
    })
    .join(' ');

  // Generate confidence band
  const confidenceBand = predictions.map((d, i) => {
    const xPos = scaleX(stockData.length - 1 + i);
    const yPos = scaleY(d.predicted);
    const confidence = d.confidence;
    const bandWidth = 10 * (1 - confidence);
    return { x: xPos, y: yPos, width: bandWidth };
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Price Chart & Predictions</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Historical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: modelColor }}></div>
            <span className="text-sm text-gray-600">{selectedModel} Prediction</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="border border-gray-100 rounded-lg">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Confidence band */}
          {confidenceBand.length > 0 && (
            <g>
              {confidenceBand.map((band, i) => (
                <ellipse
                  key={i}
                  cx={band.x}
                  cy={band.y}
                  rx={band.width}
                  ry={band.width / 2}
                  fill={modelColor}
                  opacity={0.1}
                />
              ))}
            </g>
          )}

          {/* Historical price line */}
          <path
            d={historyPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            className="drop-shadow-sm"
          />

          {/* Prediction line */}
          {predictionPath && (
            <path
              d={predictionPath}
              fill="none"
              stroke={modelColor}
              strokeWidth="2"
              strokeDasharray="5,5"
              className="drop-shadow-sm"
            />
          )}

          {/* Data points */}
          {stockData.slice(-20).map((d, i) => (
            <circle
              key={`hist-${i}`}
              cx={scaleX(stockData.length - 20 + i)}
              cy={scaleY(d.close)}
              r="3"
              fill="#3b82f6"
              className="hover:r-4 transition-all duration-200"
            />
          ))}

          {/* Prediction points */}
          {predictions.slice(0, 10).map((d, i) => (
            <circle
              key={`pred-${i}`}
              cx={scaleX(stockData.length - 1 + i)}
              cy={scaleY(d.predicted)}
              r="3"
              fill={modelColor}
              className="hover:r-4 transition-all duration-200"
            />
          ))}

          {/* Y-axis labels */}
          {Array.from({ length: 6 }, (_, i) => {
            const price = minPrice + (priceRange * i) / 5;
            const y = scaleY(price);
            return (
              <g key={i}>
                <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#6b7280" strokeWidth="1" />
                <text x={padding - 10} y={y + 5} textAnchor="end" className="fill-gray-500 text-xs">
                  ${price.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {Array.from({ length: 5 }, (_, i) => {
            const x = padding + (plotWidth * i) / 4;
            const dataIndex = Math.floor((allData.length * i) / 4);
            const date = allData[dataIndex]?.date || '';
            return (
              <g key={i}>
                <line x1={x} y1={chartHeight - padding} x2={x} y2={chartHeight - padding + 5} stroke="#6b7280" strokeWidth="1" />
                <text x={x} y={chartHeight - padding + 20} textAnchor="middle" className="fill-gray-500 text-xs">
                  {new Date(date).toLocaleDateString()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Divider line between historical and predictions */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-300 opacity-50"
          style={{
            left: `${padding + ((stockData.length - 1) / (allData.length - 1)) * plotWidth}px`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default StockChart;