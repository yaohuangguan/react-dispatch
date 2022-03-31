import React from "react";
import { dispatcher } from "react-dispatch";
import { UPDATE, ONCE_UPDATE_COUNT } from "./Constant";
const Component = () => {
  const onUpdate = () => dispatcher.dispatch(UPDATE, 1);
  const onClickOnce = () => dispatcher.dispatch(ONCE_UPDATE_COUNT, 1);
  const unMount = () => dispatcher.off([UPDATE, ONCE_UPDATE_COUNT]);

  return (
    <div>
      <button className="App-link" onClick={onUpdate}>
        Dispatch
      </button>

      <button className="App-link" onClick={onClickOnce}>
        Dispatch Once
      </button>
      <button className="App-link" onClick={unMount}>
        Uninstall
      </button>
    </div>
  );
};

export default Component;
