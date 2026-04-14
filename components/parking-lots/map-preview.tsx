'use client';

import { MapPin } from 'lucide-react';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  name?: string;
}

export function MapPreview({ latitude, longitude, name }: MapPreviewProps) {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x400&style=feature:all|element:labels|visibility:off&markers=color:0xFF6B6B|${latitude},${longitude}&key=AIzaSyDummyKeyForDemo`;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4 text-red-500" />
        Location Preview
      </h3>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
        <div className="bg-slate-800 w-full h-64 flex items-center justify-center">
          {/* Using placeholder since we need actual API key for real maps */}
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">{latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
            {name && <p className="text-xs text-slate-500">{name}</p>}
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Latitude: {latitude.toFixed(6)}</p>
        <p>Longitude: {longitude.toFixed(6)}</p>
      </div>
    </div>
  );
}
