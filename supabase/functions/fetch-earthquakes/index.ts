import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAR_BOUNDS = { north: 25.0, south: 3.0, east: 135.0, west: 115.0 };

function isInPAR(lat: number, lon: number): boolean {
  return lat >= PAR_BOUNDS.south && lat <= PAR_BOUNDS.north &&
         lon >= PAR_BOUNDS.west && lon <= PAR_BOUNDS.east;
}

serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    const data = await res.json();

    let insertedCount = 0;

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
          source_id: feature.id,
          magnitude: mag,
          latitude,
          longitude,
          depth,
          location: place,
          occurred_at: new Date(time).toISOString(),
          is_par: true,
        });

        // Send Push Notifications if Magnitude is significant
        if (mag >= 4.0) {
          const { data: tokens } = await supabase
            .from('user_device_tokens')
            .select('expo_push_token')
            .eq('is_active', true);

          if (tokens && tokens.length > 0) {
            const pushMessages = tokens.map(t => ({
              to: t.expo_push_token,
              sound: 'default',
              title: `🚨 Earthquake Alert M${mag.toFixed(1)}`,
              body: `${place} - Depth: ${depth}km`,
            }));

            await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(pushMessages),
            });
          }
        }
        insertedCount++;
      }
    }

    return new Response(JSON.stringify({ success: true, inserted: insertedCount }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});