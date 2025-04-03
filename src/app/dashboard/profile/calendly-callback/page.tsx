'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CalendlyCallback() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      // Send the code back to the parent window
      window.opener.postMessage({ code }, window.location.origin);
      // Close this window
      window.close();
    }
  }, [code]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <p>Connecting to Calendly...</p>
    </div>
  );
} 