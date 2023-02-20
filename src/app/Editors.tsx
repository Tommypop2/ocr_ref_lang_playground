import { Accessor, createEffect, Show } from "solid-js";
import { Editor } from "../components/Editor";
import { Result } from "../components/Result";
interface EditorsProps {
  isDarkTheme: boolean;
  ocrEditorVal: string;
  setOcrEditorVal: (str: string) => void;
  showResult: boolean;
  setShowResult: (x: boolean) => void;
  jsEditorVal: string;
  setJsEditorVal: (str: string) => void;
}
export function Editors(props: EditorsProps) {
  return (
    <div class="h-19/20 flex flex-row">
      <div class="w-6/10 h-full">
        <div class="h-1/20"></div>
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
            class={
              props.showResult
                ? `h-full w-1/2 border-b border-b-gray-400 bg-gray-700 text-sm font-medium text-gray-100 hover:bg-gray-600`
                : `h-full w-1/2 bg-gray-500 text-sm font-medium text-gray-100 hover:bg-gray-600`
            }
            onClick={() => {
              props.setShowResult(true);
            }}
          >
            Result
          </button>
          <button
            class={
              !props.showResult
                ? `h-full w-1/2 border-b border-b-gray-400 bg-gray-700 text-sm font-medium text-gray-100 hover:bg-gray-600`
                : `h-full w-1/2 bg-gray-500 text-sm font-medium text-gray-100 hover:bg-gray-600`
            }
            onClick={() => {
              props.setShowResult(false);
            }}
          >
            Output
          </button>
        </div>
        <div class="h-19/20">
          <Show
            when={props.showResult}
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
            <Result compiledOutput={props.jsEditorVal}></Result>
          </Show>
        </div>
      </div>
    </div>
  );
}
