import './ToolPageShell.css'

export function ToolPageShell({ children, className = '' }) {
  return <div className={`tool-container tool-page-shell ${className}`.trim()}>{children}</div>
}

export function ToolPageHero({ eyebrow = null, title, subtitle = null, note = null, centered = true, className = '' }) {
  return (
    <section className={`tool-page-hero ${centered ? 'is-centered' : ''} ${className}`.trim()}>
      {eyebrow ? <div className="tool-page-hero__eyebrow">{eyebrow}</div> : null}
      <h1 className="tool-page-hero__title">{title}</h1>
      {subtitle ? <p className="tool-page-hero__subtitle">{subtitle}</p> : null}
      {note ? <p className="tool-page-hero__note">{note}</p> : null}
    </section>
  )
}

export function ToolPageLayout({ children, className = '' }) {
  return <div className={`tool-page-layout ${className}`.trim()}>{children}</div>
}

export function ToolPagePanel({ children, className = '', tone = 'default', as: Component = 'section', ...props }) {
  return <Component className={`tool-page-panel tool-page-panel--${tone} ${className}`.trim()} {...props}>{children}</Component>
}

export function ToolControls({ children, className = '', tone = 'default', as = 'section', ...props }) {
  return <ToolPagePanel className={`tool-page-controls ${className}`.trim()} tone={tone} as={as} {...props}>{children}</ToolPagePanel>
}

export function ToolResult({ children, className = '', tone = 'default', as = 'section', ...props }) {
  return <ToolPagePanel className={`tool-page-result ${className}`.trim()} tone={tone} as={as} {...props}>{children}</ToolPagePanel>
}

export function ToolHelp({ children, className = '' }) {
  return <section className={`tool-page-help ${className}`.trim()}>{children}</section>
}

export function ToolRelated({ children, className = '' }) {
  return <section className={`tool-page-related ${className}`.trim()}>{children}</section>
}

export function ToolSectionHeading({ title, subtitle = null, className = '' }) {
  return (
    <div className={`tool-section-heading ${className}`.trim()}>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

export default ToolPageShell
