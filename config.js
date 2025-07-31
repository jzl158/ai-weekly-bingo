// Configuration module for AI Weekly Bingo
// This file loads configuration from a separate API endpoint or environment variables

window.BingoConfig = {
    supabase: {
        url: '',
        anonKey: ''
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
            console.log('API config not available, falling back to environment variables');
        }
        
        // Option 2: Fallback to environment variables (for development)
        // These would be injected by build tools like Vite or Webpack
        this.supabase.url = window.__SUPABASE_URL__ || '';
        this.supabase.anonKey = window.__SUPABASE_ANON_KEY__ || '';
        
        // Validate configuration
        if (!this.supabase.url || !this.supabase.anonKey) {
            throw new Error('Missing Supabase configuration. Please configure your environment variables or API endpoint.');
        }
        
        return true;
    }
};