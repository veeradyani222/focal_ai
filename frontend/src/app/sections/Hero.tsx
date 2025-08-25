"use client"

import { Button } from "../components/button"
import starsBg from "../assets/stars.png"

export const Hero = () => {
  return (
    <section 
      className="h-[600px] flex items-start pt-4 overflow-hidden relative"
      style={{
        backgroundImage: `url(${starsBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* THE HERO SECTION PLANET THINGY */}

      {/* CONTENT */}
      <div className="container relative z-10">
        <h1 className="text-center text-8xl md:text-9xl lg:text-[200px] font-semibold tracking-tighter bg-white bg-[radial-gradient(100%_100%_at_top_left,white,white,rgb(5,38,89))] text-transparent bg-clip-text">
          focal.ai
        </h1>
        <p className="text-center mt-6 text-lg md:text-xl lg:text-2xl text-white/60 max-w-4xl mx-auto">
          Your next big idea, argued and agreed in minutes. <br /> Skip endless meetings. Focal AI runs the debate and hands you the decision. <br />Because the smartest answer is never from one voice.
        </p>

        <div className="flex justify-center mt-10">
          <Button />
        </div>
      </div>
    </section>
  )
}
