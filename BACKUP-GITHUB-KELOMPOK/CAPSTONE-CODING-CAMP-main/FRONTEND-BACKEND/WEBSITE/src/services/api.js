const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co/rest/v1/your_table';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

export async function fetchSupabaseData() {
  const res = await fetch(SUPABASE_URL, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error('Gagal fetch data Supabase');
  return res.json();
}
