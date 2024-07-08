# Watches for file changes and runs wav files thru ffmpeg, then whisper
import transcribe
import atexit
import asyncio

def noop():
  pass

# Watch the folder for new .wav files
def main():
  # atexit.register(noop)
  # t = BackgroundTranscribe()
  # t.start()
  # print("concurrency yo")
  transcribe.watch_loop()

  # at this point i should record the text in a sqlite db or something

  
if __name__ == "__main__":
  main()