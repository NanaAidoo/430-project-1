const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
// handles post request that are sent whenever add user is called
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
    request.on('data', (chunk) => {
      body.push(chunk);
    });
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};
// handles get request that are sent and calls whatever method is used
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getWorkouts') {
    jsonHandler.getUsers(request, response);
  } else {
    jsonHandler.notReal(request, response);
  }
};
// handles head request that and reads whatevver method was called
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getWorkouts') {
    jsonHandler.getUsersMeta(request, response);
  } else {
    jsonHandler.notRealMeta(request, response);
  }
};
// on every request it reads the method and calls the appropriate method
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};
// creates a server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
