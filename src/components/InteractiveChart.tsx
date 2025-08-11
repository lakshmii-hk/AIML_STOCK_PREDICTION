import React, { useState, useRef, useEffect } from 'react';
import { StockData, PredictionData } from '../types';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';

interface InteractiveChartProps {
  stockData: StockData[];
  predictions: PredictionData[];
  selectedModel: string;
  modelColor: string;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  stockData,
  predictions,
  selectedModel,
  modelColor,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<{ data: any; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const chartWidth = 900;
  const chartHeight = 500;
  const padding = 60;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;

  // Combine historical and prediction data
  const allData = [...stockData, ...predictions.map(p => ({ close: p.predicted, date: p.date, isPrediction: true }))];
  const minPrice = Math.min(...allData.map(d => d.close));
  const maxPrice = Math.max(...allData.map(d => d.close));
  const priceRange = maxPrice - minPrice;

  // Scale functions with zoom and pan
  const scaleX = (index: number) => {
    return padding + ((index / (allData.length - 1)) * plotWidth * zoom) + pan.x;
  };
  
  const scaleY = (price: number) => {
    return padding + (((maxPrice - price) / priceRange) * plotHeight * zoom) + pan.y;
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      // Handle hover for tooltip
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find closest data point
        let closestPoint = null;
        let minDistance = Infinity;
        
        allData.forEach((data, index) => {
          const pointX = scaleX(index);
          const pointY = scaleY(data.close);
          const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
          
          if (distance < 20 && distance < minDistance) {
            minDistance = distance;
            closestPoint = { data, x: pointX, y: pointY };
          }
        });
        
        setHoveredPoint(closestPoint);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Generate paths
  const historyPath = stockData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.close)}`)
    .join(' ');

  const predictionPath = predictions
    .map((d, i) => {
      const xPos = scaleX(stockData.length - 1 + i);
      const yPos = scaleY(d.predicted);
      return `${i === 0 ? `M ${scaleX(stockData.length - 1)} ${scaleY(stockData[stockData.length - 1].close)} L` : 'L'} ${xPos} ${yPos}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Interactive Price Chart</h3>
        
        {/* Chart Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <Move className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Drag to pan</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-gray-200">
        <svg
          ref={svgRef}
          width={chartWidth}
          height={chartHeight}
          className="cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setHoveredPoint(null);
          }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={modelColor} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={modelColor} stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Price area fill */}
          <path
            d={`${historyPath} L ${scaleX(stockData.length - 1)} ${chartHeight - padding} L ${scaleX(0)} ${chartHeight - padding} Z`}
            fill="url(#priceGradient)"
          />

          {/* Historical price line */}
          <path
            d={historyPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Prediction line */}
          {predictionPath && (
            <path
              d={predictionPath}
              fill="none"
              stroke={modelColor}
              strokeWidth="3"
              strokeDasharray="8,4"
              className="drop-shadow-sm"
            />
          )}

          {/* Interactive data points */}
          {stockData.map((d, i) => (
            <circle
              key={`hist-${i}`}
              cx={scaleX(i)}
              cy={scaleY(d.close)}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
              opacity={0.8}
            />
          ))}

          {/* Prediction points */}
          {predictions.map((d, i) => (
            <circle
              key={`pred-${i}`}
              cx={scaleX(stockData.length - 1 + i)}
              cy={scaleY(d.predicted)}
              r="4"
              fill={modelColor}
              className="hover:r-6 transition-all duration-200 cursor-pointer"
              opacity={0.8}
            />
          ))}

          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#374151" strokeWidth="2"/>
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#374151" strokeWidth="2"/>
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10 text-sm"
            style={{
              left: hoveredPoint.x + 10,
              top: hoveredPoint.y - 40,
              transform: hoveredPoint.x > chartWidth - 150 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="font-medium">₹{hoveredPoint.data.close.toFixed(2)}</div>
            <div className="text-gray-300 text-xs">
              {new Date(hoveredPoint.data.date).toLocaleDateString()}
            </div>
            {hoveredPoint.data.isPrediction && (
              <div className="text-yellow-300 text-xs">Predicted</div>
            )}
          </div>
        )}
      </div>

      {/* Chart Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Historical Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: modelColor }}></div>
            <span>AI Predictions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChart;