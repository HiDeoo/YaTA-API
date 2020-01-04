import { initializeApp, firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'

import { fetchChannelIdFromEmoteId, fetchEmotesFromChannelId } from './twitchemotes'
import { ApiError, cors } from './util'

// Initialize the application.
initializeApp()

// Initialize the database.
const db = firestore()

/**
 * Various database collections used in the application.
 */
const emoteCollection = db.collection('emote')
const emotesCollection = db.collection('emotes')

/**
 * /emotes endpoint.
 * This endpoint returns a channel emotes based on a specific emote ID.
 */
export const emotes = functions.https.onRequest(async (request, response) => {
  cors(request, response)

  const id: string | undefined = request.query.id

  if (typeof id === 'undefined') {
    return response.status(400).send('Invalid payload!')
  }

  try {
    const dbEmote = await emoteCollection.doc(id).get()

    let channelId: ChannelId

    if (dbEmote.exists) {
      const { channel_id } = dbEmote.data() as DBEmote

      channelId = channel_id
    } else {
      channelId = await fetchChannelIdFromEmoteId(id)

      await emoteCollection.doc(id).set({
        channel_id: channelId,
      })
    }

    if (channelId) {
      const dbEmotes = await emotesCollection.doc(channelId).get()

      if (dbEmotes.exists) {
        const { updated_at, ...sanitizedEmotes } = dbEmotes.data() as DBEmotes
        const timestamp = Math.round(new Date().getTime() / 1000)
        const diff = timestamp - updated_at._seconds

        // Only returns emotes updated less than 30min ago.
        if (diff < 1800) {
          return response.send(sanitizedEmotes)
        }
      }

      const emotes = await fetchEmotesFromChannelId(channelId)

      await emotesCollection.doc(channelId).set({
        ...emotes,
        updated_at: firestore.FieldValue.serverTimestamp(),
      })

      return response.send(emotes)
    }

    return response.send({
      channel_name: 'Twitch',
      display_name: 'Twitch',
      broadcaster_type: null,
      emotes: [],
      plans: {
        '$4.99': null,
        '$9.99': null,
        '$24.99': null,
      },
    })
  } catch (error) {
    console.error(error)

    if (error instanceof ApiError) {
      return response.status(error.code).send(error.message)
    }

    return response.status(500).send('Something went wrong!')
  }
})
