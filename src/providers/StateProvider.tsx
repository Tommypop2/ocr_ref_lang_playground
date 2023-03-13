import { throttle } from "@solid-primitives/scheduled";
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  equalFn,
  on,
  ParentComponent,
  Setter,
  useContext,
} from "solid-js";
import { loadData, storeData } from "../helpers/data_storage";
import defaultTabs from "../defaultFiles/defaultTabs";
interface AppContextType {
  tabs: Accessor<Tab[]>;
  setTabs: (x: Tab[]) => void;
  currentTab: Accessor<number>;
  setCurrentTab: (x: number) => void;
  saveTabs: () => void;
}

const AppContext = createContext<AppContextType>();
const serialiseTabs = throttle((tabs: Tab[]) => {
  storeData("tabs", JSON.stringify(tabs));
}, 500);
export const StateProvider: ParentComponent = (props) => {
  const loadedTabs = loadData("tabs");
  const [tabs, setTabs] = createSignal<Tab[]>(loadedTabs != undefined ? JSON.parse(loadedTabs) : defaultTabs());
  const [currentTab, setCurrentTab] = createSignal(0);
  createEffect(
    on([tabs, currentTab], () => {
      serialiseTabs(tabs());
    }),
  );
  return (
    <AppContext.Provider
      value={{
        tabs,
        setTabs(x: Tab[]) {
          setTabs(x);
        },
        currentTab,
        setCurrentTab(x) {
          setCurrentTab(x);
        },
        saveTabs() {
          serialiseTabs(tabs());
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext)!;
