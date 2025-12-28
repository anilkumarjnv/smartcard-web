'use client';

// Diagnostic page to check environment variables
export default function EnvCheckPage() {
    const apiUrl = typeof window !== 'undefined'
        ? process.env.NEXT_PUBLIC_API_URL
        : 'Server-side only';
    const supabaseUrl = typeof window !== 'undefined'
        ? process.env.NEXT_PUBLIC_SUPABASE_URL
        : 'Server-side only';

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🔍 Environment Variables Diagnostic</h1>

            <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '2px solid #2196f3' }}>
                <h2>📍 Current URL:</h2>
                <p style={{ wordBreak: 'break-all' }}><strong>{typeof window !== 'undefined' ? window.location.href : 'Server-side render'}</strong></p>
            </div>

            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <h2>🔧 Environment Variables:</h2>
                <div style={{ background: 'white', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
                    <p><strong>NEXT_PUBLIC_API_URL:</strong></p>
                    <p style={{
                        background: apiUrl && apiUrl !== 'Server-side only' ? '#4caf50' : '#ff9800',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        wordBreak: 'break-all',
                        fontWeight: 'bold'
                    }}>
                        {apiUrl || '❌ NOT SET'}
                    </p>
                </div>

                <div style={{ background: 'white', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
                    <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong></p>
                    <p style={{
                        background: supabaseUrl && supabaseUrl !== 'Server-side only' ? '#4caf50' : '#ff9800',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        wordBreak: 'break-all',
                        fontWeight: 'bold'
                    }}>
                        {supabaseUrl || '❌ NOT SET'}
                    </p>
                </div>
            </div>

            <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '2px solid #ff9800' }}>
                <h2>⚠️ Important Notes:</h2>
                <ul style={{ lineHeight: '1.8' }}>
                    <li><strong>Testing Location:</strong> Are you testing on <strong>Vercel</strong> or <strong>localhost</strong>?</li>
                    <li>If testing on <strong>localhost</strong> (npm run dev), it uses your <strong>local .env file</strong></li>
                    <li>If testing on <strong>Vercel</strong>, it uses <strong>Vercel environment variables</strong></li>
                    <li>Always test production deployments on the actual <strong>Vercel URL</strong></li>
                </ul>
            </div>

            <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <h2>✅ Expected Values on Vercel:</h2>
                <p><strong>NEXT_PUBLIC_API_URL:</strong> https://smartcard-backend-aoek.onrender.com</p>
                <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> https://klvauwiovcfhsrajwqlx.supabase.co</p>
            </div>
        </div>
    );
}
