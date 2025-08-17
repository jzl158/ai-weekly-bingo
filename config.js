// Configuration module for AI Weekly Bingo
// This file loads configuration from a separate API endpoint or environment variables

window.BingoConfig = {
    supabase: {
        // Production-safe configuration
        // Will be replaced with actual values in production
        url: 'https://kfxbsrsahttsuckisktw.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeGJzcnNhaHR0c3Vja2lza3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzkzNDIsImV4cCI6MjA2NzMxNTM0Mn0.sANt0iU26PDQTGpijtdMPJM6RtNvP08OK9jCXTgh-HY'
    },
    
    // Load configuration from environment or API
    async loadConfig() {
        try {
            // Option 1: Try to load from API endpoint (recommended for production)
            const response = await fetch('/api/config');
            if (response.ok) {
                const config = await response.json();
                this.supabase.url = config.supabaseUrl;
                this.supabase.anonKey = config.supabaseAnonKey;
                return true;
            }
        } catch (error) {
            console.log('API config not available, using local configuration');
        }
        
        // Option 2: Fallback to environment variables (for development)
        // These would be injected by build tools like Vite or Webpack
        this.supabase.url = window.__SUPABASE_URL__ || this.supabase.url;
        this.supabase.anonKey = window.__SUPABASE_ANON_KEY__ || this.supabase.anonKey;
        
        // Validate configuration
        if (!this.supabase.url || !this.supabase.anonKey || 
            this.supabase.url.includes('YOUR_SUPABASE_URL_HERE') ||
            this.supabase.anonKey.includes('YOUR_SUPABASE_ANON_KEY_HERE')) {
            throw new Error('Missing Supabase configuration. Please update config.js with your Supabase project URL and anon key.');
        }
        
        return true;
    }
};