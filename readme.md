# simple-multithread

Based on [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) supported by [all modern browsers](https://caniuse.com/#feat=webworkers).

TypeScript-ready.

## Example 1

Multithreading is simple

```js
async function main() {
    const args = [ 10, 20 ];
    const result = await execAsync((a, b) => {
        return a + b;
    }, args);
    console.log(result); // 30
}
```

## Example 2

```js
// import function execAsync(func, args)

function testCase() {
	let total = 0;
	for(let i = 0; i < 99999999; ++i) {
		total += Math.random() * 2;
    }
	return total;
}

async function test1() {
	console.time('single thread');
	testCase();
	testCase();
	testCase();
	console.timeEnd('single thread');
}

async function test2() {
	console.time('multi thread');
	await Promise.all([
		execAsync(testCase, []),
		execAsync(testCase, []),
		execAsync(testCase, [])
	]);
	console.timeEnd('multi thread');
}
```

Results

```
single thread: 3907.119140625ms
multi thread: 2017.375732421875ms
```

## API

```ts
async function execAsync<ReturnT>(thread: (...args: any[]) => ReturnT, args: any[]): Promise<ReturnT>;
```

## Limitations

Only plain type values for arguments.  
No access to variables in scope, only arguments.  
No native functions or functions defined in other origin.

## Working on

* Callback support

### PS

There is much complex library - [threads](https://www.npmjs.com/package/threads).