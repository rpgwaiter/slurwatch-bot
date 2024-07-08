import os
import time
import glob
import json
import threading

from whisper_cpp_python import Whisper

model_name = os.environ.get('STT_MODEL')
w = Whisper(model_path=f"./models/{model_name}")

# Specify the folder to watch
watch_folder = "/mnt/recordings"

# Function to be executed on each .wav file
def transcribe(file_path):
  file_name, file_extension = os.path.splitext(file_path)
  new_file_path = os.path.join(os.path.dirname(file_path), file_name + '.json')

  # If the json isn't already there, generate it
  if not os.path.exists(new_file_path):
    scription = w.transcribe(file_path, response_format='json')
    print(f"{scription}")
    # TODO: dont write empty files
    with open(new_file_path, 'w', encoding='utf-8') as f:
      json.dump(scription, f, ensure_ascii=False, indent=2)

def watch_loop():
  while True:
    # Get a list of all .wav files in the folder
    wav_files = glob.glob(os.path.join(watch_folder, "*.wav"))

    print(wav_files)

    # Iterate through the new files
    for file_path in wav_files:
      # Check if the file is new
      if not os.path.exists(file_path):
          continue
      print(f"FOUND FILE: {file_path}")

      # Rename the file to avoid race conditions
      file_name, file_extension = os.path.splitext(file_path)
      new_file_path = os.path.join(os.path.dirname(file_path), file_name + '.tempwav')

      # if we don't already have the renamed file
      if not os.path.exists(new_file_path):
        os.rename(file_path, new_file_path)

      # convert .tempwav to .json transcription
      print(f"TRANSCRIBING: {new_file_path}")
      transcribe(new_file_path)

      # delete the original recording
      # TODO: optionally do this based on env or something
      if os.path.exists(new_file_path):
        try:
          os.remove(new_file_path)
        except:
          pass
      

    # Sleep for a short period before checking again
    time.sleep(5)

class BackgroundTranscribe(threading.Thread):
    def run(self,*args,**kwargs):
        watch_loop()