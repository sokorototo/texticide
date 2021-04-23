void (function () {
    class Diction{
        constructor( name, words = [] ){
            if (!Array.isArray(words)) throw new Error("Expected parameter for Diction should be an array!");
    
            // props
            this.name = String(name);
            this.patterns = Diction.parse(words);
        }
    
        static parse( patterns ){
            let copy = patterns.slice(), parsed = [];
            for (let i = 0; i < copy.length; i++) {
                const pattern = copy[i];
                parsed.push(pattern)
            }
    
            return parsed
        }
    };
    
    class Sanitizer{
        constructor(dictionary = [], config = {}){
            if( !Array.isArray(dictionary) || typeof config != "object" ){
                throw new Error("Sanitizer parameters are not of type: fn(Array, Object)")
            };
    
            this.dictionary = dictionary;
            this.defaultLevel = config.defaultLevel || 4;
            this.replacer = config.replacer || "*";
            if (typeof this.replacer != "string" && typeof this.replacer != "function") throw new Error("{}.replacer must either be a string or a function");
        }
    
        locate(string, level = this.defaultLevel, exclude = []){
            let findings = [];
            for (let i = 0; i < this.dictionary.length; i++) {
                const diction = this.dictionary[i];
                for (let j = 0; j < diction.patterns.length; j++) {
                    const word = diction.patterns[j];
                    if(exclude.includes(word.id)) continue;
                    if(word.level >= level) continue;
                    let patterns = word.patterns;
                    for (let k = 0; k < patterns.length; k++) {
                        const pattern = patterns[k];
                        let exit = false;
                        while(!exit){
                            let scope = {diction: diction.name, pattern,word: word.id};
                            let match = pattern.exec(string);
                            exit = !match;
                            if (exit) continue;
                            findings.push(Object.assign({ match: [match[0], match["index"], match[0].length + match["index"]] }, scope));
                        }
                    }
                }
            }
    
            return findings
        }
    
        clean(string, level, exclude){
            let matches = this.locate(string, level, exclude), replacer = this.replacer;
            matches.forEach(function ( match ) {
                let fragment;
                switch (typeof replacer) {
                    case "string":
                        let emptyString = "";
                        let matchLength = match.match[2] - match.match[1];
                        let replacerFragments = replacer.split("");
                        for (let i = 0; i < matchLength; i++) emptyString += replacerFragments[Math.floor(replacerFragments.length * Math.random())];
                        fragment = emptyString
                        break;
                    case "function":
                        fragment = replacer(match.match[0])
                        break;
                };
                let pre = string.slice(0, match.match[1]);
                let post = string.slice(match.match[2]);
                string = (pre + fragment + post);
            });
    
            return string
        }
    };
    // Texticide = { Diction, Sanitizer: ( fn()-> { fn(), fn() } ) }
    const Texticide = {
        Diction,
        Sanitizer
    };

    // UMD
    if (typeof define === "function" && define.amd) {
        define(Texticide);
    } else if (typeof exports === "object") {
        module.exports = Texticide;
    } else {
        globalThis["Texticide"] = Texticide;
    }
}());