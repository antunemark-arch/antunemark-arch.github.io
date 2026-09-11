"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  House,
  Wrench,
  BriefcaseBusiness,
  Mail,
} from "lucide-react";
import KineticGrid from "@/components/ui/kinetic-grid";

/* =========================================================
   TYPES
========================================================= */

type PageType = "home" | "tools" | "projects" | "contact";

/* =========================================================
   FLOATING TOOL LOGO
========================================================= */

function FloatingTool({
  logo,
  name,
  category,
  delay = "0s",
  duration = "7s",
}: {
  logo: string;
  name: string;
  category: string;
  delay?: string;
  duration?: string;
}) {
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({
    pointerX: 0,
    pointerY: 0,
    x: 0,
    y: 0,
  });

  const handleMouseMove = (
    e: ReactMouseEvent<HTMLDivElement>
  ) => {
    if (isDragging) return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setMagnet({
      x: ((mouseX - centerX) / centerX) * 28,
      y: ((mouseY - centerY) / centerY) * 28,
    });
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setMagnet({ x: 0, y: 0 });
    }
  };

  const handlePointerDown = (
    e: ReactPointerEvent<HTMLDivElement>
  ) => {
    e.currentTarget.setPointerCapture?.(
      e.nativeEvent.pointerId
    );

    dragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      x: drag.x,
      y: drag.y,
    };

    setIsDragging(true);
    setMagnet({ x: 0, y: 0 });
  };

  const handlePointerMove = (
    e: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;

    setDrag({
      x:
        dragStart.current.x +
        e.clientX -
        dragStart.current.pointerX,

      y:
        dragStart.current.y +
        e.clientY -
        dragStart.current.pointerY,
    });
  };

  const handlePointerUp = (
    e: ReactPointerEvent<HTMLDivElement>
  ) => {
    e.currentTarget.releasePointerCapture?.(
      e.nativeEvent.pointerId
    );

    setIsDragging(false);
  };

  const isMagnetic =
    !isDragging &&
    (magnet.x !== 0 || magnet.y !== 0);

  return (
    <div
      className="floating-tool"
      style={{
        animationDelay: delay,
        animationDuration: duration,
      }}
    >
      <div
        className={`
          tool-magnet
          relative
          flex
          flex-col
          items-center
          justify-center
          ${
            isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
          }
        `}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          touchAction: "none",
          transform: `
            translate3d(
              ${drag.x + magnet.x}px,
              ${drag.y + magnet.y}px,
              0
            )
            scale(${isMagnetic ? 1.18 : 1})
          `,
          transition: isDragging
            ? "none"
            : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* MAGNETIC GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-20
            w-20
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#B7FF72]/20
            blur-3xl
            sm:h-24
            sm:w-24
          "
          style={{
            opacity: isMagnetic ? 0.9 : 0,
            transform: `
              translate(-50%, -50%)
              scale(${isMagnetic ? 1.4 : 0.5})
            `,
            transition:
              "opacity 300ms ease, transform 300ms ease",
          }}
        />

        {/* LOGO */}

        <div
          className="
            relative
            z-10
            flex
            h-[76px]
            w-[76px]
            items-center
            justify-center
            sm:h-28
            sm:w-28
            lg:h-32
            lg:w-32
          "
        >
          <Image
            src={logo}
            alt={name}
            width={130}
            height={130}
            draggable={false}
            className="
              h-[58px]
              w-[58px]
              object-contain
              select-none
              transition-all
              duration-500
              sm:h-24
              sm:w-24
              lg:h-28
              lg:w-28
            "
            style={{
              filter: isMagnetic
                ? "drop-shadow(0 0 18px rgba(183,255,114,0.55))"
                : "drop-shadow(0 15px 25px rgba(0,0,0,0.35))",
            }}
          />
        </div>

        {/* LABEL */}

        <div
          className="
            relative
            z-20
            mt-0.5
            text-center
            pointer-events-none
            sm:mt-1
          "
          style={{
            opacity: isMagnetic ? 1 : 0.55,
            transform: `
              translateY(
                ${isMagnetic ? "0px" : "4px"}
              )
            `,
            transition:
              "opacity 300ms ease, transform 300ms ease",
          }}
        >
          <p
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#B7FF72]
              sm:text-[9px]
              sm:tracking-[0.25em]
            "
          >
            {category}
          </p>

          <h3
            className="
              mt-0.5
              text-xs
              font-bold
              text-white
              sm:mt-1
              sm:text-base
            "
          >
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Home() {
  /* =========================================================
     ACTIVE PAGE
  ========================================================= */

  const [activePage, setActivePage] =
    useState<PageType>("home");

  /* =========================================================
     UNIQUE OPENING GALAXY INTRO
  ========================================================= */

  const [introVisible, setIntroVisible] =
    useState(true);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setIntroVisible(false);
    }, 3000);

    return () => {
      clearTimeout(introTimer);
    };
  }, []);

  /* =========================================================
     TYPING ROLES
  ========================================================= */

  const roles = [
    "IT SUPPORT",
    "FULLSTACK DEVELOPER",
    "WEB DESIGNER",
    "AI SPECIALIST",
    "UI/UX INNOVATION",
    "MANUAL TESTING",
    "QUALITY ASSURANCE",
  ];

  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] =
    useState(false);

  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */

  const cursorRef =
    useRef<HTMLDivElement>(null);

  /* =========================================================
     TYPING EFFECT
  ========================================================= */

  useEffect(() => {
    const currentRole = roles[roleIndex];

    let timeout: ReturnType<typeof setTimeout>;

    if (
      !isDeleting &&
      text === currentRole
    ) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1600);
    } else if (
      isDeleting &&
      text === ""
    ) {
      timeout = setTimeout(() => {
        setIsDeleting(false);

        setRoleIndex(
          (previous) =>
            (previous + 1) % roles.length
        );
      }, 400);
    } else {
      timeout = setTimeout(
        () => {
          if (!isDeleting) {
            setText(
              currentRole.substring(
                0,
                text.length + 1
              )
            );
          } else {
            setText(
              currentRole.substring(
                0,
                text.length - 1
              )
            );
          }
        },
        isDeleting ? 45 : 80
      );
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    text,
    isDeleting,
    roleIndex,
  ]);

  /* =========================================================
     CUSTOM CURSOR TRACKING
  ========================================================= */

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!cursorRef.current) {
        return;
      }

      cursorRef.current.style.left =
        `${e.clientX}px`;

      cursorRef.current.style.top =
        `${e.clientY}px`;
    };

    window.addEventListener(
      "mousemove",
      moveCursor,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        moveCursor
      );
    };
  }, []);

  /* =========================================================
     PAGE NAVIGATION
  ========================================================= */

  const changePage = (page: PageType) => {
    setActivePage(page);
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <KineticGrid>
      <main
        id="home"
        className={`
          relative
          flex
          h-[100dvh]
          min-h-[100svh]
          w-full
          flex-col
          overflow-hidden
          bg-transparent
          text-white
          selection:bg-[#B7FF72]
          selection:text-[#18251D]
          ${introVisible ? "intro-loading" : ""}
        `}
      >
        {/* =====================================================
            GLOBAL ANIMATIONS
        ===================================================== */}

        <style>{`
          /* =================================================
             FLOATING TOOLS
          ================================================= */

          @keyframes floatingToolOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }

            25% {
              transform: translate3d(12px, -18px, 0) rotate(2deg);
            }

            50% {
              transform: translate3d(-8px, -30px, 0) rotate(-2deg);
            }

            75% {
              transform: translate3d(-18px, -10px, 0) rotate(1deg);
            }
          }

          @keyframes floatingToolTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }

            25% {
              transform: translate3d(-15px, -12px, 0) rotate(-2deg);
            }

            50% {
              transform: translate3d(10px, -28px, 0) rotate(2deg);
            }

            75% {
              transform: translate3d(18px, -5px, 0) rotate(-1deg);
            }
          }

          @keyframes floatingToolThree {
            0%,
            100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }

            25% {
              transform: translate3d(15px, -25px, 0) rotate(2deg);
            }

            50% {
              transform: translate3d(-12px, -12px, 0) rotate(-2deg);
            }

            75% {
              transform: translate3d(8px, -32px, 0) rotate(1deg);
            }
          }

          .floating-tool {
            will-change: transform;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }

          /* Correct selectors for the actual wrapper structure */

          .tools-galaxy > div:nth-child(1) .floating-tool {
            animation-name: floatingToolOne;
          }

          .tools-galaxy > div:nth-child(2) .floating-tool {
            animation-name: floatingToolTwo;
          }

          .tools-galaxy > div:nth-child(3) .floating-tool {
            animation-name: floatingToolThree;
          }

          .tools-galaxy > div:nth-child(4) .floating-tool {
            animation-name: floatingToolTwo;
          }

          .tools-galaxy > div:nth-child(5) .floating-tool {
            animation-name: floatingToolOne;
          }

          .tools-galaxy > div:nth-child(6) .floating-tool {
            animation-name: floatingToolThree;
          }

          .tools-galaxy > div:nth-child(7) .floating-tool {
            animation-name: floatingToolTwo;
          }

          .tools-galaxy .floating-tool:hover {
            animation-play-state: paused;
          }

          /* =================================================
             CONTACT
          ================================================= */

          @keyframes contactReveal {
            0% {
              opacity: 0;
              transform: translateY(18px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes contactTitle {
            0% {
              opacity: 0;
              transform: translateY(35px) scale(0.94);
              filter: blur(10px);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes contactOrbit {
            from {
              transform:
                translate(-50%, -50%)
                rotate(0deg);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotate(360deg);
            }
          }

          @keyframes contactOrbitReverse {
            from {
              transform:
                translate(-50%, -50%)
                rotate(360deg);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotate(0deg);
            }
          }

          @keyframes contactDot {
            from {
              transform:
                translate(-50%, -50%)
                rotate(0deg)
                translateX(115px);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotate(360deg)
                translateX(115px);
            }
          }

          @keyframes contactDotSmall {
            from {
              transform:
                translate(-50%, -50%)
                rotate(360deg)
                translateX(75px);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotate(0deg)
                translateX(75px);
            }
          }

          @media (min-width: 640px) {
            @keyframes contactDot {
              from {
                transform:
                  translate(-50%, -50%)
                  rotate(0deg)
                  translateX(260px);
              }

              to {
                transform:
                  translate(-50%, -50%)
                  rotate(360deg)
                  translateX(260px);
              }
            }

            @keyframes contactDotSmall {
              from {
                transform:
                  translate(-50%, -50%)
                  rotate(360deg)
                  translateX(180px);
              }

              to {
                transform:
                  translate(-50%, -50%)
                  rotate(0deg)
                  translateX(180px);
              }
            }
          }

          /* =================================================
             CONTACT BUTTON
          ================================================= */

          .contact-email-button {
            isolation: isolate;
          }

          .contact-email-button::before {
            content: "";
            position: absolute;
            inset: 1px;
            border-radius: 9999px;
            pointer-events: none;
            opacity: 0;
            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(183,255,114,0.18),
                transparent
              );
            transform: translateX(-100%);
            transition:
              opacity 300ms ease,
              transform 700ms ease;
          }

          .contact-email-button:hover::before {
            opacity: 1;
            transform: translateX(100%);
          }

          /* =================================================
             MOBILE OPTIMIZATION
          ================================================= */

          @media (max-width: 639px) {
            .floating-tool {
              animation-duration: 9s !important;
            }

            .tools-galaxy .floating-tool:hover {
              animation-play-state: running;
            }
          }

          /* =================================================
             UNIQUE GALAXY OPENING INTRO
          ================================================= */

          .intro-loading > .intro-header,
          .intro-loading > .intro-page-content,
          .intro-loading > .intro-marquee {
            opacity: 0;
            visibility: hidden;
          }

          .intro-page-content,
          .intro-marquee,
          main > header {
            transition:
              opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
              visibility 900ms ease;
          }

          .galaxy-intro {
            position: fixed;
            inset: 0;
            z-index: 99990;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            pointer-events: none;
            background:
              radial-gradient(circle at center, rgba(183,255,114,0.09) 0%, rgba(24,37,29,0.12) 20%, rgba(24,37,29,0.72) 58%, rgba(24,37,29,0.96) 100%);
            animation: galaxyIntroOut 900ms cubic-bezier(0.22, 1, 0.36, 1) 2.15s forwards;
          }

          .galaxy-intro-core {
            position: relative;
            width: min(72vw, 620px);
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: galaxyCoreIn 2.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .galaxy-intro-core::before {
            content: "";
            position: absolute;
            inset: 30%;
            border-radius: 50%;
            background: #B7FF72;
            filter: blur(35px);
            opacity: 0.22;
            animation: galaxyPulse 1.8s ease-in-out infinite;
          }

          .galaxy-intro-core::after {
            content: "";
            position: absolute;
            inset: 42%;
            border-radius: 50%;
            background: #B7FF72;
            box-shadow:
              0 0 25px rgba(183,255,114,0.9),
              0 0 80px rgba(183,255,114,0.45);
            animation: galaxyCorePulse 1.4s ease-in-out infinite;
          }

          .galaxy-orbit {
            position: absolute;
            left: 50%;
            top: 50%;
            border: 1px solid rgba(183,255,114,0.28);
            border-radius: 50%;
            transform: translate(-50%, -50%) rotate(-18deg);
            box-shadow: 0 0 35px rgba(183,255,114,0.06);
          }

          .galaxy-orbit.one {
            width: 55%;
            height: 20%;
            animation: galaxyOrbitOne 5s linear infinite;
          }

          .galaxy-orbit.two {
            width: 75%;
            height: 28%;
            transform: translate(-50%, -50%) rotate(28deg);
            animation: galaxyOrbitTwo 7s linear infinite;
          }

          .galaxy-orbit.three {
            width: 92%;
            height: 38%;
            transform: translate(-50%, -50%) rotate(-38deg);
            border-color: rgba(183,255,114,0.15);
            animation: galaxyOrbitThree 10s linear infinite;
          }

          .galaxy-star {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: #B7FF72;
            box-shadow: 0 0 12px rgba(183,255,114,0.8);
            animation: galaxyStar 2.4s ease-in-out infinite;
          }

          .galaxy-label {
            position: absolute;
            z-index: 10;
            text-align: center;
            animation: galaxyLabel 2.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .galaxy-label small {
            display: block;
            margin-bottom: 8px;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.38em;
            color: rgba(183,255,114,0.7);
          }

          .galaxy-label strong {
            display: block;
            font-family: Georgia, serif;
            font-size: clamp(32px, 7vw, 72px);
            font-weight: 400;
            font-style: italic;
            letter-spacing: -0.05em;
            color: #B7FF72;
            text-shadow:
              0 0 25px rgba(183,255,114,0.35),
              0 0 70px rgba(183,255,114,0.15);
          }

          @keyframes galaxyCoreIn {
            0% { transform: scale(0.12) rotate(-18deg); opacity: 0; filter: blur(18px); }
            28% { opacity: 1; filter: blur(0); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
          }

          @keyframes galaxyPulse {
            0%, 100% { transform: scale(0.7); opacity: 0.15; }
            50% { transform: scale(1.35); opacity: 0.34; }
          }

          @keyframes galaxyCorePulse {
            0%, 100% { transform: scale(0.7); opacity: 0.55; }
            50% { transform: scale(1.3); opacity: 1; }
          }

          @keyframes galaxyOrbitOne {
            from { transform: translate(-50%, -50%) rotate(-18deg); }
            to { transform: translate(-50%, -50%) rotate(342deg); }
          }

          @keyframes galaxyOrbitTwo {
            from { transform: translate(-50%, -50%) rotate(28deg); }
            to { transform: translate(-50%, -50%) rotate(-332deg); }
          }

          @keyframes galaxyOrbitThree {
            from { transform: translate(-50%, -50%) rotate(-38deg); }
            to { transform: translate(-50%, -50%) rotate(322deg); }
          }

          @keyframes galaxyStar {
            0%, 100% { opacity: 0.15; transform: scale(0.6); }
            50% { opacity: 1; transform: scale(1.8); }
          }

          @keyframes galaxyLabel {
            0% { opacity: 0; transform: translateY(18px) scale(0.92); filter: blur(10px); }
            45% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }

          @keyframes galaxyIntroOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.08); visibility: hidden; }
          }

          @media (max-width: 639px) {
            .galaxy-intro-core {
              width: 125vw;
              max-width: none;
            }

            .galaxy-orbit.one { width: 46%; height: 18%; }
            .galaxy-orbit.two { width: 66%; height: 25%; }
            .galaxy-orbit.three { width: 84%; height: 33%; }

            .galaxy-label small {
              font-size: 7px;
              letter-spacing: 0.28em;
            }

            .galaxy-label strong {
              font-size: clamp(30px, 11vw, 52px);
            }
          }

          /* =================================================
             REDUCED MOTION
          ================================================= */

          @media (prefers-reduced-motion: reduce) {
            .floating-tool,
            .animate-pulse,
            .animate-ping,
            .contact-email-button {
              animation: none !important;
              transition: none !important;
            }
          }

          /* =================================================
             TOUCH DEVICES
          ================================================= */

          @media (hover: none) and (pointer: coarse) {
            .custom-cursor {
              display: none !important;
            }
          }
        `}</style>

        {introVisible && (
          <div className="galaxy-intro" aria-hidden="true">
            <div className="galaxy-intro-core">
              <div className="galaxy-orbit one" />
              <div className="galaxy-orbit two" />
              <div className="galaxy-orbit three" />

              <span className="galaxy-star" style={{ left: "18%", top: "28%", animationDelay: "0s" }} />
              <span className="galaxy-star" style={{ left: "76%", top: "31%", animationDelay: "0.5s" }} />
              <span className="galaxy-star" style={{ left: "24%", top: "72%", animationDelay: "0.9s" }} />
              <span className="galaxy-star" style={{ left: "79%", top: "68%", animationDelay: "1.3s" }} />
              <span className="galaxy-star" style={{ left: "50%", top: "13%", animationDelay: "0.7s" }} />

              <div className="galaxy-label">
                <small>INITIALIZING EXPERIENCE</small>
                <strong>portfolio</strong>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header
          className="intro-header
            relative
            z-40
            w-full
            shrink-0
            px-4
            pt-3
            sm:px-6
            sm:pt-5
            md:px-10
            lg:px-14
          "
        >
          <div
            className="
              relative
              flex
              min-h-[46px]
              items-center
              justify-between
              sm:min-h-[54px]
            "
          >
            {/* LOGO */}

            <button
              type="button"
              onClick={() =>
                changePage("home")
              }
              className="
                group
                flex
                cursor-pointer
                items-center
                gap-1.5
                sm:gap-3
              "
            >
              <div
                className="
                  text-2xl
                  font-light
                  leading-none
                  text-[#B7FF72]
                  transition-transform
                  duration-300
                  group-hover:rotate-6
                  group-hover:scale-110
                  sm:text-4xl
                "
              >
                ✦
              </div>

              <span
                className="
                  text-xl
                  font-semibold
                  italic
                  tracking-tight
                  text-[#B7FF72]
                  font-serif
                  sm:text-3xl
                "
              >
                portfolio
              </span>
            </button>

            {/* DESKTOP NAV */}

            <nav
              className="
                hidden
                items-center
                gap-1
                rounded-full
                border
                border-white/20
                bg-[#26352C]/80
                p-1.5
                shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                backdrop-blur-xl
                md:flex
              "
            >
              {/* HOME */}

              <button
                type="button"
                onClick={() =>
                  changePage("home")
                }
                data-tooltip="HOME"
                className={`
                  group
                  tooltip-water
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  lg:px-5
                  ${
                    activePage === "home"
                      ? "bg-[#B7FF72] text-[#18251D]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="water-icon">
                  <House
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />
                </span>

                <span>Home</span>
              </button>

              {/* TOOLS */}

              <button
                type="button"
                onClick={() =>
                  changePage("tools")
                }
                data-tooltip="TOOLS I USE"
                className={`
                  group
                  tooltip-water
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  lg:px-5
                  ${
                    activePage === "tools"
                      ? "bg-[#B7FF72] text-[#18251D]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="water-icon">
                  <Wrench
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />
                </span>

                <span>Tools</span>
              </button>

              {/* PROJECTS */}

              <button
                type="button"
                onClick={() =>
                  changePage("projects")
                }
                data-tooltip="MY PROJECTS"
                className={`
                  group
                  tooltip-water
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  lg:px-5
                  ${
                    activePage === "projects"
                      ? "bg-[#B7FF72] text-[#18251D]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="water-icon">
                  <BriefcaseBusiness
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />
                </span>

                <span>Projects</span>
              </button>

              {/* CONTACT */}

              <button
                type="button"
                onClick={() =>
                  changePage("contact")
                }
                data-tooltip="CONTACT ME"
                className={`
                  group
                  tooltip-water
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  lg:px-5
                  ${
                    activePage === "contact"
                      ? "bg-[#B7FF72] text-[#18251D]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="water-icon">
                  <Mail
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />
                </span>

                <span>Contact</span>
              </button>
            </nav>

            {/* SIGNATURE */}

            <div className="hidden sm:block">
              <span
                className="
                  text-xl
                  font-semibold
                  italic
                  tracking-wide
                  text-white
                  font-serif
                  lg:text-2xl
                "
              >
                Anthony Mark
              </span>
            </div>
          </div>
        </header>

        {/* =====================================================
            MOBILE NAV
        ===================================================== */}

        <div
          className="
            relative
            z-40
            mt-2
            flex
            w-full
            shrink-0
            justify-center
            px-2
            sm:mt-4
            md:hidden
          "
        >
          <nav
            className="
              flex
              max-w-full
              items-center
              gap-0.5
              rounded-full
              border
              border-[#B7FF72]/20
              bg-[#18251D]/90
              p-1
              shadow-[0_8px_30px_rgba(0,0,0,0.3)]
              backdrop-blur-xl
              sm:gap-1
              sm:p-1.5
            "
          >
            {/* MOBILE HOME */}

            <button
              type="button"
              onClick={() =>
                changePage("home")
              }
              data-tooltip="HOME"
              className={`
                group
                tooltip-water
                flex
                min-w-0
                flex-1
                cursor-pointer
                items-center
                justify-center
                rounded-full
                px-2
                py-2
                text-[10px]
                font-bold
                transition-all
                duration-300
                sm:px-3
                sm:text-xs
                ${
                  activePage === "home"
                    ? "bg-[#B7FF72] text-[#18251D]"
                    : "text-white/65 hover:text-[#B7FF72]"
                }
              `}
            >
              <span className="water-icon water-icon-mobile">
                <House
                  size={14}
                  strokeWidth={1.9}
                  className="water-icon-symbol sm:h-4 sm:w-4"
                />
              </span>

              <span className="ml-1">
                Home
              </span>
            </button>

            {/* MOBILE TOOLS */}

            <button
              type="button"
              onClick={() =>
                changePage("tools")
              }
              data-tooltip="TOOLS I USE"
              className={`
                group
                tooltip-water
                flex
                min-w-0
                flex-1
                cursor-pointer
                items-center
                justify-center
                rounded-full
                px-2
                py-2
                text-[10px]
                font-medium
                transition-all
                duration-300
                sm:px-3
                sm:text-xs
                ${
                  activePage === "tools"
                    ? "bg-[#B7FF72] text-[#18251D]"
                    : "text-white/65 hover:text-[#B7FF72]"
                }
              `}
            >
              <span className="water-icon water-icon-mobile">
                <Wrench
                  size={14}
                  strokeWidth={1.9}
                  className="water-icon-symbol sm:h-4 sm:w-4"
                />
              </span>

              <span className="ml-1">
                Tools
              </span>
            </button>

            {/* MOBILE PROJECTS */}

            <button
              type="button"
              onClick={() =>
                changePage("projects")
              }
              data-tooltip="MY PROJECTS"
              className={`
                group
                tooltip-water
                flex
                min-w-0
                flex-1
                cursor-pointer
                items-center
                justify-center
                rounded-full
                px-2
                py-2
                text-[10px]
                font-medium
                transition-all
                duration-300
                sm:px-3
                sm:text-xs
                ${
                  activePage === "projects"
                    ? "bg-[#B7FF72] text-[#18251D]"
                    : "text-white/65 hover:text-[#B7FF72]"
                }
              `}
            >
              <span className="water-icon water-icon-mobile">
                <BriefcaseBusiness
                  size={14}
                  strokeWidth={1.9}
                  className="water-icon-symbol sm:h-4 sm:w-4"
                />
              </span>

              <span className="ml-1">
                Projects
              </span>
            </button>

            {/* MOBILE CONTACT */}

            <button
              type="button"
              onClick={() =>
                changePage("contact")
              }
              data-tooltip="CONTACT ME"
              className={`
                group
                tooltip-water
                flex
                min-w-0
                flex-1
                cursor-pointer
                items-center
                justify-center
                rounded-full
                px-2
                py-2
                text-[10px]
                font-medium
                transition-all
                duration-300
                sm:px-3
                sm:text-xs
                ${
                  activePage === "contact"
                    ? "bg-[#B7FF72] text-[#18251D]"
                    : "text-white/65 hover:text-[#B7FF72]"
                }
              `}
            >
              <span className="water-icon water-icon-mobile">
                <Mail
                  size={14}
                  strokeWidth={1.9}
                  className="water-icon-symbol sm:h-4 sm:w-4"
                />
              </span>

              <span className="ml-1">
                Contact
              </span>
            </button>
          </nav>
        </div>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <div
          className="
            intro-page-content
            relative
            z-10
            min-h-0
            flex-1
          "
        >
          {/* ===================================================
              HOME
          =================================================== */}

          {activePage === "home" && (
            <section
              className="
                relative
                mx-auto
                flex
                h-full
                w-full
                max-w-[1550px]
                items-center
                overflow-hidden
                px-4
                sm:px-8
                md:px-10
                lg:px-14
              "
            >
              {/* =================================================
                  DESKTOP GRID
              ================================================= */}

              <div
                className="
                  hidden
                  w-full
                  grid-cols-12
                  items-center
                  gap-3
                  lg:grid
                  lg:gap-5
                "
              >
                {/* LEFT STATS */}

                <div
                  className="
                    relative
                    z-20
                    col-span-2
                    flex
                    flex-col
                    justify-center
                    space-y-8
                    text-left
                  "
                >
                  {/* 1+ */}

                  <div
                    className="
                      min-w-[110px]
                      border-t
                      border-white/15
                      pt-5
                    "
                  >
                    <h2
                      className="
                        text-4xl
                        font-black
                        leading-none
                        text-[#B7FF72]
                        xl:text-5xl
                      "
                    >
                      1+
                    </h2>

                    <p
                      className="
                        mt-2
                        text-[10px]
                        uppercase
                        leading-relaxed
                        tracking-[0.16em]
                        text-white/55
                      "
                    >
                      Years Experience
                    </p>
                  </div>

                  {/* 5+ */}

                  <div
                    className="
                      min-w-[110px]
                      border-t
                      border-white/15
                      pt-5
                    "
                  >
                    <h2
                      className="
                        text-4xl
                        font-black
                        leading-none
                        text-[#B7FF72]
                        xl:text-5xl
                      "
                    >
                      5+
                    </h2>

                    <p
                      className="
                        mt-2
                        text-[10px]
                        uppercase
                        leading-relaxed
                        tracking-[0.16em]
                        text-white/55
                      "
                    >
                      Projects Done
                    </p>
                  </div>

                  {/* 100% */}

                  <div
                    className="
                      min-w-[110px]
                      border-t
                      border-white/15
                      pt-5
                    "
                  >
                    <h2
                      className="
                        text-4xl
                        font-black
                        leading-none
                        text-[#B7FF72]
                        xl:text-5xl
                      "
                    >
                      100%
                    </h2>

                    <p
                      className="
                        mt-2
                        text-[10px]
                        uppercase
                        leading-relaxed
                        tracking-[0.16em]
                        text-white/55
                      "
                    >
                      Creative Drive
                    </p>
                  </div>
                </div>

                {/* DESKTOP CENTER */}

                <div
                  className="
                    relative
                    z-10
                    col-span-7
                    h-[min(66vh,620px)]
                    min-h-[470px]
                  "
                >
                  {/* ROLE */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-[32%]
                      z-0
                      flex
                      w-[135%]
                      -translate-x-1/2
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        text-7xl
                        font-thin
                        leading-none
                        text-[#B7FF72]
                        opacity-70
                        xl:text-[100px]
                      "
                    >
                      |
                    </span>

                    <div
                      className="
                        relative
                        flex
                        min-w-0
                        items-center
                        justify-center
                      "
                    >
                      <span
                        className="
                          absolute
                          inset-0
                          whitespace-nowrap
                          text-[48px]
                          font-black
                          uppercase
                          tracking-[-0.055em]
                          text-[#B7FF72]/10
                          blur-[4px]
                          xl:text-[78px]
                        "
                      >
                        {text}
                      </span>

                      <span
                        className="
                          relative
                          whitespace-nowrap
                          text-[48px]
                          font-black
                          uppercase
                          leading-none
                          tracking-[-0.055em]
                          text-transparent
                          xl:text-[78px]
                        "
                        style={{
                          WebkitTextStroke:
                            "2px #B7FF72",
                        }}
                      >
                        {text}
                      </span>

                      <span
                        className="
                          typing-caret
                          ml-2
                          text-[48px]
                          font-light
                          leading-none
                          text-[#B7FF72]
                          xl:text-[78px]
                        "
                      >
                        |
                      </span>
                    </div>

                    <span
                      className="
                        text-7xl
                        font-thin
                        leading-none
                        text-[#B7FF72]
                        opacity-70
                        xl:text-[100px]
                      "
                    >
                      |
                    </span>
                  </div>

                  {/* AVATAR */}

                  <div
                    className="
                      absolute
                      bottom-[3%]
                      left-1/2
                      z-10
                      w-[300px]
                      -translate-x-1/2
                      sm:w-[360px]
                      lg:w-[430px]
                      xl:w-[500px]
                    "
                  >
                    <Image
                      src="/avatars.png"
                      alt="Anthony Mark 3D Avatar"
                      width={600}
                      height={600}
                      priority
                      className="
                        h-auto
                        w-full
                        object-contain
                        drop-shadow-[0_30px_35px_rgba(0,0,0,0.65)]
                      "
                    />
                  </div>
                </div>

                {/* RIGHT INTRO */}

                <div
                  className="
                    relative
                    z-20
                    col-span-3
                    flex
                    flex-col
                    items-end
                    justify-center
                    gap-5
                    text-right
                  "
                >
                  <p
                    className="
                      max-w-[310px]
                      text-sm
                      leading-[1.75]
                      text-white/70
                    "
                  >
                    Hi, I&apos;m{" "}
                    <span className="font-semibold text-[#B7FF72]">
                      Anthony Mark
                    </span>
                    . I build AI-powered automation
                    systems that connect tools,
                    streamline workflows, and turn
                    repetitive tasks into smart,
                    efficient processes.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      changePage("contact")
                    }
                    className="
                      group
                      tooltip-water
                      mt-1
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-full
                      border
                      border-[#B7FF72]/50
                      px-6
                      py-3
                      text-sm
                      font-bold
                      tracking-[0.12em]
                      text-[#B7FF72]
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:border-[#B7FF72]
                      hover:bg-[#B7FF72]
                      hover:text-[#18251D]
                      hover:shadow-[0_0_30px_rgba(183,255,114,0.30)]
                    "
                  >
                    GET IN TOUCH

                    <span
                      className="
                        text-lg
                        transition-all
                        duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                        group-hover:scale-125
                      "
                    >
                      ↗
                    </span>
                  </button>
                </div>
              </div>

              {/* =================================================
    MOBILE / TABLET HOME
================================================= */}

<div
  className="
    relative
    h-full
    w-full
    lg:hidden
  "
>
  {/* =================================================
      ROLE
  ================================================= */}

  <div
    className="
      absolute
      left-1/2
      top-[9%]
      z-20
      flex
      w-full
      -translate-x-1/2
      items-center
      justify-center
      px-3

      min-[360px]:top-[10%]
      min-[380px]:top-[11%]

      sm:top-[12%]

      md:top-[13%]
    "
  >
    <div
      className="
        relative
        max-w-[95vw]
        overflow-hidden
        text-center
      "
    >
      {/* ROLE GLOW */}

      <span
        className="
          absolute
          inset-0
          whitespace-nowrap
          text-[clamp(20px,7vw,48px)]
          font-black
          uppercase
          tracking-[-0.055em]
          text-[#B7FF72]/10
          blur-[4px]
        "
      >
        {text}
      </span>

      {/* ROLE TEXT */}

      <span
        className="
          relative
          whitespace-nowrap
          text-[clamp(20px,7vw,48px)]
          font-black
          uppercase
          leading-none
          tracking-[-0.055em]
          text-transparent
        "
        style={{
          WebkitTextStroke: "1.5px #B7FF72",
        }}
      >
        {text}
      </span>

      {/* TYPING CURSOR */}

      <span
        className="
          typing-caret
          ml-1
          text-[clamp(20px,7vw,48px)]
          font-light
          leading-none
          text-[#B7FF72]
        "
      >
        |
      </span>
    </div>
  </div>

  {/* =================================================
      AVATAR
  ================================================= */}

  <div
    className="
      absolute
      bottom-[19%]
      left-1/2
      z-10
      w-[175px]
      -translate-x-1/2

      min-[360px]:w-[195px]

      min-[380px]:bottom-[18%]
      min-[380px]:w-[215px]

      sm:bottom-[17%]
      sm:w-[285px]

      md:bottom-[16%]
      md:w-[340px]
    "
  >
    <Image
      src="/avatars.png"
      alt="Anthony Mark 3D Avatar"
      width={600}
      height={600}
      priority
      className="
        h-auto
        w-full
        object-contain
        drop-shadow-[0_22px_28px_rgba(0,0,0,0.65)]
      "
    />
  </div>

  {/* =================================================
      INTRO
  ================================================= */}

  <div
    className="
      absolute
      left-1/2
      top-[53%]
      z-20
      w-[90%]
      -translate-x-1/2
      text-center

      min-[360px]:top-[52%]

      min-[380px]:w-[88%]

      sm:top-[54%]
      sm:w-[76%]

      md:top-[55%]
      md:w-[65%]
    "
  >
    <p
      className="
        mx-auto
        max-w-md
        text-[10px]
        leading-[1.6]
        text-white/65

        min-[360px]:text-[10.5px]

        min-[380px]:text-[11px]
        min-[380px]:leading-[1.7]

        sm:text-xs
        sm:leading-6

        md:text-sm
      "
    >
      Hi, I&apos;m{" "}
      <span className="font-semibold text-[#B7FF72]">
        Anthony Mark
      </span>
      . I build AI-powered automation
      systems and practical digital
      solutions.
    </p>

    <button
      type="button"
      onClick={() => changePage("contact")}
      className="
        group
        mt-3
        inline-flex
        cursor-pointer
        items-center
        gap-2
        rounded-full
        border
        border-[#B7FF72]/50
        px-4
        py-2.5
        text-[9px]
        font-bold
        tracking-[0.12em]
        text-[#B7FF72]
        transition-all
        duration-300
        active:scale-95

        min-[380px]:px-5
        min-[380px]:py-2.5

        sm:px-5
        sm:py-3
        sm:text-[10px]

        md:px-6
        md:text-[11px]
      "
    >
      GET IN TOUCH

      <span
        className="
          text-sm
          transition-transform
          duration-300
          group-hover:-translate-y-1
          group-hover:translate-x-1

          sm:text-base
        "
      >
        ↗
      </span>
    </button>
  </div>

  {/* =================================================
      MOBILE STATS
  ================================================= */}

  <div
    className="
      absolute
      bottom-[3%]
      left-1/2
      z-20
      flex
      w-[92%]
      -translate-x-1/2
      items-start
      justify-center
      gap-2

      min-[380px]:w-[90%]
      min-[380px]:gap-3

      sm:w-[88%]
      sm:gap-5

      md:w-[82%]
      md:gap-6
    "
  >
    {/* 1+ */}

    <div
      className="
        flex-1
        border-t
        border-white/15
        pt-2
        text-center

        min-[380px]:pt-2.5

        sm:pt-3
      "
    >
      <h2
        className="
          text-lg
          font-black
          leading-none
          text-[#B7FF72]

          min-[360px]:text-xl
          min-[380px]:text-2xl

          sm:text-3xl
          md:text-4xl
        "
      >
        1+
      </h2>

      <p
        className="
          mt-1
          text-[5.5px]
          uppercase
          tracking-[0.10em]
          text-white/45

          min-[380px]:text-[6px]

          sm:text-[8px]
          md:text-[9px]
        "
      >
        Experience
      </p>
    </div>

    {/* 5+ */}

    <div
      className="
        flex-1
        border-t
        border-white/15
        pt-2
        text-center

        min-[380px]:pt-2.5

        sm:pt-3
      "
    >
      <h2
        className="
          text-lg
          font-black
          leading-none
          text-[#B7FF72]

          min-[360px]:text-xl
          min-[380px]:text-2xl

          sm:text-3xl
          md:text-4xl
        "
      >
        5+
      </h2>

      <p
        className="
          mt-1
          text-[5.5px]
          uppercase
          tracking-[0.10em]
          text-white/45

          min-[380px]:text-[6px]

          sm:text-[8px]
          md:text-[9px]
        "
      >
        Projects
      </p>
    </div>

    {/* 100% */}

    <div
      className="
        flex-1
        border-t
        border-white/15
        pt-2
        text-center

        min-[380px]:pt-2.5

        sm:pt-3
      "
    >
      <h2
        className="
          text-lg
          font-black
          leading-none
          text-[#B7FF72]

          min-[360px]:text-xl
          min-[380px]:text-2xl

          sm:text-3xl
          md:text-4xl
        "
      >
        100%
      </h2>

      <p
        className="
          mt-1
          text-[5.5px]
          uppercase
          tracking-[0.10em]
          text-white/45

          min-[380px]:text-[6px]

          sm:text-[8px]
          md:text-[9px]
        "
      >
        Drive
      </p>
    </div>
  </div>
</div>
            </section>
          )}

          {/* ===================================================
              TOOLS
          =================================================== */}

          {activePage === "tools" && (
            <section
              className="
                relative
                h-full
                w-full
                overflow-hidden
              "
            >
              {/* BACKGROUND */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  overflow-hidden
                "
              >
                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[220px]
                    w-[220px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[#B7FF72]/[0.035]
                    blur-[80px]
                    sm:h-[400px]
                    sm:w-[400px]
                    sm:blur-[90px]
                  "
                />

                {/* Stars */}

                <span className="absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-[#B7FF72]/50 shadow-[0_0_12px_rgba(183,255,114,0.5)]" />

                <span className="absolute left-[25%] top-[70%] h-1 w-1 rounded-full bg-white/30 sm:h-1.5 sm:w-1.5" />

                <span className="absolute right-[14%] top-[24%] h-1 w-1 rounded-full bg-[#B7FF72]/40 shadow-[0_0_12px_rgba(183,255,114,0.4)]" />

                <span className="absolute right-[25%] bottom-[20%] h-1 w-1 rounded-full bg-white/20 sm:h-1.5 sm:w-1.5" />

                <span className="absolute left-[48%] top-[16%] h-1 w-1 rounded-full bg-white/25" />

                <span className="absolute left-[72%] top-[64%] h-1 w-1 rounded-full bg-[#B7FF72]/30 shadow-[0_0_10px_rgba(183,255,114,0.35)]" />

                <span className="absolute left-[8%] bottom-[24%] h-1 w-1 rounded-full bg-white/20" />
              </div>

              {/* FLOATING LOGOS */}

              <div
                className="
                  tools-galaxy
                  absolute
                  inset-0
                  z-10
                  h-full
                  w-full
                "
              >
                {/* N8N */}

                <div
                  className="
                    absolute
                    left-[5%]
                    top-[15%]
                    sm:left-[10%]
                    sm:top-[18%]
                    lg:left-[14%]
                    lg:top-[20%]
                  "
                >
                  <FloatingTool
                    logo="/tools/n8n.avif"
                    name="n8n"
                    category="Automation"
                    delay="0s"
                    duration="7s"
                  />
                </div>

                {/* VS CODE */}

                <div
                  className="
                    absolute
                    right-[5%]
                    top-[13%]
                    sm:right-[10%]
                    sm:top-[16%]
                    lg:right-[16%]
                    lg:top-[17%]
                  "
                >
                  <FloatingTool
                    logo="/tools/vscodes.png"
                    name="VS Code"
                    category="Development"
                    delay="-1.8s"
                    duration="8s"
                  />
                </div>

                {/* SLACK */}

                <div
                  className="
                    absolute
                    bottom-[58%]
                    left-[27%]
                    sm:left-[32%]
                    sm:bottom-[17%]
                    lg:left-[34%]
                    lg:bottom-[58%]
                  "
                >
                  <FloatingTool
                    logo="/tools/slacks.png"
                    name="Slack"
                    category="Communication"
                    delay="-3.5s"
                    duration="7.5s"
                  />
                </div>

                {/* NOTION */}

                <div
                  className="
                    absolute
                    bottom-[19%]
                    right-[7%]
                    sm:right-[22%]
                    sm:bottom-[15%]
                    lg:right-[30%]
                    lg:bottom-[15%]
                  "
                >
                  <FloatingTool
                    logo="/tools/notions.png"
                    name="Notion"
                    category="Organization"
                    delay="-5s"
                    duration="8.5s"
                  />
                </div>

                {/* GOOGLE */}

                <div
                  className="
                    absolute
                    left-[50%]
                    top-[38%]
                    -translate-x-1/2
                    sm:left-[38%]
                    sm:top-[47%]
                    lg:left-[50%]
                    lg:top-[45%]
                  "
                >
                  <FloatingTool
                    logo="/tools/google.png"
                    name="Google"
                    category="Productivity / AI"
                    delay="-5s"
                    duration="8.5s"
                  />
                </div>

                {/* DISCORD */}

                <div
                  className="
                    absolute
                    bottom-[7%]
                    left-[3%]
                    sm:left-[8%]
                    sm:bottom-[7%]
                    lg:right-[30%]
                    lg:left-auto
                    lg:bottom-[58%]
                  "
                >
                  <FloatingTool
                    logo="/tools/discord.png"
                    name="Discord"
                    category="Communication"
                    delay="-2s"
                    duration="8.5s"
                  />
                </div>

                {/* AIRTABLE */}

                <div
                  className="
                    absolute
                    right-[4%]
                    top-[45%]
                    sm:right-[8%]
                    sm:top-[48%]
                    lg:left-[30%]
                    lg:right-auto
                    lg:top-[54%]
                  "
                >
                  <FloatingTool
                    logo="/tools/airtable.png"
                    name="Airtable"
                    category="Database"
                    delay="-4s"
                    duration="8.5s"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ===================================================
              PROJECTS
          =================================================== */}

          {activePage === "projects" && (
            <section
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                overflow-hidden
                px-4
                sm:px-8
                lg:px-12
              "
            >
              <div
                className="
                  w-full
                  max-w-6xl
                "
              >
                {/* HEADER */}

                <div
                  className="
                    mb-3
                    sm:mb-5
                    lg:mb-7
                  "
                >
                  <p
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.3em]
                      text-[#B7FF72]
                      sm:text-[10px]
                      sm:tracking-[0.35em]
                      md:text-xs
                    "
                  >
                    Selected Work / AI & Automation
                  </p>

                  <p
                    className="
                      mt-1.5
                      max-w-2xl
                      text-[9px]
                      leading-4
                      text-white/40
                      sm:mt-2
                      sm:text-xs
                      sm:leading-5
                      md:text-sm
                      md:leading-6
                    "
                  >
                    Intelligent workflows, full-stack
                    applications, and practical digital
                    solutions.
                  </p>
                </div>

                {/* PROJECT GRID */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2
                    sm:gap-3
                    md:gap-4
                  "
                >
                  {/* FB AI AGENT */}

                  <a
                    href="#"
                    onClick={(e) =>
                      e.preventDefault()
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-[#B7FF72]/20
                      bg-[#B7FF72]/[0.055]
                      p-3
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#B7FF72]/50
                      hover:bg-[#B7FF72]/[0.09]
                      sm:rounded-2xl
                      sm:p-5
                      md:p-6
                    "
                  >
                    <div
                      className="
                        absolute
                        right-0
                        top-0
                        h-16
                        w-16
                        rounded-full
                        bg-[#B7FF72]/10
                        blur-2xl
                        transition-all
                        duration-500
                        group-hover:bg-[#B7FF72]/20
                        sm:h-24
                        sm:w-24
                        sm:blur-3xl
                      "
                    />

                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-2
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[6px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-[#B7FF72]
                            sm:text-[8px]
                            sm:tracking-[0.2em]
                            md:text-[9px]
                          "
                        >
                          01 / AI Automation
                        </p>

                        <h3
                          className="
                            mt-1
                            text-sm
                            font-bold
                            leading-tight
                            text-white
                            sm:mt-2
                            sm:text-lg
                            md:text-2xl
                          "
                        >
                          FB AI Agent using n8n
                        </h3>
                      </div>

                      <span
                        className="
                          shrink-0
                          text-sm
                          text-[#B7FF72]
                          transition-transform
                          duration-300
                          group-hover:-translate-y-1
                          group-hover:translate-x-1
                          sm:text-lg
                        "
                      >
                        ↗
                      </span>
                    </div>

                    <p
                      className="
                        relative
                        z-10
                        mt-2
                        hidden
                        text-xs
                        leading-5
                        text-white/50
                        sm:block
                        md:mt-3
                        md:text-sm
                        md:leading-6
                      "
                    >
                      An AI-powered Facebook automation
                      workflow connecting messages, AI
                      processing, APIs, and automated
                      responses.
                    </p>

                    <div
                      className="
                        relative
                        z-10
                        mt-3
                        flex
                        flex-wrap
                        gap-1
                        sm:mt-4
                        sm:gap-2
                      "
                    >
                      {[
                        "n8n",
                        "AI",
                        "Facebook",
                        "Webhooks",
                        "APIs",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            px-1.5
                            py-0.5
                            text-[6px]
                            font-medium
                            text-white/55
                            sm:px-2.5
                            sm:py-1
                            sm:text-[8px]
                            md:text-[9px]
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>

                  {/* BARANGAY */}

                  <a
                    href="https://barangay.42web.io/index.php?i=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-3
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#B7FF72]/40
                      hover:bg-white/[0.055]
                      sm:rounded-2xl
                      sm:p-5
                      md:p-6
                    "
                  >
                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-2
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[6px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-[#B7FF72]/75
                            sm:text-[8px]
                            sm:tracking-[0.2em]
                            md:text-[9px]
                          "
                        >
                          02 / Full-Stack System
                        </p>

                        <h3
                          className="
                            mt-1
                            text-sm
                            font-bold
                            leading-tight
                            text-white
                            sm:mt-2
                            sm:text-lg
                            md:text-2xl
                          "
                        >
                          Barangay Suclaban Portal
                        </h3>
                      </div>

                      <span
                        className="
                          shrink-0
                          text-sm
                          text-white/30
                          transition-all
                          duration-300
                          group-hover:-translate-y-1
                          group-hover:translate-x-1
                          group-hover:text-[#B7FF72]
                          sm:text-lg
                        "
                      >
                        ↗
                      </span>
                    </div>

                    <p
                      className="
                        relative
                        z-10
                        mt-2
                        hidden
                        text-xs
                        leading-5
                        text-white/50
                        sm:block
                        md:mt-3
                        md:text-sm
                        md:leading-6
                      "
                    >
                      A digital barangay management
                      platform for resident services,
                      certificates, digital IDs, facility
                      reservations, and workflows.
                    </p>

                    <div
                      className="
                        relative
                        z-10
                        mt-3
                        flex
                        flex-wrap
                        gap-1
                        sm:mt-4
                        sm:gap-2
                      "
                    >
                      {[
                        "PHP",
                        "MySQL",
                        "JavaScript",
                        "QR Code",
                        "AdminLTE",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            px-1.5
                            py-0.5
                            text-[6px]
                            font-medium
                            text-white/55
                            sm:px-2.5
                            sm:py-1
                            sm:text-[8px]
                            md:text-[9px]
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>

                  {/* PICKLEBALL */}

                  <a
                    href="https://gccpickleball.rf.gd/?i=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-3
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#B7FF72]/40
                      hover:bg-white/[0.055]
                      sm:rounded-2xl
                      sm:p-5
                      md:p-6
                    "
                  >
                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-2
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[6px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-[#B7FF72]/75
                            sm:text-[8px]
                            sm:tracking-[0.2em]
                            md:text-[9px]
                          "
                        >
                          03 / Booking Platform
                        </p>

                        <h3
                          className="
                            mt-1
                            text-sm
                            font-bold
                            leading-tight
                            text-white
                            sm:mt-2
                            sm:text-lg
                            md:text-2xl
                          "
                        >
                          GCC Pickleball Reservation
                        </h3>
                      </div>

                      <span
                        className="
                          shrink-0
                          text-sm
                          text-white/30
                          transition-all
                          duration-300
                          group-hover:-translate-y-1
                          group-hover:translate-x-1
                          group-hover:text-[#B7FF72]
                          sm:text-lg
                        "
                      >
                        ↗
                      </span>
                    </div>

                    <p
                      className="
                        relative
                        z-10
                        mt-2
                        hidden
                        text-xs
                        leading-5
                        text-white/50
                        sm:block
                        md:mt-3
                        md:text-sm
                        md:leading-6
                      "
                    >
                      A court reservation system for
                      schedules, bookings, availability,
                      payment-proof workflows, and
                      administration.
                    </p>

                    <div
                      className="
                        relative
                        z-10
                        mt-3
                        flex
                        flex-wrap
                        gap-1
                        sm:mt-4
                        sm:gap-2
                      "
                    >
                      {[
                        "PHP",
                        "MySQL",
                        "JavaScript",
                        "Admin Dashboard",
                        "Booking",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            px-1.5
                            py-0.5
                            text-[6px]
                            font-medium
                            text-white/55
                            sm:px-2.5
                            sm:py-1
                            sm:text-[8px]
                            md:text-[9px]
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>

                  {/* BIA-YA */}

                  <a
                    href="https://biayapanaderia.lovestoblog.com/?i=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-3
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#B7FF72]/40
                      hover:bg-white/[0.055]
                      sm:rounded-2xl
                      sm:p-5
                      md:p-6
                    "
                  >
                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-2
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[6px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-[#B7FF72]/75
                            sm:text-[8px]
                            sm:tracking-[0.2em]
                            md:text-[9px]
                          "
                        >
                          04 / Business Website
                        </p>

                        <h3
                          className="
                            mt-1
                            text-sm
                            font-bold
                            leading-tight
                            text-white
                            sm:mt-2
                            sm:text-lg
                            md:text-2xl
                          "
                        >
                          BIA-YA Panaderia
                        </h3>
                      </div>

                      <span
                        className="
                          shrink-0
                          text-sm
                          text-white/30
                          transition-all
                          duration-300
                          group-hover:-translate-y-1
                          group-hover:translate-x-1
                          group-hover:text-[#B7FF72]
                          sm:text-lg
                        "
                      >
                        ↗
                      </span>
                    </div>

                    <p
                      className="
                        relative
                        z-10
                        mt-2
                        hidden
                        text-xs
                        leading-5
                        text-white/50
                        sm:block
                        md:mt-3
                        md:text-sm
                        md:leading-6
                      "
                    >
                      A modern bakery website designed
                      to showcase products, brand identity,
                      customer reviews, and online ordering.
                    </p>

                    <div
                      className="
                        relative
                        z-10
                        mt-3
                        flex
                        flex-wrap
                        gap-1
                        sm:mt-4
                        sm:gap-2
                      "
                    >
                      {[
                        "HTML",
                        "CSS",
                        "JavaScript",
                        "Responsive UI",
                        "E-Commerce",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            px-1.5
                            py-0.5
                            text-[6px]
                            font-medium
                            text-white/55
                            sm:px-2.5
                            sm:py-1
                            sm:text-[8px]
                            md:text-[9px]
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* ===================================================
              CONTACT
          =================================================== */}

          {activePage === "contact" && (
            <section
              className="
                relative
                flex
                h-full
                w-full
                items-center
                justify-center
                overflow-hidden
                px-4
                sm:px-10
                lg:px-14
              "
            >
              {/* =================================================
                  AMBIENT BACKGROUND
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  overflow-hidden
                "
              >
                {/* Central glow */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[230px]
                    w-[230px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[#B7FF72]/[0.055]
                    blur-[80px]
                    sm:h-[420px]
                    sm:w-[420px]
                    sm:blur-[100px]
                  "
                />

                {/* Outer orbit */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[270px]
                    w-[270px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-[#B7FF72]/[0.06]
                    animate-[contactOrbit_22s_linear_infinite]
                    sm:h-[520px]
                    sm:w-[520px]
                  "
                />

                {/* Inner orbit */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[185px]
                    w-[185px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-white/[0.035]
                    animate-[contactOrbitReverse_16s_linear_infinite]
                    sm:h-[360px]
                    sm:w-[360px]
                  "
                />

                {/* Orbit points */}

                <span
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#B7FF72]
                    shadow-[0_0_16px_rgba(183,255,114,0.9)]
                    animate-[contactDot_10s_linear_infinite]
                  "
                />

                <span
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-1
                    w-1
                    rounded-full
                    bg-white/60
                    animate-[contactDotSmall_7s_linear_infinite_reverse]
                  "
                />

                {/* Grid */}

                <div
                  className="
                    absolute
                    inset-0
                    opacity-[0.025]
                    [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
                    [background-size:45px_45px]
                    sm:[background-size:60px_60px]
                  "
                />

                {/* Side lines */}

                <div
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-14
                    w-px
                    -translate-y-1/2
                    bg-gradient-to-b
                    from-transparent
                    via-[#B7FF72]/20
                    to-transparent
                    sm:left-12
                    sm:h-20
                  "
                />

                <div
                  className="
                    absolute
                    right-3
                    top-1/2
                    h-14
                    w-px
                    -translate-y-1/2
                    bg-gradient-to-b
                    from-transparent
                    via-[#B7FF72]/20
                    to-transparent
                    sm:right-12
                    sm:h-20
                  "
                />
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div
                className="
                  relative
                  z-10
                  w-full
                  max-w-5xl
                  text-center
                "
              >
                {/* STATUS */}

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-center
                    gap-2
                    animate-[contactReveal_700ms_ease-out_both]
                    sm:mb-7
                  "
                >
                  <span
                    className="
                      relative
                      flex
                      h-2
                      w-2
                    "
                  >
                    <span
                      className="
                        absolute
                        inline-flex
                        h-full
                        w-full
                        animate-ping
                        rounded-full
                        bg-[#B7FF72]/50
                      "
                    />

                    <span
                      className="
                        relative
                        h-2
                        w-2
                        rounded-full
                        bg-[#B7FF72]
                        shadow-[0_0_12px_rgba(183,255,114,0.8)]
                      "
                    />
                  </span>

                  <span
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.3em]
                      text-white/35
                      sm:text-[9px]
                      sm:tracking-[0.4em]
                    "
                  >
                    Open to work
                  </span>
                </div>

                {/* EYEBROW */}

                <p
                  className="
                    mb-2
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.35em]
                    text-[#B7FF72]
                    animate-[contactReveal_800ms_ease-out_both]
                    sm:mb-3
                    sm:text-xs
                    sm:tracking-[0.45em]
                  "
                >
                  Get in touch
                </p>

                {/* TITLE */}

                <div className="relative inline-block">
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-[#B7FF72]/10
                      blur-[45px]
                      sm:blur-[65px]
                    "
                  />

                  <h2
                    className="
                      relative
                      text-[15vw]
                      font-black
                      uppercase
                      leading-[0.8]
                      tracking-[-0.075em]
                      text-white
                      animate-[contactTitle_1000ms_cubic-bezier(0.16,1,0.3,1)_both]
                      sm:text-7xl
                      md:text-8xl
                      lg:text-[9rem]
                    "
                  >
                    Let&apos;s Talk
                  </h2>
                </div>

                {/* DESCRIPTION */}

                <p
                  className="
                    mx-auto
                    mt-5
                    max-w-xs
                    text-[10px]
                    leading-5
                    text-white/40
                    animate-[contactReveal_1100ms_ease-out_both]
                    sm:mt-7
                    sm:max-w-md
                    sm:text-sm
                    sm:leading-6
                  "
                >
                  Have an idea worth building?
                  <br />
                  Let&apos;s turn it into something real.
                </p>

                {/* BUTTON */}

                <div
                  className="
                    mt-6
                    flex
                    justify-center
                    animate-[contactReveal_1200ms_ease-out_both]
                    sm:mt-8
                  "
                >
                  <a
                    href="mailto:markliwanag1102@gmail.com"
                    className="
                      contact-email-button
                      group
                      relative
                      flex
                      items-center
                      gap-2.5
                      overflow-hidden
                      rounded-full
                      border
                      border-[#B7FF72]/40
                      bg-[#B7FF72]/[0.025]
                      px-5
                      py-2.5
                      backdrop-blur-xl
                      transition-all
                      duration-500
                      hover:-translate-y-1
                      hover:border-[#B7FF72]
                      hover:bg-[#B7FF72]
                      hover:shadow-[0_0_50px_rgba(183,255,114,0.22)]
                      sm:gap-4
                      sm:px-7
                      sm:py-3.5
                    "
                  >
                    {/* Shine */}

                    <span
                      className="
                        absolute
                        inset-y-0
                        -left-[100%]
                        w-1/2
                        skew-x-[-20deg]
                        bg-white/20
                        transition-all
                        duration-700
                        group-hover:left-[130%]
                      "
                    />

                    {/* Icon */}

                    <span
                      className="
                        relative
                        z-10
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[#B7FF72]/10
                        text-sm
                        text-[#B7FF72]
                        transition-all
                        duration-300
                        group-hover:rotate-[-8deg]
                        sm:h-7
                        sm:w-7
                      "
                    >
                      ↗
                    </span>

                    <span
                      className="
                        relative
                        z-10
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-[#B7FF72]
                        transition-colors
                        duration-300
                        group-hover:text-[#18251D]
                        sm:text-xs
                        sm:tracking-[0.18em]
                      "
                    >
                      Send a message
                    </span>
                  </a>
                </div>

                {/* EMAIL */}

                <div
                  className="
                    mt-4
                    animate-[contactReveal_1300ms_ease-out_both]
                    sm:mt-5
                  "
                >
                  <a
                    href="mailto:markliwanag1102@gmail.com"
                    className="
                      break-all
                      text-[8px]
                      tracking-[0.08em]
                      text-white/25
                      transition-colors
                      duration-300
                      hover:text-[#B7FF72]
                      sm:text-xs
                      sm:tracking-[0.12em]
                    "
                  >
                    markliwanag1102@gmail.com
                  </a>
                </div>

                {/* TECH LINE */}

                <div
                  className="
                    mx-auto
                    mt-6
                    flex
                    w-full
                    max-w-xs
                    items-center
                    justify-center
                    gap-2
                    animate-[contactReveal_1400ms_ease-out_both]
                    sm:mt-9
                    sm:max-w-sm
                    sm:gap-3
                  "
                >
                  <span className="h-px flex-1 bg-white/[0.06]" />

                  <span
                    className="
                      whitespace-nowrap
                      text-[6px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-white/20
                      sm:text-[8px]
                      sm:tracking-[0.3em]
                    "
                  >
                    AI · DEV · DESIGN
                  </span>

                  <span className="h-px flex-1 bg-white/[0.06]" />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* =====================================================
            BOTTOM MARQUEE
        ===================================================== */}

        {activePage === "home" && (
          <div
            className="
              intro-marquee
              absolute
              bottom-[30px]
              left-1/2
              z-30
              w-[120%]
              -translate-x-1/2
              rotate-[-2deg]
              overflow-hidden
              border-y
              border-[#B7FF72]/20
              bg-[#18251D]/80
              py-2.5
              backdrop-blur-sm
              sm:bottom-[45px]
              sm:py-4
              sm:w-[110%]
            "
          >
            <div
              className="
                marquee-track
                flex
                w-max
                items-center
                whitespace-nowrap
              "
            >
              {/* FIRST SET */}

              {roles.map((role, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                  "
                >
                  <span
                    className="
                      px-4
                      text-[8px]
                      font-semibold
                      tracking-[0.15em]
                      text-[#B7FF72]
                      sm:px-8
                      sm:text-sm
                      sm:tracking-[0.18em]
                      md:px-10
                      md:text-base
                      lg:text-lg
                    "
                  >
                    {role}
                  </span>

                  <span
                    className="
                      text-sm
                      text-[#B7FF72]/50
                      sm:text-xl
                      md:text-2xl
                    "
                  >
                    ✦
                  </span>
                </div>
              ))}

              {/* SECOND SET */}

              {roles.map((role, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="
                    flex
                    items-center
                  "
                >
                  <span
                    className="
                      px-4
                      text-[8px]
                      font-semibold
                      tracking-[0.15em]
                      text-[#B7FF72]
                      sm:px-8
                      sm:text-sm
                      sm:tracking-[0.18em]
                      md:px-10
                      md:text-base
                      lg:text-lg
                    "
                  >
                    {role}
                  </span>

                  <span
                    className="
                      text-sm
                      text-[#B7FF72]/50
                      sm:text-xl
                      md:text-2xl
                    "
                  >
                    ✦
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            CUSTOM TRIANGULAR CURSOR
        ===================================================== */}

        <div
          ref={cursorRef}
          className="
            custom-cursor
            pointer-events-none
          "
        >
          <svg
            width="38"
            height="48"
            viewBox="0 0 38 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 2 L35 27 L21 29 L15 45 L3 2Z"
              fill="#0A0A0A"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </main>
    </KineticGrid>
  );
}