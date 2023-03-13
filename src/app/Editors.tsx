import { createSignal, Show } from "solid-js";
import { Editor } from "../components/Editor";
import { Result } from "../components/Result";
import { arrowPath, trash, noSymbol } from "solid-heroicons/outline";
import { Icon } from "solid-heroicons";
import Tabs from "../components/Tabs";
import { useAppContext } from "../providers/StateProvider";
import defaultTabs from "../defaultFiles/defaultTabs";
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
  const ctx = useAppContext();
  const [rerun, setRerun] = createSignal(false);
  const [outputs, setOutputs] = createSignal<string[]>([]);
  return (
    <div class="h-19/20 flex flex-row">
      <div class="w-6/10 h-full">
        <div class="h-1/20 flex flex-row">
          <div class="ml-16 h-full">
            <Tabs
              tabs={ctx.tabs()}
              setTabs={ctx.setTabs}
              currentTab={ctx.currentTab()}
              setCurrentTab={ctx.setCurrentTab}
            ></Tabs>
          </div>
          <button
            class="ml-auto block cursor-pointer justify-end space-x-2 px-2 py-2"
            onclick={() => {
              const res = confirm("Are you sure you want to reset the editor?");
              if (!res) return;
              setOutputs([]);
              ctx.setTabs(defaultTabs());
            }}
            title="Reset Editor"
          >
            <Icon path={trash} class="h-7" />
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
        <div class="h-1/20 flex flex-row">
          <button
            class="w-2/16"
            onclick={() => {
              setRerun((prev) => !prev);
            }}
            title={rerun() ? "Stop auto reloading" : "Start auto reloading"}
          >
            <Icon path={rerun() ? arrowPath : noSymbol} class="h-7"></Icon>
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
