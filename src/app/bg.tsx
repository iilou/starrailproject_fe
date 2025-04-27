export default function BG() {
  return (
    <div
      className='absolute top-0 left-0 w-full h-full'
      style={{
        backgroundImage: `url("/image.png")`,
        // backgroundSize: `${width}px ${height}px`,

        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}></div>
  );
}
