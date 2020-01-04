import fetch from 'node-fetch'

import { ApiError } from './util'

function getUrl(path: string) {
  return `https://api.twitchemotes.com/api/v4/${path}`
}

/**
 * Fetches the channel ID for a specific emote based on its ID.
 * @param  id - The emote ID.
 * @return The channel ID or `null` for Twitch global emotes.
 */
export async function fetchChannelIdFromEmoteId(id: string): Promise<ChannelId> {
  const res = await fetch(`${getUrl('emotes')}?id=${id}`)
  const json = await res.json()

  if (!Array.isArray(json) || json.length > 1) {
    throw new Error('Invalid JSON returned from Twitch Emotes.')
  }

  if (json.length === 0) {
    throw new ApiError('Unknown emote!', 400)
  }

  const emote: TEEmote = json[0]

  return emote.channel_id
}

/**
 * Fetches emotes for a specific channel based on its ID.
 * @param  id - The channel ID.
 * @return The emotes for the channel.
 */
export async function fetchEmotesFromChannelId(id: string): Promise<TEEmotes> {
  const res = await fetch(`${getUrl('channels')}/${id}`)
  const json = await res.json()

  if (json.error) {
    throw new Error(json.error)
  }

  const { channel_name, display_name, broadcaster_type, plans, emotes }: TEChannel = json

  return {
    channel_name,
    display_name,
    broadcaster_type,
    plans,
    emotes,
  }
}
