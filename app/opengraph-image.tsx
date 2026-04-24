import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AI导航站'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #1e3a5f 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: 30,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 56, fontWeight: 'bold', color: 'white' }}>AI</span>
        </div>
        <h1
          style={{
            fontSize: 68,
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          AI导航站
        </h1>
        <p
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.8)',
            margin: '16px 0 0',
            textAlign: 'center',
            maxWidth: '70%',
            lineHeight: 1.4,
          }}
        >
          发现最佳AI工具与技能
        </p>
      </div>
    ),
    { ...size }
  )
}
