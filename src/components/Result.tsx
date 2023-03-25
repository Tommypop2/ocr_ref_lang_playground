import { throttle } from "@solid-primitives/scheduled";
import { createEffect, createSignal, For, onCleanup, Setter, Show } from "solid-js";
import { play, stop, trash } from "solid-heroicons/outline";
import { Icon } from "solid-heroicons";
interface ResultProps {
  compiledOutput: string;
  rerunOnChanges: boolean;
  outputs: string[];
  setOutputs: Setter<string[]>;
}

interface Window extends globalThis.Window {
  resultWorker?: Worker;
}
export function Result(props: ResultProps) {
  const [isProgramRunning, setIsProgramRunning] = createSignal(false);
  const [needsInput, setNeedsInput] = createSignal(false);
  let outputsDisplay: HTMLDivElement | undefined;
  const createWorker = () => {
    const resultWorker = new Worker(new URL("../workers/resultWorker.ts", import.meta.url), { type: "module" });
    (window as Window).resultWorker = resultWorker;
    resultWorker.onmessage = (e) => {
      if (e.data.action == "print") {
        let outputArr: string[] = [];
        let data = e.data.data;
        if (data.length == 1) {
          //Todo: Make arguments spread into print print as comma separated strings, not as an array
          data = data[0]; // Removes square brackets around single outputs
        }
        if (typeof data == "object") {
          outputArr.push(JSON.stringify(data));
        } else {
          const outputStr = e.data.data as string;
          outputArr.push(outputStr);
        }
        props.setOutputs((x) => [...x.slice(-200), ...outputArr]);
        outputsDisplay?.scrollTo(0, outputsDisplay.scrollHeight);
      }
      if (e.data.action == "program_terminated") {
        setIsProgramRunning(false);
      }
      if (e.data.action == "input_data") {
        setNeedsInput(true);
      }
    };
  };
  const terminateWorker = () => {
    (window as Window).resultWorker?.terminate();
    (window as Window).resultWorker = undefined;
    setIsProgramRunning(false);
    setNeedsInput(false);
  };
  const runProgram = () => {
    props.setOutputs((x) => [...x, "Running program 'main.ocrref'...."]);
    // restartWorker();
    if ((window as Window).resultWorker == undefined) {
      createWorker();
    }
    (window as Window).resultWorker?.postMessage({ action: "run", data: props.compiledOutput });
    setIsProgramRunning(true);
  };
  const reRunProgram = throttle(() => {
    terminateWorker();
    runProgram();
  }, 300);
  createEffect(() => {
    props.compiledOutput.toString();
    if (props.rerunOnChanges === true) {
      reRunProgram();
    }
  });
  // createWorker();
  // onMount(() => {
  //   runProgram();
  // });
  onCleanup(() => {
    (window as Window).resultWorker?.terminate();
  });
  return (
    <div class="flex-column h-full w-full justify-center">
      <div class="absolute right-2.5 overflow-hidden">
        <button
          class="flex h-14 w-16 justify-center bg-gray-600 text-center"
          onClick={() => {
            if (isProgramRunning()) {
              props.setOutputs((prev) => [...prev, "Program 'main.ocrref' terminated"]);
              terminateWorker();
              return;
            }
            console.log((window as Window).resultWorker);
            runProgram();
          }}
          title={isProgramRunning() ? "Terminate" : "Run"}
        >
          <Icon path={isProgramRunning() ? stop : play} class="h-full"></Icon>
        </button>

        <button
          class="flex h-14 w-16 justify-center rounded-bl-2xl bg-gray-600 text-center"
          onClick={() => {
            props.setOutputs([]);
          }}
          title="Clear"
        >
          <Icon path={trash} class="h-full"></Icon>
        </button>
      </div>
      <div class="h-9/10 customScrollBar w-full flex-col overflow-y-scroll" ref={outputsDisplay}>
        <For each={props.outputs}>
          {(item, index) => {
            return (
              <div>
                <span class="relative m-0 inline-block h-full w-4 select-none p-0 text-right text-gray-500">
                  {index() + 1}
                </span>
                <span class="m-l-3">{item}</span>
              </div>
            );
          }}
        </For>
      </div>
      <div class="h-1/10 w-full">
        <input
          onkeydown={(e) => {
            if (e.key === "Enter") {
              if (!needsInput()) {
                e.currentTarget.value = "";
                return;
              }
              const text = e.currentTarget.value;
              (window as Window).resultWorker?.postMessage({ action: "input_data", data: text });
              e.currentTarget.value = "";
              props.setOutputs((prev) => [...prev, "> " + text]);

              setNeedsInput(false);
            }
          }}
          class="dark:text-light-50 focus:shadow-outline w-full rounded border leading-tight text-gray-700 shadow focus:outline-none dark:bg-[#1e1e1e]"
          type="text"
          placeholder="Input"
        />{" "}
        <Show when={needsInput()}>
          <div class={`h-4 w-full animate-pulse`}>Program requires input</div>
        </Show>
      </div>
    </div>
  );
}
