"use client";
import { useEffect, useState } from "react";

function PopupBars() {
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    [setActive(true)];
  }, [active]);
  return (
    <div className={`window_popup ${active && "active"}`}>
      <div className="left_side ">
        <div className="item "></div>
        <div className="item"></div>
        <div className="item"></div>
      </div>
      <div className="right_side ">
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
      </div>
    </div>
  );
}
export default PopupBars;
