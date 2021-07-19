import Texticide from '../build/txcd.min.mjs';
import {readFileSync} from 'fs';

const examples = JSON.parse(readFileSync("./tests/examples.json"));
const animals = new Texticide.Diction("Animals", [
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

console.time('Texticide.Sanitizer');
let sntzr = new Texticide.Sanitizer([animals], {
    defaultLevel: 4,
    replacer: x => x.length
});
console.timeEnd('Texticide.Sanitizer');

console.time('Texticide.Locate');
examples.forEach(( sentence ) => {
    sntzr.locate(sentence).forEach(find => console.log(sentence, find));
});
console.timeEnd('Texticide.Locate');

console.log("\nAll tests passed!")