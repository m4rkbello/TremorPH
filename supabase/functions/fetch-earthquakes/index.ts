import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAR_BOUNDS = { north: 25.0, south: 3.0, east: 135.0, west: 115.0 };

function isInPAR(lat: number, lon: number): boolean {
  return lat >= PAR_BOUNDS.south && lat <= PAR_BOUNDS.north &&
         lon >= PAR_BOUNDS.west && lon <= PAR_BOUNDS.east;
}

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    const data = await response.json();

    let inserted = 0;
    for (const feature of data.features) {
      const [longitude, latitude, depth] = feature.geometry.coordinates;
      const { mag, place, time } = feature.properties;
      if (!isInPAR(latitude, longitude)) continue;

      const { data: existing } = await supabase
        .from('earthquakes')
        .select('id')
        .eq('source_id', feature.id)
        .single();

      if (!existing) {
        await supabase.from('earthquakes').insert({
          magnitude: mag,
          latitude,
          longitude,
          depth,
          location: place,
          source: 'USGS',
          source_id: feature.id,
          occurred_at: new Date(time).toISOString(),
          is_par: true,
        });
        inserted++;
      }
    }

    return new Response(JSON.stringify({ success: true, inserted }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});