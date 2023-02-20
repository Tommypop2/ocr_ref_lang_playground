export const storeData = (key: string, data: string) => {
  if (window.localStorage !== undefined) {
    localStorage.setItem(key, data);
  }
};
export const loadData = (key: string) => {
  if (window.localStorage !== undefined) {
    const data = localStorage.getItem(key);
    if (data == null) {
      return undefined;
    }
    return data;
  }
};
