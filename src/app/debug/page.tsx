'use client'
import { useState } from 'react';
import { supabaseClient } from '../../../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { CommissionRequest } from '../types/Types';

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
    <div>
      <img src="https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/sign/work-files/0862d694-0bde-4991-8ef9-e89b984f4365/b43e4edc-6184-4221-bb90-ad344758c7ad_screenshot_2025-08-02_at_9.39.27_pm.png.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yZGE3MTRkOC0yYTFjLTQ0NTMtYTU0OS1kMGE2YTNjZDY0YmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3b3JrLWZpbGVzLzA4NjJkNjk0LTBiZGUtNDk5MS04ZWY5LWU4OWI5ODRmNDM2NS9iNDNlNGVkYy02MTg0LTQyMjEtYmI5MC1hZDM0NDc1OGM3YWRfc2NyZWVuc2hvdF8yMDI1LTA4LTAyX2F0XzkuMzkuMjdfcG0ucG5nLnBuZyIsImlhdCI6MTc1NTYyNDA2MSwiZXhwIjoxNzU2MjI4ODYxfQ.kueluB-vUr_FmIPbLADFddVeq3DPWCZ5A3lUOr8a-PM" alt="Preview" />
    </div>
  )
}
