$std: {
  async function print(data) {
    $global.log(data);
  }
  async function input() {
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
}
