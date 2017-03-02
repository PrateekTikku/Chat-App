'use strict';

// Use local.env.js for environment variables that will be set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: 'chat-secret',

  GOOGLE_ID: '96013997090-uihqgm239rvd5fk86i9qdkvgct5mqm13.apps.googleusercontent.com',
  GOOGLE_SECRET: '3OtOo-XZt5g-aefkrBOcxMCg',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
