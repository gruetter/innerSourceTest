"use strict";

module.exports = [
{
    names: ["PATTERN-TEMPLATE-RULE-001"],
    description: "No h1 headlines",
    tags: ["headings", "headers", "pattern-template"],
    function: (params, onError) => {
        params.tokens.filter(function filterToken(token) {
            return token.type === "heading_open";
        }).forEach(function forToken(token) {
            if (token.tag === "h1") {
                return onError({
                    lineNumber: token.lineNumber,
                    detail: "Use of #-headlines (h1) is not allowed in patterns",
                    context: token.line
                });
            }
        });
    }
},
{
    names: ["PATTERN-TEMPLATE-RULE-002"],
    description: "Standard Headlines",
    tags: ["headings", "headers", "pattern-template"],
    function: (params, onError) => {
        var allowedHeadlines = "Title|Patlet|Problem|Story|Context|Forces|Solutions|Resulting Context|Known Instances|Status|Author(s)|Acknowledgements";
        var re = new RegExp(`^## (${allowedHeadlines.replace(/(?=[\(\)])/g, '\\')})\\s*$`,"m");
        // console.log(re);

        params.tokens.filter(function filterToken(token) {
            return token.type === "heading_open";
        }).forEach(function forToken(token) {
            if (token.tag === "h2") {
                if (re.test(token.line)) {
                    return;
                }
                // if (/^## ()$/m.test(token.line)) {
                //     return;
                // }

                return onError({
                    lineNumber: token.lineNumber,
                    detail: "Allowed types are: " + allowedHeadlines.replace(/\|/g, ', '),
                    context: token.line
                });
            }
        });
    }
},
{
    names: ["PATTERN-TEMPLATE-RULE-004"],
    description: "Mandatory template headlines/sections",
    tags: ["headings", "headers", "pattern-template"],
    function: (params, onError) => {
        let headers_count = [];

        var mandatoryHeadlines = "Title|Patlet|Problem|Context|Forces|Solutions|Resulting Context|Status|Author(s)".split("|");

        mandatoryHeadlines.forEach((headline) => {
          headers_count[headline] = 0
        });

        // count the occurance of all headlines
        params.tokens.filter(function filterToken(token) {
            return token.type === "heading_open";
        }).forEach(function forToken(token) {
            if (token.tag === "h2") {
                let re = new RegExp("^## (.*?)$","m");
                let matchResult = token.line.match(re);

                if (matchResult != null) {
                  headers_count[matchResult[1]] += 1;
                }

                // if (matchResult != null && headers_count[matchResult[1]] >= 2) {
                //     return onError({
                //         lineNumber: token.lineNumber,
                //         detail: "Remove duplicated header",
                //         context: token.line
                //     });
                // }
            }
        });

        // console.log(headers_count);

        mandatoryHeadlines.forEach((headline) => {
          if (headers_count[headline] == 0 ) {
            // console.log("ERROR: Missing headline: " + headline);
            return onError({
                lineNumber: 1,
                detail: "Required headline/section is missing",
                context: headline
            });
          }
          if (headers_count[headline] >= 2 ) {
            return onError({
                lineNumber: 1,
                detail: "Duplicate headline/section",
                context: headline
            });
          }
        });
    }
}
];
