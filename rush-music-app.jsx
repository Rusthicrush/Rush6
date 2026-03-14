
import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME DEFINITIONS ───────────────────────────────────────────────────────
const THEMES = {
  galaxy: {
    name: "Galaxy Blue",
    bg: "linear-gradient(135deg, #020818 0%, #0a0f2e 40%, #0d1b4b 70%, #060d24 100%)",
    card: "rgba(10,20,60,0.55)",
    accent: "#00d4ff",
    accent2: "#7c3aed",
    glow: "0 0 30px rgba(0,212,255,0.35)",
    text: "#e8f4ff",
    sub: "#7eb8d4",
    border: "rgba(0,212,255,0.2)",
    nav: "rgba(4,12,40,0.92)",
    player: "rgba(6,14,44,0.9)",
    tag: "#00d4ff",
  },
  midnight: {
    name: "Midnight Black",
    bg: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)",
    card: "rgba(20,20,20,0.7)",
    accent: "#ff6b35",
    accent2: "#ff2d55",
    glow: "0 0 30px rgba(255,107,53,0.4)",
    text: "#f0f0f0",
    sub: "#888",
    border: "rgba(255,107,53,0.25)",
    nav: "rgba(8,8,8,0.95)",
    player: "rgba(15,15,15,0.92)",
    tag: "#ff6b35",
  },
  neon: {
    name: "Neon Purple",
    bg: "linear-gradient(135deg, #0d0020 0%, #1a0035 50%, #2d0055 100%)",
    card: "rgba(40,0,80,0.55)",
    accent: "#bf00ff",
    accent2: "#ff00aa",
    glow: "0 0 30px rgba(191,0,255,0.45)",
    text: "#f5e6ff",
    sub: "#b97fd4",
    border: "rgba(191,0,255,0.3)",
    nav: "rgba(10,0,25,0.95)",
    player: "rgba(20,0,40,0.92)",
    tag: "#bf00ff",
  },
  ocean: {
    name: "Ocean Cyan",
    bg: "linear-gradient(135deg, #001a1a 0%, #002d2d 50%, #004444 100%)",
    card: "rgba(0,50,50,0.55)",
    accent: "#00ffe0",
    accent2: "#00b4d8",
    glow: "0 0 30px rgba(0,255,224,0.35)",
    text: "#e0fff8",
    sub: "#70c8c0",
    border: "rgba(0,255,224,0.25)",
    nav: "rgba(0,12,12,0.95)",
    player: "rgba(0,18,18,0.92)",
    tag: "#00ffe0",
  },
  sunset: {
    name: "Sunset Glow",
    bg: "linear-gradient(135deg, #1a0000 0%, #2d0800 40%, #4d1000 70%, #1a0500 100%)",
    card: "rgba(60,15,0,0.55)",
    accent: "#ff8c00",
    accent2: "#ff4500",
    glow: "0 0 30px rgba(255,140,0,0.4)",
    text: "#fff0e0",
    sub: "#d4956a",
    border: "rgba(255,140,0,0.25)",
    nav: "rgba(15,4,0,0.95)",
    player: "rgba(20,5,0,0.92)",
    tag: "#ff8c00",
  },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const SONGS = [
  { id: 1, title: "Cosmic Drift", artist: "Nova Pulse", album: "Stellar", duration: 214, plays: 4820, fav: true, color: "#00d4ff", art: "🌌" },
  { id: 2, title: "Midnight Protocol", artist: "Echo Void", album: "Dark Matter", duration: 198, plays: 3210, fav: false, color: "#7c3aed", art: "🌙" },
  { id: 3, title: "Neon Ascent", artist: "Prism Drive", album: "Synthwave", duration: 232, plays: 5670, fav: true, color: "#bf00ff", art: "⚡" },
  { id: 4, title: "Aurora Signal", artist: "Drift Code", album: "Northern", duration: 187, plays: 2980, fav: false, color: "#00ffe0", art: "🔥" },
  { id: 5, title: "Gravity Well", artist: "Nova Pulse", album: "Stellar", duration: 256, plays: 7120, fav: true, color: "#ff6b35", art: "🪐" },
  { id: 6, title: "Void Walker", artist: "Black Sun", album: "Eclipse", duration: 203, plays: 1840, fav: false, color: "#ff2d55", art: "✨" },
  { id: 7, title: "Photon Rush", artist: "Prism Drive", album: "Synthwave", duration: 178, plays: 6340, fav: true, color: "#00d4ff", art: "💫" },
  { id: 8, title: "Stellar Core", artist: "Echo Void", album: "Dark Matter", duration: 241, plays: 3890, fav: false, color: "#ffd700", art: "⭐" },
  { id: 9, title: "Quantum Leap", artist: "Drift Code", album: "Northern", duration: 195, plays: 4560, fav: true, color: "#00ff88", art: "🎵" },
  { id: 10, title: "Dark Nebula", artist: "Black Sun", album: "Eclipse", duration: 268, plays: 2130, fav: false, color: "#9b59b6", art: "🌠" },
  { id: 11, title: "Light Chaser", artist: "Nova Pulse", album: "Horizon", duration: 221, plays: 5890, fav: true, color: "#3498db", art: "🌟" },
  { id: 12, title: "Binary Storm", artist: "Echo Void", album: "Dark Matter", duration: 189, plays: 3400, fav: false, color: "#e74c3c", art: "⚡" },
];

