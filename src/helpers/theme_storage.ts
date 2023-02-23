import { storeData } from "./data_storage";
import { loadData } from "./data_storage";
const key = "isDarkTheme";
export function saveTheme(isDarkTheme: boolean) {
  storeData(key, isDarkTheme.toString());
}
export function loadTheme() {
  const data = loadData(key);
  if (data == undefined) return true;
  return data == "true";
}
