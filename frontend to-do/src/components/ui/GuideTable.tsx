import type { GuideTableProps } from '../../types'
/** GuideTable — composant reutilisable. Props: title, headers, data */
export default function GuideTable({ title, headers, data }: GuideTableProps) {
  return (
    <div className="my-4">
      {title && <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'var(--text-3)' }}>{title}</p>}
      <div className="overflow-x-auto rounded-xl" style={{ border:'1px solid var(--border2)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:'var(--bg-surface)' }}>
              {headers.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color:'var(--text-3)', borderBottom:'1px solid var(--border)' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} style={{ background: ri%2===0 ? 'var(--bg-card)' : 'var(--bg-surface)' }}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3" style={{ color:'var(--text-1)' }}>
                    {ci === 0 ? <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background:'var(--primary-dim)', color:'var(--primary)' }}>{cell}</code> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
