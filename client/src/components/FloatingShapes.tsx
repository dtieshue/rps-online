export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{ position:'absolute', top:'-10%', left:'-5%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(circle,#7c3aed44 0%,transparent 70%)', animation:'float1 18s ease-in-out infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', top:'30%', right:'-10%', width:'45vw', height:'45vw', borderRadius:'50%', background:'radial-gradient(circle,#ec489944 0%,transparent 70%)', animation:'float2 22s ease-in-out infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'20%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,#06b6d444 0%,transparent 70%)', animation:'float3 26s ease-in-out infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', top:'60%', left:'5%', width:'30vw', height:'30vw', borderRadius:'50%', background:'radial-gradient(circle,#f59e0b33 0%,transparent 70%)', animation:'float1 30s ease-in-out infinite reverse', filter:'blur(50px)' }} />
      <div style={{ position:'absolute', top:'15%', right:'15%', width:'80px', height:'80px', border:'2px solid #7c3aed44', borderRadius:'12px', animation:'spin-slow 20s linear infinite', transform:'rotate(45deg)' }} />
      <div style={{ position:'absolute', bottom:'20%', right:'8%', width:'50px', height:'50px', border:'2px solid #ec489944', borderRadius:'50%', animation:'spin-slow 15s linear infinite reverse' }} />
      {[...Array(10)].map((_,i) => (
        <div key={i} style={{ position:'absolute', top:`${10+(i*8.3)%85}%`, left:`${5+(i*9.1)%90}%`, width:`${3+(i%3)*2}px`, height:`${3+(i%3)*2}px`, borderRadius:'50%', background:['#ff6bcb','#6bffb8','#6bb5ff','#ffdf70'][i%4], opacity:0.4+(i%4)*0.1, animation:`float${(i%3)+1} ${14+i*1.5}s ease-in-out infinite`, animationDelay:`${i*0.8}s` }} />
      ))}
    </div>
  );
}
