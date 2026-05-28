import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// High-resolution engineering images (4K source)
const IMAGES = {
  hero1: "https://images.pexels.com/photos/31258538/pexels-photo-31258538.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  hero2: "https://images.pexels.com/photos/5505131/pexels-photo-5505131.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  hero3: "https://images.pexels.com/photos/34659699/pexels-photo-34659699.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  construction: "https://images.pexels.com/photos/14486702/pexels-photo-14486702.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  design: "https://images.pexels.com/photos/4458205/pexels-photo-4458205.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  instrumentation: "https://images.pexels.com/photos/34194580/pexels-photo-34194580.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  management: "https://images.pexels.com/photos/8961073/pexels-photo-8961073.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  implementation: "https://images.pexels.com/photos/7461108/pexels-photo-7461108.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  team1: "https://images.pexels.com/photos/3862135/pexels-photo-3862135.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  team2: "https://images.pexels.com/photos/8482865/pexels-photo-8482865.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  blueprint: "https://images.pexels.com/photos/9616959/pexels-photo-9616959.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  control: "https://images.pexels.com/photos/25819964/pexels-photo-25819964.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
  site: "https://images.pexels.com/photos/8961259/pexels-photo-8961259.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1920",
};

// Three.js Engineering Lattice
function EngineeringLattice() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const { positions, linePositions } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const scale = 12;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Create structured lattice, not random
      const x = (Math.random() - 0.5) * scale;
      const y = (Math.random() - 0.5) * scale * 0.6;
      const z = (Math.random() - 0.5) * scale;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }
    
    // Create connections for engineering truss look
    const lineCount = 400;
    const linePositions = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const idx1 = Math.floor(Math.random() * count);
      const idx2 = Math.floor(Math.random() * count);
      linePositions[i * 6] = positions[idx1 * 3];
      linePositions[i * 6 + 1] = positions[idx1 * 3 + 1];
      linePositions[i * 6 + 2] = positions[idx1 * 3 + 2];
      linePositions[i * 6 + 3] = positions[idx2 * 3];
      linePositions[i * 6 + 4] = positions[idx2 * 3 + 1];
      linePositions[i * 6 + 5] = positions[idx2 * 3 + 2];
    }
    
    return { positions, linePositions };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#60a5fa"
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

