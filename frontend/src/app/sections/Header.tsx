import MenuIcon from "../assets/icon-menu.svg"
import { Button } from "../components/button"

export const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <header className="py-4 border-b border-white/15 md:border-none sticky top-0 z-10 ">
      <div className="absolute inset-0 backdrop-blur -z-10 md:hidden"></div>
      <div className="container">
        <div className="flex justify-between items-center md:border rounded-lg border-white/15  md:py-2.5 md:px-5 max-w-2xl mx-auto relative ">
          <div className="hidden md:block absolute inset-0 backdrop-blur -z-10 "></div>
          <div>
            <a href="/" className="text-white font-inter text-xl font-semibold hover:opacity-80 transition-opacity duration-200">
              focal.ai
            </a>
          </div>
          <div className="hidden md:block">
            <nav className="flex gap-8 text-sm ">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-white/70 hover:text-white transition-colors duration-200 hover:scale-105 cursor-pointer"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('stats-comparison')}
                className="text-white/70 hover:text-white transition-colors duration-200 hover:scale-105 cursor-pointer"
              >
                View stats
              </button>
            </nav>
          </div>
          <div className="flex gap-4 items-center">
            <Button />
                         <img src={MenuIcon.src} alt="Menu" className="md:hidden h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  )
}
