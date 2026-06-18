import { useNavigate } from 'react-router-dom'
import GuideTable from '../components/ui/GuideTable'
import Button from '../components/ui/Button'
import type { ReactNode } from 'react'

const TABLE1 = {
  title: 'Composants principaux de React Router DOM',
  headers: ['Composant','Role'],
  data: [
    ['BrowserRouter','Active le systeme de routage cote client'],
    ['Routes','Contient toutes les routes de l\'application'],
    ['Route','Definit une route et le composant a afficher'],
    ['Link','Permet de naviguer sans rechargement'],
    ['useNavigate','Permet de naviguer par code'],
  ],
}

const TABLE2 = {
  title: 'Hooks utiles de React Router DOM',
  headers: ['Hook','Role','Exemple'],
  data: [
    ['useNavigate','Naviguer par code','navigate("/dashboard")'],
    ['useParams','Lire les params URL','const { id } = useParams()'],
    ['useLocation','Acceder a la localisation','const loc = useLocation()'],
    ['useSearchParams','Query params','const [p] = useSearchParams()'],
  ],
}

function CodeBlock({ code }: { code:string }) {
  return (
    <pre className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--accent)] overflow-x-auto my-3 font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  )
}

function Section({ n, title, children }: { n:number; title:string; children:ReactNode }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="text-base font-bold text-[var(--text-1)] mb-3 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg btn-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Inline({ children }: { children:ReactNode }) {
  return <code className="text-[var(--primary)] font-mono text-xs bg-[var(--primary)]/10 px-1.5 py-0.5 rounded">{children}</code>
}

export default function GuidePage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen pt-16 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-5 animate-fadeUp">
        <div className="glass rounded-3xl p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
            <span className="text-xs font-medium text-[var(--primary)]">Documentation · v1.0</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-1)] mb-2">Petit guide : <span className="gradient-text">React Router DOM</span></h1>
          <p className="text-[var(--text-2)] max-w-lg mx-auto text-sm leading-relaxed">
            React Router DOM est une bibliotheque tres utilisee dans les applications React. Elle permet de gerer la navigation entre differentes pages sans recharger la page complete (navigation cote client).
          </p>
        </div>

        <Section n={1} title="Installation">
          <p className="text-sm text-[var(--text-2)] mb-2">Pour installer React Router DOM dans un projet React :</p>
          <CodeBlock code="npm install react-router-dom"/>
        </Section>

        <Section n={2} title="Importation principale">
          <p className="text-sm text-[var(--text-2)] mb-2">Les composants principaux sont <Inline>BrowserRouter</Inline>, <Inline>Routes</Inline> et <Inline>Route</Inline>.</p>
          <CodeBlock code={`import { BrowserRouter, Routes, Route } from "react-router-dom";`}/>
        </Section>

        <Section n={3} title="Exemple simple de routage">
          <CodeBlock code={`function App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}`}/>
        </Section>

        <Section n={4} title="Navigation avec Link">
          <p className="text-sm text-[var(--text-2)] mb-2">Le composant <Inline>Link</Inline> permet de naviguer sans recharger le navigateur.</p>
          <CodeBlock code={`import { Link } from "react-router-dom";\n\n<Link to="/">Accueil</Link>\n<Link to="/about">A propos</Link>`}/>
        </Section>

        <Section n={5} title="Composants importants">
          {/* GuideTable recoit title, headers, data via props */}
          <GuideTable title={TABLE1.title} headers={TABLE1.headers} data={TABLE1.data}/>
        </Section>

        <Section n={6} title="Hooks disponibles">
          <GuideTable title={TABLE2.title} headers={TABLE2.headers} data={TABLE2.data}/>
        </Section>

        <div className="glass rounded-2xl p-6 border-l-4" style={{ borderLeftColor:'var(--accent)' }}>
          <h3 className="text-sm font-bold text-[var(--text-1)] mb-2">Conclusion</h3>
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            React Router DOM est essentiel pour creer des applications React multi-pages avec une navigation rapide et fluide.
            Ce projet TaskFlow utilise <Inline>BrowserRouter</Inline>, <Inline>Routes</Inline>, <Inline>Route</Inline>, <Inline>Link</Inline>, <Inline>NavLink</Inline> et <Inline>useNavigate</Inline>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center py-4">
          <Button onClick={() => navigate('/dashboard')}>→ Aller au Dashboard</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>← Retour accueil</Button>
        </div>
      </div>
    </div>
  )
}
