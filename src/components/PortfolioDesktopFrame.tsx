type PortfolioDesktopFrameProps = {
  title?: string
}

export default function PortfolioDesktopFrame({
  title = 'Abhishek Enaguthi portfolio OS',
}: PortfolioDesktopFrameProps) {
  const osSrc =
    process.env.NODE_ENV === 'production'
      ? '/index.html#2a'
      : '/claude-design/index.html#2a'

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#14110D]" style={{ height: '100dvh' }}>
      <iframe
        src={osSrc}
        title={title}
        className="h-full w-full border-0"
      />
    </main>
  )
}
