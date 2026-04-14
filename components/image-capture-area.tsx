'use client'

import { ImageIcon } from 'lucide-react'

interface ImageCaptureAreaProps {
  imageFront?: string | null
  imagePlate?: string | null
  faceImg?: string | null
}

export function ImageCaptureArea({ 
  imageFront, 
  imagePlate, 
  faceImg 
}: ImageCaptureAreaProps) {
  const formatBase64 = (str?: string | null) => {
    if (!str) return null;
    if (str.startsWith('data:image')) return str; // Nếu có header rồi thì thôi
    return `data:image/jpeg;base64,${str}`;      // Nếu chưa có thì thêm vào
  };

  const images = [
    { id: 'face', label: 'HÌNH LÁI XE', src: formatBase64(faceImg) },
    { id: 'front', label: 'HÌNH PHÍA TRƯỚC', src: formatBase64(imageFront) },
    { id: 'plate', label: 'BIỂN SỐ', src: formatBase64(imagePlate) },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {images.map((image) => (
        <div 
          key={image.id}
          className={`bg-card border border-border rounded-lg flex items-center justify-center overflow-hidden aspect-square`}
        >
          {image.src ? (
            <img 
              src={image.src} 
              alt={image.label}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs text-center leading-tight">{image.label}</span>
            </div>
          )}
        </div>
      ))}
      </div>
  )
}
