import { createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";

interface ResultProps {
  compiledOutput: string;
}

interface Window extends globalThis.Window {
  resultWorker?: Worker;
}
export function Result(props: ResultProps) {
  const [outputs, setOutputs] = createSignal<string[]>([]);
  const [isProgramRunning, setIsProgramRunning] = createSignal(false);
  const [needsInput, setNeedsInput] = createSignal(false);
  let outputsDisplay: HTMLDivElement | undefined;
  const createWorker = () => {
    const resultWorker = new Worker(new URL("../workers/resultWorker.js", import.meta.url), { type: "module" });
    (window as Window).resultWorker = resultWorker;
    resultWorker.onmessage = (e) => {
      if (e.data.action == "print") {
        const outputStr = e.data.data as string;
        setOutputs((x) => [...x.slice(-200), outputStr]);
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
    setIsProgramRunning(false);
    setNeedsInput(false);
  };
  const restartWorker = () => {
    terminateWorker();
    createWorker();
  };
  createWorker();
  const runProgram = () => {
    setOutputs((x) => [...x, "Running program"]);
    (window as Window).resultWorker?.postMessage({ action: "run", data: props.compiledOutput });
    setIsProgramRunning(true);
  };
  onMount(() => {
    runProgram();
  });
  onCleanup(() => {
    (window as Window).resultWorker?.terminate();
  });
  return (
    <div class="flex-column h-full w-full justify-center">
      <div class="absolute right-12">
        <Show
          when={isProgramRunning()}
          fallback={
            <button
              class="w-18 flex h-10 justify-center rounded bg-gray-600 text-center"
              onClick={() => {
                runProgram();
              }}
            >
              Run
            </button>
          }
        >
          <button
            class="w-18 flex h-10 justify-center rounded bg-gray-600 text-center"
            onClick={() => {
              restartWorker();
            }}
          >
            Terminate
          </button>
        </Show>

        <button
          class="w-18 flex h-10 justify-center rounded bg-gray-600 text-center"
          onClick={() => {
            setOutputs([]);
          }}
        >
          Clear
        </button>
      </div>
      <div class="h-9/10 w-full flex-col overflow-y-scroll" ref={outputsDisplay}>
        <For each={outputs()}>
          {(item, index) => {
            return (
              <div>
                <span class="m-0 h-full select-none p-0 text-gray-500">{index() + 1}</span>
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
              (window as Window).resultWorker?.postMessage({ action: "input_data", data: e.currentTarget.value });
              setNeedsInput(false);
            }
          }}
          class="dark:text-light-50 focus:shadow-outline w-full rounded border leading-tight text-gray-700 shadow focus:outline-none dark:bg-[#1e1e1e]"
          type="text"
          placeholder="Input"
        />{" "}
        <div class={`h-4 w-4 ${needsInput() ? "bg-light-50" : ""}`}></div>
      </div>
    </div>
  );
}
