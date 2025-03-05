import chalk from "chalk";

function chalkish(template, ...substitutions) {
  let result = template.reduce(
    (accum, part, i) => accum + part + (substitutions[i] || ""),
    "",
  );

  const stylePattern = /\{([\w\\.\\(\\),\s]+?)\s(.*?)\}/g;

  result = result.replace(stylePattern, (match, styleInstructions, text) => {
    // Initial chalk function
    let currentStyle = chalk;

    // Split style instructions (e.g., "rgb(255,255,255).bold")
    styleInstructions.split(".").forEach((instruction) => {
      const funcMatch = instruction.match(/^(\w+)\(([\d,\s]+)\)$/);
      if (funcMatch) {
        // Function-based styles (e.g., "rgb(255,255,255)")
        const [, methodName, methodArgs] = funcMatch;
        const args = methodArgs
          .split(",")
          .map((arg) => parseInt(arg.trim(), 10));
        if (typeof currentStyle[methodName] === "function") {
          currentStyle = currentStyle[methodName](...args);
        }
      } else {
        // Simple styles (e.g., "bold")
        if (typeof currentStyle[instruction] === "function") {
          currentStyle = currentStyle[instruction];
        }
      }
    });

    // Apply the style to the text
    return currentStyle(text);
  });

  return result;
}

const splash = () => {
  console.log(
    "font-family:monospace",
  );
};

const genericPrefixed = (msg) => {
  console.log(chalkish`{magenta [Nitro Sniper]} ${msg}`);
};

const info = (msg) => {
  genericPrefixed(`{cyan (INFO)} ${msg}`);
};

const error = (msg) => {
  genericPrefixed(`{rgb(242,46,46) (ERROR)} ${msg}`);
};

const warning = (msg) => {
  genericPrefixed(`{yellowBright (WARNING)} ${msg}`);
};

const fatal = (msg) => {
  genericPrefixed(`{rgb(242,46,46).bold (FATAL ERROR)} ${msg}`);
};

const success = (msg) => {
  genericPrefixed(`{rgb(28,232,41) [+]} ${msg}`);
};

export default {
  splash,
  info,
  error,
  warning,
  genericPrefixed,
  fatal,
  success,
};
