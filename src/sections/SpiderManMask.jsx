import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { BackgroundBeams } from "./../components/BackgroundBeams";

import bgTextureLines from "../../public/images/movieposter.avif";
import spider from "../../public/images/spider.jpg";
import SpiderManSymbiote from "../components/Spider-man-symbiote.jsx";

const verticalScannerMask = `linear-gradient(to right, transparent, black 15%, black 85%, transparent)`;

const SpiderManMask = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });

  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const hoverCanvasRef = useRef(null);
  const tl = useRef(null);

  const isHoveredRef = useRef(false);
  const showMask = isHovered;
  const idleMaskPosition = isMobile
    ? "calc(50% + 100px) center"
    : "calc(50% + 170px) center";

  useEffect(() => {
    isHoveredRef.current = showMask;
  }, [showMask]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const proxy = { size: 0, opacity: 0 };
    const solid = hoverCanvasRef.current;

    tl.current = gsap.timeline({ repeat: -1, repeatDelay: 5, paused: true });

    if (solid) {
      tl.current
        .set(proxy, { size: 0, opacity: 0 })
        .to(proxy, {
          opacity: 1,
          size: 350,
          duration: 0.5,
          ease: "power3.out",
          onUpdate: () => {
            if (solid && !isHoveredRef.current) {
              solid.style.opacity = proxy.opacity;
              const size = `${proxy.size}px 100%`;
              solid.style.WebkitMaskSize = size;
              solid.style.maskSize = size;
            }
          },
        })
        .to(proxy, { duration: 0.8 })
        .to(proxy, {
          opacity: 0,
          size: 0,
          duration: 0.5,
          ease: "power3.in",
          onUpdate: () => {
            if (solid && !isHoveredRef.current) {
              solid.style.opacity = proxy.opacity;
              const size = `${proxy.size}px 100%`;
              solid.style.WebkitMaskSize = size;
              solid.style.maskSize = size;
            }
          },
        });
    }

    tl.current.play();

    return () => {
      if (tl.current) tl.current.kill();
    };
  }, []);

  const handleMove = (clientX, clientY) => {
    if (containerRef.current && hoverCanvasRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const moveFactor = isMobile ? 3 : 10;
      const moveX = (x / rect.width - 0.5) * moveFactor;
      const moveY = (y / rect.height - 0.5) * moveFactor;
      setMousePos({ x: moveX, y: moveY });

      const maskWidth = isMobile ? 200 : 350;
      const positionStr = `${x - maskWidth / 2}px center`;

      hoverCanvasRef.current.style.WebkitMaskPosition = positionStr;
      hoverCanvasRef.current.style.maskPosition = positionStr;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  useEffect(() => {
    const solid = hoverCanvasRef.current;
    if (solid) {
      if (showMask) {
        if (tl.current) tl.current.pause();
        const size = isMobile ? "200px 100%" : "350px 100%";
        solid.style.WebkitMaskSize = size;
        solid.style.maskSize = size;
        solid.style.opacity = 1;
      } else {
        solid.style.opacity = 0;

        setTimeout(() => {
          if (!isHoveredRef.current && solid) {
            solid.style.WebkitMaskPosition = idleMaskPosition;
            solid.style.maskPosition = idleMaskPosition;
          }
        }, 300);

        if (tl.current) tl.current.restart(true).delay(1);
      }
    }
  }, [showMask, isMobile, idleMaskPosition]);

  const finalMaskScale = isMobile ? 0.05 : 0.062;
  const finalMaskPosition = isMobile ? [0, 0.4, 0] : [0, 0, 0];

  return (
    <section className="relative w-full min-h-screen overflow-hidden pt-20 flex flex-col items-center bg-[#020617]">
      <style>
        {`
           @keyframes scanWipe {
            0% { clip-path: inset(0 0 100% 0); opacity: 0; }
            15% { opacity: 0.4; } 
            40% { clip-path: inset(0 0 0 0); opacity: 0.4; }
            60% { clip-path: inset(0 0 0 0); opacity: 0.4; }
            85% { opacity: 0.4; } 
            100% { clip-path: inset(100% 0 0 0); opacity: 0; }
             }
          .animate-scanner {
            animation: scanWipe 5s ease-in-out infinite;
          }

          @keyframes techPulse {
            0% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.02); }
            100% { opacity: 0.2; transform: scale(1); }
          }
        `}
      </style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-center "
          style={{
            backgroundImage: `url(${spider})`,
            animation: "techPulse 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-15 bg-center"
          style={{ backgroundImage: `url(${bgTextureLines})` }}
        />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <BackgroundBeams />
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-[950px] h-[550px] md:h-[700px] !cursor-pointer z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          setIsHovered(true);
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) =>
          handleMove(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchEnd={handleMouseLeave}
      >
        <img
          src="/images/hero.png"
          alt="Mohamed Fawzei"
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-300 ease-out !cursor-pointer"
          style={{
            objectPosition: "top center",
            transformOrigin: "top center",
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) scale(${isMobile ? 1.2 : 1.21})`,
          }}
        />

        <div
          className={`absolute inset-0 z-15 pointer-events-none transition-opacity duration-300 animate-scanner !cursor-pointer ${isHovered ? "opacity-0" : "opacity-100"}`}
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, -12], fov: 22, near: 0.1, far: 50 }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1} />
              <SpiderManSymbiote
                wireframeMode={true}
                scale={finalMaskScale}
                position={finalMaskPosition}
                mousePos={mousePos}
              />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        <div
          ref={hoverCanvasRef}
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
            WebkitMaskImage: verticalScannerMask,
            maskImage: verticalScannerMask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
      
            WebkitMaskPosition: idleMaskPosition,
            maskPosition: idleMaskPosition,
            opacity: 0,
          }}
        >
          <Canvas
            shadows
            transparent
            camera={{ position: [0, 0, -12], fov: 22, near: 0.1, far: 50 }}
            style={{
              pointerEvents: isHovered ? "auto" : "none",
              touchAction: "none",
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={2} />
              <directionalLight
                position={[0, 5, 5]}
                intensity={4}
                color="#ffffff"
              />
              <spotLight position={[5, 5, -5]} intensity={5} color="#ff4444" />

              <SpiderManSymbiote
                wireframeMode={false}
                scale={finalMaskScale}
                position={finalMaskPosition}
                mousePos={mousePos}
              />
              <Environment resolution={256} preset="city">
                <group rotation={[-Math.PI / 3, 4, 1]}>
                  <Lightformer
                    form={"circle"}
                    intensity={4}
                    position={[0, 5, -9]}
                    scale={10}
                  />
                  <Lightformer
                    form={"circle"}
                    intensity={4}
                    position={[0, 3, 1]}
                    scale={10}
                  />
                </group>
              </Environment>
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default SpiderManMask;
