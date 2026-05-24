import "../styles/dog.css";

interface Props {
  isFed: boolean;
  dogRef: { current: HTMLDivElement | null };
  onPet?: () => void;
  isPetted?: boolean;
}

function DogCorgi({ isFed, dogRef, onPet, isPetted }: Props) {
  return (
    <div
      className={`dog-wrap${isFed ? " dog-fed" : ""}${isPetted ? " dog-petted" : ""}`}
      ref={dogRef}
      onPointerDown={isFed ? onPet : undefined}
      onPointerEnter={(e) => { if (isFed && e.buttons > 0 && onPet) onPet(); }}
      style={{ cursor: isFed ? "pointer" : undefined }}
    >
      <div className="dog">
        <div className="dog-heart dog-heart--1" />
        <div className="dog-heart dog-heart--2" />
        <div className="dog-heart dog-heart--3" />
        <div className="dog-heart dog-heart--4" />
        <div className="dog-head">
          <div className="dog-ear dog-ear--left" />
          <div className="dog-ear dog-ear--right" />
          <div className="dog-nose" />
          <div className="dog-face">
            <div className="dog-eye dog-eye--left" />
            <div className="dog-eye dog-eye--right" />
            <div className="dog-mouth" />
            <div className="dog-tongue" />
          </div>
        </div>
        <div className="dog-body">
          <div className="dog-chest" />
          <div className="dog-legs">
            <div className="dog-legs__front dog-legs__front--left" />
            <div className="dog-legs__front dog-legs__front--right" />
            <div className="dog-legs__back dog-legs__back--left" />
            <div className="dog-legs__back dog-legs__back--right" />
          </div>
          <div className="dog-tail" />
        </div>
      </div>
    </div>
  );
}

export default DogCorgi;
