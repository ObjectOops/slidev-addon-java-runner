---
theme: default
layout: two-cols-header
# Future feature, not implemented yet.
# `tools.jar` doesn't come with versions past 8.
# java:
#   version: 11 # Supported: 8, 11, 17
---

# Java Code Runner for Slidev

::left::

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

::right::

```java {monaco-run} {runnerOptions:{addSources:['MyClass.java']}}
package demo;

public class Main {
    public static void main(String[] args) {
        System.out.println("\033[96mHello, world!\033[0m");
        
        MyClass.foo();
        MyClass myObject = new MyClass();
        myObject.bar();
    }
}
```
