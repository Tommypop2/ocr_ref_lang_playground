import { Accessor, createEffect, createSignal, Show } from "solid-js";
import { Editor } from "../components/Editor";
import { Result } from "../components/Result";
import { arrowPath, trash, noSymbol } from "solid-heroicons/outline";
import { Icon } from "solid-heroicons";
import mainOCRREF from "../defaultFiles/main.ocrref?raw";

interface EditorsProps {
  isDarkTheme: boolean;
  ocrEditorVal: string;
  setOcrEditorVal: (str: string) => void;
  outputTab: number;
  setOutputTab: (x: number) => void;
  jsEditorVal: string;
  setJsEditorVal: (str: string) => void;
}
export function Editors(props: EditorsProps) {
  const [rerun, setRerun] = createSignal(false);
  const [outputs, setOutputs] = createSignal<string[]>([]);
  return (
    <div class="h-19/20 flex flex-row">
      <div class="w-6/10 h-full">
        <div class="h-1/20 flex-row">
          <button
            class="ml-auto cursor-pointer justify-end space-x-2 px-2 py-2"
            onclick={() => {
              setOutputs([]);
              props.setOcrEditorVal(mainOCRREF);
            }}
          >
            <Icon path={trash} class="h-5" />
            <span class="sr-only">Reset Editor</span>
          </button>
        </div>
        <div class="h-19/20">
          <Editor
            isDarkTheme={props.isDarkTheme}
            onContentChange={(str) => {
              props.setOcrEditorVal(str);
            }}
            value={props.ocrEditorVal}
          ></Editor>
        </div>
      </div>
      <div class="w-4/10 h-full">
        <div class="h-1/20">
          <button
            class="w-2/16 transition duration-300 ease-linear"
            onclick={() => {
              setRerun((prev) => !prev);
            }}
          >
            <Icon path={rerun() ? arrowPath : noSymbol} class="h-6"></Icon>
          </button>
          <button
            class={
              props.outputTab == 0
                ? `w-7/16 h-full border-b border-b-gray-400 bg-gray-700 text-sm font-medium text-gray-100 hover:bg-gray-600`
                : `w-7/16 h-full bg-gray-500 text-sm font-medium text-gray-100 hover:bg-gray-600`
            }
            onClick={() => {
              props.setOutputTab(0);
            }}
          >
            Result
          </button>
          <button
            class={
              props.outputTab == 1
                ? `w-7/16 h-full border-b border-b-gray-400 bg-gray-700 text-sm font-medium text-gray-100 hover:bg-gray-600`
                : `w-7/16 h-full bg-gray-500 text-sm font-medium text-gray-100 hover:bg-gray-600`
            }
            onClick={() => {
              props.setOutputTab(1);
            }}
          >
            Output
          </button>
        </div>
        <div class="h-19/20">
          <Show
            when={props.outputTab == 0}
            fallback={
              <Editor
                isDarkTheme={props.isDarkTheme}
                onContentChange={(str) => {
                  props.setJsEditorVal(str);
                }}
                value={props.jsEditorVal}
                language="javascript"
              ></Editor>
            }
          >
            <Result
              compiledOutput={props.jsEditorVal}
              rerunOnChanges={rerun()}
              outputs={outputs()}
              setOutputs={setOutputs}
            ></Result>
          </Show>
        </div>
      </div>
    </div>
  );
}
