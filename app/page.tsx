import ParallaxHero from './components/ParallaxHero'

// ─── Data fetching helpers ────────────────────────────────────────────────────

async function fetchGitHubStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.stargazers_count ?? null
  } catch {
    return null
  }
}

async function fetchPackagistDownloads(pkg: string): Promise<number | null> {
  try {
    const res = await fetch(`https://packagist.org/packages/${pkg}.json`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.package?.downloads?.total ?? null
  } catch {
    return null
  }
}

async function fetchVSCodeInstalls(extensionId: string): Promise<number | null> {
  try {
    const res = await fetch(
      'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;api-version=7.1-preview.1',
        },
        body: JSON.stringify({
          filters: [{ criteria: [{ filterType: 7, value: extensionId }] }],
          flags: 914,
        }),
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const ext = data.results?.[0]?.extensions?.[0]
    const stat = ext?.statistics?.find(
      (s: { statisticName: string; value: number }) => s.statisticName === 'install'
    )
    return stat?.value ?? null
  } catch {
    return null
  }
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmt(n: number | null): string {
  if (n === null || n === undefined) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  name: string
  description: string
  url: string
  githubUrl?: string
  stars: number | null
  downloads?: number | null
  downloadLabel?: string
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page() {
  const [
    forrestStars,
    forrestDownloads,
    presidentStars,
    fileLlamaStars,
    resumeGptStars,
    sawdustStars,
    discordBotStars,
    adminiteStars,
    sfdxStars,
    sfdxDownloads,
    starwarsStars,
  ] = await Promise.all([
    fetchGitHubStars('omniphx/forrest'),
    fetchPackagistDownloads('omniphx/forrest'),
    fetchGitHubStars('omniphx/PresidentDashboard'),
    fetchGitHubStars('omniphx/FileLlama'),
    fetchGitHubStars('omniphx/resume-gpt'),
    fetchGitHubStars('omniphx/sawdust'),
    fetchGitHubStars('omniphx/discord-ma-vaccine-bot'),
    fetchGitHubStars('omniphx/adminite'),
    fetchGitHubStars('omniphx/sfdx-autodeploy-watcher'),
    fetchVSCodeInstalls('omniphx.sfdx-auto-deployer'),
    fetchGitHubStars('omniphx/starwars'),
  ])

  const projects: Project[] = [
    {
      name: 'forrest',
      description: 'Opensource Salesforce REST API client for Laravel. Handles OAuth authentication, token refresh, and provides a clean interface to every Salesforce resource.',
      url: 'https://github.com/omniphx/forrest',
      stars: forrestStars,
      downloads: forrestDownloads,
      downloadLabel: 'packagist',
    },
    {
      name: 'sfdx-autodeploy-watcher',
      description: 'VS Code extension that automatically deploys Salesforce metadata changes using the sfdx CLI. Watches for file system changes and triggers deploys on save.',
      url: 'https://marketplace.visualstudio.com/items?itemName=omniphx.sfdx-auto-deployer',
      githubUrl: 'https://github.com/omniphx/sfdx-autodeploy-watcher',
      stars: sfdxStars,
      downloads: sfdxDownloads,
      downloadLabel: 'vscode',
    },
    {
      name: 'presidential-dashboard',
      description: 'Compare presidential terms across stock indexes, inflation-adjusted oil, the job market, and interest rates. A data visualization tool for political and economic analysis.',
      url: 'https://president-dashboard.vercel.app/',
      githubUrl: 'https://github.com/omniphx/PresidentDashboard',
      stars: presidentStars,
    },
    {
      name: 'filellama',
      description: 'Chat with your documents using AI. Upload PDFs, Word docs, and text files to ask questions and extract insights using natural language.',
      url: 'https://filellama.ai/',
      githubUrl: 'https://github.com/omniphx/FileLlama',
      stars: fileLlamaStars,
    },
    {
      name: 'resumegpt',
      description: 'Ask questions about my resume using a conversational AI interface. Built to demonstrate RAG patterns with OpenAI embeddings and vector search.',
      url: 'https://resume-gpt-cyan.vercel.app/',
      githubUrl: 'https://github.com/omniphx/resume-gpt',
      stars: resumeGptStars,
    },
    {
      name: 'sawdust',
      description: 'Browser-based CAD software I built to design my sauna. Features a 2D/3D cut-list optimizer and bill of materials generator for woodworking projects.',
      url: 'https://omniphx.github.io/sawdust/',
      githubUrl: 'https://github.com/omniphx/sawdust',
      stars: sawdustStars,
    },
    {
      name: 'adminite',
      description: 'Electron desktop app for Salesforce admins to execute SOQL/SOSL queries, perform bulk record operations, and manage permission sets.',
      url: 'https://github.com/omniphx/adminite',
      stars: adminiteStars,
    },
    {
      name: 'discord-vaccine-bot',
      description: 'Discord bot that monitored COVID-19 vaccine appointment availability for frontline workers in the Boston area. Helped hundreds of teachers find life-saving appointments.',
      url: 'https://github.com/omniphx/discord-ma-vaccine-bot',
      stars: discordBotStars,
    },
    {
      name: 'starwars',
      description: 'One of my first software projects — Star Wars rendered in ASCII art in the browser. A nostalgic tribute to the classic telnet animation.',
      url: 'https://omniphx.github.io/starwars/',
      githubUrl: 'https://github.com/omniphx/starwars',
      stars: starwarsStars,
    },
  ]

  const s: React.CSSProperties = {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '0 clamp(24px, 5vw, 80px)',
  }

  return (
    <main>
      <ParallaxHero />

      <div style={{ ...s, paddingTop: '80px', paddingBottom: '120px' }}>

        {/* ── About ─────────────────────────────────────── */}
        <section id="about" style={{ marginBottom: '100px' }}>
          <p className="section-label">about</p>
          <p style={{ maxWidth: '620px', lineHeight: 1.8, color: 'var(--fg)', fontSize: '17px' }}>
            Engineer and manager with over a decade building web and mobile products.
            I&apos;ve shipped consumer health apps, design systems used by 400+ teams, AI-powered tooling,
            and low-code data platforms. Currently leading engineering at Abbott,
            where I manage the team behind the Lingo CGM eCommerce platform.
          </p>
        </section>

        <hr className="divider" style={{ marginTop: '0', marginBottom: '80px' }} />

        {/* ── Career ────────────────────────────────────── */}
        <section id="career" style={{ marginBottom: '100px' }}>
          <p className="section-label">career</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {[
              {
                company: 'Abbott',
                role: 'Engineering Manager — Web Commerce & Health Platforms',
                period: 'Dec 2025 – Present',
                description: 'Manage the engineering team behind the Lingo eCommerce platform — a Next.js consumer storefront for our continuous glucose monitor hosted on Azure. Balancing hands-on technical strategy with people leadership across complex, fast-moving initiatives.',
                links: [{ label: 'hellolingo.com', href: 'https://www.hellolingo.com/' }],
              },
              {
                company: 'Abbott',
                role: 'Senior Frontend Engineer',
                period: 'Sep 2023 – Nov 2025',
                description: 'Tech Lead on the Lingo consumer CGM React Native app, driving technical direction across engineering, design, and product. Delivered a performant, consumer-grade health experience from zero to App Store launch.',
                links: [
                  { label: 'iOS App', href: 'https://apps.apple.com/us/app/lingo-by-abbott/id1670445335' },
                  { label: 'Android App', href: 'https://play.google.com/store/apps/details?id=com.abbott.lingo.wellness&hl=en_US' },
                ],
              },
              {
                company: 'Patterns',
                role: 'Senior Software Engineer',
                period: 'Jun 2022 – Jun 2023',
                description: 'Led frontend development of a low-code ETL and DAG builder for data scientists and engineers. Also developed Python/Django APIs and integrated AI capabilities including a GPT-powered chatbot and a Cohere-based Salesforce case classifier.',
                links: [] as { label: string; href: string }[],
              },
              {
                company: 'athenahealth',
                role: 'Lead Member of Technical Staff',
                period: 'Sep 2018 – Jun 2022',
                description: "Supported athenahealth's Design System — a React component library used by 400+ internal teams. Led the TypeScript migration, launched a new Gatsby site, and helped build a telehealth solution using AWS Chime during COVID-19 regulatory changes.",
                links: [] as { label: string; href: string }[],
              },
              {
                company: 'NeuraFlash',
                role: 'Senior Salesforce Developer',
                period: 'Jan 2018 – Sep 2018',
                description: 'Built AI/ML applications for the Salesforce platform using Apex, Lightning, Node.js, and Python. Developed AppExchange products leveraging AWS and Heroku microservices.',
                links: [] as { label: string; href: string }[],
              },
            ].map((job) => (
              <div key={job.role}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '17px' }}>{job.company}</span>
                    <span style={{ color: 'var(--muted)', marginLeft: '12px', fontSize: '15px' }}>{job.role}</span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>{job.period}</span>
                </div>
                <p style={{ color: 'var(--fg)', fontSize: '15px', lineHeight: 1.8, maxWidth: '640px', marginBottom: job.links.length ? '12px' : '0' }}>
                  {job.description}
                </p>
                {job.links.length > 0 && (
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {job.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '13px', color: 'var(--accent)', letterSpacing: '0.05em' }}
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" style={{ marginTop: '0', marginBottom: '80px' }} />

        {/* ── Projects ──────────────────────────────────── */}
        <section id="projects" style={{ marginBottom: '100px' }}>
          <p className="section-label">projects</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {projects.map((p, i) => (
              <div
                key={p.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '16px',
                  alignItems: 'start',
                  padding: '24px 0',
                  borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.03em' }}
                    >
                      [{p.name}]
                    </a>
                    {p.githubUrl && p.githubUrl !== p.url && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '12px' }}
                      >
                        github ↗
                      </a>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '540px' }}>
                    {p.description}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', paddingTop: '2px' }}>
                  {p.stars !== null && (
                    <span style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '16px' }}>★</span> {fmt(p.stars)}
                    </span>
                  )}
                  {p.downloads !== null && p.downloads !== undefined && (
                    <span style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      ↓ {fmt(p.downloads)} {p.downloadLabel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" style={{ marginTop: '0', marginBottom: '80px' }} />

        {/* ── Collaborations ────────────────────────────── */}
        <section id="collaborations" style={{ marginBottom: '100px' }}>
          <p className="section-label">collaborations</p>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <a
                href="https://shelf-app.net/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 700, fontSize: '16px' }}
              >
                [shelf]
              </a>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '540px' }}>
              App to share reviews of movies, books, TV shows, and games with friends and family.
              Contributed the &ldquo;Weekly Read&rdquo; — a collaborative short story feature with a Kindle-like reading UX
              that lets users discuss and annotate together.
            </p>
            <a
              href="https://shelf-app.net/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '13px', color: 'var(--accent)', display: 'inline-block', marginTop: '8px' }}
            >
              shelf-app.net ↗
            </a>
          </div>
        </section>

        <hr className="divider" style={{ marginTop: '0', marginBottom: '80px' }} />

        {/* ── Contact ───────────────────────────────────── */}
        <section id="contact">
          <p className="section-label">contact</p>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'github', href: 'https://github.com/omniphx' },
              { label: 'linkedin', href: 'https://www.linkedin.com/in/matthew-mitchener/' },
              { label: 'email', href: 'mailto:mattjmitchener@gmail.com' },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('mailto') ? undefined : '_blank'}
                rel={c.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="contact-link"
              >
                [{c.label}]
              </a>
            ))}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────── */}
        <footer style={{ marginTop: '80px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.05em' }}>
            <span style={{ fontSize: '12px' }}>matthew mitchener · {new Date().getFullYear()}</span>
          </p>
        </footer>

      </div>
    </main>
  )
}
