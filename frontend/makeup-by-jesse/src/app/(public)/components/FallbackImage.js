// app/(public)/components/FallbackImage.js
'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function FallbackImage({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || '/placeholder.svg')

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'image'}
      onError={() => setImgSrc('/default.jpg')}
    />
  )
}
