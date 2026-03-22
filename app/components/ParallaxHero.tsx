'use client'

import { useEffect, useRef } from 'react'

export default function ParallaxHero() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      const scrollY = window.scrollY
      contentRef.current.style.transform = `translateY(${scrollY * 0.38}px)`
      contentRef.current.style.opacity = String(Math.max(0, 1 - scrollY / 600))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      padding: '0 clamp(24px, 5vw, 80px)',
    }}>
      {/* Subtle background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        pointerEvents: 'none',
      }} />

      <div ref={contentRef} style={{ maxWidth: '860px', width: '100%', margin: '0 auto', position: 'relative' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--muted)', marginBottom: '32px' }}>
          <span style={{ color: 'var(--accent)' }}>// </span>portfolio
        </p>
        <h1 style={{
          fontSize: 'clamp(48px, 10vw, 112px)',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          marginBottom: '32px',
        }}>
          MATTHEW<br />
          <span style={{ color: 'var(--accent)', fontSize: 'clamp(24px, 5vw, 56px)', fontWeight: 400, letterSpacing: '0.05em' }}>&ldquo;MARTY&rdquo;</span><br />
          MITCHENER
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px', letterSpacing: '0.08em', marginBottom: '8px' }}>
          engineering manager · software architect · builder
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '12px', letterSpacing: '0.05em' }}>
          alameda, california<span className="cursor" style={{ marginLeft: '4px' }}>█</span>
        </p>
      </div>
    </section>
  )
}
