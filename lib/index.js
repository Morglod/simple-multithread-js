"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function execAsync(func, args) {
    var funcCode = func.toString();
    // assert
    if (funcCode.endsWith(') { [native code] }')) {
        throw new Error('Cannot run native function');
    }
    var workerCode = "(() => {\n        const func = " + funcCode + ";\n        const args = JSON.parse('" + JSON.stringify(args) + "');\n        let result;\n        try { result = func(...args); }\n        catch(error) { postMessage({ error }); }\n\n        if (result instanceof Promise) {\n            result.then(x => postMessage({ result: x }))\n                  .catch(error => postMessage({ error }));\n        } else {\n            postMessage({ result });\n        }\n    })()";
    var workerCodeBlob = new Blob([workerCode], { type: 'text/javascript' });
    return new Promise(function (resolve, reject) {
        var worker = new Worker(window.URL.createObjectURL(workerCodeBlob));
        worker.onerror = function (ev) { return reject(ev.error); };
        worker.onmessage = function (ev) {
            worker.terminate();
            resolve(ev.data);
        };
    });
}
exports.execAsync = execAsync;
//# sourceMappingURL=index.js.map