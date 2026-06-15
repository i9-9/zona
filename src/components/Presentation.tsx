"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LangToggle } from "@/components/LangToggle";
import { useLang } from "@/context/LangContext";
import { slides, type Slide } from "@/data/slides";

const SLIDE_COUNT = slides.length;
const FIRST_IMAGE_SLIDE_INDEX = 7;
const VIDEO_SLIDE_INDEX = 10; // slide 11 = remes.mp4

function VideoSlide({ isActive }: { isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.muted = true;
      const play = () => video.play().catch(() => {});
      play();
      // por si el ref no estaba listo en el primer tick
      const t = setTimeout(play, 100);
      return () => clearTimeout(t);
    } else {
      video.pause();
    }
  }, [isActive]);

  const onCanPlay = useCallback(() => {
    if (videoRef.current && isActive) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full max-w-full max-h-full object-contain"
        src="/images/remes.mp4"
        poster="/images/11.jpg"
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={onCanPlay}
      />
      {/* Capa negra para tapar "VEO" en la esquina inferior derecha */}
      <div
        className="absolute bottom-0 right-0 w-64 h-32 bg-black"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        aria-hidden
      />
    </div>
  );
}

function ImageSlide({
  index,
  imageNum,
  isActive,
}: {
  index: number;
  imageNum: number;
  isActive: boolean;
}) {
  const [error, setError] = useState(false);

  // Slide 11: video remes.mp4 (se reproduce solo cuando el slide está activo)
  if (index === VIDEO_SLIDE_INDEX) {
    return <VideoSlide isActive={isActive} />;
  }

  if (error && index === SLIDE_COUNT - 1) {
    return (
      <h2 className="text-4xl md:text-5xl font-bold [font-family:var(--font-display)]">
        Gracias
      </h2>
    );
  }
  return (
    <img
      src={`/images/${imageNum}.jpg`}
      alt=""
      className="w-full h-full max-w-full max-h-full object-contain"
      style={{ objectFit: "contain" }}
      onError={() => setError(true)}
    />
  );
}

function SlideFooter({
  lugar,
  fecha,
}: {
  lugar?: string;
  fecha?: string;
}) {
  if (!lugar && !fecha) return null;
  return (
    <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs opacity-50 font-mono">
      <span>{lugar ?? ""}</span>
      <span>{fecha ?? ""}</span>
    </div>
  );
}

/** Pie de slide para imágenes: fondo oscuro para buen contraste en zonas blancas y negras */
function ImageSlideLayoutBar({
  lugar,
  fecha,
  etiqueta,
  position,
}: {
  lugar?: string;
  fecha?: string;
  etiqueta?: string;
  position: "top" | "bottom";
}) {
  const right = etiqueta ? `${etiqueta}  ${fecha ?? ""}`.trim() : (fecha ?? "");
  if (!lugar && !right) return null;
  const posClass = position === "top" ? "top-0" : "bottom-0";
  return (
    <div
      className={`absolute left-0 right-0 ${posClass} flex justify-between items-center px-8 py-4 text-xs font-mono text-white bg-black/75 backdrop-blur-sm border-white/10 ${
        position === "top" ? "border-b" : "border-t"
      }`}
    >
      <span>{lugar ?? ""}</span>
      <span>{right}</span>
    </div>
  );
}