const PLAYLISTS = [
  { id: 1, name: "Morning Rush", songs: [1, 3, 7, 9], color: "#00d4ff", icon: "☀️" },
  { id: 2, name: "Night Drive", songs: [2, 4, 6, 10], color: "#7c3aed", icon: "🌙" },
  { id: 3, name: "Focus Mode", songs: [5, 8, 11, 12], color: "#00ffe0", icon: "🎯" },
  { id: 4, name: "Party Hits", songs: [1, 3, 5, 7, 9, 11], color: "#ff6b35", icon: "🎉" },
];

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// ─── GALAXY PARTICLES BACKGROUND ─────────────────────────────────────────────
const GalaxyBg = ({ theme }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      drift: (Math.random() - 0.5) * 0.12,
    }));
    const nebulas = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 180 + 80,
      a: Math.random() * 0.06 + 0.02,
    }));
    let t = 0;
    const accent = theme.accent;
    const accent2 = theme.accent2;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nebulas.forEach((n) => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, accent.replace(")", `,${n.a})`).replace("rgb", "rgba").replace("#", "rgba(").replace(/rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\)/, (_, r, g2, b) => `rgba(${parseInt(r, 16)},${parseInt(g2, 16)},${parseInt(b, 16)},${n.a})`));
        g.addColorStop(1, "transparent");
        const g2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g2.addColorStop(0, hexToRgba(accent, n.a));
        g2.addColorStop(0.5, hexToRgba(accent2, n.a * 0.5));
        g2.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = g2;
        ctx.fill();
      });
      stars.forEach((s) => {
        s.a += s.speed * Math.sin(t * 0.02);
        s.x += s.drift * 0.1;
        if (s.x > W) s.x = 0; if (s.x < 0) s.x = W;
        const alpha = Math.abs(Math.sin(t * s.speed + s.a)) * 0.9 + 0.1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(accent, alpha);
        ctx.fill();
      });
      t++;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [theme]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: "none" }} />;
};

const hexToRgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

