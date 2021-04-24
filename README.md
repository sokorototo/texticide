# Texticide.

![Texticide Logo](https://raw.githubusercontent.com/sokorototo/texticide/master/logo.png)

------

![npm](https://img.shields.io/npm/v/texticide?style=flat-square) ![npm bundle size](https://img.shields.io/bundlephobia/min/texticide?style=flat-square) [![](https://data.jsdelivr.com/v1/package/npm/texticide/badge)](https://www.jsdelivr.com/package/npm/texticide) ![NPM](https://img.shields.io/npm/l/texticide?style=flat-square) ![npm](https://img.shields.io/npm/dw/texticide?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues/sokorototo/texticide?style=flat-square) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/sokorototo/texticide?style=flat-square)

***Texticide.js* is a JavaScript library for identifying all fragments of a given text that match a given regular expression and provides extra functionality for editing out said fragments.**



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

Include the file `texticide.min.js` in your project directory. Then:

- Browser:  

  ```html
  <script src="path/to/texticide.min.js">
  ```

- Node: 

  ```javascript
  const {Diction, Sanitizer} = require("texticide");
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

The `Texticide` object has two main classes as methods, `Diction` and `Sanitizer`. The `Diction` class is used to build a set of recognizable `word`s. A `word` here has `id` (identifier), ` level` (for filtering) and `patterns` (array of regular expressions) parameters. The `Sanitizer` builds the functionality to locate and clean any words from a piece of text.

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
    "Your cat is a bitch",
    "Get the fuck outta here pig!",
    "A dog wandered into our garden one day",
    "For I will consider my Cat Jeoffry",
    "You’ve read of several kinds of Cat"
]
```

First we need to build our `Diction` instance, what our `Sanitizer` can recognize. The first parameter is the name of the instance. This is useful for scoping, seen later. The second parameter is an array of object literals ( words ) that contain `id`, `level` and `patterns` properties. [Explained here.](#usage)  `patterns`, this is because a word can have multiple patterns that may not fit into one Regular Expression hence needing an array of Regular Expressions.

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

Next we need to build our `Sanitizer`. The constructor takes two parameters an array of `Diction` instances, its dictionary, and a config object literal. Its dictionary tells the Sanitizer what words to recognize. This is because it allows one to build multiple sanitizers each with a different dictionary. The second parameter is an object literal with two optional properties, `defaultLevel` and `replacer`.  The `defaultLevel` tells the `Sanitizer` to only hit words with a level equal to or lower than `defaultLevel`. The replacer can be a function or a string and it tells the `Sanitizer.clean` how to erase found matches. If a string is given a unit is picked at random from the string and substituted in place for each letter in the match:

```
Text.___________________________replacer.________Result.
I love dogs.____________________'+'______________I love ++++.
Sadly bacon comes from pigs.____'123'____________Sadly bacon comes from 312.
I am allergic to cats.__________'&-%!'___________I am allergic to &!%-.
```

If a function is used, the function is called with the found text and the return value injected in place.

```
const replacer  = x => x.length;
// I am allergic to any cat. => I am allergic to any 3.
// Sadly bacon comes from piggs. => Sadly bacon comes from 5.
// I love dogs. => I love 4.
```

Now let us build a `Sanitizer`:

```javascript
let sntzr = new Texticide.Sanitizer([animals], {
    defaultLevel: 4,
    replacer: "*"
});	
```

The `sntzr` has two methods `locate` and `clean`. `locate` returns an array of matches and `clean` returns a cleaned up string:

```javascript
const examples = require("./examples.json");
examples.forEach(( sentence ) => {
    sntzr.locate(sentence).forEach(find => console.log(sentence, "=>", find));
});
```

`Sanitizer.locate` returns an object literal with the following properties: (1)`match`; an array with the actual word found and its location inside of the input string. (2)`word`; the `id` of the word that matched the `match`.  (3)`pattern`; the regex that matched the `match`.  (4)`diction`; the diction from which the word was declared. Output: 

```
Such cute gerbils! => {
  match: [ 'gerbil', 10, 16 ],
  diction: 'Black American',
  pattern: /g(a|e)r?bil{1,2}/gi,
  word: 'gerbil'
}
Get the fuck outta here pig! => {
  match: [ 'pig', 24, 27 ],
  diction: 'Black American',
  pattern: /p(i|y)g+/gi,
  word: 'pig'
}
```

`Sanitizer.clean` simply cleans the given text off of any identified matches, using `replacer` for replacement: 

```javascript
const examples = require("./examples.json");
examples.forEach(( sentence ) => {
    console.log(sntzr.clean(sentence));
});
```

Giving us the output:

```
Such cute ******s!
Stupid cat, scratching the upholstery
Alright peter rabbit!
My cows are cool. They really like chickens
My dog is real cool
Your cat is a bitch
Get the fuck outta here ***!
A dog wandered into our garden one day
For I will consider my Cat Jeoffry
You’ve read of several kinds of Cat
```

Both `Sanitizer.locate` and `Sanitizer.clean` take two extra arguments. The second argument is an explicitly implies a level to be used and the third argument is an array of `id`'s to word to be ignored. For example: 

```javascript
const examples = require("./examples.json");
examples.forEach(( sentence ) => {
    console.log(sntzr.clean(sentence, 6, ["cow"]));
});
```

Output:

```html
Such cute ******s!  << hits all words, as they are all below 6 >>
Stupid ***, scratching the upholstery
Alright peter ******!
My cows are cool. They really like chickens << ignores cows  >>
My *** is real cool
Your *** is a bitch
Get the fuck outta here ***!
A *** wandered into our garden one day
For I will consider my *** Jeoffry
You’ve read of several kinds of ***
```

------

### Extras.

- Feedback would be much appreciated.
- For any issues, go [here](https://github.com/sokorototo/texticide/issues).

