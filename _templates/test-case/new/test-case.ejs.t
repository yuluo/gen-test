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
    request(options, (err, response, body) => {
        expect(response.statusCode).toBeOneOf(globalConfig["<%= codes %>"]);
        done();
    });
});
