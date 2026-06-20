import React from 'react';
import { MapPin, Info, Compass } from 'lucide-react';
import { ModelInput } from '../types';

interface CaliforniaMapProps {
  input: ModelInput;
  estimatedValue: number;
}

export const CaliforniaMap: React.FC<CaliforniaMapProps> = ({ input, estimatedValue }) => {
  const { Latitude, Longitude } = input;

  // Projection boundary constants for California
  const MIN_LAT = 32.5;
  const MAX_LAT = 42.5;
  const MIN_LON = -124.5;
  const MAX_LON = -114.3;

  // Dimensions of SVG map projection
  const width = 300;
  const height = 400;

  // Convert GPS coordinates to pixel coordinates on SVG canvas
  // X axis: Longitude maps to width. Note: Longitude is negative, so -124 is left, -114 is right.
  const x = ((Longitude - MIN_LON) / (MAX_LON - MIN_LON)) * width;
  // Y axis: Latitude maps to height. Note: 42.5 (North) is top (0px), 32.5 (South) is bottom (heightpx).
  const y = height - ((Latitude - MIN_LAT) / (MAX_LAT - MIN_LAT)) * height;

  // Major California reference points
  const referenceCities = [
    { name: "San Francisco", lat: 37.77, lon: -122.42 },
    { name: "Los Angeles", lat: 34.05, lon: -118.24 },
    { name: "Sacramento", lat: 38.58, lon: -121.49 },
    { name: "San Diego", lat: 32.71, lon: -117.16 }
  ];

  // Map reference cities to pixels
  const projectedCities = referenceCities.map(city => ({
    ...city,
    x: ((city.lon - MIN_LON) / (MAX_LON - MIN_LON)) * width,
    y: height - ((city.lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * height
  }));

  // Helper: calculate spherical distance in miles (approximation)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find closest city
  const closestCityInfo = referenceCities.reduce((prev, curr) => {
    const prevDist = getDistance(Latitude, Longitude, prev.lat, prev.lon);
    const currDist = getDistance(Latitude, Longitude, curr.lat, curr.lon);
    return currDist < prevDist ? curr : prev;
  });

  const distanceToClosest = getDistance(Latitude, Longitude, closestCityInfo.lat, closestCityInfo.lon);

  // Generate realistic geographic commentary based on coordinates
  const getContextualCommentary = () => {
    // Coast proximity: SF, LA, SD are coastal.
    // If coordinates are very close to one of the coastal hubs or generally West, it's coastal.
    const isCoastal = Longitude < -120.5 && (
      (Latitude > 32.5 && Latitude < 34.5 && Longitude > -119.0) || // SoCal Coast
      (Latitude > 36.5 && Latitude < 38.5 && Longitude < -121.8) || // SF Bay
      (Latitude > 40.0 && Longitude < -124.0) // Humboldt/NoCal Coast
    );

    if (isCoastal) {
      if (estimatedValue > 400000) {
        return `This district is situated in a high-demand coastal corridor near the ${closestCityInfo.name} metro market. Ocean proximity, temperate climates, and dense high-income jobs strongly inflate baseline valuations.`;
      }
      return `This district is located near the coastal shelf. Coastal positioning grants premiums, though local zoning or socio-demographic indicators moderate the aggregate valuation.`;
    }

    // Mountain/East boundary
    if (Longitude > -119.0 && Latitude > 37.0) {
      return "This district is located in the eastern mountainous/Sierras area. Low population densities, forest land, and remote positioning yield lower land-value weights, typical of rural recreational regions.";
    }

    // Central Valley
    if (Latitude > 35.0 && Latitude < 39.5 && Longitude > -121.5 && Longitude < -119.0) {
      return "This district lies within California's Central Valley agricultural plain. Flat inland positioning and agriculture-focused economies correlate with high housing affordability compared to coastal hubs.";
    }

    // Inland Southern California
    if (Latitude < 35.0 && Longitude > -118.0) {
      return "This district is positioned in inland Southern California. High summer heat indices and desert terrain traditionally result in lower baseline home value coefficients, serving as affordable relief for the LA basin.";
    }

    return "This district represents an intermediate geographic plain in California. Home values are driven by standard municipal access, median income distributions, and moderate local population density.";
  };

  return (
    <div className="space-y-6 select-none">
      <div>
        <h3 className="text-xl font-bold font-outfit text-white mb-1">Geographic Intelligence</h3>
        <p className="text-sm text-slate-400">
          California spatial indexing overlay mapping coordinates directly to municipal price indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        {/* Map column */}
        <div className="md:col-span-2 flex justify-center">
          <div className="relative border border-brand-border bg-slate-950/40 rounded-2xl p-4 shadow-glass overflow-hidden w-[332px]">
            {/* Compass rose accent */}
            <div className="absolute top-4 right-4 text-slate-600 flex items-center gap-1">
              <Compass size={14} />
              <span className="font-mono text-[9px] font-bold">GRID</span>
            </div>

            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
              {/* stylized California backdrop contour */}
              <path
                d="M 50,20 L 175,20 L 175,160 L 290,320 L 260,380 L 195,385 L 145,340 L 95,290 L 80,240 L 40,160 L 35,90 Z"
                fill="rgba(99, 102, 241, 0.04)"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              
              {/* Inner fill land mass */}
              <path
                d="M 50,20 L 175,20 L 175,160 L 290,320 L 260,380 L 195,385 L 145,340 L 95,290 L 80,240 L 40,160 L 35,90 Z"
                fill="url(#california-glow)"
              />

              {/* Gradient defs */}
              <defs>
                <radialGradient id="california-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.12)" />
                  <stop offset="100%" stopColor="rgba(3, 7, 18, 0)" />
                </radialGradient>
              </defs>

              {/* Reference cities */}
              {projectedCities.map(city => (
                <g key={city.name}>
                  <circle cx={city.x} cy={city.y} r="3" fill="rgba(255,255,255,0.3)" />
                  <text
                    x={city.x + 6}
                    y={city.y + 3}
                    fill="rgba(255,255,255,0.4)"
                    fontSize="8"
                    fontFamily="Inter"
                  >
                    {city.name}
                  </text>
                </g>
              ))}

              {/* Selected coordinate pin indicator */}
              {x >= 0 && x <= width && y >= 0 && y <= height && (
                <g>
                  {/* Glowing halo wave */}
                  <circle cx={x} cy={y} r="12" fill="rgba(99,102,241,0.25)" className="animate-ping" style={{ transformOrigin: `${x}px ${y}px` }} />
                  <circle cx={x} cy={y} r="6" fill="rgba(99,102,241,0.6)" />
                  <circle cx={x} cy={y} r="3" fill="#ffffff" />
                  
                  {/* Fine dotted coordinates lines */}
                  <line x1={x} y1={0} x2={x} y2={height} stroke="rgba(99,102,241,0.15)" strokeDasharray="2 2" />
                  <line x1={0} y1={y} x2={width} y2={y} stroke="rgba(99,102,241,0.15)" strokeDasharray="2 2" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Info/Contextual column */}
        <div className="md:col-span-3 space-y-4">
          <div className="p-4 rounded-xl border border-brand-border bg-slate-900/30">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={13} className="text-brand-indigo" /> Location Coordinates
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Latitude</p>
                <p className="text-base font-semibold font-mono text-white mt-0.5">{Latitude.toFixed(4)}° N</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Longitude</p>
                <p className="text-base font-semibold font-mono text-white mt-0.5">{Longitude.toFixed(4)}° W</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-brand-border bg-slate-900/30">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Proximity Index
            </h4>
            <p className="text-sm text-slate-200 leading-normal">
              Located approximately <strong className="text-brand-indigo font-mono">{distanceToClosest.toFixed(1)} miles</strong> from downtown <strong className="text-white font-outfit">{closestCityInfo.name}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-brand-border bg-brand-indigo/5">
            <h4 className="text-xs font-bold text-brand-indigo uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info size={13} /> Spatial Analytics Commentary
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-inter">
              {getContextualCommentary()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
