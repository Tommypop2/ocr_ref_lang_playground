import { Component } from "solid-js";
import { StateProvider } from "../providers/StateProvider";
import Main from "./Main";

const App: Component = () => {
  return (
    <StateProvider>
      <Main />
    </StateProvider>
  );
};

export default App;
