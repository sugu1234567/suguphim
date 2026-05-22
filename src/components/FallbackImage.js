'use client';
import { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';

export default function FallbackImage({ src, alt = '', className = '', ...props }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      {...props}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
