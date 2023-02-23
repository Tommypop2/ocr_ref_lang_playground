import { Component, createEffect, createSignal, Show } from "solid-js";
import mainOCRREF from "../defaultFiles/main.ocrref?raw";
import { throttle } from "@solid-primitives/scheduled";
import { Editors } from "./Editors";
import { storeData, loadData } from "../helpers/data_storage";
import { Header } from "../components/Header";
import { loadTheme, saveTheme } from "../helpers/theme_storage";
const App: Component = () => {
  const [isDarkTheme, setIsDarkTheme] = createSignal(loadTheme());
  const [outputTab, setOutputTab] = createSignal(0);
  const [jsEditorVal, setJsEditorVal] = createSignal("");
  let initVal = loadData("code_value");
  if (initVal == undefined) {
    initVal = mainOCRREF;
  }
  const [ocrEditorVal, setOcrEditorVal] = createSignal(initVal);
  createEffect(() => {
    saveTheme(isDarkTheme());
  });
  const applyCompilation = throttle(async (res: string) => {
    setJsEditorVal(res);
  }, 250);
  const updateStorage = throttle(async (str: string) => {
    storeData("code_value", str);
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
    updateStorage(ocrEditorVal());
    resultWorker.postMessage({ action: "compile", data: [["main", ocrEditorVal()]] });
  });
  return (
    <div class={`${isDarkTheme() ? "dark" : ""} m-0 h-full p-0`}>
      <div class="dark:text-light-100 m-0 h-full p-0 dark:bg-[#1e1e1e]">
        <div class="h-1/20">
          <Header
            isDarkTheme={isDarkTheme()}
            setIsDarkTheme={(x: boolean) => {
              setIsDarkTheme(x);
            }}
          />
        </div>
        <Editors
          isDarkTheme={isDarkTheme()}
          ocrEditorVal={ocrEditorVal()}
          setOcrEditorVal={(str: string) => {
            setOcrEditorVal(str);
          }}
          setOutputTab={(x: number) => {
            setOutputTab(x);
          }}
          outputTab={outputTab()}
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
