export default function PageShell({ title, children, content = true, heroId }) {
  return (
    <main className="page-main">
      <div className="page-hero">
        <h1 id={heroId}>{title}</h1>
      </div>
      {content ? <div className="content-page">{children}</div> : children}
    </main>
  );
}
