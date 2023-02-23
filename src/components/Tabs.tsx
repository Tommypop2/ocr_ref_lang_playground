import { For } from "solid-js";
type Tab = {
  name: string;
  value: string;
};
interface TabsProps {
  tabs: Tab[];
  setTabs: (x: string[][]) => void;
}
interface TabViewProps {
  tab: Tab;
}
function TabView(props: TabViewProps) {
  return (
    <div class="rounded-t-m h-full cursor-pointer rounded-t-lg bg-[#6b7280] px-2 dark:bg-[#3c3c3c]">
      <div class="mt-1 select-none pt-2">{props.tab.name}</div>
    </div>
  );
}
export default function Tabs(props: TabsProps) {
  return (
    <div class="h-full">
      <For each={props.tabs}>
        {(item, index) => {
          return TabView({ tab: item });
        }}
      </For>
    </div>
  );
}
