// Ensure PDFJSDev is globally available before anything else
if (typeof globalThis !== "undefined") {
  globalThis.PDFJSDev = globalThis.PDFJSDev || {};

  // Define build flags dynamically from Vite environment
  globalThis.PDFJSDev.CHROME = import.meta.env.VITE_BUILD_TARGET === "chrome";
  globalThis.PDFJSDev.GENERIC = import.meta.env.VITE_BUILD_TARGET === "generic";
  globalThis.PDFJSDev.MOZCENTRAL = import.meta.env.VITE_BUILD_TARGET === "mozcentral";
  globalThis.PDFJSDev.GECKOVIEW = import.meta.env.VITE_BUILD_TARGET === "geckoview";

  // ✅ Improved test() function that supports logical expressions
  globalThis.PDFJSDev.test = function (expression) {
    try {
      // Replace flag names with boolean values (e.g., "CHROME" → true/false)
      let evalExpression = expression.replace(/(CHROME|GENERIC|MOZCENTRAL|GECKOVIEW)/g, (match) => {
        return globalThis.PDFJSDev[match] ? "true" : "false";
      });

      // Evaluate the logical expression safely
      return new Function(`return ${evalExpression}`)();
    } catch (error) {
      console.error(`PDFJSDev.test("${expression}") failed:`, error);
      return false;
    }
  };

  // ✅ Add eval() function
  globalThis.PDFJSDev.eval = function (expression) {
    try {
      // If it's a simple flag, return its value
      if (globalThis.PDFJSDev.hasOwnProperty(expression)) {
        return globalThis.PDFJSDev[expression];
      }

      // If it's a nested object reference (e.g., 'OBJ.obj'), evaluate it safely
      return expression.split('.').reduce((acc, key) => (acc && acc[key] ? acc[key] : undefined), globalThis.PDFJSDev);
    } catch (error) {
      console.error(`PDFJSDev.eval("${expression}") failed:`, error);
      return undefined;
    }
  };

  // ✅ Example predefined objects (used in eval tests)
  globalThis.PDFJSDev.TRUE = true;
  globalThis.PDFJSDev.FALSE = false;
  globalThis.PDFJSDev.TEXT = "Hello, PDFJSDev!";
  globalThis.PDFJSDev.OBJ = { obj: "Nested object value" };
}

// ✅ Now, PDFJSDev is guaranteed to exist before any imports
console.log("PDFJSDev initialized:", globalThis.PDFJSDev);
