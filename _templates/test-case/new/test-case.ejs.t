---
to: generated/<%= endpoint %>/<%= operation %>/require-test/require.test.js
inject: true
after: test cases
---


test("<%= name %>", done => {
    const data = require("./payload-<%= testcounter %>.json");
<% if (mediatype === "application/x-www-form-urlencoded") { %>
    options.body = queryString.stringify(data);
<% } else { %>
    options.body = data;
<% } %>
    Object.keys(parameters).forEach(key => {
        let value = parameters[key].values[0];
        if( parameters[key].values["<% testcounter %>"] ) {
            value = parameters[key].values["<% testcounter %>"];
        }

        if(parameters[key].in === "path") {
            options.uri = options.uri.replace(`{${key}}`, value);
        } else if (parameters[key].in === "header") {
            options.headers[key] = value;
        }
    });

    request(options, (err, response, body) => {
        expect(response.statusCode).toBeOneOf(globalConfig["<%= codes %>"]);
        done();
    });
});
