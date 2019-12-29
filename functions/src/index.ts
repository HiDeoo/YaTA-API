import * as functions from 'firebase-functions'

/**
 * /emote endpoint.
 */
export const emote = functions.https.onRequest((_request, response) => {
  response.send('Hello from emote!')
})
