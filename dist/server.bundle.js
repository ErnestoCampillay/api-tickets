/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "http"
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
(module) {

module.exports = require("http");

/***/ },

/***/ "./src/server.js"
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n\nconst PORT = process.env.PORT || 3000;\nconst APP_NAME = process.env.APP_NAME || \"API de Tickets\";\nconst server = http__WEBPACK_IMPORTED_MODULE_0__.createServer((req, res) => {\n  res.setHeader(\"Content-Type\", \"application/json\");\n  if (req.url === \"/\" && req.method === \"GET\") {\n    res.writeHead(200); // 200 significa \"OK\"\n    res.end(JSON.stringify({\n      mensaje: `¡Bienvenido a ${APP_NAME}!`\n    }));\n  } else if (req.url === \"/health\" && req.method === \"GET\") {\n    res.writeHead(200);\n    res.end(JSON.stringify({\n      status: \"ok\"\n    }));\n  } else if (req.url === \"/version\" && req.method === \"GET\") {\n    res.writeHead(200);\n    res.end(JSON.stringify({\n      version: \"1.0.0\"\n    }));\n  } else if (req.url === \"/tickets\" && req.method === \"GET\") {\n    // tickets simulados (inventados)\n    const ticketsDeEjemplo = [{\n      id: 1,\n      titulo: \"Fallo en la conexión Wi-Fi\",\n      estado: \"abierto\"\n    }, {\n      id: 2,\n      titulo: \"Actualización de software\",\n      estado: \"en progreso\"\n    }, {\n      id: 3,\n      titulo: \"Reemplazo de teclado\",\n      estado: \"cerrado\"\n    }];\n    res.writeHead(200);\n    res.end(JSON.stringify(ticketsDeEjemplo));\n  } else {\n    res.writeHead(404);\n    res.end(JSON.stringify({\n      error: \"Ruta no encontrada\"\n    }));\n  }\n});\nserver.listen(PORT, () => {\n  console.log(`🚀 ${APP_NAME} escuchando en http://localhost:${PORT}`);\n});\n\n//# sourceURL=webpack://tickets/./src/server.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	let __webpack_exports__ = __webpack_require__("./src/server.js");
/******/ 	
/******/ })()
;