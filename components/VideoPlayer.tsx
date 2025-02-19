import type React from "react"

interface VideoPlayerProps {
  url: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden" style={{ maxHeight: "300px" }}>
      <iframe
        src={url}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  )
}

