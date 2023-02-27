import { compile } from "../../compiler";
import stdlibJS from "../defaultFiles/std_lib.js?raw";
let stdLibStr = stdlibJS;
onmessage = async (evt) => {
  if (evt.data.action == "compile") {
    // const data = evt.data.data as string[][];
    const data = evt.data.data;
    const startTime = new Date();
    const result = await compile(data);
    const endTime = new Date();
    const elapsedTimeMs = endTime.getMilliseconds() - startTime.getMilliseconds();
    console.log(`Compilation took ${elapsedTimeMs}ms`);
    postMessage({ status: "success", compiledCode: result });
  }
};

export {};
