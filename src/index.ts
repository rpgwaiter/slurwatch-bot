import { Client, Events, GatewayIntentBits, GuildBasedChannel } from 'discord.js'
import { VoiceConnectionStatus, AudioPlayerStatus, joinVoiceChannel, getVoiceConnection , } from '@discordjs/voice'
import type { Collection, Guild, GuildMember } from 'discord.js'
import 'dotenv/config'

const { SLURWATCH_TOKEN = '', SLURWATCH_GUILD_IDS = '', SLURWATCH_VOICE_CHANNELS = '' } = process.env

// Create a new client instance
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.MessageContent
] })


// Ran once the client successfully connects/auths
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
  const guild = readyClient.guilds.cache.get(SLURWATCH_GUILD_IDS)!
  const channel = guild.channels.cache.get(SLURWATCH_VOICE_CHANNELS)!

  // See if anyone's already in the voice channel
  const members = channel.members as Collection<string, GuildMember>
  const memberLength = members.size

  if (memberLength) {
    console.log(`There's ${memberLength} people in (${channel.name}). Joining...`)
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    })
  }
  
})


// Ran any time someone joins or leaves a voice channel
client.on(Events.VoiceStateUpdate, async voiceClient => {
  const username: string = voiceClient.member?.user.username! // Who's status changed

  const guild: Guild = voiceClient.guild!
  const channel: GuildBasedChannel = guild.channels.cache.get(SLURWATCH_VOICE_CHANNELS)!

  // Get the current voice channel if we're already in one
  let connection = getVoiceConnection(guild.id)

  const members = channel.members as Collection<string, GuildMember>
  const memberLength = members.size
 

  // An event happens on connect or disconnect, so lets see what it is
  if (!voiceClient.channel && username !== 'slurwatch') {
    console.log(`[${username}] - Connected`)
    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    })!

    connection.once(Events.ClientReady, conn => {
      console.log('Connected to Voice Channel:', channel.name)
    })
    
    // From here we should get the audio stream and pass it to the STT service
    // const audio = connection.receiver.createStream(message.member)
    // console.log(audio)
    // const file = fs.createWriteStream('recording.pcm')
    //   audio.pipe(file)
  } else {
    username !== 'slurwatch' && console.log(`[${username}] - Disconnected`)
    if (memberLength === 1) { // if we're the only one in the channel we can leave
      console.log('Everyone left the channel, we should leave too. Disconnecting.')
      connection?.disconnect()
    }
  }
})

// Log in to Discord with your client's token
client.login(SLURWATCH_TOKEN)
