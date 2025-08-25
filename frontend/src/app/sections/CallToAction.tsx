"use client"

import Gridbg from "../assets/grid-lines.png"
import { Button } from "../components/button"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion"
import { RefObject, useEffect, useRef } from "react"

//for follow mouse hover, we created a custom hook
const useRelativeMousePosition = (to: RefObject<HTMLDivElement | null>) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const updateMousePosition = (event: MouseEvent) => {
    if (!to.current) return
    const { top, left } = to.current.getBoundingClientRect()
    mouseX.set(event.x - left)
    mouseY.set(event.y - top)
  }

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  return [mouseX, mouseY]
}
//MAIN FUNCTION
export const CallToAction = () => {
  const borderedDivRef = useRef<HTMLDivElement>(null)

  const [mouseX, mouseY] = useRelativeMousePosition(borderedDivRef)

  const maskImage = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px, black, transparent)`
  return (
    <section className="p-20 md:p-28">
      <div
        ref={borderedDivRef}
        className="border border-white/10 py-28 rounded-xl overflow-hidden relative group bg-gradient-to-br from-[#052659]/20 to-black"
      >
        {/*this one for initial masking */}
        <div
          //we have a grop-hover class to help as manage teh bg-mask
          className="absolute inset-0 bg-[#052659] bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0 transition duration-1000"
          style={{
            backgroundImage: `url(${Gridbg.src})`,
          }}
        ></div>
        {/* this one for mouse hover */}
        <motion.div
          className="absolute inset-0 bg-[#052659] bg-blend-overlay  opacity-0 group-hover:opacity-100 transition duration-1000 "
          style={{
            maskImage,
            backgroundImage: `url(${Gridbg.src})`,
          }}
        ></motion.div>
        <div className="container">
          <div className="relative">
            <h2 className="text-2xl md:text-2xl lg:text-4xl font-semibold tracking-tighter text-center max-w-lg mx-auto">
            Because the smartest answer <br /> is never from one voice.
            </h2>
            <p className="text-lg text-white/70 text-center mt-10 max-w-xl mx-auto">
            Turn messy discussions into consensus-driven PRDs without ever calling a meeting.
            </p>
            <div className="text-center mt-10">
              <button 
                onClick={() => {
                  const element = document.getElementById('stats-comparison')
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    })
                  }
                }}
                className="inline-block bg-white/70 text-black px-8 py-4 rounded-lg font-medium hover:bg-white/80 transition-colors duration-200 cursor-pointer"
              >
                Know why you need us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
