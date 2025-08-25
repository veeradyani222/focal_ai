// components/LearnSection.tsx
import { motion } from "framer-motion";
const TOK = { fg: "var(--fg)", fg2: "var(--fg2)", line: "var(--line)" };

export default function LearnSection() {
  const items = [
    {
      title: "What makes a good input?",
      points: [
        "State the problem in one sentence.",
        "Name your target user.",
        "List 3–5 must‑have outcomes.",
        "Mention constraints and deadlines.",
        "Add links only if essential.",
      ],
    },
    {
      title: "How agents decide",
      points: [
        "Customer pushes for outcomes and clarity.",
        "Designer removes friction and confusion.",
        "Finance checks viability and scope creep.",
        "Developer guards feasibility and effort.",
        "PM balances priorities and trade‑offs.",
      ],
    },
    {
      title: "From spec to sprint",
      points: [
        "Turn priorities into user stories.",
        "Define acceptance criteria early.",
        "Plan dependencies and sequence.",
      ],
    },
  ];
  return (
    <section id="learn" className="container py-12">
      <h2>Learn the basics in 2 minutes</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {items.map((block, i) => (
          <motion.div
            key={block.title}
            className="p-5 rounded-2xl"
            style={{ border: `1px solid ${TOK.line}`, background: "rgba(5,38,89,.28)" }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <h3 style={{ color: TOK.fg }}>{block.title}</h3>
            <ul className="mt-3 space-y-2 text-sm" style={{ color: TOK.fg2 }}>
              {block.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full mt-2" style={{ background: "var(--acc2)" }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}