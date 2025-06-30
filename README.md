# slidev-addon-java-runner

[![NPM Version](https://img.shields.io/npm/v/slidev-addon-java-runner)](https://www.npmjs.com/package/slidev-addon-java-runner)

<img width="696" alt="image" src="https://github.com/user-attachments/assets/88e7277b-d96b-40b5-8bdb-3f04279d42cc" />

Java code runner addon for Slidev. In-browser code execution using [CheerpJ](https://cheerpj.com/).
> CheerpJ is not open-source, but is free under its community license ([more details](https://github.com/leaningtech/cheerpj-meta)).

[Live Demo](https://objectoops.github.io/slidev-addon-java-runner/)

## Install

Headmatter:
```yaml
addons:
  - java-runner
```

If not automatically prompted to install:
```sh
npm install slidev-addon-java-runner
```

> [!Important]
> Although CheerpJ is loaded through a CDN, self-hosting is only provided under its **commercial license**.  
> Therefore, this addon requires an internet connection to work.

## Usage

See `example.md` for full usage.

### Basic

````md
```java {monaco-run} {autorun:false}
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```
````
> Turn autorun off to avoid redundant recompilation and running when making changes to code from within a slide.

### Split code across multiple files

Use the `runnerOptions` prop to set `entrypoint` to `false` and `file_path` for non-entrypoint files.  
Specify a package (i.e. `demo`).
````md
```java {monaco-run} {runnerOptions:{entrypoint:false, file_path:'MyClass.java'}}
package demo;

public class MyClass {
    public static void foo() {
        System.out.println("Foo");
    }
    public void bar() {
        System.out.println("Bar");
    }
}
```
````

Include a list of sources to be compiled with the entrypoint using `addSources`.  
````md
```java {monaco-run} {autorun:false, runnerOptions:{addSources:['MyClass.java']}}
package demo;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
        
        MyClass.foo();
        MyClass myObject = new MyClass();
        myObject.bar();
    }
}
```
````

> [!Note]
> A single virtual file system will be used for all slides. This means that files added in one slide will persist when navigating to another slide.

### Mimic command line arguments

Include a list of arguments to be passed using `args`.
````md
```java {monaco-run} {autorun:false, runnerOptions:{args:['arg1', 'arg2', 'arg3']}}
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        // Output: [arg1, arg2, arg3]
        System.out.println(Arrays.toString(args));
    }
}
```
````
