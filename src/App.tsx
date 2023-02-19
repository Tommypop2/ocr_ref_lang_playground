import { Component, createEffect, createSignal, Show } from "solid-js";
import mainOCRREF from "./defaultFiles/main.ocrref?raw";
import stdlibJS from "./defaultFiles/std_lib.js?raw";
import { Editor } from "./components/Editors";
import { compile } from "../compiler";
import { throttle } from "@solid-primitives/scheduled";
import { Result } from "./components/Result";
const App: Component = () => {
  const [isDarkTheme, setIsDarkTheme] = createSignal(true);
  const [showResult, setShowResult] = createSignal(false);
  const [jsEditorVal, setJsEditorVal] = createSignal("");
  const [compiledOutput, setCompiledOutput] = createSignal("");
  const [ocrRefLangEditorVal, setOcrRefLangEditorVal] = createSignal("");
  const [newOcrEditorVal, setNewOcrEditorVal] = createSignal(mainOCRREF);
  const applyCompilation = throttle(async (res: string) => {
    setCompiledOutput(res);
  }, 250);
  createEffect(async () => {
    const output = await compile([["main", ocrRefLangEditorVal()]], stdlibJS);
    const file = output[0];
    const res = file[1];
    applyCompilation(res);
  });
  
  return (
    <div class="dark m-0 h-full p-0">
      <div class="dark:text-light-100 m-0 h-full p-0 dark:bg-[#1e1e1e]">
        <header class="h-1/20 px-6 py-3 text-4xl">OCR Reference Language Playground</header>
        <div class="h-19/20 flex flex-row">
          <div class="w-6/10 h-full">
            <div class="h-1/20"></div>
            <div class="h-19/20">
              <Editor
                isDarkTheme={isDarkTheme()}
                onContentChange={(str) => {
                  setOcrRefLangEditorVal(str);
                }}
                newValue={newOcrEditorVal()}
              ></Editor>
            </div>
          </div>
          <div class="w-4/10 h-full">
            <div class="h-1/20">
              <button
                class="h-full w-1/2 bg-gray-500 text-sm font-medium text-gray-100 hover:bg-gray-600"
                onClick={() => {
                  setShowResult(true);
                }}
              >
                Result
              </button>
              <button
                class="h-full w-1/2 bg-gray-500 text-sm font-medium text-gray-100 hover:bg-gray-600"
                onClick={() => {
                  setShowResult(false);
                }}
              >
                Output
              </button>
            </div>
            <div class="h-19/20">
              <Show
                when={showResult()}
                fallback={
                  <Editor
                    isDarkTheme={isDarkTheme()}
                    onContentChange={(str) => {
                      setJsEditorVal(str);
                    }}
                    newValue={compiledOutput()}
                    language="javascript"
                  ></Editor>
                }
              >
                <Result compiledOutput={compiledOutput()}></Result>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
