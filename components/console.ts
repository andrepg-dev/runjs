export const generateConsoleScript = () => {
  return `<script>
    const customConsole = (w) => {
      const pushToConsole = (payload, type, line) => {
        w.parent.postMessage({
          console: {
            payload: payload,
            type: type,
            line: line,
          }
        }, "*");
      }

      pushToConsole("clear", "system");

      w.onerror = (message, url, line, column) => {
        const fixedLine = line - 74;
        pushToConsole({ line: fixedLine, column: column - 1, message }, "error", fixedLine, column - 1);
      }

      const console = {
        log: function(...args){
          try {
            throw new Error();
          } catch (error) {
            const stack = error.stack.split("\\n")[2].trim();
            const line = stack.match(/:(\\d+):\\d+/)[1] - 74;
            pushToConsole(args, "log", line);
          }
        },
        error: function(...args){
          try {
            throw new Error();
          } catch (error) {
            const stack = error.stack.split("\\n")[2].trim();
            const line = stack.match(/:(\\d+):\\d+/)[1] - 74;
            pushToConsole(args, "error", line);
          }
        },
        warn: function(...args){
          try {
            throw new Error();
          } catch (error) {
            const stack = error.stack.split("\\n")[2].trim();
            const line = stack.match(/:(\\d+):\\d+/)[1] - 74;
            pushToConsole(args, "warn", line);
          }
        },
        info: function(...args){
          try {
            throw new Error();
          } catch (error) {
            const stack = error.stack.split("\\n")[2].trim();
            const line = stack.match(/:(\\d+):\\d+/)[1] - 74;
            pushToConsole(args, "info", line);
          }
        }
      }

      window.console = { ...window.console, ...console };
    }

    if (window.parent){
      customConsole(window);
    }
    </script>`;
}
