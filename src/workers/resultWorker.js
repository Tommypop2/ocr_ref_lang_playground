onmessage = async (e) => {
  console.log(e);
  if (e.data.action === "run") {
    const data = e.data.data;
    var $global = {
      log: (data) => {
        postMessage({ action: "print", data: data });
      },
      input: async () => {
        postMessage({ action: "input_data" });
        const data = await new Promise((res, rej) => {
          self.addEventListener("message", ({ data }) => {
            if (data.action == "input_data") {
              console.log(data.data);
              res(data.data);
            }
          });
        });
        return data;
      },
    };
    const res = eval(data);
    res.then((e) => {
      postMessage({ action: "program_terminated" });
    });
  }
};
