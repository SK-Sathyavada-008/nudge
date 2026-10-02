import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, MeshDistortMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';


interface MouseState {
  x: number;
  y: number;
}

interface CharacterReaction {
  text: string;
  emoji: string;
}

// ─── Sparkle Particle ────────────────────────────────────────────────────────
const SparkleParticle: React.FC<{ position: THREE.Vector3; color: string }> = ({ position, color }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const velocity = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.08,
    Math.random() * 0.1 + 0.02,
    (Math.random() - 0.5) * 0.05
  ));
  const life = useRef(1.0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    life.current -= delta * 1.5;
    if (life.current <= 0) { meshRef.current.visible = false; return; }
    meshRef.current.position.add(velocity.current);
    velocity.current.y -= 0.003;
    meshRef.current.scale.setScalar(life.current * 0.2);
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity = life.current;
  });

  return (
    <mesh ref={meshRef} position={position.toArray() as [number, number, number]}>
      <octahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={1} />
    </mesh>
  );
};

// ─── 3D Logo ─────────────────────────────────────────────────────────────────
const Logo3DText: React.FC<{ mouse: MouseState; onClick: () => void }> = ({ mouse, onClick }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; position: THREE.Vector3; color: string }>>([]);

  const { rotX, rotY, logoScale } = useSpring({
    rotX: mouse.y * 0.28,
    rotY: mouse.x * 0.38,
    logoScale: hovered ? 1.04 : clicked ? 0.96 : 1.0,
    config: { mass: 1, tension: 110, friction: 26 },
  });

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.55) * 0.035;
    }
    if (lightRef.current) {
      lightRef.current.position.set(mouse.x * 5, mouse.y * 3 + 2, 4);
    }
  });

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 180);
    onClick();
    const colors = ['#6366f1', '#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a855f7'];
    const newSparkles = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      position: new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1.2 + 0.5, 0),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setSparkles(prev => [...prev.slice(-20), ...newSparkles]);
    setTimeout(() => setSparkles([]), 1400);
  };

  return (
    <animated.group ref={groupRef} rotation-x={rotX} rotation-y={rotY} scale={logoScale}>
      <pointLight ref={lightRef} position={[0, 2, 4]} intensity={8} color="#6366f1" />
      <pointLight position={[-3, 1, 2]} intensity={3} color="#38bdf8" />
      <pointLight position={[3, -1, 2]} intensity={3} color="#34d399" />

      <Center position={[0, 0.3, 0]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.68}
          height={0.28}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.025}
          bevelOffset={0}
          bevelSegments={6}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={handleClick}
        >
          NUDGE VEER
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#4f46e5"
            emissiveIntensity={hovered ? 0.75 : 0.42}
            metalness={0.8}
            roughness={0.18}
          />
        </Text3D>
      </Center>

      {/* Glow ring */}
      <Torus args={[2.1, 0.012, 8, 80]} position={[0, 0.3, -0.15]}>
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={hovered ? 2 : 1} transparent opacity={0.35} />
      </Torus>

      {/* Depth bg plane */}
      <mesh position={[0, 0.3, -0.45]}>
        <planeGeometry args={[9, 2.8]} />
        <meshStandardMaterial color="#070a14" transparent opacity={0.25} />
      </mesh>

      {sparkles.map(s => (
        <SparkleParticle key={s.id} position={s.position} color={s.color} />
      ))}
    </animated.group>
  );
};

