import type { StatCardProps } from '../../types'

/** StatCard — props: value, label, icon, color */
export default function StatCard({ value, label, icon, color }: StatCardProps) {
  return (
    <div className="panel-md" style={{ padding:'28px 28px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{
          width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
          background:`${color}14`, border:`1px solid ${color}28`, fontSize:22,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize:38, fontWeight:900, color, letterSpacing:'-2px', lineHeight:1, marginBottom:8 }}>{value}</div>
      <div style={{ fontSize:13.5, color:'var(--t2)', fontWeight:500, letterSpacing:'-.01em' }}>{label}</div>
    </div>
  )
}
