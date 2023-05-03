// Currently compiler dumps "await" everywhere. This is necessary for inputs
// to work, as the main thread on web workers cannot be blocked whilst still
// having them receive messages. Therefore, the web worker must await a
// promise. Eventually, the 'Result' window will go inside of an iframe,
// which should remove this problem, as print and input methods
// will be able to directly manipulate the DOM
async function print(...data) {
  $global.log(data);
}
async function input(prompt) {
  if (prompt) $global.log(prompt);
  return $global.input();
}
// Casts
async function str(data) {
  return data.toString();
}
async function int(data) {
  return parseInt(data);
}
async function float(data) {
  return parseFloat(data);
}
async function bool(data) {
  return data == true;
}
