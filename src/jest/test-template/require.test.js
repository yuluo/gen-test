'use strict'
const request = require('request-promise-native');
const utils = require('../utils');

const config = {
    'mediaType': 'application/json',
    'baseUrl': 'http://localhost:8080/v3',
    'mediaType': 'application/json'
}

const template = {
    "photoUrls": [
      "photoUrls",
      "photoUrls"
    ],
    "name": "doggie",
    "id": 0,
    "category": {
      "name": "name",
      "id": 6
    },
    "tags": [
      {
        "name": "name",
        "id": 1
      },
      {
        "name": "name",
        "id": 1
      }
    ],
    "status": "available"
  }

describe('required test', () => {
    let token = '';
    let options = {};
    
    beforeAll(  async () => {
        token = await utils.login();
    });

    beforeEach( () => {
        options = {
            'method': 'POST',
            'uri': config.baseUrl + '/pet',
            'auth': {
                'bearer': token
            },
            'headers': {
                'Content-Type': config.mediaType
            },
            'json': true
        };
    })
    

    test('postive', done => {
        options.body = template;
        request(options, (err, response, body) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