function ThreeBackground() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <EngineeringLattice />
        <Preload all />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),_transparent_60%)]" />
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselIndex = useRef(0);
  const carouselTimer = useRef<number | null>(null);

  const pages = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const services = [
    {
      title: "Construction",
      desc: "End-to-end civil, structural and industrial construction with BIM coordination, QA/QC, and safety-first delivery.",
      img: IMAGES.construction,
      points: ["High-rise & industrial", "Steel & concrete", "Site supervision"],
    },
    {
      title: "Design & Engineering",
      desc: "Concept to IFC: architectural, structural, MEP design using international codes and digital twins.",
      img: IMAGES.design,
      points: ["BIM Level 2/3", "Structural analysis", "MEP coordination"],
    },
    {
      title: "Instrumentation",
      desc: "Process control, SCADA, DCS, field instrumentation, calibration and commissioning for critical plants.",
      img: IMAGES.instrumentation,
      points: ["SCADA/DCS", "Loop checking", "Hazardous area"],
    },
    {
      title: "Management",
      desc: "PMO, cost control, scheduling, risk and procurement — delivering on time, on budget, every time.",
      img: IMAGES.management,
      points: ["Primavera P6", "EVM & KPI", "Contract admin"],
    },
    {
      title: "Implementation",
      desc: "Turnkey execution, commissioning, startup and handover with comprehensive O&M documentation.",
      img: IMAGES.implementation,
      points: ["FAT/SAT", "Commissioning", "Training"],
    },
  ];

  const projects = [
    {
      title: "Harbour Front Towers",
      location: "Lagos, NG",
      img: IMAGES.hero1,
      scope: "42-storey mixed-use, 180,000 m²",
    },
    {
      title: "Petrochem Instrumentation Upgrade",
      location: "Port Harcourt, NG",
      img: IMAGES.control,
      scope: "DCS migration, 2,400 I/O points",
    },
    {
      title: "Metro Viaduct Phase 2",
      location: "Abuja, NG",
      img: IMAGES.hero3,
      scope: "12.4 km elevated guideway",
    },
    {
      title: "Industrial Park Utilities",
      location: "Ogun, NG",
      img: IMAGES.site,
      scope: "Power, water, fire systems",
    },
    {
      title: "Design HQ Campus",
      location: "Accra, GH",
      img: IMAGES.blueprint,
      scope: "BIM-led design & build",
    },
  ];

  // GSAP initial animations
  useEffect(() => {
    if (!appRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.from(".hero-title span", {
        yPercent: 110,
        stagger: 0.04,
        duration: 1,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
      });
    }, appRef);
    return () => ctx.revert();
  }, []);

  // Page transitions
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
      ScrollTrigger.refresh();
    }, appRef);
    return () => ctx.revert();
  }, [active]);

  // Hero carousel
  useEffect(() => {
    if (active !== "home" || !carouselRef.current) return;
    const slides = carouselRef.current.querySelectorAll(".hero-slide");
    const total = slides.length;
    
    const go = (idx: number) => {
      carouselIndex.current = idx;
      gsap.to(slides, {
        opacity: (i) => (i === idx ? 1 : 0),
        scale: (i) => (i === idx ? 1 : 1.05),
        duration: 1.2,
        ease: "power2.inOut",
      });
    };
    
    go(0);
    if (carouselTimer.current) window.clearInterval(carouselTimer.current);
    carouselTimer.current = window.setInterval(() => {
      go((carouselIndex.current + 1) % total);
    }, 5000);
    
    return () => {
      if (carouselTimer.current) window.clearInterval(carouselTimer.current);
    };
  }, [active]);

  // Scroll animations for services
  useEffect(() => {
    if (active !== "services") return;
    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={appRef} className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 selection:text-white">
      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-8">
          <button onClick={() => setActive("home")} className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-xl bg-blue-500/20 blur-xl transition group-hover:bg-blue-500/30" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-900/20 ring-1 ring-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M3 9L12 3L21 9V19C21 19.55 20.55 20 20 20H4C3.45 20 3 19.55 3 19V9Z" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15"/>
                  <path d="M9 20V12H15V20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="text-left">
              <div className="font-semibold tracking-tight leading-none">MORIZ</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Internationals</div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`nav-item relative rounded-full px-4 py-2 text-sm transition ${
                  active === p.id
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {active === p.id && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-white/5 ring-1 ring-white/10" />
                )}
                {p.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); setActive("contact"); }}
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:bg-slate-100 transition"
            >
              Start a Project
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl">
            <div className="px-6 py-4 space-y-1">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActive(p.id); setMenuOpen(false); }}
                  className={`block w-full text-left rounded-lg px-3 py-2.5 text-[15px] ${active === p.id ? "bg-white/10 text-white" : "text-slate-300"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="page-content">
        {/* HOME */}
        {active === "home" && (
          <section>
            {/* Hero */}
            <div ref={heroRef} className="relative isolate overflow-hidden">
              <div className="absolute inset-0 -z-10">
                <ThreeBackground />
              </div>
              
              {/* Hero carousel images */}
              <div ref={carouselRef} className="absolute inset-0 -z-10">
                {[IMAGES.hero1, IMAGES.hero2, IMAGES.hero3].map((src, i) => (
                  <div key={i} className="hero-slide absolute inset-0 opacity-0">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 mix-blend-multiply" />
                  </div>
                ))}
              </div>

              <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
                <div className="grid min-h-[88vh] grid-cols-1 items-center gap-12 py-20 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      <span className="text-xs tracking-wide text-slate-300">ISO 9001 • 14001 • 45001 Certified</span>
                    </div>
                    
                    <h1 className="hero-title mt-6 text-[clamp(40px,7vw,84px)] font-semibold leading-[0.9] tracking-[-0.02em]">
                      <span className="block overflow-hidden"><span className="block">World-Class</span></span>
                      <span className="block overflow-hidden"><span className="block bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Engineering</span></span>
                      <span className="block overflow-hidden"><span className="block">Solutions</span></span>
                    </h1>
                    
                    <p className="hero-sub mt-6 max-w-xl text-[17px] leading-relaxed text-slate-300">
                      Moriz Internationals delivers construction, design, instrumentation, management and implementation for critical infrastructure across Africa and beyond. Senior-led. Enterprise-ready.
                    </p>
                    
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActive("services")}
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-[15px] font-medium text-slate-900 shadow-lg shadow-black/20 transition hover:translate-y-[-1px]"
                      >
                        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition group-hover:opacity-100" />
                        <span className="group-hover:text-white transition">Explore Services</span>
                        <svg className="transition group-hover:translate-x-0.5 group-hover:text-white" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setActive("projects")}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[15px] backdrop-blur-md hover:bg-white/10 transition"
                      >
                        View Projects
                      </button>
                    </div>

                    <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
                      {[
                        { k: "18+", v: "Years" },
                        { k: "240+", v: "Projects" },
                        { k: "12", v: "Countries" },
                      ].map((s) => (
                        <div key={s.v}>
                          <div className="text-3xl font-semibold tracking-tight">{s.k}</div>
                          <div className="text-sm text-slate-400">{s.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative">
                      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-blue-500/10 blur-3xl" />
                      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-px bg-white/5">
                          {services.slice(0, 4).map((svc) => (
                            <div key={svc.title} className="group relative bg-slate-950/70 p-5">
                              <img src={svc.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.15] transition group-hover:opacity-25" />
                              <div className="relative">
                                <div className="text-[11px] uppercase tracking-widest text-slate-400">Service</div>
                                <div className="mt-1 font-medium">{svc.title}</div>
                                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                                  Available
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 bg-slate-950/50 px-5 py-4">
                          <div className="text-sm text-slate-300">Senior Lead Engineer on every project</div>
                          <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="h-7 w-7 rounded-full border-2 border-slate-900 bg-slate-700" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee */}
            <div className="border-y border-white/5 bg-white/[0.02] py-4">
              <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
                <div className="flex items-center gap-10 overflow-hidden">
                  <div className="shrink-0 text-xs uppercase tracking-[0.2em] text-slate-500">Trusted by industry leaders</div>
                  <div className="flex animate-[marquee_30s_linear_infinite] items-center gap-12 whitespace-nowrap">
                    {["SHELL", "DANGOTE", "BUA GROUP", "NLNG", "TOTALENERGIES", "JULIUS BERGER", "MTN", "AIRTEL"].map((b) => (
                      <span key={b} className="text-sm font-medium tracking-widest text-slate-500">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {active === "about" && (
          <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="sticky top-28">
                  <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em]">Built on precision. Delivered with integrity.</h2>
                  <p className="mt-5 text-slate-300 leading-relaxed">
                    Moriz Internationals is a world-class engineering solutions firm solving complex challenges in construction, design, instrumentation, management, and implementation.
                  </p>
                  <div className="mt-8 flex gap-3">
                    <button onClick={() => setActive("contact")} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100">Work with us</button>
                    <button onClick={() => setActive("projects")} className="rounded-full border border-white/15 px-5 py-2.5 text-sm hover:bg-white/5">Our work</button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-3xl border border-white/10">
                  <img src={IMAGES.team1} alt="Engineering team reviewing plans" className="h-[420px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-0 p-8">
                    <div className="text-sm uppercase tracking-widest text-slate-300">About Firm</div>
                    <div className="mt-2 max-w-xl text-lg text-slate-100">Senior-led delivery, international standards, local expertise.</div>
                  </div>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-3">
                  {[
                    { title: "Mission", desc: "Deliver safe, sustainable, and bankable engineering outcomes." },
                    { title: "Vision", desc: "Africa’s most trusted partner for critical infrastructure." },
                    { title: "Values", desc: "Safety, Quality, Integrity, Innovation, Accountability." },
                  ].map((c) => (
                    <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
                      <div className="text-[11px] uppercase tracking-widest text-slate-400">{c.title}</div>
                      <div className="mt-2 text-slate-200">{c.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  <img src={IMAGES.team2} alt="Site management" className="h-[260px] w-full rounded-2xl object-cover border border-white/10" />
                  <img src={IMAGES.blueprint} alt="Design" className="h-[260px] w-full rounded-2xl object-cover border border-white/10" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SERVICES */}
        {active === "services" && (
          <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
            <div className="flex items-end justify-between gap-8">
              <div>
                <h2 className="text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.02em]">Services</h2>
                <p className="mt-3 max-w-2xl text-slate-300">Comprehensive engineering capabilities from concept to commissioning.</p>
              </div>
            </div>

            <div className="services-grid mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article key={s.title} className="service-card group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl">
                  <div className="relative h-[220px] overflow-hidden">
                    <img src={s.img} alt={s.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{s.title}</h3>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] backdrop-blur">Enterprise</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-relaxed text-slate-300">{s.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {s.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {active === "projects" && (
          <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.02em]">Selected Projects</h2>
              <div className="text-sm text-slate-400">Carousel • Auto-play</div>
            </div>

            <div className="mt-10 relative">
              <div className="overflow-hidden rounded-[2rem] border border-white/10">
                <div className="relative">
                  {/* Project Carousel */}
                  <ProjectCarousel projects={projects} />
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                { k: "Zero LTIs", v: "3.2M man-hours" },
                { k: "On-time", v: "94% projects" },
                { k: "Client NPS", v: "72 — world class" },
              ].map((m) => (
                <div key={m.k} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center backdrop-blur">
                  <div className="text-3xl font-semibold">{m.k}</div>
                  <div className="mt-1 text-slate-400">{m.v}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        {active === "contact" && (
          <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h2 className="text-[clamp(32px,5vw,52px)] font-semibold leading-tight tracking-[-0.02em]">Let's build something significant.</h2>
                <p className="mt-4 text-slate-300">Tell us about your project. A senior lead engineer will respond within one business day.</p>
                
                <div className="mt-10 space-y-6">
                  {[
                    { l: "Head Office", v: "Victoria Island, Lagos, Nigeria" },
                    { l: "Email", v: "projects@moriz-intl.com" },
                    { l: "Phone", v: "+234 1 700 1234" },
                  ].map((c) => (
                    <div key={c.l} className="flex gap-4">
                      <div className="mt-1 h-8 w-8 shrink-0 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-slate-400">{c.l}</div>
                        <div className="mt-1 text-slate-100">{c.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <form onSubmit={(e) => { e.preventDefault(); alert("Thank you. Our senior engineer will contact you shortly."); }} className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8">
                  <div className="grid gap-5 md:grid-cols-2">
                    {[
                      { label: "Full name", type: "text", ph: "Ada Okafor" },
                      { label: "Work email", type: "email", ph: "ada@company.com" },
                      { label: "Company", type: "text", ph: "Company Ltd" },
                      { label: "Phone", type: "text", ph: "+234..." },
                    ].map((f) => (
                      <label key={f.label} className="group">
                        <div className="text-xs uppercase tracking-widest text-slate-400">{f.label}</div>
                        <input required type={f.type} placeholder={f.ph} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none ring-0 transition placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-950" />
                      </label>
                    ))}
                    <label className="md:col-span-2">
                      <div className="text-xs uppercase tracking-widest text-slate-400">Project type</div>
                      <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none focus:border-blue-500/50">
                        <option>Construction</option>
                        <option>Design & Engineering</option>
                        <option>Instrumentation</option>
                        <option>Management</option>
                        <option>Implementation</option>
                      </select>
                    </label>
                    <label className="md:col-span-2">
                      <div className="text-xs uppercase tracking-widest text-slate-400">Project brief</div>
                      <textarea rows={5} placeholder="Scope, location, timeline, budget range..." className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none focus:border-blue-500/50" />
                    </label>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs text-slate-400">By submitting, you agree to our terms.</div>
                    <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-900 shadow hover:bg-slate-100">
                      Send request
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </form>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {["ISO 9001", "ISO 14001", "ISO 45001"].map((iso) => (
                    <div key={iso} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm text-slate-300">{iso} Certified</div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white"><path d="M3 9L12 3L21 9V19C21 19.55 20.55 20 20 20H4C3.45 20 3 19.55 3 19V9Z" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15"/><path d="M9 20V12H15V20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <div className="font-semibold leading-none">MORIZ INTERNATIONALS</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Senior Lead Engineer</div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">World-class engineering solutions in construction, design, instrumentation, management and implementation.</p>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { h: "Company", l: ["About", "Leadership", "Careers", "News"] },
                { h: "Services", l: ["Construction", "Design", "Instrumentation", "Management"] },
                { h: "Projects", l: ["Portfolio", "Case Studies", "Clients"] },
                { h: "Legal", l: ["Privacy", "Terms", "HSE Policy"] },
              ].map((col) => (
                <div key={col.h}>
                  <div className="text-xs uppercase tracking-widest text-slate-500">{col.h}</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {col.l.map((i) => <li key={i} className="hover:text-white cursor-pointer">{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
            <div>© {new Date().getFullYear()} Moriz Internationals. All rights reserved.</div>
            <div>Built with React • GSAP • Three.js • Tailwind</div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// Project Carousel Component with GSAP
function ProjectCarousel({ projects }: { projects: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!trackRef.current) return;
      gsap.to(trackRef.current, {
        xPercent: -100 * idx,
        duration: 0.8,
        ease: "power3.inOut",
      });
    });
    return () => ctx.revert();
  }, [idx]);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % projects.length), 4500);
    return () => clearInterval(id);
  }, [projects.length]);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex will-change-transform">
          {projects.map((p) => (
            <div key={p.title} className="min-w-full">
              <div className="relative h-[520px] md:h-[600px]">
                <img src={p.img} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(2,6,23,0.8))]" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-200">{p.location}</span>
                    </div>
                    <h3 className="mt-4 text-[clamp(28px,4vw,48px)] font-semibold leading-tight tracking-[-0.01em]">{p.title}</h3>
                    <p className="mt-2 text-slate-200/90">{p.scope}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-4">
        <button onClick={() => setIdx((i) => (i - 1 + projects.length) % projects.length)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur hover:bg-black/60 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={() => setIdx((i) => (i + 1) % projects.length)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur hover:bg-black/60 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {projects.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}
