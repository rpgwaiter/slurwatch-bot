# Watches for file changes and runs wav files thru ffmpeg, then whisper
import transcribe
import atexit
import asyncio

def noop():
  pass

# Watch the folder for new .wav files
def main():
  transcribe.watch_loop()

  
if __name__ == "__main__":
  main()
