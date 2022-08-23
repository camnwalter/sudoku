import styles from "../styles/OverlayText.module.css";

interface OverlayTextProps {
  text: string;
  type: "corner" | "center";
}

const OverlayText = ({ text, type }: OverlayTextProps) => {
  return (
    <div className={[styles.overlayText, styles[type]].join(" ")}>{text}</div>
  );
};

export default OverlayText;
