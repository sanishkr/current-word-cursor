const debounce = (fn, delay) => {
  let timerId = null;
  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};

export { debounce };
