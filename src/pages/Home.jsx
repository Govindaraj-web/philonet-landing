import React, { useEffect, useState } from "react";

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const part1 = "philonet";
  const part2 = "A new friendship is one thought away";

  useEffect(() => {
    let index = 0;
    let phase = "typing1";
    let timer;

    const type = () => {
      if (phase === "typing1") {
        if (index <= part1.length) {
          setTypedText(part1.slice(0, index));
          index++;
          timer = setTimeout(type, 80);
        } else {
          phase = "pause1";
          timer = setTimeout(type, 800); // pause after Philonet
        }
      } else if (phase === "pause1") {
        phase = "deleting1";
        index = part1.length;
        timer = setTimeout(type, 50);
      } else if (phase === "deleting1") {
        if (index >= 0) {
          setTypedText(part1.slice(0, index));
          index--;
          timer = setTimeout(type, 50);
        } else {
          phase = "typing2";
          index = 0;
          timer = setTimeout(type, 200);
        }
      } else if (phase === "typing2") {
        if (index <= part2.length) {
          setTypedText(part2.slice(0, index));
          index++;
          timer = setTimeout(type, 80);
        }
      }
    };

    type();
    return () => clearTimeout(timer);
  }, []);

  return <span className="typewriter">{typedText}</span>;
}
