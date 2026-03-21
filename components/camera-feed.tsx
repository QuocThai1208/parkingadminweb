'use client'

import { useState, useRef } from 'react'
import { Camera, CameraOff, Video } from 'lucide-react'

interface CameraFeedProps {
  isLoading?: boolean
}

export function CameraFeed({ isLoading = false }: CameraFeedProps) {
  // Trạng thái kết nối của từng camera
  const [activeCamera, setActiveCamera] = useState<Record<string, boolean>>({})
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  const cameras = [
    { id: 'face', label: 'CAMERA LÁI XE' },
    { id: 'front', label: 'CAMERA PHÍA TRƯỚC' },
    { id: 'plate', label: 'CAMERA BIỂN SỐ' },
  ]

  const toggleCamera = async (id: string) => {
    if (activeCamera[id]) {
      const stream = videoRefs.current[id]?.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
      if (videoRefs.current[id]) videoRefs.current[id]!.srcObject = null
      setActiveCamera(prev => ({ ...prev, [id]: false }))
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRefs.current[id]) {
        videoRefs.current[id]!.srcObject = stream
        setActiveCamera(prev => ({ ...prev, [id]: true }))
      }
    } catch (err) {
      console.error("Không thể truy cập camera:", err)
      alert("Không tìm thấy thiết bị camera hoặc quyền truy cập bị từ chối!")
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {cameras.map((camera) => (
        <div 
          key={camera.id}
          onClick={() => toggleCamera(camera.id)}
          className={`relative rounded-lg border overflow-hidden flex items-center justify-center aspect-square cursor-pointer transition-all duration-300
            ${activeCamera[camera.id] ? 'border-green-500 shadow-lg shadow-green-500/20' : 'bg-gradient-to-b from-card to-primary/10 border-border hover:border-primary'}`}
        >
          <video
            ref={(el) => { videoRefs.current[camera.id] = el }}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${activeCamera[camera.id] ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* UI Trạng thái */}
          <div className={`relative z-10 flex flex-col items-center gap-1 transition-opacity ${activeCamera[camera.id] ? 'bg-black/40 p-2 rounded text-white' : 'text-muted-foreground'}`}>
            {activeCamera[camera.id] ? (
              <Video className="w-5 h-5 animate-pulse text-green-400" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
            <p className="text-[10px] font-bold text-center leading-tight uppercase tracking-wider">{camera.label}</p>
          </div>

          {isLoading && (
             <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
          )}

          {/* Badge trạng thái */}
          <div className="absolute top-2 right-2 flex gap-1 items-center z-20">
            <div className={`w-2 h-2 rounded-full ${activeCamera[camera.id] ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
            <span className="text-[8px] font-mono text-white bg-black/50 px-1 rounded">
              {activeCamera[camera.id] ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}