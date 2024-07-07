# slurwatch-bot

#### Discord bot that sits in a voice channel and listens for slurs, keeps track of who said what and how many times

---

## NOTE: The explicit goal of this project is to DISCOURAGE the use of slurs, I absolutely do not want to gamify being a shitty person. I may need to gamify in the opposite direction to achieve this goal, or maybe this is a bad idea in general. Time will tell. Maybe the bot could kick/ban/move users who are repeat offenders.

### Requirements

- bun (js runtime)

So, this bot will record all activity in a voice channel and drop .wav files in a specified dir (in .env)


### TODO:

- Listen to any channel in a guild with a person in it, not just the ones specified
- Setup whisper inotify service that waits for recordings and auto transcribes them, deleting the recording afterwards (this is due to the js bindings for whisper.cpp being garbage)
- Maybe someday rewrite this in python since the whisper bindings seem a LOT better on the py side