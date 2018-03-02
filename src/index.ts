export function execAsync<ReturnT = any>(func: (...args: any[]) => ReturnT, args: any[]): Promise<ReturnT> {
    const funcCode = func.toString();

    // assert
    if (funcCode.endsWith(') { [native code] }')) {
        throw new Error('Cannot run native function');
    }

    const workerCode = `(() => {
        const func = ${funcCode};
        const args = JSON.parse('${JSON.stringify(args)}');
        let result;
        try { result = func(...args); }
        catch(error) { postMessage({ error }); }

        if (result instanceof Promise) {
            result.then(x => postMessage({ result: x }))
                  .catch(error => postMessage({ error }));
        } else {
            postMessage({ result });
        }
    })()`;

    const workerCodeBlob = new Blob([ workerCode ], { type: 'text/javascript' });

    return new Promise<ReturnT>((resolve, reject) => {
        const worker = new Worker(window.URL.createObjectURL(workerCodeBlob));
        worker.onerror = ev => reject(ev.error);
        worker.onmessage = ev => {
            worker.terminate();
            resolve(ev.data as ReturnT);
        };
    });
}
