import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function GlowingSphere({ position, color, size = 0.4, speed = 1 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.6} distort={0.3} speed={2} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

function FloatingCube({ position, color, size = 0.3, speed = 1 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={speed * 0.8} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[size, size, size]} />
        <MeshWobbleMaterial color={color} emissive={color} emissiveIntensity={0.4} factor={0.2} speed={1} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position, color, speed = 0.8 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function Particles({ count = 200 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#34d399" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#34d399" />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#60a5fa" />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#a78bfa" />

      {/* Main floating objects */}
      <GlowingSphere position={[-3.5, 1.5, -2]} color="#34d399" size={0.5} speed={0.7} />
      <GlowingSphere position={[4, -1, -3]} color="#60a5fa" size={0.35} speed={1.2} />
      <GlowingSphere position={[2.5, 2.5, -4]} color="#a78bfa" size={0.25} speed={0.9} />

      <FloatingCube position={[-4, -1.5, -2.5]} color="#34d399" size={0.4} speed={0.6} />
      <FloatingCube position={[3.5, 1, -1.5]} color="#f472b6" size={0.25} speed={1.1} />
      <FloatingCube position={[-2, 2.5, -3.5]} color="#fbbf24" size={0.2} speed={0.8} />

      <FloatingTorus position={[5, 0, -4]} color="#34d399" speed={0.5} />
      <FloatingTorus position={[-5, -0.5, -3]} color="#60a5fa" speed={0.7} />

      {/* Small accent spheres */}
      <GlowingSphere position={[1, 3, -5]} color="#34d399" size={0.15} speed={1.5} />
      <GlowingSphere position={[-1.5, -2, -4]} color="#f472b6" size={0.12} speed={1.3} />
      <GlowingSphere position={[3, -2.5, -2]} color="#fbbf24" size={0.1} speed={1.8} />

      <Particles count={300} />
      <Stars radius={15} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />
      <GridFloor />
    </>
  );
}

const LandingScene = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default LandingScene;
