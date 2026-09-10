"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  House,
  UserRound,
  BriefcaseBusiness,
  Mail,
} from "lucide-react";
import KineticGrid from "@/components/ui/kinetic-grid";

export default function Home() {
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
  const [isDeleting, setIsDeleting] = useState(false);

  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */

  const cursorRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     TYPING EFFECT
  ========================================================= */

  useEffect(() => {
    const currentRole = roles[roleIndex];

    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentRole) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1600);
    } else if (isDeleting && text === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);

        setRoleIndex(
          (prev) => (prev + 1) % roles.length
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

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  /* =========================================================
     CUSTOM CURSOR TRACKING
  ========================================================= */

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!cursorRef.current) return;

      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <KineticGrid>
      <main
        id="home"
        className="
          min-h-screen
          h-screen
          bg-transparent
          text-white
          relative
          overflow-hidden
          flex
          flex-col
          selection:bg-[#B7FF72]
          selection:text-[#18251D]
        "
      >

        {/* =========================================================
            HEADER
        ========================================================= */}

        <header
          className="
            relative
            z-40
            w-full
            px-6
            sm:px-10
            lg:px-14
            pt-5
            sm:pt-6
          "
        >

          <div
            className="
              relative
              flex
              items-center
              justify-between
              min-h-[54px]
            "
          >

            {/* LOGO */}

            <a
              href="#home"
              className="
                flex
                items-center
                gap-2
                sm:gap-3
                group
              "
            >

              <div
                className="
                  text-[#B7FF72]
                  text-3xl
                  sm:text-4xl
                  leading-none
                  font-light
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  group-hover:rotate-6
                "
              >
                ✦
              </div>

              <span
                className="
                  text-[#B7FF72]
                  text-2xl
                  sm:text-3xl
                  font-semibold
                  tracking-tight
                  font-serif
                  italic
                "
              >
                portfolio
              </span>

            </a>


            {/* =====================================================
                DESKTOP NAVBAR
            ===================================================== */}

            <nav
              className="
                hidden
                md:flex
                items-center
                gap-1
                rounded-full
                border
                border-white/20
                bg-[#26352C]/80
                p-1.5
                shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                backdrop-blur-xl
              "
            >

              {/* HOME */}

              <a
                href="#home"
                data-tooltip="HOME"
                className="
                  group
                  tooltip-water
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#B7FF72]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#18251D]
                  transition-all
                  duration-300
                "
              >

                <span className="water-icon">

                  <House
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />

                </span>

                <span>
                  Home
                </span>

              </a>


              {/* ABOUT */}

              <a
                href="#about"
                data-tooltip="ABOUT ME"
                className="
                  group
                  tooltip-water
                  flex
                  items-center
                  gap-2
                  rounded-full
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white/70
                  transition-all
                  duration-300
                  hover:bg-white/10
                  hover:text-white
                "
              >

                <span className="water-icon">

                  <UserRound
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />

                </span>

                <span>
                  About
                </span>

              </a>


              {/* PROJECTS */}

              <a
                href="#projects"
                data-tooltip="MY PROJECTS"
                className="
                  group
                  tooltip-water
                  flex
                  items-center
                  gap-2
                  rounded-full
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white/70
                  transition-all
                  duration-300
                  hover:bg-white/10
                  hover:text-white
                "
              >

                <span className="water-icon">

                  <BriefcaseBusiness
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />

                </span>

                <span>
                  Projects
                </span>

              </a>


              {/* CONTACT */}

              <a
                href="#contact"
                data-tooltip="CONTACT ME"
                className="
                  group
                  tooltip-water
                  flex
                  items-center
                  gap-2
                  rounded-full
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white/70
                  transition-all
                  duration-300
                  hover:bg-white/10
                  hover:text-white
                "
              >

                <span className="water-icon">

                  <Mail
                    size={19}
                    strokeWidth={1.8}
                    className="water-icon-symbol"
                  />

                </span>

                <span>
                  Contact
                </span>

              </a>

            </nav>


            {/* SIGNATURE */}

            <div className="hidden sm:block">

              <span
                className="
                  text-xl
                  lg:text-2xl
                  font-serif
                  italic
                  font-semibold
                  tracking-wide
                  text-white
                "
              >
                Anthony Mark
              </span>

            </div>

          </div>

        </header>


        {/* =========================================================
            MOBILE NAVBAR
        ========================================================= */}

        <div
          className="
            md:hidden
            relative
            z-40
            flex
            justify-center
            mt-4
            px-3
          "
        >

          <nav
            className="
              flex
              items-center
              gap-1
              p-1.5
              rounded-full
              bg-[#18251D]/90
              backdrop-blur-xl
              border
              border-[#B7FF72]/20
              shadow-[0_8px_30px_rgba(0,0,0,0.3)]
            "
          >

            {/* HOME */}

            <a
              href="#home"
              data-tooltip="HOME"
              className="
                group
                tooltip-water
                flex
                items-center
                bg-[#B7FF72]
                text-[#18251D]
                px-3
                py-2
                rounded-full
                text-xs
                font-bold
              "
            >

              <span className="water-icon water-icon-mobile">

                <House
                  size={16}
                  strokeWidth={1.9}
                  className="water-icon-symbol"
                />

              </span>

              <span className="ml-1">
                Home
              </span>

            </a>


            {/* ABOUT */}

            <a
              href="#about"
              data-tooltip="ABOUT ME"
              className="
                group
                tooltip-water
                flex
                items-center
                text-white/65
                hover:text-[#B7FF72]
                px-3
                py-2
                rounded-full
                text-xs
                font-medium
              "
            >

              <span className="water-icon water-icon-mobile">

                <UserRound
                  size={16}
                  strokeWidth={1.9}
                  className="water-icon-symbol"
                />

              </span>

              <span className="ml-1">
                About
              </span>

            </a>


            {/* PROJECTS */}

            <a
              href="#projects"
              data-tooltip="MY PROJECTS"
              className="
                group
                tooltip-water
                flex
                items-center
                text-white/65
                hover:text-[#B7FF72]
                px-3
                py-2
                rounded-full
                text-xs
                font-medium
              "
            >

              <span className="water-icon water-icon-mobile">

                <BriefcaseBusiness
                  size={16}
                  strokeWidth={1.9}
                  className="water-icon-symbol"
                />

              </span>

              <span className="ml-1">
                Projects
              </span>

            </a>


            {/* CONTACT */}

            <a
              href="#contact"
              data-tooltip="CONTACT ME"
              className="
                group
                tooltip-water
                flex
                items-center
                text-white/65
                hover:text-[#B7FF72]
                px-3
                py-2
                rounded-full
                text-xs
                font-medium
              "
            >

              <span className="water-icon water-icon-mobile">

                <Mail
                  size={16}
                  strokeWidth={1.9}
                  className="water-icon-symbol"
                />

              </span>

              <span className="ml-1">
                Contact
              </span>

            </a>

          </nav>

        </div>


        {/* =========================================================
            HERO
        ========================================================= */}

        <section
          className="
            relative
            z-10
            w-full
            max-w-[1550px]
            mx-auto
            px-6
            sm:px-10
            lg:px-14
            flex-1
            flex
            items-center
            pb-20
            sm:pb-20
          "
        >

          <div
            className="
              w-full
              grid
              grid-cols-12
              items-center
              gap-3
              lg:gap-5
            "
          >

            {/* =====================================================
                LEFT STATS
            ===================================================== */}

            <div
              className="
                col-span-12
                lg:col-span-2
                order-2
                lg:order-1
                flex
                lg:flex-col
                justify-center
                gap-6
                lg:gap-0
                lg:space-y-8
                text-center
                lg:text-left
                mt-4
                lg:mt-0
                relative
                z-20
              "
            >

              {/* EXPERIENCE */}

              <div
                className="
                  border-t
                  border-white/15
                  pt-3
                  lg:pt-5
                  min-w-[110px]
                "
              >

                <h2
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-5xl
                    font-black
                    text-[#B7FF72]
                    leading-none
                  "
                >
                  1+
                </h2>

                <p
                  className="
                    text-[9px]
                    sm:text-[10px]
                    lg:text-[10px]
                    uppercase
                    tracking-[0.16em]
                    text-white/55
                    mt-2
                    leading-relaxed
                  "
                >
                  Years Experience
                </p>

              </div>


              {/* PROJECTS */}

              <div
                className="
                  border-t
                  border-white/15
                  pt-3
                  lg:pt-5
                  min-w-[110px]
                "
              >

                <h2
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-5xl
                    font-black
                    text-[#B7FF72]
                    leading-none
                  "
                >
                  5+
                </h2>

                <p
                  className="
                    text-[9px]
                    sm:text-[10px]
                    lg:text-[10px]
                    uppercase
                    tracking-[0.16em]
                    text-white/55
                    mt-2
                    leading-relaxed
                  "
                >
                  Projects Done
                </p>

              </div>


              {/* CREATIVE */}

              <div
                className="
                  border-t
                  border-white/15
                  pt-3
                  lg:pt-5
                  min-w-[110px]
                "
              >

                <h2
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-5xl
                    font-black
                    text-[#B7FF72]
                    leading-none
                  "
                >
                  100%
                </h2>

                <p
                  className="
                    text-[9px]
                    sm:text-[10px]
                    lg:text-[10px]
                    uppercase
                    tracking-[0.16em]
                    text-white/55
                    mt-2
                    leading-relaxed
                  "
                >
                  Creative Drive
                </p>

              </div>

            </div>


            {/* =====================================================
                CENTER HERO
            ===================================================== */}

            <div
              className="
                col-span-12
                lg:col-span-7
                order-1
                lg:order-2
                relative
                h-[500px]
                sm:h-[550px]
                lg:h-[590px]
                xl:h-[620px]
                flex
                items-center
                justify-center
              "
            >

  
              {/* TYPING ROLE */}

              <div
                className="
                  absolute
                  top-[36%]
                  left-1/2
                  -translate-x-1/2
                  w-[135%]
                  flex
                  justify-center
                  items-center
                  z-0
                  pointer-events-none
                "
              >

                <span
                  className="
                    text-[#B7FF72]
                    text-5xl
                    sm:text-7xl
                    lg:text-[100px]
                    font-thin
                    opacity-70
                    leading-none
                  "
                >
                  |
                </span>


                <div
                  className="
                    relative
                    flex
                    items-center
                    justify-center
                    min-w-0
                  "
                >

                  {/* GLOW TEXT */}

                  <span
                    className="
                      absolute
                      inset-0
                      text-[30px]
                      sm:text-[48px]
                      lg:text-[68px]
                      xl:text-[78px]
                      font-black
                      tracking-[-0.055em]
                      uppercase
                      whitespace-nowrap
                      text-[#B7FF72]/10
                      blur-[4px]
                    "
                  >
                    {text}
                  </span>


                  {/* OUTLINE TEXT */}

                  <span
                    className="
                      relative
                      text-[30px]
                      sm:text-[48px]
                      lg:text-[68px]
                      xl:text-[78px]
                      font-black
                      tracking-[-0.055em]
                      uppercase
                      whitespace-nowrap
                      text-transparent
                      leading-none
                    "
                    style={{
                      WebkitTextStroke:
                        "2px #B7FF72",
                    }}
                  >
                    {text}
                  </span>


                  {/* CARET */}

                  <span
                    className="
                      inline-block
                      ml-2
                      text-[#B7FF72]
                      text-[30px]
                      sm:text-[48px]
                      lg:text-[68px]
                      xl:text-[78px]
                      font-light
                      typing-caret
                      leading-none
                    "
                  >
                    |
                  </span>

                </div>


                <span
                  className="
                    text-[#B7FF72]
                    text-5xl
                    sm:text-7xl
                    lg:text-[100px]
                    font-thin
                    opacity-70
                    leading-none
                  "
                >
                  |
                </span>

              </div>


              {/* SECONDARY TEXT */}

              <div
                className="
                  absolute
                  top-[48%]
                  left-1/2
                  -translate-x-1/2
                  z-0
                  whitespace-nowrap
                "
              >


              </div>


              {/* AVATAR */}

<div
  className="
    absolute
    left-1/2
    -translate-x-1/2
    bottom-[12%]
    sm:bottom-[13%]
    md:bottom-[14%]
    lg:bottom-[15%]
    z-10
    w-[235px]
    sm:w-[330px]
    md:w-[390px]
    lg:w-[450px]
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
      w-full
      h-auto
      object-contain
      drop-shadow-[0_30px_35px_rgba(0,0,0,0.65)]
    "
  />
</div>

            </div>


            {/* =====================================================
                RIGHT INTRO
            ===================================================== */}

            <div
              className="
                col-span-12
                lg:col-span-3
                order-3
                flex
                flex-col
                items-center
                lg:items-end
                justify-center
                text-center
                lg:text-right
                gap-4
                lg:gap-5
                mt-2
                lg:mt-0
                relative
                z-20
              "
            >

              <p
                className="
                  text-sm
                  sm:text-base
                  lg:text-[13px]
                  xl:text-sm
                  text-white/70
                  leading-[1.75]
                  max-w-[310px]
                "
              >

                Hi, I'm{" "}

                <span
                  className="
                    text-[#B7FF72]
                    font-semibold
                  "
                >
                  Anthony Mark
                </span>

                . I build modern,
                responsive and high-performance
                web experiences that combine
                clean code with creative design.

              </p>


              <a
                href="#contact"
                data-tooltip="CONTACT ME"
                className="
                  group
                  tooltip-water
                  mt-1
                  flex
                  items-center
                  gap-3
                  px-6
                  py-3
                  rounded-full
                  border
                  border-[#B7FF72]/50
                  text-[#B7FF72]
                  text-xs
                  sm:text-sm
                  font-bold
                  tracking-[0.12em]
                  transition-all
                  duration-300
                  hover:bg-[#B7FF72]
                  hover:text-[#18251D]
                  hover:border-[#B7FF72]
                  hover:shadow-[0_0_30px_rgba(183,255,114,0.30)]
                  hover:scale-105
                "
              >

                GET IN TOUCH

                <span
                  className="
                    text-lg
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    group-hover:scale-125
                  "
                >
                  ↗
                </span>

              </a>

            </div>

          </div>

        </section>


{/* =========================================================
    BOTTOM MARQUEE
========================================================= */}

<div
  className="
    absolute
    bottom-[45px]
    left-1/2
    z-30
    -translate-x-1/2
    w-[110%]
    overflow-hidden
    border-y
    border-[#B7FF72]/20
    bg-[#18251D]/80
    py-4
    backdrop-blur-sm
    rotate-[-2deg]
  "
>
  <div className="marquee-track flex w-max items-center whitespace-nowrap">
    {[
      "IT SUPPORT",
      "FULLSTACK DEVELOPER",
      "WEB DESIGNER",
      "AI SPECIALIST",
      "UI/UX INNOVATION",
      "MANUAL TESTING",
      "QUALITY ASSURANCE",
    ].map((role, index) => (
      <div key={index} className="flex items-center">
        <span
          className="
            px-8
            text-sm
            font-semibold
            tracking-[0.18em]
            text-[#B7FF72]
            sm:px-10
            sm:text-base
            lg:text-lg
          "
        >
          {role}
        </span>

        <span className="text-xl text-[#B7FF72]/50 sm:text-2xl">
          ✦
        </span>
      </div>
    ))}

    {/* Duplicate */}
    {[
      "IT SUPPORT",
      "FULLSTACK DEVELOPER",
      "WEB DESIGNER",
      "AI SPECIALIST",
      "UI/UX INNOVATION",
      "MANUAL TESTING",
      "QUALITY ASSURANCE",
    ].map((role, index) => (
      <div key={`duplicate-${index}`} className="flex items-center">
        <span
          className="
            px-8
            text-sm
            font-semibold
            tracking-[0.18em]
            text-[#B7FF72]
            sm:px-10
            sm:text-base
            lg:text-lg
          "
        >
          {role}
        </span>

        <span className="text-xl text-[#B7FF72]/50 sm:text-2xl">
          ✦
        </span>
      </div>
    ))}
  </div>
</div>

        {/* =========================================================
            CUSTOM TRIANGULAR CURSOR
        ========================================================= */}

        <div
          ref={cursorRef}
          className="custom-cursor"
        >

          <svg
            width="38"
            height="48"
            viewBox="0 0 38 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              d="
                M3 2
                L35 27
                L21 29
                L15 45
                L3 2Z
              "
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