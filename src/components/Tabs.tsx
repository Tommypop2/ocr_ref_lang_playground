import { Icon } from "solid-heroicons";
import { createEffect, For, Show } from "solid-js";
import { plus, xCircle } from "solid-heroicons/outline";
import { useAppContext } from "../providers/StateProvider";
interface TabsProps {
  tabs: Tab[];
  setTabs: (x: Tab[]) => void;
  currentTab: number;
  setCurrentTab: (x: number) => void;
}
export default function Tabs(props: TabsProps) {
  return (
    <div class="flex h-full flex-row gap-2">
      <For each={props.tabs}>
        {(item, index) => {
          return (
            <div
              onclick={() => {
                const len = props.tabs.length;
                if (len <= index()) {
                  return;
                }
                props.setCurrentTab(index());
              }}
            >
              <div
                class={
                  index() == props.currentTab
                    ? "rounded-t-m flex h-full cursor-pointer flex-row rounded-t-lg border bg-[#3c3f46] px-2 dark:bg-[#2b2b2b]"
                    : "rounded-t-m flex h-full cursor-pointer flex-row rounded-t-lg bg-[#6b7280] px-2 dark:bg-[#3c3c3c]"
                }
              >
                <div class="mt-1 select-none pt-2">{item.name}</div>
                <Show when={index() != 0}>
                  <button
                    class="h-full w-6"
                    onclick={() => {
                      props.setCurrentTab(index() - 1);
                      let newTabs = props.tabs;
                      newTabs.splice(index(), 1);

                      props.setTabs([...newTabs]);
                    }}
                  >
                    <Icon path={xCircle} class="align-middle"></Icon>
                  </button>
                </Show>
              </div>
            </div>
          );
        }}
      </For>
      <button
        class="h-full w-7"
        onclick={() => {
          const newTab: Tab = { name: "tab-" + props.tabs.length, content: "" };
          const newTabs = [...props.tabs, newTab];
          props.setTabs(newTabs);
        }}
      >
        <Icon path={plus} class="align-middle"></Icon>
      </button>
    </div>
  );
}
