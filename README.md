# Auto throttle

This project is a simple rate limiter server implemented in TypeScript. It allows you to limit the number of requests per user over a specified time interval.

## Features

- Rate limiting by IP address
- Configurable maximum requests and time interval
- Endpoint to update rate limiting configuration at runtime
- Simple JSON response format

## Prerequisites

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










