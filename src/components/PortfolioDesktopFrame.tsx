type PortfolioDesktopFrameProps = {
  title?: string
}

export default function PortfolioDesktopFrame({
  title = 'Abhishek Enaguthi portfolio OS',
}: PortfolioDesktopFrameProps) {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#14110D]">
      <iframe
        src="/claude-design/index.html#2a"
        title={title}
        className="h-full w-full border-0"
      />
    </main>
  )
}
