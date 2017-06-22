let value = 0
console.log("test2里面执行");
module.exports = {
  increment: () => value++,
  get: () => value,
}