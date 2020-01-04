/**
 * A Twitch channel id.
 * We're accepting `null` in this case as Twitch global emotes don't have a channel ID.
 */
type ChannelId = string | null

/**
 * A Twitch emote representation returned from twitchemotes.com.
 */
type TEEmote = {
  code: string
  emoticon_set: number
  id: number
  channel_id: ChannelId
  channel_name: string
}

/**
 * A Twitch channel representation returned from twitchemotes.com.
 */
type TEChannel = {
  channel_name: string
  display_name: string
  channel_id: string
  broadcaster_type: 'partner' | 'affiliate' | null
  plans: {
    '$4.99': string | null
    '$9.99': string | null
    '$24.99': string | null
  }
  emotes: Array<{
    code: string
    emoticon_set: number
    id: number
  }>
  subscriber_badges: {
    [key: string]: {
      image_url_1x: string
      image_url_2x: string
      image_url_4x: string
      title: string
    }
  } | null
  bits_badges: {
    [key: string]: {
      image_url_1x: string
      image_url_2x: string
      image_url_4x: string
      title: string
    }
  } | null
  cheermotes: {
    [key: string]: {
      '1': string
      '1.5': string
      '2': string
      '3': string
      '4': string
    }
  } | null
  base_set_id: string
  generated_at: string
}

/**
 * A sanitized list of Twitch channel emotes returned from twitchemotes.com.
 */
type TEEmotes = Pick<TEChannel, 'channel_name' | 'display_name' | 'broadcaster_type' | 'plans' | 'emotes'>

/**
 * A Twitch emote stored in the database.
 */
type DBEmote = Pick<TEEmote, 'channel_id'>

/**
 * A list of Twitch channel emotes stored in the database.
 */
type DBEmotes = TEEmotes & { updated_at: DbTimestamp }
