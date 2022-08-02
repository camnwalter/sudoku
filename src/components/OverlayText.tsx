interface OverlayTextProps {
  text: string;
  type: "corner" | "center";
}

export const OverlayText = ({ text, type }: OverlayTextProps) => {
  return <div className={`overlayText ${type}`}>{text}</div>;
};
