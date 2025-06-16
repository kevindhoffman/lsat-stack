import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const supabase = createClient(
  'https://reaubuunxfgyazrjuxmd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlYXVidXVueGZneWF6cmp1eG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMzU2NzQsImV4cCI6MjA2NTYxMTY3NH0.4rI4xtkUrHQgGrhUadQDoD3jhlASKHrURVY6kLO1opI'
)
