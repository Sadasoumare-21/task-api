import { useEffect } from 'react'

interface Props { isOpen:boolean; onClose:()=>void; title:string; children:React.ReactNode }

export default function Modal({ isOpen, onClose, title, children }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:24,
    }}
      onClick={onClose}>
      {/* Backdrop */}
      <div style={{ position:'absolute', inset:0, background:'rgba(4,6,14,.85)', backdropFilter:'blur(12px)' }}/>

      {/* Panel */}
      <div className="fx-up" style={{ position:'relative', width:'100%', maxWidth:560 }}
        onClick={e => e.stopPropagation()}>
        <div className="panel" style={{ padding:'32px 36px', boxShadow:'0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:'var(--t1)', letterSpacing:'-.03em' }}>{title}</h2>
            <button className="btn-icon" onClick={onClose}
              style={{ width:34, height:34, borderRadius:10, background:'var(--s3)', border:'1px solid var(--l2)' }}>
              <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
