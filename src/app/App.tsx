import { Component, createEffect, createSignal, Show } from "solid-js";
import mainOCRREF from "../defaultFiles/main.ocrref?raw";
import { throttle } from "@solid-primitives/scheduled";
import { Editors } from "./Editors";
const App: Component = () => {
  const [isDarkTheme, setIsDarkTheme] = createSignal(true);
  const [showResult, setShowResult] = createSignal(false);
  const [jsEditorVal, setJsEditorVal] = createSignal("");
  const [ocrEditorVal, setOcrEditorVal] = createSignal(mainOCRREF);

  const applyCompilation = throttle(async (res: string) => {
    setJsEditorVal(res);
  }, 250);
  const resultWorker = new Worker(new URL("../workers/compilerWorker.ts", import.meta.url), { type: "module" });
  resultWorker.onmessage = (evt) => {
    const evtData = evt.data;
    if (evtData.status == "success") {
      const data = evtData.compiledCode;
      const file = data[0];
      const compilationRes = file[1];
      applyCompilation(compilationRes);
    }
  };
  createEffect(() => {
    resultWorker.postMessage({ action: "compile", data: [["main", ocrEditorVal()]] });
  });
  return (
    <div class="dark m-0 h-full p-0">
      <div class="dark:text-light-100 m-0 h-full p-0 dark:bg-[#1e1e1e]">
        <header class="h-1/20 px-6 py-3 text-4xl">OCR Reference Language Playground</header>
        <Editors
          isDarkTheme={isDarkTheme()}
          ocrEditorVal={ocrEditorVal()}
          setOcrEditorVal={(str: string) => {
            setOcrEditorVal(str);
          }}
          showResult={showResult()}
          setShowResult={(x: boolean) => {
            setShowResult(x);
          }}
          jsEditorVal={jsEditorVal()}
          setJsEditorVal={(str: string) => {
            setJsEditorVal(str);
          }}
        ></Editors>
      </div>
    </div>
  );
};

export default App;
