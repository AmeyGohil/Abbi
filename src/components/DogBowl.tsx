import { useRef } from "react";
import { motion } from "framer-motion";
import "../styles/dog-bowl.css";

interface Props {
  isFed: boolean;
  onFed: () => void;
  dogRef: { current: HTMLDivElement | null };
}

function rectsOverlap(a: DOMRect, b: DOMRect) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function DogBowl({ isFed, onFed, dogRef }: Props) {
  const bowlRef = useRef<HTMLDivElement>(null);

  const handleDrag = () => {
    if (isFed || !bowlRef.current || !dogRef.current) return;
    const bowl = bowlRef.current.getBoundingClientRect();
    const dog = dogRef.current.getBoundingClientRect();
    if (rectsOverlap(bowl, dog)) {
      onFed();
    }
  };

  if (isFed) return null;

  return (
    <motion.div
      ref={bowlRef}
      className="dog-bowl-wrap"
      drag
      dragMomentum={false}
      dragElastic={0.12}
      whileDrag={{ scale: 1.06 }}
      onDrag={handleDrag}
    >
      <div className="dog-bowl">
        <div className="dog-bowl-inner">
          <div className="kibble kibble--1" />
          <div className="kibble kibble--2" />
          <div className="kibble kibble--3" />
          <div className="kibble kibble--4" />
          <div className="kibble kibble--5" />
          <div className="kibble kibble--6" />
          <div className="kibble kibble--7" />
        </div>
      </div>
      <div className="dog-bowl-base" />
    </motion.div>
  );
}

export default DogBowl;
