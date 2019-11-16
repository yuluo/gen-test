'use strict'
const request = require('request');

let config = {
    'mediaType': 'application/json',
    'baseUrl': 'http://localhost:8080'
}

async function login() {
    return '067f6b38-a4f3-4152-a571-74b2b6c31cd8';
}

function setConfig(config) {
    this.config = config;
}

module.exports = {
    login
}