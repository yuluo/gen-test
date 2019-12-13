---
to: generated/<%= endpoint %>/<%= operation %>/require-test/require.test.js
inject: true
after: test cases
---


test("<%= name %>", done => {
    const data = require("./<%= datafile %>");
    options.body = data;
    request(options, (err, response, body) => {
        expect(response.statusCode).toBeOneOf(globalConfig["<%= codes %>"]);
        done();
    });
});
