import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface CountryTestCount {
  country_code: string;
  test_count: number;
}

const RealWorldMap = () => {
  // Fetch test counts per country
  const { data: countryData = [], isLoading } = useQuery({
    queryKey: ['country-test-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milk_tests')
        .select('country_code')
        .not('country_code', 'is', null);
      
      if (error) throw error;
      
      // Count tests per country
      const counts: Record<string, number> = {};
      data.forEach(test => {
        if (test.country_code) {
          counts[test.country_code] = (counts[test.country_code] || 0) + 1;
        }
      });
      
      return Object.entries(counts).map(([country_code, test_count]) => ({
        country_code,
        test_count
      })) as CountryTestCount[];
    },
  });

  const getCountryColor = (countryCode: string): string => {
    const country = countryData.find(c => c.country_code === countryCode);
    if (!country) return '#f3f4f6'; // Light gray for no data
    
    const testCount = country.test_count;
    if (testCount >= 100) return '#dc2626'; // Red - Very High
    if (testCount >= 50) return '#ea580c'; // Orange - High  
    if (testCount >= 20) return '#f59e0b'; // Amber - Medium-High
    if (testCount >= 10) return '#eab308'; // Yellow - Medium
    if (testCount >= 5) return '#84cc16'; // Lime - Low-Medium
    if (testCount >= 1) return '#22c55e'; // Green - Low
    return '#f3f4f6'; // Light gray for no data
  };

  const getCountryTestCount = (countryCode: string): number => {
    const country = countryData.find(c => c.country_code === countryCode);
    return country ? country.test_count : 0;
  };

  const totalTests = countryData.reduce((sum, country) => sum + country.test_count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">Loading world map...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Global Milk Test Activity Map</h2>
        <p className="text-lg text-gray-600">
          {countryData.length} countries with {totalTests.toLocaleString()} total tests
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
          <span className="text-sm">100+ tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ea580c' }}></div>
          <span className="text-sm">50-99 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-sm">20-49 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
          <span className="text-sm">10-19 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
          <span className="text-sm">5-9 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
          <span className="text-sm">1-4 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-300"></div>
          <span className="text-sm">No data</span>
        </div>
      </div>

      {/* World Map SVG with real country paths */}
      <div className="w-full overflow-x-auto bg-blue-50 rounded-lg border border-gray-200">
        <svg viewBox="0 0 1000 500" className="w-full h-auto min-h-[400px] max-h-[600px]">
          {/* United States */}
          <path
            d="M200 200 L350 200 L350 180 L380 180 L380 160 L400 160 L400 140 L360 140 L360 120 L320 120 L320 100 L280 100 L280 120 L240 120 L240 140 L200 140 L200 160 L180 160 L180 180 L200 180 Z M160 200 L160 220 L140 220 L140 240 L120 240 L120 280 L200 280 L350 280 L350 240 L370 240 L370 220 L350 220 L350 200 Z"
            fill={getCountryColor('US')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>United States: {getCountryTestCount('US')} tests</title>
          </path>

          {/* Canada */}
          <path
            d="M140 80 L420 80 L420 140 L400 140 L400 160 L380 160 L380 180 L350 180 L350 200 L200 200 L200 180 L180 180 L180 160 L160 160 L160 140 L140 140 Z"
            fill={getCountryColor('CA')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Canada: {getCountryTestCount('CA')} tests</title>
          </path>

          {/* Brazil */}
          <path
            d="M320 320 L380 320 L400 340 L400 380 L380 400 L360 420 L340 420 L320 400 L300 380 L300 360 L320 340 Z"
            fill={getCountryColor('BR')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Brazil: {getCountryTestCount('BR')} tests</title>
          </path>

          {/* United Kingdom */}
          <path
            d="M480 160 L500 160 L500 140 L520 140 L520 160 L520 180 L500 180 L500 200 L480 200 L480 180 L460 180 L460 160 L480 160 Z"
            fill={getCountryColor('GB')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>United Kingdom: {getCountryTestCount('GB')} tests</title>
          </path>

          {/* France */}
          <path
            d="M480 200 L520 200 L540 220 L540 260 L520 280 L500 280 L480 260 L460 240 L460 220 L480 200 Z"
            fill={getCountryColor('FR')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>France: {getCountryTestCount('FR')} tests</title>
          </path>

          {/* Germany */}
          <path
            d="M520 180 L560 180 L580 200 L580 240 L560 260 L540 260 L540 220 L520 200 L520 180 Z"
            fill={getCountryColor('DE')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Germany: {getCountryTestCount('DE')} tests</title>
          </path>

          {/* Netherlands */}
          <path
            d="M520 160 L540 160 L540 180 L520 180 L520 160 Z"
            fill={getCountryColor('NL')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Netherlands: {getCountryTestCount('NL')} tests</title>
          </path>

          {/* Belgium */}
          <path
            d="M500 180 L520 180 L520 200 L500 200 L500 180 Z"
            fill={getCountryColor('BE')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Belgium: {getCountryTestCount('BE')} tests</title>
          </path>

          {/* Spain */}
          <path
            d="M440 240 L480 240 L480 280 L460 300 L440 300 L420 280 L420 260 L440 240 Z"
            fill={getCountryColor('ES')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Spain: {getCountryTestCount('ES')} tests</title>
          </path>

          {/* Italy */}
          <path
            d="M540 240 L560 240 L560 280 L580 300 L580 320 L560 340 L540 320 L520 300 L520 280 L540 260 L540 240 Z"
            fill={getCountryColor('IT')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Italy: {getCountryTestCount('IT')} tests</title>
          </path>

          {/* Switzerland */}
          <path
            d="M520 220 L540 220 L540 240 L520 240 L520 220 Z"
            fill={getCountryColor('CH')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Switzerland: {getCountryTestCount('CH')} tests</title>
          </path>

          {/* Austria */}
          <path
            d="M560 220 L580 220 L580 240 L560 240 L560 220 Z"
            fill={getCountryColor('AT')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Austria: {getCountryTestCount('AT')} tests</title>
          </path>

          {/* Croatia */}
          <path
            d="M580 240 L600 240 L600 260 L580 260 L580 240 Z"
            fill={getCountryColor('HR')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Croatia: {getCountryTestCount('HR')} tests</title>
          </path>

          {/* Russia */}
          <path
            d="M600 120 L880 120 L900 140 L900 200 L880 220 L800 220 L780 200 L720 200 L700 180 L680 160 L660 140 L640 140 L620 160 L600 160 L600 120 Z"
            fill={getCountryColor('RU')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Russia: {getCountryTestCount('RU')} tests</title>
          </path>

          {/* China */}
          <path
            d="M700 200 L780 200 L800 220 L800 260 L780 280 L760 280 L740 260 L720 240 L700 220 L700 200 Z"
            fill={getCountryColor('CN')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>China: {getCountryTestCount('CN')} tests</title>
          </path>

          {/* India */}
          <path
            d="M680 260 L720 260 L740 280 L740 320 L720 340 L700 340 L680 320 L660 300 L660 280 L680 260 Z"
            fill={getCountryColor('IN')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>India: {getCountryTestCount('IN')} tests</title>
          </path>

          {/* Japan */}
          <path
            d="M820 220 L840 220 L840 200 L860 200 L860 220 L860 240 L840 260 L820 260 L820 240 L820 220 Z M850 240 L870 240 L870 260 L850 260 L850 240 Z"
            fill={getCountryColor('JP')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Japan: {getCountryTestCount('JP')} tests</title>
          </path>

          {/* Australia */}
          <path
            d="M760 360 L840 360 L860 380 L860 420 L840 440 L800 440 L780 420 L760 400 L740 380 L740 360 L760 360 Z"
            fill={getCountryColor('AU')}
            stroke="#ffffff"
            strokeWidth="1"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Australia: {getCountryTestCount('AU')} tests</title>
          </path>

          {/* Country labels for active countries */}
          {countryData.filter(c => c.test_count >= 5).map(country => {
            const labelPositions: Record<string, [number, number]> = {
              'NL': [530, 170],
              'DE': [550, 210],
              'FR': [500, 230],
              'BE': [510, 190],
              'GB': [490, 170],
              'US': [275, 220],
              'CA': [280, 110],
              'BR': [350, 360],
              'AU': [800, 400],
              'IT': [550, 280],
              'ES': [450, 270],
              'CH': [530, 230],
              'AT': [570, 230],
              'HR': [590, 250],
              'RU': [750, 160],
              'CN': [740, 230],
              'IN': [700, 300],
              'JP': [840, 230],
            };
            
            const [x, y] = labelPositions[country.country_code] || [0, 0];
            if (x === 0) return null;
            
            return (
              <g key={country.country_code}>
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white drop-shadow-lg"
                  style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))' }}
                >
                  {country.country_code}
                </text>
                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-white drop-shadow-lg"
                  style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))' }}
                >
                  {country.test_count}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {countryData.slice(0, 10).map((country, index) => (
          <div
            key={country.country_code}
            className="bg-white p-4 rounded-lg border-2 text-center shadow-sm hover:shadow-md transition-shadow"
            style={{ borderColor: getCountryColor(country.country_code) }}
          >
            <div className="text-lg font-bold mb-1" style={{ color: getCountryColor(country.country_code) }}>
              #{index + 1} {country.country_code}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {country.test_count}
            </div>
            <div className="text-xs text-gray-500">
              {country.test_count === 1 ? 'test' : 'tests'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealWorldMap;