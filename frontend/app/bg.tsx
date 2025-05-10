export default function BG() {
  return (
    <div
      className='fixed top-0 left-0 w-[100vw] h-[100vh] z-[-1]'
      style={{
        backgroundImage: `url("/image.png")`,
        // backgroundSize: `${width}px ${height}px`,

        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "brightness(1) saturate(0.4) contrast(1.2) blur(0.1px) glow(1px #ffffff)",
        transform: "rotate(180deg)",
      }}></div>
  );
}
