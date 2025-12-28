// Diagnostic page to check environment variables
export default function EnvCheckPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Environment Variables Check</h1>
            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <h2>Server-side values (at build time):</h2>
                <p><strong>NEXT_PUBLIC_API_URL:</strong> {apiUrl || '❌ NOT SET'}</p>
                <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl || '❌ NOT SET'}</p>
            </div>

            <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <h2>Client-side values (from browser):</h2>
                <p><strong>NEXT_PUBLIC_API_URL:</strong> <span id="client-api-url">Loading...</span></p>
                <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> <span id="client-supabase-url">Loading...</span></p>
            </div>

            <script dangerouslySetInnerHTML={{
                __html: `
                    document.getElementById('client-api-url').textContent = 
                        '${apiUrl}' || '❌ NOT SET';
                    document.getElementById('client-supabase-url').textContent = 
                        '${supabaseUrl}' || '❌ NOT SET';
                `
            }} />
        </div>
    );
}
