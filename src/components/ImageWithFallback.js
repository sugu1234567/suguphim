 'use client';

import React from 'react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';

export default function ImageWithFallback({ src, alt, className, style }) {
  const handleError = (e) => {
    e.target.src = FALLBACK_IMG;
  };
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={handleError}
    />
  );
}
