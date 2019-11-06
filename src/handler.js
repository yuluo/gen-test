'use strict';
const jp = require('jsonpath');
const SwaggerParser = require("swagger-parser");

module.exports.parseSpec = async event => {
  const apiObject = await SwaggerParser.dereference(event);
  const paths = apiObject.paths;

  Object.keys(paths).forEach( pathKey => {
    const path = paths[pathKey];
    Object.keys(path).forEach( key => {
      if(key === 'post' && pathKey === '/pet') {
        const jsonSchema = jp.query(path[key], "$['requestBody']['content']['application/json']['schema']")[0];
        console.log(`${key} ${pathKey}`);
        if(jsonSchema) {
          processJsonSchema(jsonSchema);
        }
      }
    })
  })
  
};

function processJsonSchema(schema) {
  console.log(JSON.stringify(schema, null, 2));

  let response = {
    template: {},
    required: []
  }

  response.required = schema.required;
}

function generateTemplate(schema) {
  if(schema.type === 'object') {

  } else if(schema.type === 'integer') {

  } else if(schema.type === 'number') {
    
  } else if(schema.type === 'boolean') {

  } else {
    if(schema.format === 'byte') {

    } else if(schema.format === 'binary') {

    } else if(schema.format === 'date-time') {

    } else if(schema.format === 'date') {

    } else if(schema.format === 'password') {

    } else {

    }
  }
}

const typeTemplate = {
  'integer': 'randomInteger()'
}
