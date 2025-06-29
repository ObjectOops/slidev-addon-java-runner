import { defineCodeRunnersSetup } from '@slidev/types'
// import { useNav } from '@slidev/client'

const JAVA_DEFAULT_VERSION = 8;

let output: HTMLPreElement;

function loadScript(cdn: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = cdn;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load CheerpJ.`));
        document.head.appendChild(script);
    })
}

async function setupCheerpJ(): Promise<void> {
    // console.log('Obtaining headmatter configuration.');
    // const { slides } = useNav();
    // // @ts-expect-error
    // const javaVersion = slides.value[0].meta.slide.frontmatter?.java?.version 
    //     ?? JAVA_DEFAULT_VERSION;
    // console.log(`Using Java version ${javaVersion}.`);
    console.log('Initializing CheerpJ...');
    // await cheerpjInit({version: javaVersion});
    await cheerpjInit({version: JAVA_DEFAULT_VERSION});
    console.log('Obtaining tools.jar...');
    const toolsJarFile = await fetch(new URL('../bootstrap/tools.jar', import.meta.url));
    cheerpOSAddStringFile("/str/tools.jar", await toolsJarFile.bytes());
    console.log('Creating output console.');
    // Undocumented feature: CheerpJ implicitly looks for `#console` to write to.
    output = document.createElement('pre');
    output.id = "console";
    document.body.appendChild(output);
    console.log('Initialization complete.')
}

export default defineCodeRunnersSetup(async () => {
    await loadScript('https://cjrtnc.leaningtech.com/4.2/loader.js');
    await setupCheerpJ();
    return {
        async java(code, ctx) {
            const isEntrypoint = (ctx.options.entrypoint ?? true) as boolean;
            let filePath = ctx.options['file_path'];
            const additionalSources = (ctx.options.addSources ?? []) as string[];
            const args = (ctx.options.args ?? []) as string[];
            if (!isEntrypoint && filePath === undefined) {
                return {error:'Must specify file path.'};
            }
            filePath ??= 'Main.java';
            cheerpOSAddStringFile(`/str/${filePath}`, code);
            return isEntrypoint 
                ? await compileAndRunMain(filePath as string, code, additionalSources, args) 
                : {text: "File added."};
        }
    }
})

async function compileAndRunMain(
    filePath: string, fileContents: string, additionalSources: string[], args: string[]
) {
    output.innerText = '';
    console.log('Started compiling.');
    let processCode = await cheerpjRunMain(
        "com.sun.tools.javac.Main", 
        "/str/tools.jar:/files/", 
        `/str/${filePath}`, 
        ...additionalSources.map((src) => `/str/${src}`), 
        "-d", 
        "/files/", 
        '-Xlint'
    );
    console.log('Finished compiling.');
    if (processCode == 0) {
        output.innerText = '';
        const classNameFull = deriveMainClass(filePath, fileContents);
        console.log(`Started process ${classNameFull}.`);
        processCode = await cheerpjRunMain(classNameFull, "/str/tools.jar:/files/", ...args);
        console.log('Finished process.');
        if (processCode != 0) {
            output.textContent += `\n\x1b[91mProcess exited with code ${processCode}.\x1b[0m`;
        }
        return {text: output.textContent ?? "", highlightLang: 'ansi'};
    }
    return {error: output.textContent ?? ""}
}

// Reference: https://github.com/leaningtech/javafiddle/blob/main/src/lib/CheerpJ.svelte#L44
function deriveMainClass(filePath: string, fileContents: string) {
    const className = filePath.split('/').pop()!.replace('.java', '');
    const match = fileContents.match(/package\s+(.+);/);
    if (match && match.length > 1) {
        const packageName = match[1];
        return `${packageName}.${className}`;
    } else {
        return className;
    }
}
