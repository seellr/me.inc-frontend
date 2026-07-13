export default async function BottomOverlay() {
    return (
        <div className="fixed h-15 lg:h-21 bottom-0 left-0 w-full flex flex-col z-[40] translate-z-0 mask-base mask-to-t translate-y-[11%] pointer-events-none">
            <div className="absolute inset-0"></div>
            <div className="absolute inset-0"></div>
            <div className="absolute inset-0"></div>
            <div className="absolute inset-0"></div>
        </div>
    )
}