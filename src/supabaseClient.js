import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mqudrmpuwmsonxjigswc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdWRybXB1d21zb254amlnc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzMxODUsImV4cCI6MjA3OTc0OTE4NX0.5ouRjBMtfFtKNR2i50vgv0e9aJDXFxB-00TTMiO1MgA'

export const supabase = createClient(supabaseUrl, supabaseKey)
