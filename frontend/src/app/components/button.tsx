export const Button = () => {
  return (
    <button className="relative py-4 px-6 rounded-lg font-medium text-medium bg-gradient-to-b from-[#031a3d] to-[#052659] shadow-[0px_0px_12px_#052659] hover:shadow-[0px_0px_20px_#052659] transition-all duration-300 hover:scale-105 group">
      <div className="absolute inset-0">
        <div className="border rounded-lg border-white/20 absolute inset-0 group-hover:border-white/40 transition-colors duration-300"></div>
      </div>
      <span className="relative z-10">Sign up</span>
    </button>
  )
}
