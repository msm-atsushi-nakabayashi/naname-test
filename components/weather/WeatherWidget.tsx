'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, MapPin, RefreshCw } from 'lucide-react';
import { WeatherService } from '@/lib/services/weatherService';
import { WeatherData } from '@/lib/types/weather';

interface WeatherWidgetProps {
  className?: string;
}

export default function WeatherWidget({ className = '' }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await WeatherService.getWeatherByCity('Tokyo');
      setWeather(data);
    } catch (err) {
      setError('天気情報を取得できませんでした');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case '晴れ':
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case '曇り':
      case 'clouds':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case '雨':
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case '雪':
      case 'snow':
        return <Snowflake className="h-8 w-8 text-blue-200" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Cloud className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">{error || '天気情報を読み込めません'}</p>
          {!process.env.NEXT_PUBLIC_WEATHER_API_KEY && (
            <p className="text-xs text-orange-600 mt-1">
              実際の天気データを表示するには、OpenWeatherMapのAPIキーを設定してください
            </p>
          )}
          <button
            onClick={fetchWeather}
            className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{weather.location}</span>
        </div>
        <button
          onClick={fetchWeather}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="更新"
        >
          <RefreshCw className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getWeatherIcon(weather.condition)}
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Droplets className="h-4 w-4" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Wind className="h-4 w-4" />
            <span>{weather.windSpeed}m/s</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        最終更新: {weather.lastUpdated.toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
}