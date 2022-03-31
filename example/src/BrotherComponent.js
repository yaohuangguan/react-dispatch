import React, { useState, useEffect } from "react";
import { UPDATE, ONCE_UPDATE_COUNT } from "./Constant";
import { dispatcher } from "react-dispatch";

const BrotherComponent = () => {
  const [count, setCount] = useState(0);
  const [action, setAction] = useState("");
  const [onceCount, setOnceCount] = useState(0);
  useEffect(() => {
    dispatcher.on(UPDATE, data => {
      setCount(prev => prev + data);

      setAction(UPDATE);
    });

    dispatcher.once(ONCE_UPDATE_COUNT, data =>
      setOnceCount(prev => prev + data)
    );
    return () => {
      dispatcher.off([UPDATE, ONCE_UPDATE_COUNT]);
    };
  }, []);
  return (
    <>
      <div>
        {action ? action : "Data from dispatch: "}
        {count}
      </div>
      <div>ONLY ONCE - Data from dispatch: {onceCount}</div>
    </>
  );
};

export default BrotherComponent;
