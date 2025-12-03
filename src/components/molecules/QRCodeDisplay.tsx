'use client';

import React from 'react';
import Image from 'next/image';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center justify-center p-4 bg-white rounded-2xl border-2 border-gray-200">
      <img src={qrUrl} alt="QR Code" className="w-full h-full" />
    </div>
  );
}

