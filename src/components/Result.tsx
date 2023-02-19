import { createEffect, createSignal, For, onMount } from "solid-js";
interface ResultProps {
  compiledOutput: string;
}
export function Result(props: ResultProps) {
  const [outputs, setOutputs] = createSignal<string[]>([]);
  let outputsDisplay: HTMLDivElement | undefined;
  onMount(() => {
    window.addEventListener("print_event", (evt) => {
      const outputStr = (evt as any).detail as string;
      setOutputs((x) => [...x.slice(-200), outputStr]);
      outputsDisplay?.scrollTo(0, outputsDisplay.scrollHeight);
    });
  });
  return (
    <div class="flex-column h-full w-full justify-center">
      <div class="w-18 absolute right-12 flex h-10 justify-center rounded bg-gray-600 text-center">
        <button
          onClick={() => {
            setOutputs((x) => [...x, "Running program"]);
            eval(props.compiledOutput);
          }}
        >
          Run
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
          class="dark:text-light-50 focus:shadow-outline w-full rounded border leading-tight text-gray-700 shadow focus:outline-none dark:bg-[#1e1e1e]"
          type="text"
          placeholder="Input"
        />
      </div>
    </div>
  );
}
