import { Icon } from "solid-heroicons";
import { moon, sun } from "solid-heroicons/outline";

interface HeaderProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (x: boolean) => void;
}
export function Header(props: HeaderProps) {
  return (
    <div class="flex h-full flex-row">
      <div class="text-4xl">OCR Reference Language Playground</div>
      <button
        class="ml-auto flex justify-end"
        onclick={() => {
          props.setIsDarkTheme(!props.isDarkTheme);
        }}
        title={props.isDarkTheme ? "Light mode" : "Dark mode"}
      >
        <Icon path={props.isDarkTheme ? sun : moon} class="h-11"></Icon>
      </button>
    </div>
  );
}