function SlideContent({
  slide,
  index,
  isActive,
  thankYou,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  thankYou: string;
}) {
  const base = "h-full shrink-0 flex flex-col items-center justify-center px-8 relative";
  const slideWidth = "100vw";

  // A partir del slide 8: imagen con layout como primera slide (lugar/fecha) y contraste
  if (index >= FIRST_IMAGE_SLIDE_INDEX) {
    const imageNum = index + 1;
    const s = slide;
    const lugar = "lugar" in s ? s.lugar : undefined;
    const fecha = "fecha" in s ? s.fecha : undefined;
    const etiqueta = "etiqueta" in s ? s.etiqueta : undefined;
    return (
      <div
        className="h-full shrink-0 relative overflow-hidden flex items-center justify-center min-w-0"
        style={{ width: slideWidth }}
      >
        <ImageSlide index={index} imageNum={imageNum} isActive={isActive} />
        <ImageSlideLayoutBar lugar={lugar} fecha={fecha} etiqueta={etiqueta} position="top" />
        <ImageSlideLayoutBar lugar={lugar} fecha={fecha} etiqueta={etiqueta} position="bottom" />
      </div>
    );
  }

  switch (slide.type) {
    case "portada":
      return (
        <div className={base} style={{ width: slideWidth }}>
          <p className="absolute top-8 left-8 right-8 flex justify-between text-xs font-mono opacity-60">
            <span>{slide.lugar}</span>
            <span>{slide.fecha}</span>
          </p>
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight [font-family:var(--font-display)]">
              {slide.titulo}
            </h1>
            {slide.subtitulo && (
              <p className="mt-8 text-lg md:text-xl opacity-80 [font-family:var(--font-body)]">
                {slide.subtitulo}
              </p>
            )}
            <p className="mt-4 text-sm font-mono opacity-50">BRIEF + NAMING</p>
          </div>
        </div>
      );

    case "texto":
      return (
        <div className={base} style={{ width: slideWidth }}>
          <div className="max-w-2xl mx-auto text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 [font-family:var(--font-display)]">
              {slide.titulo}
            </h2>
            <div className="space-y-5 [font-family:var(--font-body)] opacity-90 leading-relaxed">
              {slide.parrafos.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <SlideFooter lugar={slide.lugar} fecha={slide.fecha} />
        </div>
      );

    case "bullets":
      return (
        <div className={base} style={{ width: slideWidth }}>
          <div className="max-w-xl mx-auto text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 [font-family:var(--font-display)]">
              {slide.titulo}
            </h2>
            <ul className="space-y-4 text-lg [font-family:var(--font-body)] opacity-90">
              {slide.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {slide.parrafo && (
              <p className="mt-8 text-sm md:text-base opacity-80 leading-relaxed [font-family:var(--font-body)]">
                {slide.parrafo}
              </p>
            )}
          </div>
          <SlideFooter lugar={slide.lugar} fecha={slide.fecha} />
        </div>
      );

    case "divisor":
      return (
        <div className={base} style={{ width: slideWidth }}>
          <div className="text-left">
            <p className="text-3xl md:text-4xl tracking-[0.4em] font-bold [font-family:var(--font-display)]">
              {slide.linea}
            </p>
            <p className="mt-6 text-sm font-mono opacity-60">{slide.etiqueta}</p>
          </div>
          <SlideFooter lugar={slide.lugar} fecha={slide.fecha} />
        </div>
      );

    case "logo":
      return (
        <div className={base} style={{ width: slideWidth }}>
          <div className="flex flex-col items-start gap-3 md:gap-4 text-left [font-family:var(--font-display)]">
            {slide.lineas.map((linea, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight"
              >
                {linea}
              </span>
            ))}
          </div>
          {(slide.lugar || slide.fecha) && (
            <SlideFooter lugar={slide.lugar} fecha={slide.fecha} />
          )}
        </div>
      );

    case "gracias":
      return (
        <div className={base} style={{ width: slideWidth }}>
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold [font-family:var(--font-display)]">
              {thankYou}
            </h2>
          </div>
        </div>
      );

    default:
      return <div className={base} style={{ width: slideWidth }} />;
  }
}

export function Presentation() {
  const [current, setCurrent] = useState(0);
  const { lang } = useLang();
  const thankYou = lang === "es" ? "Gracias" : "Thank you";

  const go = useCallback(
    (delta: number) => {
      setCurrent((c) => Math.max(0, Math.min(SLIDE_COUNT - 1, c + delta)));
    },
    []
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) go(1);
      else if (e.deltaY < 0) go(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go]);

  return (
    <div className="relative h-screen w-screen max-w-full overflow-hidden bg-[var(--slide-dark)] text-[var(--slide-dark-fg)]">
      <div className="absolute top-6 right-6 z-30">
        <LangToggle className="lang-toggle lang-toggle-overlay" />
      </div>

      {/* Controles: fondo oscuro para buen contraste en slides negras, blancas o con imagen */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/75 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={current === 0}
          className="p-2 rounded-full text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-mono tabular-nums min-w-16 text-center text-white">
          {current + 1} / {SLIDE_COUNT}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={current === SLIDE_COUNT - 1}
          className="p-2 rounded-full text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots: fondo oscuro para verse en zonas claras y oscuras */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 bg-black/75 backdrop-blur-sm py-3 px-2 rounded-full border border-white/10">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir a diapositiva ${i + 1}`}
          />
        ))}
      </div>

      {/* Slides: un slide = ancho completo de la pantalla (como PDF) */}
      <div
        className="h-full flex transition-transform duration-300 ease-out"
        style={{
          width: `${SLIDE_COUNT * 100}vw`,
          transform: `translateX(-${current * 100}vw)`,
        }}
      >
        {slides.map((slide, index) => (
          <SlideContent
            key={index}
            slide={slide}
            index={index}
            isActive={current === index}
            thankYou={thankYou}
          />
        ))}
      </div>
    </div>
  );
}
