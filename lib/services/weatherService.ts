import { WeatherData, WeatherResponse } from '@/lib/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherService {
  static async getWeatherByCity(city: string = 'Tokyo'): Promise<WeatherData> {
    try {
      // Check if API key is available
      if (!API_KEY) {
        console.warn('OpenWeatherMap API key not found. Using mock data. Please set NEXT_PUBLIC_WEATHER_API_KEY in your .env.local file.');
        return this.getMockWeatherData();
      }

      const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ja`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your NEXT_PUBLIC_WEATHER_API_KEY.');
        } else if (response.status === 404) {
          throw new Error(`City "${city}" not found.`);
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }
      }

      const data: WeatherResponse = await response.json();
      
      // Validate response data
      if (!data.main || !data.weather || data.weather.length === 0) {
        throw new Error('Invalid weather data received from API');
      }
      
      return {
        temperature: Math.round(data.main.temp),
        condition: this.translateCondition(data.weather[0].main),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed * 10) / 10 || 0,
        icon: data.weather[0].icon,
        description: data.weather[0].description || this.translateCondition(data.weather[0].main),
        location: data.name,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Weather service error:', error);
      
      // Return mock data with error indication for development
      const mockData = this.getMockWeatherData();
      mockData.description = `${mockData.description} (モックデータ)`;
      return mockData;
    }
  }

  private static translateCondition(condition: string): string {
    const translations: { [key: string]: string } = {
      'Clear': '晴れ',
      'Clouds': '曇り',
      'Rain': '雨',
      'Drizzle': '小雨',
      'Thunderstorm': '雷雨',
      'Snow': '雪',
      'Mist': '霧',
      'Fog': '霧',
      'Haze': 'もや',
      'Dust': '砂埃',
      'Sand': '砂嵐',
      'Ash': '火山灰',
      'Squall': '突風',
      'Tornado': '竜巻'
    };
    
    return translations[condition] || condition;
  }

  private static getMockWeatherData(): WeatherData {
    const conditions = ['晴れ', '曇り', '雨', '雪'];
    const icons = ['01d', '02d', '10d', '13d'];
    const randomIndex = Math.floor(Math.random() * conditions.length);

    return {
      temperature: Math.floor(Math.random() * 25) + 5, // 5-30°C
      condition: conditions[randomIndex],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 10) + 1, // 1-10 m/s
      icon: icons[randomIndex],
      description: conditions[randomIndex],
      location: '東京',
      lastUpdated: new Date()
    };
  }
}