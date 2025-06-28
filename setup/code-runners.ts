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

export default defineCodeRunnersSetup(() => {
    return {
        async java(code, ctx) {
            cheerpOSAddStringFile("/str/Main.java", code);
            const processCode = await cheerpjRunMain("com.sun.tools.javac.Main", "/str/tools.jar:/files/", "/str/Main.java", "-d", "/files/", '-Xlint');
            if (processCode == 0) {
                cheerpjRunMain("what.Main", "/str/tools.jar:/files/");
            }
            return {
                text: "TESTING"
            }
        }
    }
})
