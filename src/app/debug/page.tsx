'use client'
import { useState } from 'react';

export default function Debug() {
  const [downloadLinksAndUrls, setDownloadLinksAndUrls] = useState<Array<{
    downloadLink: string;
    url: string;
  }>>([
    {
      downloadLink: 'https://example.com/signed-url-1',
      url: 'https://example.com/public-url-1'
    },
    {
      downloadLink: 'https://example.com/signed-url-2',
      url: 'https://example.com/public-url-2'
    }
  ]);

  const uploadFilesToStorage = async (files: FileList) => {
  }
  return (
    <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
      <a
        href="${file.downloadLink}"
        style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', color: '#2563eb', textDecoration: 'none', marginBottom: '0.5rem', fontFamily: "'Lexend', sans-serif" }}
      >
        Click here to reject
      </a>
      <a
        href="${file.downloadLink}"
        style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', color: '#2563eb', textDecoration: 'none', marginBottom: '0.5rem', fontFamily: "'Lexend', sans-serif" }}
      >
        Click here to accept
      </a>
    </div>
  )
}