// ─── Creature ─────────────────────────────────────────────────────────────────
const PlayableCreature: React.FC<{ onReaction: (r: CharacterReaction) => void }> = ({ onReaction }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const eyeLeftRef = useRef<THREE.Mesh>(null!);
  const eyeRightRef = useRef<THREE.Mesh>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const blinkTimer = useRef(0);
  const blinkOpen = useRef(true);
  const blinkDuration = 0.1;

  const reactions: CharacterReaction[] = [
    { text: 'bro??', emoji: '😐' },
    { text: 'WHY.', emoji: '😤' },
    { text: 'okay.', emoji: '😑' },
    { text: '😭', emoji: '' },
    { text: 'stop poking me', emoji: '🫤' },
    { text: 'hello?', emoji: '👋' },
    { text: 'i have a job.', emoji: '💼' },
  ];
  const annoyedReactions: CharacterReaction[] = [
    { text: '😤 FINE.', emoji: '' },
    { text: 'ok im leaving', emoji: '🚶' },
    { text: 'WHY ARE YOU LIKE THIS', emoji: '' },
    { text: 'asking kanha about you', emoji: '🦚' },
  ];

  const { creatureScale } = useSpring({
    creatureScale: isDragging ? 1.14 : 1.0,
    config: { mass: 0.7, tension: 200, friction: 16 },
  });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = performance.now() * 0.001;
    groupRef.current.position.y = -0.8 + Math.sin(t * 1.15) * 0.06;
    groupRef.current.rotation.z = Math.sin(t * 0.75) * 0.07;

    blinkTimer.current += delta;
    const nextBlink = blinkOpen.current ? (2 + Math.random() * 2.5) : blinkDuration;
    if (blinkTimer.current > nextBlink) {
      blinkOpen.current = !blinkOpen.current;
      blinkTimer.current = 0;
    }
    const eyeScaleY = blinkOpen.current ? 1 : 0.07;
    if (eyeLeftRef.current) eyeLeftRef.current.scale.y += (eyeScaleY - eyeLeftRef.current.scale.y) * 0.28;
    if (eyeRightRef.current) eyeRightRef.current.scale.y += (eyeScaleY - eyeRightRef.current.scale.y) * 0.28;

    if (bodyRef.current) {
      const sx = isDragging ? 1.16 : 1.0;
      const sy = isDragging ? 0.86 : 1.0;
      bodyRef.current.scale.x += (sx - bodyRef.current.scale.x) * 0.1;
      bodyRef.current.scale.y += (sy - bodyRef.current.scale.y) * 0.1;
    }
  });

  const handleClick = useCallback(() => {
    const nc = clickCount + 1;
    setClickCount(nc);
    const pool = nc > 5 ? annoyedReactions : reactions;
    onReaction(pool[Math.floor(Math.random() * pool.length)]);
  }, [clickCount, onReaction]);

  const handleDoubleClick = useCallback(() => {
    onReaction({ text: '✨ SPECIAL MOVE ✨', emoji: '🌟' });
    setClickCount(0);
  }, [onReaction]);

  return (
    <animated.group
      ref={groupRef}
      position={[2.5, -0.8, 0]}
      scale={creatureScale}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Body */}
      <mesh ref={bodyRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <MeshDistortMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.5} metalness={0.3} roughness={0.5} distort={0.22} speed={2} />
      </mesh>
      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.1, 0.1, 0.24]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.1, 0.1, 0.3]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.1, 0.1, 0.24]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.1, 0.1, 0.3]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      {/* Mouth */}
      <Torus args={[0.07, 0.013, 8, 12, Math.PI]} position={[0, -0.06, 0.26]} rotation={[0, 0, Math.PI]}>
        <meshStandardMaterial color="#4c1d95" />
      </Torus>
      {/* Antenna */}
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.17, 8]} />
        <meshStandardMaterial color="#c4b5fd" />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} />
      </mesh>
      {/* Shadow */}
      <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} />
      </mesh>
    </animated.group>
  );
};

// ─── Ambient floating dots ────────────────────────────────────────────────────
const FloatingParticles: React.FC = () => {
  const ref = useRef<THREE.Points>(null!);
  const count = 55;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    return arr;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.018;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6366f1" size={0.022} transparent opacity={0.45} sizeAttenuation />
    </points>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────
const SceneContent: React.FC<{
  mouse: MouseState;
  onLogoClick: () => void;
  onCreatureReaction: (r: CharacterReaction) => void;
}> = ({ mouse, onLogoClick, onCreatureReaction }) => (
  <>
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
    <directionalLight position={[-5, -3, 2]} intensity={0.5} color="#38bdf8" />
    <FloatingParticles />
    <Suspense fallback={null}>
      <Logo3DText mouse={mouse} onClick={onLogoClick} />
    </Suspense>
    <Suspense fallback={null}>
      <Float speed={1.2} rotationIntensity={0.04} floatIntensity={0.14}>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.17}
          height={0.035}
          position={[-2.05, -0.62, 0]}
        >
          #From Developer to the Best PM
          <meshStandardMaterial color="#94a3b8" emissive="#38bdf8" emissiveIntensity={0.22} metalness={0.3} roughness={0.6} />
        </Text3D>
      </Float>
    </Suspense>
    <PlayableCreature onReaction={onCreatureReaction} />
  </>
);

