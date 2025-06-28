---
theme: default
layout: default
# Future feature, not implemented yet.
# `tools.jar` doesn't come with versions past 8.
# java:
#   version: 11 # Supported: 8, 11, 17
---

# Java Code Runner for Slidev

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

```java {monaco-run} {runnerOptions:{addSources:['MyClass.java']}}
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
