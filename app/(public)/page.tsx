import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pg_tables')
    .select('*')
    .limit(1)

  return (
    <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
  )
}
