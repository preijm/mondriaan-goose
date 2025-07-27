import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface CountryTestCount {
  country_code: string;
  test_count: number;
}

const GeographicalWorldMap = () => {
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
    if (!country) return '#e5e7eb'; // Light gray for no data
    
    const testCount = country.test_count;
    if (testCount >= 100) return '#dc2626'; // Red - Very High
    if (testCount >= 50) return '#ea580c'; // Orange - High  
    if (testCount >= 20) return '#f59e0b'; // Amber - Medium-High
    if (testCount >= 10) return '#eab308'; // Yellow - Medium
    if (testCount >= 5) return '#84cc16'; // Lime - Low-Medium
    if (testCount >= 1) return '#22c55e'; // Green - Low
    return '#e5e7eb'; // Light gray for no data
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
          <span className="text-sm font-medium">100+ tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ea580c' }}></div>
          <span className="text-sm font-medium">50-99 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-sm font-medium">20-49 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
          <span className="text-sm font-medium">10-19 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
          <span className="text-sm font-medium">5-9 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
          <span className="text-sm font-medium">1-4 tests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-300"></div>
          <span className="text-sm font-medium">No data</span>
        </div>
      </div>

      {/* Geographical World Map SVG */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-lg">
        <svg viewBox="0 0 1000 500" className="w-full h-auto bg-blue-100">
          {/* United States - More realistic shape */}
          <path
            d="M158 206 L159 204 L174 201 L188 200 L204 202 L220 204 L235 202 L249 199 L264 197 L280 196 L295 198 L310 200 L325 198 L340 196 L355 198 L370 200 L385 202 L400 204 L415 206 L430 208 L430 220 L428 235 L426 250 L424 265 L422 280 L420 295 L418 310 L416 325 L414 340 L400 338 L385 336 L370 334 L355 332 L340 330 L325 328 L310 326 L295 324 L280 322 L264 320 L249 318 L235 316 L220 314 L204 312 L188 310 L174 308 L159 306 L158 291 L156 276 L154 261 L152 246 L150 231 L152 216 Z"
            fill={getCountryColor('US')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>United States: {getCountryTestCount('US')} tests</title>
          </path>

          {/* Canada - More realistic northern shape */}
          <path
            d="M150 80 L180 82 L210 84 L240 86 L270 88 L300 90 L330 92 L360 94 L390 96 L420 98 L450 100 L480 102 L480 120 L478 135 L476 150 L474 165 L472 180 L470 195 L430 193 L400 191 L370 189 L340 187 L310 185 L280 183 L249 181 L220 179 L188 177 L158 175 L150 160 L148 145 L146 130 L144 115 L146 100 Z"
            fill={getCountryColor('CA')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Canada: {getCountryTestCount('CA')} tests</title>
          </path>

          {/* United Kingdom - Accurate island shape */}
          <path
            d="M480 140 L485 138 L492 136 L498 135 L505 137 L510 140 L512 145 L514 150 L516 155 L518 160 L520 165 L522 170 L520 175 L516 178 L510 180 L505 182 L498 183 L492 182 L485 180 L480 178 L476 175 L474 170 L472 165 L470 160 L468 155 L466 150 L468 145 L472 142 L476 140 Z"
            fill={getCountryColor('GB')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>United Kingdom: {getCountryTestCount('GB')} tests</title>
          </path>

          {/* France - Hexagonal shape */}
          <path
            d="M485 180 L520 182 L530 185 L535 192 L540 200 L542 210 L544 220 L546 230 L548 240 L550 250 L545 258 L538 264 L530 268 L520 270 L510 268 L500 264 L492 258 L485 250 L480 240 L478 230 L476 220 L474 210 L472 200 L470 192 L472 185 L478 182 Z"
            fill={getCountryColor('FR')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>France: {getCountryTestCount('FR')} tests</title>
          </path>

          {/* Germany - Central European shape */}
          <path
            d="M520 158 L545 160 L560 162 L572 165 L580 170 L585 178 L588 186 L590 195 L592 204 L594 213 L592 222 L588 230 L582 236 L574 240 L565 242 L555 244 L545 246 L535 244 L525 242 L520 236 L518 228 L516 220 L514 212 L512 204 L510 195 L508 186 L506 178 L508 170 L512 164 L518 160 Z"
            fill={getCountryColor('DE')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Germany: {getCountryTestCount('DE')} tests</title>
          </path>

          {/* Netherlands - Small coastal country */}
          <path
            d="M508 158 L520 160 L525 165 L528 172 L525 178 L520 182 L515 184 L508 182 L503 178 L500 172 L503 165 L508 162 Z"
            fill={getCountryColor('NL')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Netherlands: {getCountryTestCount('NL')} tests</title>
          </path>

          {/* Belgium - Small central country */}
          <path
            d="M500 172 L515 174 L520 178 L522 184 L520 190 L515 194 L508 196 L500 194 L495 190 L493 184 L495 178 L498 174 Z"
            fill={getCountryColor('BE')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Belgium: {getCountryTestCount('BE')} tests</title>
          </path>

          {/* Spain - Iberian Peninsula */}
          <path
            d="M445 220 L478 222 L485 225 L490 232 L495 240 L500 248 L502 256 L504 264 L502 272 L498 278 L492 282 L485 284 L478 282 L470 278 L462 272 L455 264 L450 256 L448 248 L446 240 L444 232 L442 225 L444 220 Z"
            fill={getCountryColor('ES')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Spain: {getCountryTestCount('ES')} tests</title>
          </path>

          {/* Italy - Boot shape */}
          <path
            d="M545 230 L555 232 L562 236 L568 242 L572 250 L574 258 L576 266 L578 274 L580 282 L582 290 L584 298 L582 306 L578 312 L572 316 L565 318 L558 316 L552 312 L548 306 L546 298 L544 290 L542 282 L540 274 L538 266 L536 258 L534 250 L536 242 L540 236 L545 232 Z"
            fill={getCountryColor('IT')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Italy: {getCountryTestCount('IT')} tests</title>
          </path>

          {/* Switzerland - Mountain country */}
          <path
            d="M520 210 L535 212 L542 216 L545 222 L542 228 L535 232 L528 234 L520 232 L515 228 L512 222 L515 216 L520 212 Z"
            fill={getCountryColor('CH')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Switzerland: {getCountryTestCount('CH')} tests</title>
          </path>

          {/* Austria - Alpine country */}
          <path
            d="M545 210 L570 212 L578 216 L582 222 L578 228 L570 232 L562 234 L545 232 L540 228 L538 222 L540 216 L545 212 Z"
            fill={getCountryColor('AT')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Austria: {getCountryTestCount('AT')} tests</title>
          </path>

          {/* Croatia - Adriatic coast */}
          <path
            d="M570 232 L585 234 L592 238 L596 244 L598 252 L596 258 L592 262 L585 264 L578 262 L572 258 L568 252 L566 244 L568 238 L572 234 Z"
            fill={getCountryColor('HR')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Croatia: {getCountryTestCount('HR')} tests</title>
          </path>

          {/* Russia - Large territory */}
          <path
            d="M600 100 L750 102 L850 104 L900 106 L920 110 L925 118 L928 126 L930 135 L932 144 L934 153 L936 162 L934 171 L930 178 L925 184 L918 188 L910 190 L900 192 L850 190 L800 188 L750 186 L700 184 L650 182 L620 180 L610 175 L605 168 L602 160 L600 152 L598 144 L596 135 L594 126 L592 118 L594 110 L598 104 Z"
            fill={getCountryColor('RU')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Russia: {getCountryTestCount('RU')} tests</title>
          </path>

          {/* China - Large eastern territory */}
          <path
            d="M700 180 L780 182 L820 184 L840 186 L850 190 L855 198 L858 206 L860 215 L862 224 L864 233 L862 242 L858 249 L852 254 L845 258 L836 260 L825 262 L812 264 L798 266 L784 268 L770 266 L758 264 L748 260 L740 254 L734 247 L730 238 L728 229 L726 220 L724 211 L722 202 L720 194 L718 186 L720 180 Z"
            fill={getCountryColor('CN')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>China: {getCountryTestCount('CN')} tests</title>
          </path>

          {/* India - Subcontinent */}
          <path
            d="M680 240 L720 242 L740 244 L755 246 L765 250 L772 256 L776 264 L778 272 L780 280 L782 288 L784 296 L786 304 L784 312 L780 318 L774 322 L766 324 L756 326 L745 328 L733 330 L720 332 L706 330 L694 328 L684 324 L676 318 L670 310 L666 301 L664 292 L662 283 L660 274 L658 265 L656 256 L658 248 L662 242 L668 238 L675 236 Z"
            fill={getCountryColor('IN')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>India: {getCountryTestCount('IN')} tests</title>
          </path>

          {/* Japan - Island chain */}
          <path
            d="M840 200 L845 198 L852 196 L858 198 L862 202 L864 208 L866 214 L868 220 L866 226 L862 230 L856 232 L849 234 L842 232 L837 228 L834 222 L832 216 L830 210 L828 204 L830 200 L835 198 Z M870 210 L875 208 L880 206 L885 208 L888 212 L890 218 L888 224 L883 228 L878 230 L873 228 L870 224 L868 218 L866 212 L868 208 Z"
            fill={getCountryColor('JP')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Japan: {getCountryTestCount('JP')} tests</title>
          </path>

          {/* Australia - Continental island */}
          <path
            d="M750 350 L820 352 L860 354 L885 356 L900 360 L908 366 L914 374 L918 383 L920 392 L922 401 L924 410 L922 419 L918 426 L912 431 L904 434 L895 436 L885 438 L874 440 L862 442 L849 444 L835 446 L820 448 L804 450 L788 452 L772 450 L758 448 L746 444 L736 438 L728 430 L722 421 L718 411 L716 401 L714 391 L712 381 L710 371 L708 361 L710 353 L714 347 L720 343 L728 341 L738 340 Z"
            fill={getCountryColor('AU')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Australia: {getCountryTestCount('AU')} tests</title>
          </path>

          {/* Brazil - South American giant */}
          <path
            d="M300 280 L350 282 L380 284 L400 286 L415 290 L425 296 L432 304 L436 313 L438 322 L440 331 L442 340 L444 349 L446 358 L448 367 L450 376 L448 385 L444 392 L438 397 L430 400 L420 402 L408 404 L395 406 L381 408 L366 410 L350 412 L333 414 L316 416 L300 418 L285 416 L272 414 L261 410 L252 404 L245 396 L240 387 L237 377 L235 367 L233 357 L231 347 L229 337 L227 327 L225 317 L223 307 L221 297 L219 287 L221 279 L225 273 L231 269 L239 267 L249 266 L261 266 L274 267 L287 269 Z"
            fill={getCountryColor('BR')}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="hover:stroke-2 cursor-pointer transition-all duration-200"
          >
            <title>Brazil: {getCountryTestCount('BR')} tests</title>
          </path>

          {/* Country labels for countries with tests */}
          {countryData.filter(c => c.test_count >= 1).map(country => {
            const labelPositions: Record<string, [number, number]> = {
              'NL': [515, 170],
              'DE': [550, 190],
              'FR': [500, 210],
              'BE': [508, 185],
              'GB': [490, 160],
              'US': [275, 250],
              'CA': [300, 140],
              'BR': [350, 350],
              'AU': [820, 400],
              'IT': [560, 270],
              'ES': [460, 250],
              'CH': [530, 220],
              'AT': [560, 220],
              'HR': [580, 245],
              'RU': [750, 150],
              'CN': [780, 220],
              'IN': [720, 280],
              'JP': [850, 215],
            };
            
            const [x, y] = labelPositions[country.country_code] || [0, 0];
            if (x === 0) return null;
            
            return (
              <g key={country.country_code}>
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white"
                  style={{ 
                    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  {country.country_code}
                </text>
                <text
                  x={x}
                  y={y + 8}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-white"
                  style={{ 
                    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                    fontFamily: 'Arial, sans-serif'
                  }}
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

export default GeographicalWorldMap;