// ─── Export ───────────────────────────────────────────────────────────────────
// ─── Error Boundary & CSS 3D Fallback ────────────────────────────────────────
interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('Logo3DScene: WebGL unavailable or errored, rendering CSS 3D fallback.', error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const CSS3DTitleFallback: React.FC<{
  mouse: MouseState;
  onLogoClick?: () => void;
  onCreatureClick: () => void;
}> = ({ mouse, onLogoClick, onCreatureClick }) => (
  <div
    className="w-full flex flex-col items-center justify-center relative select-none"
    style={{ height: 420 }}
  >
    {/* Floating ambient glow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-96 h-48 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
    </div>

    {/* Interactive 3D Perspective Title */}
    <div
      onClick={onLogoClick}
      className="cursor-pointer transition-transform duration-100 ease-out text-center group"
      style={{
        transform: `perspective(1000px) rotateX(${mouse.y * 14}deg) rotateY(${mouse.x * 18}deg) translateZ(10px)`,
      }}
    >
      <div className="relative inline-block">
        <h1
          className="text-6xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-indigo-100 via-indigo-300 to-indigo-600 drop-shadow-[0_15px_30px_rgba(99,102,241,0.5)]"
          style={{
            textShadow:
              '0 1px 0 #4338ca, 0 2px 0 #3730a3, 0 3px 0 #312e81, 0 4px 0 #1e1b4b, 0 6px 1px rgba(0,0,0,0.1), 0 0 25px rgba(99,102,241,0.6)',
          }}
        >
          NUDGE VEER
        </h1>
        <div className="absolute -inset-6 bg-indigo-500/10 rounded-3xl blur-2xl -z-10 group-hover:bg-indigo-500/25 transition-all" />
      </div>
      <p className="mt-4 text-sm sm:text-base font-bold text-slate-300 tracking-wide">
        #From Developer to the Best PM
      </p>
    </div>

    {/* Clickable CSS Creature */}
    <div
      onClick={onCreatureClick}
      className="absolute top-10 right-12 cursor-pointer transition-all hover:scale-110 active:scale-90"
      title="Click me!"
    >
      <div className="relative flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-purple-400 shadow-lg shadow-violet-500/40 flex items-center justify-center animate-bounce">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
          </div>
        </div>
        <span className="text-[10px] text-violet-300 font-bold mt-1">poke me</span>
      </div>
    </div>
  </div>
);

// ─── Export ───────────────────────────────────────────────────────────────────
export const Logo3DScene: React.FC<{ onLogoClick?: () => void }> = ({ onLogoClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0 });
  const [reaction, setReaction] = useState<CharacterReaction | null>(null);
  const [reactionVisible, setReactionVisible] = useState(false);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReduced) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  }, [prefersReduced]);

  const handleMouseLeave = useCallback(() => setMouse({ x: 0, y: 0 }), []);

  const handleReaction = useCallback((r: CharacterReaction) => {
    setReaction(r);
    setReactionVisible(true);
    clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReactionVisible(false), 2400);
  }, []);

  const handleFallbackCreatureClick = useCallback(() => {
    const list = [
      { text: 'bro??', emoji: '😐' },
      { text: 'WHY.', emoji: '😤' },
      { text: 'okay.', emoji: '😑' },
      { text: 'stop poking me', emoji: '🫤' },
      { text: 'hello?', emoji: '👋' },
      { text: '✨ SPECIAL MOVE ✨', emoji: '🌟' },
    ];
    handleReaction(list[Math.floor(Math.random() * list.length)]);
  }, [handleReaction]);

  useEffect(() => () => clearTimeout(reactionTimer.current), []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: 420 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <SceneErrorBoundary
        fallback={
          <CSS3DTitleFallback
            mouse={prefersReduced ? { x: 0, y: 0 } : mouse}
            onLogoClick={onLogoClick}
            onCreatureClick={handleFallbackCreatureClick}
          />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <SceneContent
            mouse={prefersReduced ? { x: 0, y: 0 } : mouse}
            onLogoClick={onLogoClick || (() => {})}
            onCreatureReaction={handleReaction}
          />
        </Canvas>
      </SceneErrorBoundary>

      {/* Creature speech bubble */}
      {reaction && (
        <div
          className={`absolute top-8 right-10 transition-all duration-300 pointer-events-none z-10 ${
            reactionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="relative bg-slate-900/95 border-2 border-violet-500/60 rounded-2xl px-4 py-2.5 shadow-xl shadow-violet-500/25 backdrop-blur-md">
            <div className="absolute -bottom-2.5 right-5 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-violet-500/60" />
            <p className="text-sm font-bold text-violet-200">
              {reaction.emoji && <span className="mr-1">{reaction.emoji}</span>}
              {reaction.text}
            </p>
          </div>
        </div>
      )}

      {/* Hints */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-5 text-[11px] text-slate-600 pointer-events-none select-none">
        <span>✦ move mouse over logo</span>
        <span>✦ click for sparks</span>
        <span>✦ poke the creature</span>
      </div>
    </div>
  );
};

