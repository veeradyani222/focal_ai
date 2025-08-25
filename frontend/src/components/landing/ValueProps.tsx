'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Users, Zap } from 'lucide-react';

const valueProps = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Skip scheduling nightmares and 4-hour meetings. Get stakeholder input in minutes, not days.",
    gradient: "from-purple-500 to-purple-600",
    delay: 0
  },
  {
    icon: Users,
    title: "Complete Coverage",
    description: "5 specialized AI agents ensure every perspective is considered - customer, design, finance, development, and product.",
    gradient: "from-cyan-500 to-cyan-600",
    delay: 0.1
  },
  {
    icon: Zap,
    title: "Scalable Anytime",
    description: "No calendar coordination needed. Run debates 24/7 and scale from 1 idea to 100 without breaking a sweat.",
    gradient: "from-blue-500 to-blue-600",
    delay: 0.2
  }
];

export default function ValueProps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why teams choose{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Focal AI
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Transform how you gather requirements and make product decisions. 
            Faster, smarter, and more comprehensive than traditional meetings.
          </p>
        </motion.div>

        {/* Value Proposition Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: prop.delay }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-gray-900/70">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${prop.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <prop.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">{prop.title}</h3>
                <p className="text-purple-200 leading-relaxed">{prop.description}</p>
                
                {/* Hover Effect */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">80x</div>
                <div className="text-purple-200">Faster than meetings</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">5</div>
                <div className="text-purple-200">AI agents per debate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-purple-200">Available anytime</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <blockquote className="text-xl text-white italic mb-4">
              "Focal AI saved us 3 weeks of stakeholder meetings. We got better requirements in 3 minutes than we would have in 3 hours of traditional discussions."
            </blockquote>
            <div className="text-purple-200">
              <div className="font-semibold">Sarah Chen</div>
              <div className="text-sm">Product Manager, TechCorp</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