// ─── CSS IN JS ────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const id = "rush-styles";
  if (document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:wght@300;400;500;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
    html,body,#root { height:100%; overflow:hidden; }
    .rush-app { font-family:'Exo 2',sans-serif; height:100vh; overflow:hidden; position:relative; }
    .rush-font { font-family:'Orbitron',monospace; }
    .screen { position:absolute; inset:0; overflow:hidden; transition:opacity 0.4s ease; }
    .scroll-area { overflow-y:auto; overflow-x:hidden; height:100%; scrollbar-width:none; }
    .scroll-area::-webkit-scrollbar { display:none; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes scaleIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
    @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes rushPulse { 0%,100%{text-shadow:0 0 30px currentColor,0 0 60px currentColor} 50%{text-shadow:0 0 50px currentColor,0 0 100px currentColor,0 0 150px currentColor} }
    .fade-in { animation:fadeIn 0.5s ease forwards; }
    .scale-in { animation:scaleIn 0.4s ease forwards; }
    .float-anim { animation:float 3s ease-in-out infinite; }
    .glow-anim { animation:glow 2s ease-in-out infinite; }
    .rush-text { animation:rushPulse 2.5s ease-in-out infinite; }
    .glass { backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); }
    .btn-press:active { transform:scale(0.93) !important; }
    input[type=range] { -webkit-appearance:none; appearance:none; height:3px; border-radius:4px; outline:none; cursor:pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; cursor:pointer; }
    .marquee-wrap { overflow:hidden; white-space:nowrap; }
    .marquee { display:inline-block; animation:marquee 8s linear infinite; }
    @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .album-spin { animation:spin 8s linear infinite; animation-play-state:paused; }
    .album-spin.playing { animation-play-state:running; }
  `;
  document.head.appendChild(el);
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function RushMusicApp() {
  useEffect(() => injectStyles(), []);

  const [screen, setScreen] = useState("splash");
  const [themeKey, setThemeKey] = useState("galaxy");
  const theme = THEMES[themeKey];

  const [songs, setSongs] = useState(SONGS);
  const [playlists, setPlaylists] = useState(PLAYLISTS);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(80);
  const [navTab, setNavTab] = useState("home");
  const [libTab, setLibTab] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [onboardPage, setOnboardPage] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState([0, 2, 6, 4, 8]);
  const progressRef = useRef(null);

  // Progress ticker
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + 1;
        if (next >= songs[current].duration) { setPlaying(false); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, current, songs]);

  const playSong = (idx) => {
    setCurrent(idx);
    setProgress(0);
    setPlaying(true);
    setRecentlyPlayed((r) => [idx, ...r.filter((x) => x !== idx)].slice(0, 8));
    if (screen !== "player") setScreen("player");
  };

  const toggleFav = (id) => setSongs((s) => s.map((x) => x.id === id ? { ...x, fav: !x.fav } : x));

  const nextSong = () => {
    const next = shuffle ? Math.floor(Math.random() * songs.length) : (current + 1) % songs.length;
    setCurrent(next); setProgress(0); setPlaying(true);
  };
  const prevSong = () => {
    const prev = (current - 1 + songs.length) % songs.length;
    setCurrent(prev); setProgress(0); setPlaying(true);
  };

  const song = songs[current];

  const navTo = (tab) => { setNavTab(tab); setScreen("main"); };

  // Splash timer
  useEffect(() => {
    if (screen === "splash") setTimeout(() => setScreen("onboard"), 3200);
  }, []);

  const appStyle = { background: theme.bg, color: theme.text, width: "100%", height: "100vh", overflow: "hidden", position: "relative" };

  return (
    <div className="rush-app" style={appStyle}>
      <GalaxyBg theme={theme} />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        {screen === "splash" && <SplashScreen theme={theme} />}
        {screen === "onboard" && <OnboardScreen theme={theme} page={onboardPage} setPage={setOnboardPage} onDone={() => setScreen("login")} />}
        {screen === "login" && <LoginScreen theme={theme} onLogin={() => { setScreen("main"); setNavTab("home"); }} />}
        {screen === "player" && (
          <PlayerScreen theme={theme} song={song} songs={songs} playing={playing} setPlaying={setPlaying}
            progress={progress} setProgress={setProgress} shuffle={shuffle} setShuffle={setShuffle}
            repeat={repeat} setRepeat={setRepeat} volume={volume} setVolume={setVolume}
            nextSong={nextSong} prevSong={prevSong} toggleFav={toggleFav}
            onBack={() => setScreen("main")} />
        )}
        {screen === "main" && (
          <MainLayout theme={theme} navTab={navTab} setNavTab={navTo} song={song} playing={playing}
            setPlaying={setPlaying} onOpenPlayer={() => setScreen("player")}
            songs={songs} setSongs={setSongs} playlists={playlists} setPlaylists={setPlaylists}
            playSong={playSong} toggleFav={toggleFav} recentlyPlayed={recentlyPlayed}
            themeKey={themeKey} setThemeKey={setThemeKey} search={search} setSearch={setSearch}
            libTab={libTab} setLibTab={setLibTab} modal={modal} setModal={setModal} />
        )}
        {modal && <Modal modal={modal} setModal={setModal} theme={theme} songs={songs} playlists={playlists} setPlaylists={setPlaylists} />}
      </div>
    </div>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ theme }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24 }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        border: `1px solid ${theme.accent}30`,
        boxShadow: `0 0 80px ${theme.accent}20, inset 0 0 80px ${theme.accent}10`,
        animation: "pulse 2s ease-in-out infinite",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.8s"
      }} />
      <div style={{
        position: "absolute", width: 200, height: 200, borderRadius: "50%",
        border: `1px solid ${theme.accent2}40`,
        animation: "spin 8s linear infinite",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.8s"
      }} />

      {/* Logo */}
      <div style={{
        opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "scale(1)" : "scale(0.5)",
        transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        textAlign: "center", position: "relative"
      }}>
        <div className="rush-font" style={{
          fontSize: 88, fontWeight: 900, letterSpacing: 16,
          color: theme.accent,
          textShadow: `0 0 40px ${theme.accent}, 0 0 80px ${theme.accent}80`,
          lineHeight: 1,
        }} className="rush-font rush-text">RUSH</div>
        <div style={{
          fontSize: 11, letterSpacing: 8, color: theme.sub, marginTop: 8, textTransform: "uppercase", fontWeight: 600
        }}>MUSIC PLAYER</div>
      </div>

      {/* Dev name */}
      <div style={{
        opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.8s",
        fontSize: 12, color: theme.sub, letterSpacing: 4, textTransform: "uppercase",
        position: "absolute", bottom: 60
      }}>
        by <span style={{ color: theme.accent, fontWeight: 700 }}>Rush</span>
      </div>

      {/* Loading bar */}
      <div style={{
        position: "absolute", bottom: 40, width: 160, height: 2,
        background: `${theme.accent}20`, borderRadius: 2, overflow: "hidden",
        opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.5s"
      }}>
        <div style={{
          height: "100%", background: `linear-gradient(90deg, ${theme.accent2}, ${theme.accent})`,
          borderRadius: 2, width: phase >= 3 ? "100%" : "40%",
          transition: "width 1s ease", boxShadow: `0 0 8px ${theme.accent}`
        }} />
      </div>
    </div>
  );
}

// ─── ONBOARD SCREEN ───────────────────────────────────────────────────────────
const ONBOARD_DATA = [
  { icon: "🎵", title: "Immersive Sound", desc: "Experience music like never before with our cutting-edge audio engine and galaxy-inspired visuals.", color: "#00d4ff" },
  { icon: "📱", title: "Offline Ready", desc: "Take your music anywhere. All your favorites, playlists, and albums available without internet.", color: "#7c3aed" },
  { icon: "🎨", title: "Premium Themes", desc: "Personalize your experience with stunning galaxy themes. Make Rush yours.", color: "#bf00ff" },
];

function OnboardScreen({ theme, page, setPage, onDone }) {
  const d = ONBOARD_DATA[page];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 28px 48px" }}>
      {/* Skip */}
      <div style={{ alignSelf: "flex-end", color: theme.sub, fontSize: 13, cursor: "pointer" }} onClick={onDone}>Skip</div>

      {/* Visual */}
      <div key={page} className="scale-in" style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <div style={{
          width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${d.color}40, ${d.color}10)`,
          border: `1px solid ${d.color}50`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 64, boxShadow: `0 0 60px ${d.color}40`,
          animation: "float 3s ease-in-out infinite"
        }}>{d.icon}</div>
        <div>
          <div className="rush-font" style={{ fontSize: 26, fontWeight: 800, color: theme.text, marginBottom: 14, letterSpacing: 2 }}>{d.title}</div>
          <div style={{ color: theme.sub, fontSize: 15, lineHeight: 1.7, maxWidth: 280 }}>{d.desc}</div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {ONBOARD_DATA.map((_, i) => (
          <div key={i} onClick={() => setPage(i)} style={{
            width: i === page ? 24 : 8, height: 8, borderRadius: 4,
            background: i === page ? theme.accent : `${theme.accent}40`,
            transition: "all 0.3s ease", cursor: "pointer"
          }} />
        ))}
      </div>

      {/* Button */}
      {page < 2 ? (
        <button className="btn-press" onClick={() => setPage(page + 1)} style={{
          width: "100%", padding: "16px 0", borderRadius: 16, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`,
          color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Exo 2', sans-serif",
          boxShadow: `0 4px 24px ${theme.accent}50`, letterSpacing: 1
        }}>Continue</button>
      ) : (
        <button className="btn-press" onClick={onDone} style={{
          width: "100%", padding: "16px 0", borderRadius: 16, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`,
          color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Exo 2', sans-serif",
          boxShadow: `0 4px 24px ${theme.accent}50`, letterSpacing: 1
        }}>Get Started 🚀</button>
      )}
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ theme, onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const inputStyle = {
    width: "100%", padding: "15px 18px", borderRadius: 14, border: `1px solid ${theme.border}`,
    background: theme.card, color: theme.text, fontSize: 15, fontFamily: "'Exo 2', sans-serif",
    outline: "none", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)"
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", gap: 24 }}>
      <div className="fade-in" style={{ textAlign: "center", marginBottom: 12 }}>
        <div className="rush-font rush-text" style={{ fontSize: 52, fontWeight: 900, letterSpacing: 10, color: theme.accent, textShadow: `0 0 30px ${theme.accent}` }}>RUSH</div>
        <div style={{ color: theme.sub, fontSize: 13, letterSpacing: 3 }}>WELCOME BACK</div>
      </div>

      <div className="fade-in glass" style={{ width: "100%", background: theme.card, borderRadius: 24, padding: 24, border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: 14, boxShadow: theme.glow }}>
        <input style={inputStyle} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <input style={inputStyle} placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} type="password" />
        <button className="btn-press" onClick={onLogin} style={{
          padding: "15px 0", borderRadius: 14, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`,
          color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Exo 2', sans-serif",
          boxShadow: `0 4px 20px ${theme.accent}40`, marginTop: 4
        }}>Sign In</button>
        <div style={{ textAlign: "center", color: theme.sub, fontSize: 13 }}>Forgot password?</div>
      </div>

      <div style={{ color: theme.sub, fontSize: 13 }}>— or —</div>

      <button className="btn-press" onClick={onLogin} style={{
        width: "100%", padding: "15px 0", borderRadius: 14, border: `1px solid ${theme.border}`,
        background: theme.card, color: theme.text, fontSize: 15, fontFamily: "'Exo 2', sans-serif",
        cursor: "pointer", backdropFilter: "blur(20px)", letterSpacing: 1
      }}>Continue as Guest</button>
    </div>
  );
}

// ─── MAIN LAYOUT ──────────────────────────────────────────────────────────────
function MainLayout({ theme, navTab, setNavTab, song, playing, setPlaying, onOpenPlayer, songs, setSongs, playlists, setPlaylists, playSong, toggleFav, recentlyPlayed, themeKey, setThemeKey, search, setSearch, libTab, setLibTab, modal, setModal }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", paddingBottom: playing ? 128 : 68 }}>
        {navTab === "home" && <HomeTab theme={theme} songs={songs} playSong={playSong} toggleFav={toggleFav} recentlyPlayed={recentlyPlayed} playlists={playlists} search={search} setSearch={setSearch} setNavTab={setNavTab} />}
        {navTab === "library" && <LibraryTab theme={theme} songs={songs} playSong={playSong} toggleFav={toggleFav} libTab={libTab} setLibTab={setLibTab} playlists={playlists} setModal={setModal} search={search} setSearch={setSearch} />}
        {navTab === "playlists" && <PlaylistsTab theme={theme} playlists={playlists} setPlaylists={setPlaylists} songs={songs} playSong={playSong} setModal={setModal} />}
        {navTab === "themes" && <ThemesTab theme={theme} themeKey={themeKey} setThemeKey={setThemeKey} />}
        {navTab === "settings" && <SettingsTab theme={theme} themeKey={themeKey} setThemeKey={setThemeKey} />}
      </div>

      {/* Mini Player */}
      {playing && (
        <div className="glass" onClick={onOpenPlayer} style={{
          position: "fixed", bottom: 64, left: 12, right: 12, borderRadius: 20,
          background: theme.player, border: `1px solid ${theme.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 14,
          boxShadow: theme.glow, cursor: "pointer", zIndex: 50, animation: "slideUp 0.3s ease"
        }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg, ${song.color}80, ${song.color}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1px solid ${song.color}40` }}>{song.art}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
            <div style={{ fontSize: 12, color: theme.sub }}>{song.artist}</div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn-press" onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }} style={{ background: "none", border: "none", color: theme.accent, fontSize: 22, cursor: "pointer" }}>
              {playing ? "⏸" : "▶️"}
            </button>
          </div>
          {/* Progress bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `${theme.accent}20`, borderRadius: "0 0 20px 20px" }}>
            <div style={{ height: "100%", background: theme.accent, borderRadius: "0 0 20px 20px", width: `${(song ? (0 / song.duration) * 100 : 0)}%`, transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="glass" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 64,
        background: theme.nav, borderTop: `1px solid ${theme.border}`,
        display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 100,
        paddingBottom: 4
      }}>
        {[
          { tab: "home", icon: "⊞", label: "Home" },
          { tab: "library", icon: "♫", label: "Library" },
          { tab: "playlists", icon: "≡", label: "Playlists" },
          { tab: "themes", icon: "◈", label: "Themes" },
          { tab: "settings", icon: "⚙", label: "Settings" },
        ].map(({ tab, icon, label }) => (
          <button key={tab} className="btn-press" onClick={() => setNavTab(tab)} style={{
            background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, padding: "6px 12px", borderRadius: 12,
            color: navTab === tab ? theme.accent : theme.sub,
            transition: "all 0.2s"
          }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 10, fontWeight: navTab === tab ? 700 : 400, letterSpacing: 0.5 }}>{label}</div>
            {navTab === tab && <div style={{ width: 4, height: 4, borderRadius: "50%", background: theme.accent, position: "absolute", bottom: 6, boxShadow: `0 0 6px ${theme.accent}` }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab({ theme, songs, playSong, toggleFav, recentlyPlayed, playlists, search, setSearch, setNavTab }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const trending = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 6);
  const favs = songs.filter((s) => s.fav);

  return (
    <div className="scroll-area" style={{ height: "100%" }}>
      <div style={{ padding: "52px 0 20px" }}>

        {/* HERO */}
        <div style={{ padding: "0 22px 24px", textAlign: "center" }}>
          <div className="rush-font rush-text" style={{ fontSize: 72, fontWeight: 900, letterSpacing: 12, color: theme.accent, textShadow: `0 0 40px ${theme.accent}, 0 0 80px ${theme.accent}50`, lineHeight: 1 }}>RUSH</div>
          <div style={{ fontSize: 13, color: theme.sub, letterSpacing: 3, marginTop: 6 }}>{greeting} ✦</div>
        </div>

        {/* Search */}
        <div style={{ padding: "0 22px 24px" }}>
          <div className="glass" style={{ display: "flex", alignItems: "center", gap: 12, background: theme.card, borderRadius: 16, padding: "12px 18px", border: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.sub, fontSize: 16 }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search songs, artists..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: theme.text, fontSize: 15, fontFamily: "'Exo 2', sans-serif" }} />
          </div>
        </div>

        {/* Recently Played */}
        <Section title="Recently Played" theme={theme}>
          <div style={{ display: "flex", gap: 14, paddingBottom: 4, overflowX: "auto", scrollbarWidth: "none" }}>
            {recentlyPlayed.map((idx) => {
              const s = songs[idx];
              return (
                <div key={s.id} className="btn-press" onClick={() => playSong(idx)} style={{ flexShrink: 0, width: 110, cursor: "pointer" }}>
                  <div className="glass" style={{ width: 110, height: 110, borderRadius: 18, background: `linear-gradient(135deg, ${s.color}50, ${s.color}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, border: `1px solid ${s.color}40`, boxShadow: `0 4px 20px ${s.color}30`, marginBottom: 8 }}>{s.art}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: theme.sub, textAlign: "center", marginTop: 2 }}>{s.artist}</div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Trending */}
        <Section title="🔥 Trending" theme={theme}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {trending.map((s, i) => <SongRow key={s.id} song={s} idx={i} theme={theme} songs={songs} playSong={playSong} toggleFav={toggleFav} rank={i + 1} />)}
          </div>
        </Section>

        {/* Playlists */}
        <Section title="Your Playlists" theme={theme} action="See All" onAction={() => setNavTab("playlists")}>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
            {playlists.map((p) => (
              <div key={p.id} className="btn-press glass" style={{
                flexShrink: 0, width: 140, borderRadius: 20, padding: 16, cursor: "pointer",
                background: theme.card, border: `1px solid ${p.color}40`,
                boxShadow: `0 4px 20px ${p.color}20`
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: theme.sub }}>{p.songs.length} songs</div>
                <div style={{ width: "100%", height: 2, background: `linear-gradient(90deg, ${p.color}, transparent)`, borderRadius: 1, marginTop: 10 }} />
              </div>
            ))}
          </div>
        </Section>

        {/* Favorites */}
        {favs.length > 0 && (
          <Section title="❤️ Favorites" theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {favs.map((s, i) => <SongRow key={s.id} song={s} idx={songs.indexOf(s)} theme={theme} songs={songs} playSong={playSong} toggleFav={toggleFav} />)}
            </div>
          </Section>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ title, theme, children, action, onAction }) {
  return (
    <div style={{ padding: "0 22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, letterSpacing: 0.5 }}>{title}</div>
        {action && <div onClick={onAction} style={{ fontSize: 12, color: theme.accent, cursor: "pointer" }}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── SONG ROW ─────────────────────────────────────────────────────────────────
function SongRow({ song, idx, theme, songs, playSong, toggleFav, rank }) {
  return (
    <div className="btn-press glass" onClick={() => playSong(idx)} style={{
      display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
      borderRadius: 16, background: theme.card, border: `1px solid ${theme.border}`,
      cursor: "pointer", transition: "all 0.2s"
    }}>
      {rank && <div className="rush-font" style={{ width: 20, textAlign: "center", fontSize: 12, color: theme.sub, fontWeight: 700 }}>{rank}</div>}
      <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg, ${song.color}60, ${song.color}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${song.color}40`, flexShrink: 0 }}>{song.art}</div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
        <div style={{ fontSize: 12, color: theme.sub, marginTop: 2 }}>{song.artist} · {fmt(song.duration)}</div>
      </div>
      <button className="btn-press" onClick={(e) => { e.stopPropagation(); toggleFav(song.id); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: song.fav ? "#ff2d55" : theme.sub }}>
        {song.fav ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

// ─── PLAYER SCREEN ────────────────────────────────────────────────────────────
function PlayerScreen({ theme, song, songs, playing, setPlaying, progress, setProgress, shuffle, setShuffle, repeat, setRepeat, volume, setVolume, nextSong, prevSong, toggleFav, onBack }) {
  const [speed, setSpeed] = useState(1);
  const pct = (progress / song.duration) * 100;

  return (
    <div className="scroll-area" style={{ height: "100%" }}>
      <div style={{ padding: "52px 24px 32px", display: "flex", flexDirection: "column", gap: 28, minHeight: "100%" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className="btn-press" onClick={onBack} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, width: 40, height: 40, cursor: "pointer", color: theme.text, fontSize: 18 }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div className="rush-font" style={{ fontSize: 11, letterSpacing: 4, color: theme.accent }}>NOW PLAYING</div>
          </div>
          <button className="btn-press" onClick={() => toggleFav(song.id)} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, width: 40, height: 40, cursor: "pointer", fontSize: 18 }}>
            {song.fav ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Album Art */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: -20, borderRadius: "50%",
              background: `radial-gradient(circle, ${song.color}30, transparent 70%)`,
              animation: "pulse 2s ease-in-out infinite"
            }} />
            <div className={`album-spin ${playing ? "playing" : ""}`} style={{
              width: 220, height: 220, borderRadius: "50%",
              background: `linear-gradient(135deg, ${song.color}70, ${song.color}20)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 80, border: `3px solid ${song.color}50`,
              boxShadow: `0 0 60px ${song.color}40, 0 20px 60px rgba(0,0,0,0.5)`,
              position: "relative"
            }}>
              {song.art}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent)" }} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 6 }}>{song.title}</div>
          <div style={{ fontSize: 14, color: theme.sub }}>{song.artist} · {song.album}</div>
        </div>

        {/* Progress */}
        <div className="glass" style={{ borderRadius: 20, padding: "20px 22px", background: theme.player, border: `1px solid ${theme.border}` }}>
          <input type="range" min={0} max={song.duration} value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ width: "100%", accentColor: theme.accent, marginBottom: 8 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: theme.sub }}>
            <span>{fmt(progress)}</span><span>{fmt(song.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="glass" style={{ borderRadius: 24, padding: "22px 20px", background: theme.player, border: `1px solid ${theme.border}` }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: 20 }}>
            <button className="btn-press" onClick={() => setShuffle(!shuffle)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: shuffle ? theme.accent : theme.sub, filter: shuffle ? `drop-shadow(0 0 8px ${theme.accent})` : "none" }}>⇄</button>
            <button className="btn-press" onClick={prevSong} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 30, color: theme.text }}>⏮</button>
            <button className="btn-press" onClick={() => setPlaying(!playing)} style={{
              width: 68, height: 68, borderRadius: "50%", border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`,
              color: "#fff", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 30px ${theme.accent}60, 0 8px 24px rgba(0,0,0,0.4)`
            }}>{playing ? "⏸" : "▶"}</button>
            <button className="btn-press" onClick={nextSong} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 30, color: theme.text }}>⏭</button>
            <button className="btn-press" onClick={() => setRepeat(!repeat)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: repeat ? theme.accent : theme.sub, filter: repeat ? `drop-shadow(0 0 8px ${theme.accent})` : "none" }}>↺</button>
          </div>

          {/* Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 16 }}>🔈</span>
            <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))}
              style={{ flex: 1, accentColor: theme.accent }} />
            <span style={{ fontSize: 16 }}>🔊</span>
          </div>

          {/* Speed */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
              <button key={s} className="btn-press" onClick={() => setSpeed(s)} style={{
                padding: "4px 10px", borderRadius: 8, border: `1px solid ${s === speed ? theme.accent : theme.border}`,
                background: s === speed ? `${theme.accent}20` : "transparent", color: s === speed ? theme.accent : theme.sub,
                fontSize: 11, cursor: "pointer", fontFamily: "'Exo 2', sans-serif"
              }}>{s}x</button>
            ))}
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── LIBRARY TAB ─────────────────────────────────────────────────────────────
function LibraryTab({ theme, songs, playSong, toggleFav, libTab, setLibTab, playlists, setModal, search, setSearch }) {
  const TABS = ["all", "albums", "artists", "playlists", "favorites", "recent"];
  const filtered = songs.filter((s) => {
    if (libTab === "favorites") return s.fav;
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q);
  });
  const artists = [...new Set(songs.map((s) => s.artist))];
  const albums = [...new Set(songs.map((s) => s.album))];

  return (
    <div className="scroll-area" style={{ height: "100%" }}>
      <div style={{ padding: "52px 0 20px" }}>
        <div style={{ padding: "0 22px 18px" }}>
          <div className="rush-font" style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>Library</div>
        </div>

        {/* Search */}
        <div style={{ padding: "0 22px 16px" }}>
          <div className="glass" style={{ display: "flex", alignItems: "center", gap: 12, background: theme.card, borderRadius: 14, padding: "11px 16px", border: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.sub }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your library..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: theme.text, fontSize: 14, fontFamily: "'Exo 2', sans-serif" }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, padding: "0 22px 20px", overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map((t) => (
            <button key={t} className="btn-press" onClick={() => setLibTab(t)} style={{
              flexShrink: 0, padding: "7px 16px", borderRadius: 20,
              border: `1px solid ${t === libTab ? theme.accent : theme.border}`,
              background: t === libTab ? `${theme.accent}20` : theme.card,
              color: t === libTab ? theme.accent : theme.sub,
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Exo 2', sans-serif",
              textTransform: "capitalize", letterSpacing: 0.5
            }}>{t}</button>
          ))}
        </div>

        <div style={{ padding: "0 22px" }}>
          {(libTab === "all" || libTab === "favorites" || libTab === "recent") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.length === 0 && <EmptyState theme={theme} msg="No songs found" />}
              {filtered.map((s, i) => <SongRow key={s.id} song={s} idx={songs.indexOf(s)} theme={theme} songs={songs} playSong={playSong} toggleFav={toggleFav} />)}
            </div>
          )}
          {libTab === "artists" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {artists.map((a) => (
                <div key={a} className="btn-press glass" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", borderRadius: 16, background: theme.card, border: `1px solid ${theme.border}`, cursor: "pointer" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent}50, ${theme.accent2}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎤</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{a}</div>
                    <div style={{ fontSize: 12, color: theme.sub }}>{songs.filter((s) => s.artist === a).length} songs</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {libTab === "albums" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {albums.map((al) => {
                const s = songs.find((x) => x.album === al);
                return (
                  <div key={al} className="btn-press glass" style={{ borderRadius: 18, padding: 16, background: theme.card, border: `1px solid ${theme.border}`, cursor: "pointer" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>{s?.art}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{al}</div>
                    <div style={{ fontSize: 11, color: theme.sub }}>{songs.filter((x) => x.album === al).length} songs</div>
                  </div>
                );
              })}
            </div>
          )}
          {libTab === "playlists" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {playlists.map((p) => (
                <div key={p.id} className="btn-press glass" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", borderRadius: 16, background: theme.card, border: `1px solid ${p.color}40`, cursor: "pointer" }}>
                  <div style={{ fontSize: 32 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: theme.sub }}>{p.songs.length} songs</div>
                  </div>
                  <button className="btn-press" onClick={(e) => { e.stopPropagation(); setModal({ type: "editPlaylist", playlist: p }); }} style={{ background: "none", border: "none", color: theme.sub, cursor: "pointer", fontSize: 18 }}>⋯</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── PLAYLISTS TAB ────────────────────────────────────────────────────────────
function PlaylistsTab({ theme, playlists, setPlaylists, songs, playSong, setModal }) {
  const [selected, setSelected] = useState(null);

  const createPlaylist = () => {
    const newP = { id: Date.now(), name: `My Playlist ${playlists.length + 1}`, songs: [], color: theme.accent, icon: "🎵" };
    setPlaylists([...playlists, newP]);
  };

  const deletePlaylist = (id) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  if (selected) {
    const pl = playlists.find((p) => p.id === selected.id) || selected;
    const plSongs = pl.songs.map((id) => songs.find((s) => s.id === id)).filter(Boolean);
    return (
      <div className="scroll-area" style={{ height: "100%" }}>
        <div style={{ padding: "52px 22px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <button className="btn-press" onClick={() => setSelected(null)} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, width: 40, height: 40, cursor: "pointer", color: theme.text, fontSize: 18 }}>‹</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>{pl.name}</div>
              <div style={{ fontSize: 12, color: theme.sub }}>{pl.songs.length} songs</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {plSongs.length === 0 && <EmptyState theme={theme} msg="No songs in this playlist" />}
            {plSongs.map((s, i) => <SongRow key={s.id} song={s} idx={songs.indexOf(s)} theme={theme} songs={songs} playSong={playSong} toggleFav={() => {}} />)}
          </div>
          <div style={{ height: 80 }} />
          <button className="btn-press" onClick={() => setModal({ type: "addToPlaylist", playlistId: pl.id })} style={{
            position: "fixed", bottom: 80, right: 24, width: 52, height: 52, borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`,
            border: "none", cursor: "pointer", color: "#fff", fontSize: 24, boxShadow: theme.glow, zIndex: 40
          }}>+</button>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-area" style={{ height: "100%" }}>
      <div style={{ padding: "52px 22px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="rush-font" style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>Playlists</div>
          <button className="btn-press" onClick={createPlaylist} style={{
            padding: "8px 16px", borderRadius: 12, border: `1px solid ${theme.accent}`,
            background: `${theme.accent}20`, color: theme.accent, fontSize: 13, cursor: "pointer",
            fontFamily: "'Exo 2', sans-serif", fontWeight: 600
          }}>+ New</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {playlists.map((p) => (
            <div key={p.id} className="btn-press glass" onClick={() => setSelected(p)} style={{
              borderRadius: 20, padding: 18, background: theme.card,
              border: `1px solid ${p.color}40`, cursor: "pointer", position: "relative",
              boxShadow: `0 4px 20px ${p.color}20`
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: theme.sub, marginBottom: 12 }}>{p.songs.length} songs</div>
              <div style={{ width: "100%", height: 2, background: `linear-gradient(90deg, ${p.color}, transparent)`, borderRadius: 1 }} />
              <button className="btn-press" onClick={(e) => { e.stopPropagation(); deletePlaylist(p.id); }} style={{
                position: "absolute", top: 12, right: 12, background: "rgba(255,45,85,0.2)",
                border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#ff2d55", fontSize: 14
              }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── THEMES TAB ───────────────────────────────────────────────────────────────
function ThemesTab({ theme, themeKey, setThemeKey }) {
  return (
    <div className="scroll-area" style={{ height: "100%" }}>
      <div style={{ padding: "52px 22px 20px" }}>
        <div className="rush-font" style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: 2, marginBottom: 8 }}>Themes</div>
        <div style={{ color: theme.sub, fontSize: 14, marginBottom: 28 }}>Choose your visual identity</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(THEMES).map(([key, t]) => (
            <div key={key} className="btn-press glass" onClick={() => setThemeKey(key)} style={{
              borderRadius: 20, overflow: "hidden", cursor: "pointer",
              border: `2px solid ${key === themeKey ? t.accent : "transparent"}`,
              boxShadow: key === themeKey ? `0 0 24px ${t.accent}50` : "none",
              transition: "all 0.3s ease"
            }}>
              <div style={{ height: 80, background: t.bg, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="rush-font" style={{ fontSize: 28, fontWeight: 900, color: t.accent, letterSpacing: 8, textShadow: `0 0 20px ${t.accent}` }}>RUSH</div>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 50%, ${t.accent}20, transparent)` }} />
              </div>
              <div style={{ padding: "14px 18px", background: t.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{t.name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    {[t.accent, t.accent2, t.sub].map((c, i) => (
                      <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: c, boxShadow: `0 0 6px ${c}` }} />
                    ))}
                  </div>
                </div>
                {key === themeKey && <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: `0 0 12px ${t.accent}` }}>✓</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({ theme, themeKey, setThemeKey }) {
  const [animations, setAnimations] = useState(true);
  const [hq, setHq] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const Toggle = ({ val, set }) => (
    <div className="btn-press" onClick={() => set(!val)} style={{
      width: 48, height: 28, borderRadius: 14, background: val ? theme.accent : `${theme.sub}40`,
      position: "relative", cursor: "pointer", transition: "background 0.3s", flexShrink: 0
    }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: val ? 23 : 3, transition: "left 0.3s", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
    </div>
  );

  const Row = ({ label, sub, right }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${theme.border}` }}>
      <div>
        <div style={{ fontSize: 15, color: theme.text, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: theme.sub, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );

  const Card = ({ title, children }) => (
    <div className="glass" style={{ borderRadius: 20, background: theme.card, border: `1px solid ${theme.border}`, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "12px 18px 8px", fontSize: 11, letterSpacing: 2, color: theme.sub, textTransform: "uppercase", fontWeight: 700 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div className="scroll-area" style={{ height: "100%" }}>
      <div style={{ padding: "52px 22px 20px" }}>
        <div className="rush-font" style={{ fontSize: 28, fontWeight: 800, color: theme.text, letterSpacing: 2, marginBottom: 24 }}>Settings</div>

        {/* Premium Banner */}
        <div className="glass" style={{ borderRadius: 20, padding: 20, marginBottom: 20, background: `linear-gradient(135deg, ${theme.accent2}30, ${theme.accent}20)`, border: `1px solid ${theme.accent}40` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 36 }}>👑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Rush Premium</div>
              <div style={{ fontSize: 12, color: theme.sub, marginTop: 2 }}>Unlock all features & themes</div>
            </div>
            <div style={{ padding: "8px 16px", borderRadius: 12, background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Upgrade</div>
          </div>
        </div>

        <Card title="Appearance">
          <Row label="Active Theme" sub={THEMES[themeKey].name} right={<div style={{ width: 24, height: 24, borderRadius: "50%", background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />} />
          <Row label="UI Animations" right={<Toggle val={animations} set={setAnimations} />} />
        </Card>

        <Card title="Audio">
          <Row label="High Quality Audio" sub="Uses more data" right={<Toggle val={hq} set={setHq} />} />
          <Row label="Crossfade" sub="3 seconds" right={<div style={{ color: theme.accent, fontSize: 14 }}>›</div>} />
          <Row label="Equalizer" sub="Flat" right={<div style={{ color: theme.accent, fontSize: 14 }}>›</div>} />
        </Card>

        <Card title="Notifications">
          <Row label="Now Playing" right={<Toggle val={notifications} set={setNotifications} />} />
        </Card>

        <Card title="About">
          <Row label="App Version" right={<div style={{ color: theme.sub, fontSize: 13 }}>1.0.0</div>} />
          <Row label="Developer" right={<div style={{ color: theme.accent, fontSize: 13, fontWeight: 700 }}>Rush</div>} />
          <Row label="Terms of Service" right={<div style={{ color: theme.accent, fontSize: 14 }}>›</div>} />
          <Row label="Privacy Policy" right={<div style={{ color: theme.accent, fontSize: 14 }}>›</div>} />
        </Card>

        <div className="glass" style={{ borderRadius: 20, padding: 24, background: theme.card, border: `1px solid ${theme.border}`, textAlign: "center" }}>
          <div className="rush-font rush-text" style={{ fontSize: 32, fontWeight: 900, color: theme.accent, letterSpacing: 8, textShadow: `0 0 20px ${theme.accent}` }}>RUSH</div>
          <div style={{ fontSize: 12, color: theme.sub, marginTop: 6 }}>Made with ♥ by Rush</div>
          <div style={{ fontSize: 11, color: `${theme.sub}80`, marginTop: 4 }}>© 2026 Rush Music · All rights reserved</div>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ modal, setModal, theme, songs, playlists, setPlaylists }) {
  if (modal.type === "addToPlaylist") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={() => setModal(null)}>
        <div className="glass" onClick={(e) => e.stopPropagation()} style={{
          width: "100%", background: theme.nav, borderRadius: "24px 24px 0 0", padding: "24px 22px 48px",
          border: `1px solid ${theme.border}`, animation: "slideUp 0.3s ease"
        }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.sub, margin: "0 auto 20px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Add Songs</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
            {songs.map((s) => (
              <div key={s.id} className="btn-press" onClick={() => {
                setPlaylists(playlists.map((p) => p.id === modal.playlistId ? { ...p, songs: p.songs.includes(s.id) ? p.songs : [...p.songs, s.id] } : p));
              }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 14, background: theme.card, cursor: "pointer", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 24 }}>{s.art}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: theme.text, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: theme.sub }}>{s.artist}</div>
                </div>
                {playlists.find((p) => p.id === modal.playlistId)?.songs.includes(s.id) && <div style={{ color: theme.accent, fontSize: 18 }}>✓</div>}
              </div>
            ))}
          </div>
          <button className="btn-press" onClick={() => setModal(null)} style={{ width: "100%", marginTop: 16, padding: "14px 0", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Exo 2', sans-serif" }}>Done</button>
        </div>
      </div>
    );
  }
  return null;
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ theme, msg }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 0", color: theme.sub }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🎵</div>
      <div style={{ fontSize: 15 }}>{msg}</div>
    </div>
  );
}
