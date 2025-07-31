// Vercel serverless function to serve Supabase configuration
// Environment variables are set in Vercel dashboard and accessed securely server-side

export default function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get environment variables (these are set in Vercel dashboard)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    // Validate that environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing environment variables: SUPABASE_URL or SUPABASE_ANON_KEY');
        return res.status(500).json({ 
            error: 'Server configuration error. Please contact administrator.' 
        });
    }
    
    // Return configuration
    res.status(200).json({
        supabaseUrl: supabaseUrl,
        supabaseAnonKey: supabaseAnonKey
    });
}