import { Component, createEffect, createSignal, on, Show } from "solid-js";
import { throttle } from "@solid-primitives/scheduled";
import { Editors } from "./Editors";
import { Header } from "../components/Header";
import { loadTheme, saveTheme } from "../helpers/theme_storage";
import { useAppContext } from "../providers/StateProvider";
import stdlibJS from "../defaultFiles/std_lib.js?raw";

const Main: Component = () => {
  const ctx = useAppContext();
  const [isDarkTheme, setIsDarkTheme] = createSignal(loadTheme());
  const [outputTab, setOutputTab] = createSignal(0);
  const [jsEditorVal, setJsEditorVal] = createSignal("");
  const [ocrEditorVal, setOcrEditorVal] = createSignal(ctx.tabs()[ctx.currentTab()].content);
  createEffect(() => {
    setOcrEditorVal(ctx.tabs()[ctx.currentTab()].content);
  });
  //   let initVal = loadData("code_value");
  //   if (initVal == undefined) {
  //     initVal = mainOCRREF;
  //   }
  createEffect(() => {
    saveTheme(isDarkTheme());
  });
  const applyCompilation = throttle(async (res: string) => {
    setJsEditorVal(res);
  }, 250);
  const resultWorker = new Worker(new URL("../workers/compilerWorker.ts", import.meta.url), { type: "module" });
  resultWorker.onmessage = (evt) => {
    const evtData = evt.data;
    if (evtData.status == "success") {
      let compiledCode = "";
      const data = evtData.compiledCode;
      for (let i = 0; i < data.length; i++) {
        const file = data[i];
        const compilationRes = file[1];
        compiledCode += compilationRes;
      }
      compiledCode = stdlibJS + compiledCode;
      applyCompilation(compiledCode);
    }
  };
  const compile = throttle(() => {
    const tabs = ctx.tabs() as any;
    const keys = Object.keys(tabs);
    let tabsArr: string[][] = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      tabsArr.push([tabs[key].name, tabs[key].content]);
    }
    resultWorker.postMessage({ action: "compile", data: tabsArr });
  }, 300);
  createEffect(
    on(ocrEditorVal, () => {
      let tabs = ctx.tabs();
      tabs[ctx.currentTab()].content = ocrEditorVal();
      ctx.setTabs([...tabs]);
    }),
  );
  createEffect(
    on(ocrEditorVal, () => {
      compile();
    }),
  );
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

export default Main;
