# **Styleguide** 📖

Document version: $Revision: 42665 $


# Table of contents
1. [Javascript](#Javascript)
   - [Naming Conventions](##Naming%20Conventions)
   - [Variables](##Variables)
   - [Strings](##Strings)
   - [Object creation](#Object%20creation)
   - [Loops](#Loops)
   - [Function parameters](#Function%20parameters)
   - [Function declarations vs. Function expressions](#Function%20declarations%20vs.%20Function%20expressions)
   - [Nesting](#Nesting)
   - [Strict Mode](#Strict%20Mode)
   - [Line Breaks and spacing](#Line%20Breaks%20and%20spacing)
   - [Commenting out code](#Commenting%20out%20code)
   - [Deleting properties](#Deleting%20properties)
   - [Do not use with(){} or eval()](#Do%20not%20use%20with(){}%20or%20eval())
   - [Immediately-Invoked Function Expression](#Immediately-Invoked%20Function%20Expression)
   - [Truth-y and fals-y values in JavaScript](#Truth-y%20and%20fals-y%20values%20in%20avaScript])
   - [Checking for existence of an object or defined value](#Checking%20for%20existence%20of%20an%20object%20or%20defined%20value)
   - [Checking for null and undefined](#Checking%20for%20null%20and%20undefined)
   - [Typecheck](#Typecheck)
   - [Operator precedence](#Operator%20precedence)
   - [Accessing an object’s prototype](#Accessing%20an%20object’s%20prototype)
   - [Extending of Native Prototypes](#Extending%20of%20Native%20Prototypes)
   - [Tooling](#Tooling)
2. [Typescript](#Typescript)
3. [Angular](#Angular)
4. [Code documentation](#codedocumentation)
   - [Code to be documented](#codetobedocumented)
   - [API Documentation](#apidocumentation)
   - [Conceptual Documentation](#conceptualdocumentation)

# **General**
This Styleguide only highlights the most common an most used parts. If you miss any information in this guide maybe the link section will help as well. Otherwise contact your team lead.
## Consistency
For any style question that isn't settled definitively by this specification, do what the other code in the same file is already doing (be consistent). If that doesn't resolve the question, consider emulating the other files in the same directory.
## File Header
On creation of a file the following file header must be added:
```javascript
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
```
When committing the file to SVN the file header is modified automatically, as shown below. Do not delete or modify it.
```javascript
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
```
## Type safety
> To have a more type safety and therefore a more stable software the usage of type `any` must be avoided.

In the current migration progress there will be some cases where we initialy have to use `any` to reduce refactoring time. At a latter point the eslint rules will be added with the setting `no-explicit-any: true`. At this stage the use of `any` is not allowed any more.

Sometimes using `any` is legitimate, for example in tests to construct a mock object. In such cases, add a comment that suppresses the lint warning, and document why it is legitimate.
```typescript
// This test only needs a partial implementation of XYService, and if
// we overlooked something the test will fail in an obvious way.
// This is an intentionally unsafe partial mock
// tslint:disable-next-line:no-any
const mockXYService = ({get() { return mockXY; }} as any) as XYService;
// Component is not used in this test
// tslint:disable-next-line:no-any
const component = new MyComponent(mockXYService, /* unused Component */ null as any);
```

```javascript
// ✅ Do this
let myCount: number = 0;

// ❌ Don't do this
let myCount = 0;
let myCount: any = 0;
```

# **Javascript** <a name="Javascript"></a>
## General
The following conventions refer to the current AngularJS state. Some of the code examples only visualize core aspects. For example the type safety is not mentioned in the Javascript section, but must be considered in Typescript code base.
## Naming Conventions
>camelCasing, NOT PascalCasing for function names, parameter names, variable names. Do not use _ as the first character of a name.

> Global variables (which should be avoided, but still) should be ALLUPPERCASE.

> Classes are written in PascalCase.

*Examples:*

```javascript
// simple function
let fnName = () => {
    // function code goes here
};

// global variable
const PI = 3.14159265;

// class or constructor
class MyClass {

}

// server side DTO
let BoQDto = {
    Index: 0,
    Brief: 'item',
    Quantity: 2.0
};

// client side JSON object
let sortColumn = {
    sortOrder: asc,
    description: 'Brief'
};
```
## Variables
Declare all local variables with either `const` or `let`.

Use `const` by default, unless a variable needs to be reassigned. The `var` keyword must not be used!

No global variables should be used with in your own scripts. (In general global variables should be avoided).

## Strings
Use string interpolation for multiline strings.
```javascript
let myString = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren`;

// with parameter
let myValue = `custom string`;
let myString = `Lorem ipsum ${myValue} sit amet, consetetur sadipscing elitr,
sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren`;

```
Quoting strings: Prefer ` over ' over ". This is helpful when creating strings that include HTML.
```javascript
let msg = `<p class="flow">Hello</p>`;
```

## Object creation
Use Array and Object literals instead of Array and Object constructors. Array constructors are error-prone due to their arguments.

Example:

```javascript
// ✅ Do this
let o = {};
let a1 = [x1, x2, x3]

// ❌ Don't do this
let o = new Object();
let a1 = new Array(x1, x2, x3)
```

## Loops
Prefer the array's native foreach method instead of the traditional for – loop except when you have to break out of the loop prematurely.

This code example will iterate over the elements of `myArray` and execute the provided function with each element. The second and third parameters are optional and can be used in your function to access the current index of your array element as well as the whole array itself (not just the current element). It is not possible to break out of a for-each loop.

```javascript
myArray.forEach(function (element, index, myArray) {
}); // will execute the supplied function for every element of the array.

// use .some if you want to break out of forEach
[1, 2, 3].some(function (el) {
  return el === 2;
});
```

> We do not use Angular’s forEach method or underscores’ each method because these were substitutes for older JavaScript versions when the native foreach method was not available yet.

> Don't use for-in loops because they were initialy meant to work with old objects with string keys only.

## Function parameters

It is recommended not to use more than five parameters in your function. If you need to use many parameters consider if you observe proper separation of concerns in your function. In other words your function probably does too much.

You may also consider using a wrapper object as parameter type that combines several related parameters.

Either put all parameters of a function on the same line if space permits or put every parameter in a separate indented line.

If you are using array notation put the strings of the array on one line and the function on a separate line.

```javascript
function(verylongparameter1, verylongparameter2, verylongparameter3) {
}

// OR
function(verylongparameter1,
    verylongparameter2,
    verylongparameter3) {
}

// array notation
function([param1, param2, param3]) {
}
```

Single-line array and object initializers are allowed when they fit on a line.

## Function declarations vs. Function expressions
There are three ways in JavaScript to declare a function:

```javascript
// named function
function doStuff() {
}

// recommended
// named function with variable assignment
let doStuff = () => {
};

// function expression (anonymous function with access variable)
// not recommended because of drawbacks with callbacks and not meaningful debugging
let doStuff = function() {
};

```

> **Do not define functions within blocks**

This is illegal. Functions can only be defined in the program or another function body. In strict mode the JavaScript engine will throw an error if we try to define functions within blocks.

```javascript
// ❌ Don't do this
if (sample === true) {
    function calculateReducedPrice (itemprice) {
        //…
    }
}
```

## Nesting
It is recommended not to exceed a nesting depth of 5. Since we wrap our code into auto executing functions we have a minimum nesting depth of 2.

## Line Breaks and spacing
End every statement with a semicolon. Do not rely on automatic semi colon injection (ASI).

Because we use Java conventions (and the dangers of automatic semi colon injection) use the Java Style for blocks:

```javascript
// ✅ Do this
function () {
    // content of block is indented one tab
    console.log('hello world');
}

// ❌ Don't do this
function()
{
    console.log('hello');
}

function() { console.log('hello'); }
```

Configure your text editor to use tabs, not spaces for indentation. The content of a multiline block gets indented by one tab. Nested functions get indented according to their nesting level. Always use one tab per indentation level.

To ensure everyone is using the same settings **.editorconfig** is a manditory configuration for you IDE. Place it in your root folder in your workspace.

### **Blank lines**

Use newlines to group logically related pieces of code. For example:
```javascript
doSomethingTo(x);
doSomethingElseTo(x);
andThen(x);

nowDoSomethingWith(y);

andNowWith(z);
```

## Commenting out code

Do not comment out code that is no longer in use. All code is still accessible via the repository if you need it later. If you need to comment out code temporarily always add an additional comment with the date, your name and the reason for commenting out this piece of code.

Never comment out whole JavaScript files. Delete files that do not contain any active code.

## Deleting properties
For performance reasons it is better to set values that you want to delete to null rather than deleting the property. If you need the property to not exist, e.g. you want to iterate over the properties with a for-in loop, deleting the property is acceptable.
> **Never set a value to undefined.**
```javascript
let student = { name: 'Mike', age: 12 };

// Setting a property to null
student.age = null;

// Deleting a property
delete student.age;
// OR
delete student[age];
```

## Do not use with(){} or eval()
Using eval() is highly dangerous, so don’t use eval except for code loading and meta-programming. To load data always use JSON.parse() instead.

With JSON.parse, invalid JSON (including all executable JavaScript) will cause an exception to be thrown.
> **Never use with.**

## Truth-y and fals-y values in JavaScript
The following values will evaluate to false in JavaScript (colloquially called fals-y values):
> false <br>
> null <br>
> undefined <br>
> "" (empty string) <br>
> 0 <br>
> NaN (not a number) <br>

All other values will be considered truth-y, that is, they will evaluate to true:
> All objects <br>
> The strings '0' and 'false' <br>
> Any other value <br>


## Checking for existence of an object or defined value
In JavaScript it is best practice to check for the existence of an object instead of checking if it is not null or undefined. That means we flip the logic from checking if something is not null to checking if something exists. We also flip the logic from checking if something is not undefined to checking if something is defined.

```javascript
// ✅ Do this
if (myString) {
    // do stuff
}

// OR
if (myString !== null && !angular.isUndefined(yourValue) && myString !== '') {
    // do stuff
}
```

## Checking for null and undefined
```javascript
// ✅ Do this
if (obj === null) {
}

// ❌ Don't do this
if (obj == null) {
}

// ✅ Do this
if (!angular.isUndefined(yourValue) {
}
// OR
if (typeof yourValue === 'undefined') {
}

// ❌ Don't do this
if (yourValue !== undefined) {
}
```

## Typecheck
It is almost always better to use the === and !== operators.

The == and != operators do type coercion which often operates counter-intuitively.

In particular, do not use == to compare against false values.
```javascript
// ✅ Do this
if (3 === '3') {
    // condition is false
}

if (3 !== '3') {
    // condition is true
}

// ❌ Don't do this
if (3 == '3') {
    // condition is true because of automatic type conversion
}

If (3 != '3') {
    // condition is false because of automatic type conversion
}
```

## Operator precedence
Use the minimum amount of brackets and only when you need to change operator precedence. Do not use brackets when using unary operators.
**Operator precedence and associativity**
| Operator   |      	Operator Use      |  Associativity | Precedence |
|----------|:-------------:|------:|------:|
()|	Method/function call, grouping |	Left to right |	Highest — 1 |
[]|	Array access |	Left to right |	1 |
.|	Object property access |	Left to right |	1 |
++|	Increment	| Right to left |	2 |
--|	Decrement	| Right to left |	2 |
-|	Negation	| Right to left |	2 |
!|	Logical NOT	| Right to left |	2 |
~|	Bitwise NOT	| Right to left |	2 |
delete|	Removes array value or object property | Right to left |	2 |
new|	Creates an object |	Right to left |	2 |
typeof|	Returns data type |	Right to left |	2 |
void|	Specifies no value to return |	Right to left |	2 |
/|	Division |	Left to right |	3 |
*|	Multiplication |	Left to right |	3 |
%|	Modulus |	Left to right |	3 |
+|	Plus |	Left to right |	4 |
+|	String Concatenation |	Left to right |	4 |
-|	Subtraction |	Left to right |	4 |
\>> |	Bitwise right-shift |	Left to right |	5 |
<< |	Bitwise left-shift |	Left to right |	5 |
\>,| >=	Greater than, greater than or equal to |	Left to right |	6 |
<,| <=	Less than, less than or equal to |	Left to right |	6 |
== |	Equality |	Left to right |	7 |
!= |	Inequality |	Left to right |	7 |
===|	Identity operator — equal to (and same data type) |	Left to right |	7
!==|	Non-identity operator — not equal to (or don't have the same data type) |	Left to right |	7
&|	Bitwise AND |	Left to right |	8
^|	Bitwise XOR |	Left to right |	9
\| |	Bitwise OR |	Left to right |	10
&&|	Logical AND |	Left to right |	11
\|\| |	Logical OR |	Left to right |	12
?: |	Conditional branch |	Left to right |	13
= |	Assignment |	Right to left |	14
*=, /=, %=, +=,, -=, <<=, >>=, >>>=, &=, ^=, \|= |	Assignment according to the preceding operator |	Right to left |	14
, |	Multiple evaluation |	Left to right |	Lowest: 15


## Accessing an object’s prototype
> **Don’t use proto.**

This feature is unofficial/deprecated.

> Use Object.getPrototypeOf instead.

## Extending of Native Prototypes
> **Don’t extend Native Prototypes!**
One mis-feature that is often used is to extend Object.prototype or one of the other built in prototypes.

This technique is called monkey patching and breaks encapsulation. While used by popular frameworks such as Prototype, there is still no good reason for cluttering built-in types with additional non-standard functionality.

The only good reason for extending a built-in prototype is to backport the features of newer JavaScript engines; for example, Array.forEach.

## Tooling

ESLint will additionally help to provide a good level of consistent styles and rules.

> **It is mandatory for each developer to use and build with ESLint rules.**
---
# TypeScript
## Classes
### Getter/Setter
For a simple get/set pair it is allowed to expose the public field itself [(TS get/set documentation)](https://www.typescriptlang.org/docs/handbook/2/classes.html#getters--setters).
```typescript
// ✅ Do this
class MyClass {
   public myVar: string;
}

// ❌ Don't do this
class MyClass {
  private _myVar: string;
  public get myVar() {
    return this._myVar;
  }
  public set myVar(value: string) {
    this._myVar = value;
  }
}
```
For more complex get/set pairs use a private field with a prefixt `_` instead.
```typescript
// ✅ Do this
class MyClass {
  private _myVar: string;
  public get myVar() {
    return this._myVar;
  }
  public set myVar(value: string) {
    // some complex logic
    value.split("").reverse().join("");

    this._myVar = value;
  }
}
```
Keep getter and setter next to each other when they are needed.

### Constructor
Use the constructor to define fields in the class.
```typescript
// ✅ Do this
class MyClass {
   constructor (private myVar: string) {}
}

// ❌ Don't do this
class MyClass {
   private myVar: string;
   constructor (myVar: string) {
      this.myVar = myVar;
   }
}
```

## Functions
Functions should have a return type even if the compiler can detect it automatically.
```typescript
// ✅ Do this
myFn(): string {
   return `something`;
}

// ❌ Don't do this
myFn() {
   return `something`;
}
```
## Member declarations
Interface and class declarations must use the `;` character to separate individual member declarations.
```typescript
// ✅ Do this
interface Foo {
  memberA: string;
  memberB: number;
}

// ❌ Don't do this
interface Foo {
  memberA: string,
  memberB: number,
}
```

Inline object type declarations must use the comma as a separator.
```typescript
type SomeTypeAlias = {
  memberA: string,
  memberB: number,
};
```
## Variables
When assigning a value to a variable it is allowed to not write the type definition.
```typescript
// ✅ Do this
let a = 'abc'; // compiler detects string

// ❌ Don't do this
let a; // compiler will fail in strict mode
a = 'abc';
```

## Decorators
> Do not define new decorators without prior clearance by the TA team. Only use the decorators defined by frameworks

Angular (e.g. `@Component`, `@NgModule`, etc.)

## Imports
There are four variants of import statements in ES6 and TypeScript
| Import | type | Example |	Use for |
| --- | --- | --- | --- |
| module |	import * as foo from '...';	| TypeScript imports
| destructuring |	import {SomeThing} from '...'; |	TypeScript imports
| default |	import SomeThing from '...'; |	Only for other external code that requires them
| side-effect |	import '...'; |	Only to import libraries for their side-effects on load (such as custom elements)

```typescript
// Good: choose between two options as appropriate (see below).
import * as ng from '@angular/core';
import {Foo} from './foo';

// Only when needed: default imports.
import Button from 'Button';

// Sometimes needed to import libraries for their side effects:
import 'jasmine';
import '@polymer/paper-button';
```
>Try to use direct function imports as often as possible. Avoid importing with `{*}` if not all functions are needed.

## Import Paths
Alias paths for imports are highly recommended. If aliases (`@`) are missing contact your team lead. All aliases will be handled in the `tsconfig.base.json`.

Example
```typescript
import { ... } from '@iTWO/modules/...';
```

Relative paths for imports are allowed but should be avoided if possible.

## Import Structure
Try to structe the imports of each file as well as possible. The recommended structure goes as following:
1. angular (core)
2. third party
3. own libs, services, interfaces,...
```typescript
// ✅ Do this
// example imports:

// core
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject,  takeUntil } from 'rxjs';

// third party
import { forEach } from 'lodash-es6';

// interfaces
import { IDomainControlDemo } from '@ui-common/components/input-controls/model/interfaces/domain-control-demo.interface';
import { IFormGenerator } from '@ui-common/model/form-generator/form-generator.interface';

// services
import { FormGeneratorService } from '@ui-common/services/form-generator/form-generator.service';

```

---
# Angular
## General
All sourcecode is managed in the `_angular` folder. It is not allowed to commit anywhere else.

All app specific code goes to `apps/itwo40/src`. Not needed by module developer.

All module specific code goes to the module lib `libs/modules/[MODULE]`.

`platform` and `ui` are reserved for framework features.

You can find the basic structure of each folder in the iTWO40_Angular_Application_Structure-Spec.docx (replace with correct path).

## Single Responsibility
Apply the [single responsibility principle (SRP)](https://en.wikipedia.org/wiki/Single-responsibility_principle) to all components, services, and other symbols. This helps make the application cleaner, easier to read and maintain, and more testable.

> Do define one thing, such as a service or component per file

```typescript
// ✅ Do this

// feature.component.ts
...
@Component {
    providers: [FeatureSerivce]
}
export class AppComponent {}

// feature.service.ts
...
@Injectable()
export class FeatureService {}

// feature.model.ts
interface Feature {
  id: number;
  name: string;
}

// ❌ Don't do this

// feature.ts
@Component {
    providers: [FeatureSerivce]
}
export class AppComponent {}

@Injectable()
export class FeatureService {}

interface Feature {
  id: number;
  name: string;
}
```
## Naming
Do follow a pattern that describes the symbol's feature then its type. Names of folders and files should cleary convey their intent.

> The recommended pattern is [feature]/[artifact].[type].[ts | html | scss | md]
## File types
| Type | Description | Example |
| --- | --- | --- |
| component | Angular UI component class, e.g. `ArtifactComponent`. | artifact.component.ts \| html \| scss |
| component base | Base class for Angular UI component, e.g. `ArtifactBaseComponent` | artifact-base.component.ts |
| service | Angular service class, e.g. `ArtifactService`. | artifact.service.ts |
| directive | Angular directive class, e.g. `ArtifactDirective`. | artifact.directive.ts |
| model | Class used as an Angular data model, e.g. `Artifact`. | artifact.model.ts |
| module | Angular module class, e.g. `ArtifactModule`. | artifact.module.ts |
| interface | Interface, e.g. `IArtifact`. | artifact.interface.ts |
| class | Class, e.g. `Artifact`. | artifact.class.ts |
| enum | Enum type, e.g. `Artifact`. | artifact.enum.ts |
| other type | Any other type, e.g. `Artifact`. | artifact.type.ts |

`.spec` can be used for `services` and `components` as subtype to create unit tests.

> Avoid to invent additional type names. Also avoid using shortcuts like .serv or .dir etc.

## Folders
Use only lowercase and if needed kebab-case for folders. Also try to stay as flat as possible.

Place files only in the foreseen places e.g.: `service` into `services` folder, `component` into `components` folder and so on.

Group component files to one component folder.
```
.\libs\modules\[MODULE]\[SUBMODULE]\src\lib\components
└─── COMPONENT
    | COMPONENT.component.ts
    | COMPONENT.component.html
    | COMPONENT.component.scss
    | COMPONENT.component.spec.ts
└─── COMPONENT2
...
```

### Component Hierarchies

In case you use class inheritance with Angular components, the following applies to any base classes that are solely intended as base classes for Angular components:

- Their name must end in `BaseComponent`.
- Analogously to other components, they must be placed in a subfolder named `/components/...-base/`.
- They *should* be made abstract.

## File names
> Do use consistent names for all assets named after what they represent.

> Do append the symbol name with the conventional suffix (such as `Component`, `Directive`, `Module`, `Pipe`, or `Service`) for a thing of that type.

Examples:
```typescript
// app.component.ts
@Component({ ... })
export class AppComponent { }

// feature.component.ts
@Component({ ... })
export class FeatureComponent { }

// feature-list.component.ts
@Component({ ... })
export class FeatureListComponent { }

// feature-detail.component.ts
@Component({ ... })
export class FeatureDetailComponent { }

// validation.directive.ts
@Directive({ ... })
export class ValidationDirective { }

// app.module.ts
@NgModule({ ... })
export class AppModule {}

// awesome-feature.service.ts
@Injectable()
export class AwesomeFeatureService { }
```

## Component Templates
Do use separated template files for `@Component` templates.<br>
Single line templates are allowed inline.

```typescript
// ✅ Do this
// ok-button.component.ts
@Component({
  selector: 'awesome-ok-button',
  templateUrl: './ok-button.component.html'
})
// ok-button.component.html
<button value="ok"></button>

// ❌ Don't do this
@Component({
  selector: 'awesome-ok-button',
  template: `<div>
               <div>
                  <button value="ok"></button>
               </div>
            </div>`
})
```
Same rule apply for styles. Don't use `styles` property but `styleUrls` instead.

## Component Selectors
> Do use dashed-case or kebab-case for naming the element selectors of components.

```typescript
// ✅ Do this
@Component({
  selector: 'awesome-ok-button',
  templateUrl: './ok-button.component.html'
})

// ❌ Don't do this
@Component({
  selector: 'awesomeOkButton',
  templateUrl: './ok-button.component.html'
})
```

> Do use a [custom prefix](https://angular.io/guide/styleguide#component-custom-prefix) for a component selector. Each prefix represent their origin.

```typescript
// ✅ Do this
@Component({
  selector: 'parentfolder-libfolder-component',
  templateUrl: './component-name.component.html'
})
export class ParentFolderLibFolderComponentNameComponent {}

// Example for UI
// Example with status bar component
// Same rules apply to platform folder except replacing ui with platform
// Located in: libs\ui\common\src\lib\components\status-bar
// Filename: status-bar.component.ts
@Component({
  selector: 'ui-common-status-bar',
  templateUrl: './status-bar.component.html'
})
export class UiCommonStatusBarComponent {}

// Example for Modules
// Example with tile group component for desktop module
// Located in: libs\modules\desktop\common\src\lib\components\tile-group
// Filename: tile-group.component.ts
@Component({
  selector: 'desktop-common-tile-group',
  templateUrl: './tile-group.component.html'
})
export class DesktopCommonTileGroupComponent {}

// ❌ Don't do this
@Component({
  selector: 'component',
  templateUrl: './component.component.html'
})
```

## Directive selectors
In general the same rules apply to `directives` as for `components` except the lowerCamelCase rule.
Please read [Component selectors](#Component%20Selectors) for more details.

> Do Use lowerCamelCase for naming the selectors of directives.

```typescript
// ✅ Do this
@Directive({
  selector: '[someValidate]'
})
export class ValidateDirective {}

// ❌ Don't do this
@Directive({
  selector: '[validate]'
})
export class ValidateDirective {}

@Directive({
  selector: '[some-Validate]'
})
export class ValidateDirective {}
```



## Component communication
The prefered communication between `components` are `Oberservables` from [RxJs](https://rxjs.dev/guide/observable).
Direct communication between two components (parent <> child) can be done with `EventEmitter`.
> Don't use `EventEmitter` as `Observables` as this is may not be possible in a future `Angular` version.

---


<a name="codedocumentation"></a>

# Code Documentation

Objective is a complete documentation of public types and members. A so-called **API documentation** helps Angular developers
providing a clear and helpful documentation of our application. Even if the developers change it will be easy to understand
the logic as what to be passed and what to be not.

The component or class can additionally be described with further info or notes. While the **API documentation** is
written very close to the actual code and is mandatory, this **Conceptual Documentation** is done in an extra file and is only necessary when needed.

The trunk documentation can be displayed here:
- Compodoc - *[https://ribprdbldagw001.itwo40.eu/ng-docs/dev/compodoc](https://ribprdbldagw001.itwo40.eu/ng-docs/dev/compodoc/)*
- Storybook - *[https://ribprdbldagw001.itwo40.eu/ng-docs/dev/storybook](https://ribprdbldagw001.itwo40.eu/ng-docs/dev/storybook/)*


<a name="codetobedocumented"></a>

## Code to be documented

Public types and members that is part of the framework and thus used by other developers must be documented if it is the following code:

- Components (*)
- Interfaces
- Enums
- Classes
- Pipes
- Services

> \* Components must be provided with a so-called story for **storybook** in addition to the normal code documentation.

<a name="apidocumentation"></a>

## API Documentation

This is done directly on the code to be documented and is mandatory. A certain syntax is required for this. As we use Typescript AST parser and its internal APIs, so the comments have to be **JSDoc** comment style. But not the full scope of JSDoc is supported because of TypeScript compiler limitations. Only the following tags are supported so far:

### Simple description

Without using an @-tag, the text is used as a simple description of the code. This way you can describe classes as well as functions, services, pipes, directives and many more.

```typescript

/**
 * Class representing a list of products.
 */
@Component({...})
export class ProductListComponent implements OnInit {...}
```



```typescript
/**
 * These method shows a string in the console. This is just a test.
 *
 * To make a line change, a blank line must be inserted.
 */
DoSomething(text: string) {
  console.log(text);
}
```



### Param and Returns

The other thing in class we do is create a method. the method can be of two types a function that returns a value and the other one which performs just logic inside it (e.g. void type). With that, the method can also accept parameters of different types such as string, number, etc.

**Function with return type and parameters**

```typescript
  /**
   * get the product count by its type
   * @param {string} type The name of the ProductType
   * @return {number} count
   */
  private getProductCount(type: string): number {
    return this.product[type].count;
  };
```



### Deprecated

It is possible to mark a class as deprecated.

```typescript
 /**
 * Class representing a list of products.
 * @deprecated This class is deprecated. Please use instead the NewProductListComponent class.
 */
export class ProductListComponent {...}
```



### Ignore

These tag indicate that a symbol in your code should never appear in the documentation. `@ignore` works inside a class, component or injectable, but also for the entire component. The following example ignores the entire component.

```typescript
/**
 * @ignore
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {}
```



### Example

```typescript
  /**
   * Gets the number of groups from a page.
   *
   * **Example:**
   *
   * This example shows how to pass a page id to gets the count of its groups.
   * `typescript
   * let groupCount = getGroupCount(myGroup.id)
   * `
* @param {string} pageId Id of the page
* @return {number} Number of groups
  */
  private getGroupCount (pageId: string): number {
  return this.pages[pageId].groups.count;
  };
```



### Links

For internal reference

```typescript
{@link Todo}
[Todo]{@link Todo.html}
{@link Todo|TodoClass}
```

Anchors are supported

```typescript
[Todo]{@link Todo#myproperty}
```

For external link

```typescript
[Google]{@link http://www.google.com}
{@link http://www.apple.com|Apple}
{@link https://github.com GitHub}
```

<a name="conceptualdocumentation"></a>

## Conceptual Documentation

Conceptual documentation is used to explain a class or component in more depth. This can be detailed
instructions for use, as well as a collection of examples. Thus, this documentation serves as a replacement for the previous **wiki** entry.

A conceptual documentation is added via a specially created file. The file must have the same name as the file it describes with the extension "md" and
the file must be in the same directory.

### Examples
- To descripe the file `accordion.component.ts` you need the file `accordion.component.md`
- To descripte the file `platform-translate.service.ts` you need the file `platform-translate.service.md`
- To descripte the file `module-client-area-base.ts` you need the file `module-client-area-base.md`

# Experimental
Suffixing `Observables` (and `Promises`) with `$` to directly indicate that the `function` returns an `Observable` or a variable is an `Observable`.
```typescript
// variable example
const project$ = Observable.from(['1', '2', '3']);
project$.subscribe(value => console.log(value));

// function example
function myOberserverFn$(): Observable {
   return new Observable(sub => {
      sub.next(1);
   });
}

myOberserverFn$.subscribe(value => {
   console.log(value);
})

```



---

# Links

[Google JS Style Guide](https://google.github.io/styleguide/jsguide.html)

[Google TS Style Guide](https://google.github.io/styleguide/tsguide.html)

[Angular Style Guide](https://angular.io/guide/styleguide)
