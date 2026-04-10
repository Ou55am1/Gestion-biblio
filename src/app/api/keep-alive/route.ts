import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Une simple requête "Select" sur la table "books" pour garder la BD active. 
    // Supabase perçoit cette requête comme de l'activité, ce qui réinitialise le compteur d'inactivité.
    const { data, error } = await supabase
      .from('books') 
      .select('id')
      .limit(1);

    if (error) {
        throw error;
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Base de données Supabase maintenue active !' 
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: error }, { status: 500 });
  }
}
