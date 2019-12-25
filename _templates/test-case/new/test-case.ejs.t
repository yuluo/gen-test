---
to: generated/<%= endpoint %>/<%= operation %>/require-test/require.test.js
inject: true
after: test cases
---


test("<%= name %>", done => {
    const data = require("./<%= datafile %>");
<% if (mediatype === "application/x-www-form-urlencoded") { %>
    options.body = queryString.stringify(data);
<% } else { %>
    options.body = data;
<% } %>
    Object.keys(parameters).forEach(key => {
        if(parameters[key].in === "path") {
            options.uri = options.uri.replace(`{${key}}`, parameters[key].values[0]);
        } else if (parameters[key].in === "header") {
            options.headers[key] = parameters[key].values[0];
        }
    });

    request(options, (err, response, body) => {
        expect(response.statusCode).toBeOneOf(globalConfig["<%= codes %>"]);
        done();
    });
});
