# Auto throttle Middleware

This middleware is designed to limit the rate of incoming requests to your Node.js server. It can be used with any Node.js framework that supports middleware functions. The middleware is built using a simple yet effective rate limiting algorithm, and is easily configurable.

## Installation

To use the middleware, simply import the createRateLimiterMiddleware function from the provided source code

```typescript
import { createRateLimiterMiddleware } from './path/to/middleware';
```

## Usage

To use the middleware, you need to create an instance of it by calling the ```createRateLimiterMiddleware``` function with the desired maximum number of requests and the interval in seconds between request processing resets.

```typescript
const rateLimiterMiddleware = createRateLimiterMiddleware(maxRequests, interval);
```

Then, add the created middleware to your application's middleware stack.

### Express.js

```typescript
const express = require('express');
const app = express();

// Import the middleware
const { createRateLimiterMiddleware } = require('./path/to/middleware');

// Configure the middleware
const maxRequests = 5;
const interval = 60; // in seconds

// Create the middleware instance
const rateLimiterMiddleware = createRateLimiterMiddleware(maxRequests, interval);

// Add the middleware to the application
app.use(rateLimiterMiddleware);

// Your other route handlers and middleware
// ...

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### Koa.js
```typescript
const Koa = require('koa');
const app = new Koa();

// Import the middleware
const { createRateLimiterMiddleware } = require('./path/to/middleware');

// Configure the middleware
const maxRequests = 5;
const interval = 60; // in seconds

// Create the middleware instance
const rateLimiterMiddleware = createRateLimiterMiddleware(maxRequests, interval);

// Add the middleware to the application
app.use(async (ctx, next) => {
  await rateLimiterMiddleware(ctx.req, ctx.res, next);
});

// Your other route handlers and middleware
// ...

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### Hapi.js
```typescript
const Hapi = require('@hapi/hapi');

// Import the middleware
const { createRateLimiterMiddleware } = require('./path/to/middleware');

// Configure the middleware
const maxRequests = 5;
const interval = 60; // in seconds

// Create the middleware instance
const rateLimiterMiddleware = createRateLimiterMiddleware(maxRequests, interval);

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

server.ext('onPreHandler', async (request, h) => {
  await rateLimiterMiddleware(request.raw.req, request.raw.res, () => {});
  return h.continue;
});

// Your other route handlers and middleware
// ...

(async () => {
  await server.start();
  console.log('Server running on %s', server.info.uri);
})();
```

The middleware can also be used with other Node.js frameworks that support middleware functions. Simply adapt the integration to fit the specific framework's middleware structure.

## Configuration

The rate limiter middleware can be configured using the ```setMaxRequests``` and ```setInterval``` methods. 
The ```getLimits``` method allows you to retrieve the current configuration. The ```resetLimits``` method resets the configuration to the default values.


- [Node.js](https://nodejs.org/) (version 14 or higher)
- [TypeScript](https://www.typescriptlang.org/)

## Installation

1. Clone the repository:  
    ```bash
    git clone https://github.com/your-username/rate-limiter-server.git 
2. Change to the project directory:
    ```bash
    cd autothrottle
3. Install dependencies:
    ```bash
    npm install

## Running the server

1. Compile the TypeScript code:
    ```bash
   npm run build
2. Start the server:
    ```bash
    npm start

The server will be running on the port specified in the config.json file (default is 3000).

## Usage

### Update rate limiting configuration
You can update the maximum requests and time interval by sending a PUT request to the /limits endpoint with the following JSON payload:
```json
{
  "maxRequests": 10,
  "interval": 60000
}
```
This will update the rate limiting configuration to allow 10 requests per 60,000 milliseconds (1 minute).

### Check rate limiting configuration
You can check the current rate limiting configuration by sending a GET request to the /limits endpoint.

### Request handling
The server will respond with a 429 Too Many Requests status code if a user exceeds the allowed request limit. Otherwise, it will respond with a 200 OK status code and a simple message indicating that the request has been processed.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.










