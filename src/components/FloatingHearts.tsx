import { motion } from 'framer-motion'

const GENTLE_TRANSITION = {
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

const bubbles = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: 6 + index * 8,
  top: 8 + (index * 17) % 82,
  size: 16 + (index % 4) * 5,
  delay: index * 0.55,
  duration: 16 + (index % 4) * 3,
}))

const hearts = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: 10 + (index * 11) % 86,
  top: 12 + (index * 19) % 80,
  size: 14 + (index % 3) * 5,
  delay: index * 0.45 + 0.2,
  duration: 13 + (index % 3) * 2,
  rotate: ((index * 23) % 28) - 14,
}))

function FloatingHearts() {
  return (
    <div className="floating-decor" aria-hidden="true" style={{ userSelect: "none", pointerEvents: "none" }}>
      {bubbles.map((bubble) => (
        <motion.span
          key={`bubble-${bubble.id}`}
          className="floating-bubble"
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            width: bubble.size,
            height: bubble.size,
            rotate: 45,
          }}
          initial={{ opacity: 0.32 }}
          animate={{
            y: [0, -8, -14, -8, 0],
            x: [0, 5, -4, 5, 0],
            opacity: [0.28, 0.4, 0.48, 0.4, 0.28],
            scale: [1, 1.02, 1.04, 1.02, 1],
          }}
          transition={{
            ...GENTLE_TRANSITION,
            duration: bubble.duration,
            delay: bubble.delay,
          }}
        />
      ))}

      {hearts.map((heart) => (
        <motion.span
          key={`heart-${heart.id}`}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            fontSize: heart.size,
            rotate: heart.rotate,
          }}
          initial={{ opacity: 0.38 }}
          animate={{
            y: [0, -6, -12, -6, 0],
            opacity: [0.32, 0.48, 0.58, 0.48, 0.32],
            scale: [1, 1.04, 1.07, 1.04, 1],
          }}
          transition={{
            ...GENTLE_TRANSITION,
            duration: heart.duration,
            delay: heart.delay,
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

export default FloatingHearts
