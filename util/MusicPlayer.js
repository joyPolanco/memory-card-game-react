
import audio from "../public/sound.mp3"
const sound = new Audio(audio);


export const play = () => {
  sound.currentTime = 0;
  sound.playbackRate = 2;
  sound.loop = true;
  sound.volume = 0.2;

  sound.play();
};

export const pause = () => {
  sound.pause();
  sound.currentTime = 0;
};