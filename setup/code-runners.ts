import { defineCodeRunnersSetup } from '@slidev/types'

function loadScript(cdn: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = cdn;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load CheerpJ.`));
        document.head.appendChild(script);
    })
}

await loadScript('https://cjrtnc.leaningtech.com/4.2/loader.js');

console.log('Initializing CheerpJ...');
await cheerpjInit();
console.log('Obtaining tools.jar...');
cheerpOSAddStringFile("/str/tools.jar", await (await fetch('bootstrap/tools.jar')).bytes());
console.log('Creating output console.');
// Undocumented feature: CheerpJ implicitly looks for `#console` to write to.
const output = document.createElement('div');
output.id = "console";
document.body.appendChild(output);
console.log('Initialization complete.')

export default defineCodeRunnersSetup(() => {
    return {
        async java(code, ctx) {
            cheerpOSAddStringFile("/str/Main.java", code);
            output.innerText = '';
            console.log('Started compiling.');
            let processCode = await cheerpjRunMain("com.sun.tools.javac.Main", "/str/tools.jar:/files/", "/str/Main.java", "-d", "/files/", '-Xlint');
            console.log('Finished compiling.');
            if (processCode == 0) {
                output.innerText = '';
                console.log('Started process.');
                processCode = await cheerpjRunMain("Main", "/str/tools.jar:/files/");
                console.log('Finished process.');
                return {text: output.innerText}
            }
            return {text: output.innerText}
        }
    }
})

// Should add:
// - Get stdout. (Implicitly looks for console. Create a dummy one and then delete it.)
// - Define Java version.
// - Way to define entrypoint or just add to fs.
// - Way to define package name for entrypoint.
