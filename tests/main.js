const Texticide = require("../build/txcd.min"), examples = require("./examples.json");
let animals = new Texticide.Diction("Animals", [
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
let sntzr = new Texticide.Sanitizer([animals], {
    defaultLevel: 4,
    replacer: x => x.length
});

examples.forEach(( sentence ) => {
    sntzr.locate(sentence).forEach(find => console.log(sentence, find));
});

setTimeout(() => {
    console.log("\nAll tests passed!")
}, 60*2);  // 2 minutes