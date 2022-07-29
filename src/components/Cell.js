import { useState } from "react";

export const Cell = ({ adjacent, id, onClick, selected, onKeyDown }) => {
  const [text, setText] = useState("");
  const [cornerNotes, setCornerNotes] = useState([]);

  return (
    <div
      className="cell"
      id={selected ? "focused" : adjacent ? "adjacent" : ""}
      tabIndex={-1}
      onKeyDown={(e) => {
        onKeyDown(e);

        e.preventDefault();
        if (e.key === "Backspace") {
          setText("");
        } else if (e.key === "Delete") {
          setText("");
          setCornerNotes([]);
        } else if (e.key <= 9 && e.key >= 1) {
          if (e.ctrlKey) {
            if (cornerNotes.includes(e.key)) {
              setCornerNotes((notes) => notes.filter((note) => note !== e.key));
            } else {
              setCornerNotes((notes) => notes.concat(e.key).sort());
            }
          } else {
            setText(e.key);
          }
        }
      }}
      onClick={onClick}
    >
      <div className="centerText">{text}</div>
      <div className="cornerText">
        {cornerNotes.map((note) => (
          <div>{note}</div>
        ))}
      </div>
    </div>
  );
};
