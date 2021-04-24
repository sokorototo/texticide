# Texticide.

![Texticide Logo](https://raw.githubusercontent.com/sokorototo/texticide/master/logo.png)

------

SHIELD.IO STUFF

*Texticide.js* is a JavaScript library for identifying all fragments of a given text that match a given regular expression and provides extra functionality for editing out said fragments.



### Installation.

##### CDN.
  Deliver the package via cdn:
  - jsdelivr:
    ```http
    https://cdn.jsdelivr.net/npm/texticide
    ```
- unpkg:
    ```http
    https://unpkg.com/texticide
    ```

##### NPM.

To install with NPM run:

```
npm install texticide
```

##### Embedded.

Include the file `worley.min.js` in your project directory. Then:

- Browser:  

  ```html
  <script src="path/to/texticide.min.js">
  ```

- Node: 

  ```javascript
  const Worley = require("texticide");
  ```

##### ES6 Module.

In the build directory is an es6 module implementation of the library. The main|default import of the module id the `Texticide` object itself:

```javascript
import Texticide from "texticide.min.mjs";
import {Diction, Sanitizer} from "texticide.min.mjs";
```



##### RequireJS.

```javascript
requirejs(["path/to/texticide.min.mjs"], function(Texticide) {
    const {Diction, Sanitizer} = Texticide;
    // Do yo stuff over here
});
```

------

### Usage.

The `Texticide` object has two main classes as methods, `Diction` and `Sanitizer`. The `Diction` class is used to build a set of recognizable words. A `word` here has `id` (identifier),` level` (for filtering) and `patterns` (array of regular expressions) parameters. The `Sanitizer` builds the functionality to locate and clean any words from a piece of text.

------

### Example.

Lets say we have an array of animal related sentences in a file( example.json ). We want to send it to Mars and it turns out martians don't like animals from earth. So we have to edit out any and all instances of 'animal' words from the sentences.

```json
[
    "Such cute gerbils!",
    "Stupid cat, scratching the upholstery",
    "Alright peter rabbit!",
    "My cows are cool. They really like chickens",
    "My dog is real cool",
    "Your bitch a cat",
    "Get the fuck outta here pig!",
    "A dog wandered into our garden one day",
    "For I will consider my Cat Jeoffry",
    "You’ve read of several kinds of Cat"
]
```

First we need to build our `Diction` instance, what our `Sanitizer` can recognize. The first parameter is the name of the instance. This is useful for scoping, seen later. The second parameter is an array of object literals ( words ) that contain `id`, `level` and `patterns` properties. [Explained here.]()

```javascript
const Texticide = require("texticide");
let animals = new Texticide.Diction("Black American", [
    {
        id: "gerbil",
        level: 2,
        patterns: [ new RegExp("g(a|e)r?bil{1,2}", "ig") ]
    },
    {
        id: "cat",
        level: 5,
        patterns: [ new RegExp("(c|k)at", "ig") ]
    },
    {
        id: "rabbit",
        level: 4,
        patterns: [ new RegExp("r(a|e)b{1,3}it{1,2}", "ig") ]
    },
    {
        id: "cow",
        level: 4,
        patterns: [ new RegExp("(c|k)o+w", "ig") ]
    },
    {
        id: "dog",
        level: 4,
        patterns: [ new RegExp("dog", "ig") ]
    },
    {
        id: "pig",
        level: 3,
        patterns: [ new RegExp("p(i|y)g+", "ig") ]
    }
]);
```

