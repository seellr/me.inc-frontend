export default async function BottomOverlay() {
  return (
    <div
      className="pointer-events-none fixed bottom-0 left-0 z-[40] h-20 w-full translate-y-[11%] lg:h-28"
      style={{
        maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
      }}
    >
      <div className="absolute inset-0 backdrop-blur-md" />
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>
  )
}