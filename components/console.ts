export const consoleScript = () => `
 <script>
              function p(t) {
                  if (t.length > 1) {
                      const l = t[1].getLineNumber();
                      const c = t[1].getColumnNumber();
                      return [l, c];
                  }
                  return [1, 0];
              }
              function cs() {
                  const pst = Error.prepareStackTrace;
                  try {
                      let r = [];
                      Error.prepareStackTrace = (_, cs) => {
                          const cwc = cs.slice(1);
                          r = cwc;
                          return cwc;
                      };

                      new Error().stack;
                      return r;
                  } finally {
                      Error.prepareStackTrace = pst;
                  }
              }
              Object.defineProperty(window, "_runjs", {
                  enumerable: false,
                  configurable: false,
                  writable: false,
                  value: {
                      cc: 0,
                      le: false,
                  },
              });
              Object.seal(window._runjs);

              window.parent.postMessage({ type: "sandbox:ready" }, "*");
              const originalSetTimeout = setTimeout;
              const originalSetInterval = setInterval;
              const originalRequestAnimationFrame = window.requestAnimationFrame;

              console.log = (...args) => {
                  const t = cs();
                  const [l, c] = p(t);
                  window._runjs.cc += 1;
                  originalSetTimeout(() =>
                      window.parent.postMessage(
                          {
                              type: "sandbox:consolelog",
                              message: args,
                              position: { line: l, column: c },
                              count: window._runjs.cc,
                              initial: !window._runjs.le,
                          },
                          "*"
                      )
                  );
                  if (window._runjs.cc > 2000) {
                    throw new Error("Infinite loop detected");
                  }
              };
              console.error = console.log;
              console.info = console.log;
              console.debug = console.log;
              console.warn = console.log;
              window.alert = console.log;
              window.prompt = window.confirm = window.print = () => {};

              function isPromise(value) {
                  return Boolean(value && typeof value.then === "function");
              }

              function exec(code) {
                 if (!code) return Promise.resolve();
                     return new Promise(function (resolve, reject) {
                      let result;
                      try {
                      // Detectar bucles while y agregar un contador de iteraciones
                      const modifiedCode = code.replace(/while\s*\((.*?)\)\s*{/, (match, condition) => {
                          return \`\let _iter = 0; while (\${condition}) { if (++_iter > 2000) throw new Error('Infinite loop detected');\`\;
                      });
                      result = eval.call(null, modifiedCode);
                      } catch (error) {
                          reject(\`\${error.name || "Error"}: \${error.message || error}\`\);
                      }
                      resolve(result);
                  });
              }

              window.addEventListener("message", (event) => {
                  if (event.data?.type === "sandbox:evaluate") {
                      window._runjs.cc = 0;
                      const line = event.data.line;
                      const expression = event.data.expression;
                      window._runjs.le = event.data.lastExpression;

                      exec(expression)
                          .then((result) => {
                              window.parent.postMessage(
                                  {
                                      type: "sandbox:log",
                                      message: result,
                                      position: { line: parseInt(line, 10), column: 0 },
                                  },
                                  "*"
                              );
                          })
                          .catch((result) => {
                              window.parent.postMessage(
                                  {
                                      type: "sandbox:error",
                                      message: result,
                                      position: { line: parseInt(line, 10), column: 0 },
                                  },
                                  "*"
                              );
                          });
                  }
              });

              function fnHandler(fn) {
                  return function () {
                      if (window._runjs.le) {
                          return fn.apply(this, arguments);
                      }
                      return;
                  };
              }

              setTimeout = fnHandler(originalSetTimeout);
              setInterval = fnHandler(originalSetInterval);
              window.requestAnimationFrame = fnHandler(originalRequestAnimationFrame);
          </script>
`