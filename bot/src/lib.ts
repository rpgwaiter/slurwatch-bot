import { EndBehaviorType, type VoiceConnection } from '@discordjs/voice'
import { Transform } from 'node:stream'
import OpusScript from 'opusscript'
import { renameSync } from 'fs'

// @ts-expect-error
import { FileWriter } from 'wav'

// TODO: take this from env
// const recordingDir = `${__dirname}/../recordings`
// const { SLURWATCH_RECORDING_DIR } = process.env || { SLURWATCH_RECORDING_DIR: `${__dirname}/../recordings` }
const recordingDir = process.env['SLURWATCH_RECORDING_DIR'] || `${__dirname}/../recordings`

class OpusDecodingStream extends Transform {
  encoder
  // @ts-expect-error
  constructor (options, encoder) {
    super(options)
    this.encoder = encoder
  }

  // @ts-expect-error
  _transform (data, encoding, callback) {
    // console.log(this.encoder)
    this.push(this.encoder.decode(data))
    callback()
  }
}

// Listens to people talking and spits out a wav file
export function listenIn (client: VoiceConnection) {
  let pathToFile: string
  let endToFile: string
  let sub
  client.receiver?.speaking.on('start', userId => { // ran when someone starts talking
    try {
      sub = client.receiver.subscribe(userId, {
        end: {
          behavior: EndBehaviorType.AfterSilence,
          duration: 1000
        }
      })
      pathToFile = `${recordingDir}/${userId}-${Date.now()}.writing`
      endToFile = `${recordingDir}/${userId}-${Date.now()}.wav`

      const encoder = new OpusScript(
        OpusScript.VALID_SAMPLING_RATES[2], // 16000
        2, // channels
        OpusScript.Application.VOIP
      )

      sub
        .pipe(new OpusDecodingStream({}, encoder))
        .pipe(new FileWriter(pathToFile, {
          channels: 2,
          sampleRate: 16000
        }))

      console.log(`${userId} is speaking...`)

      
    } catch (e) {
      console.warn(e)
    }
  })
  client.receiver?.speaking.on('end', userId => { // when they stop talking
    console.log(`${userId} stopped speaking`)
    sub?.destroy() // Ensure no further writes
    sub = client.receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1000
      }
    })
    renameSync(pathToFile, endToFile)
  })
}
