import React, { useEffect, useState, useRef } from "react";
import { Fireworks } from "fireworks-js/dist/react";
import options from "./fireworks-config.json";
import HBJohnnyVid from "./assets/JohnnyWishingHappyBdVid.mp4";
import Cake from "./cake/cake";
import NotPass from "./assets/gandalf_shallnotpass.mp3";
import "./App.css";

function App (){
  // Variables
  const videoRef = useRef(null);
  const audio = new Audio(NotPass);
  const [ audioPlaying, setAudioPlaying ] = useState(false);
  audio.onended = function (){
    setAudioPlaying(false);
  };
  const [ startVideo, toggleStartVideo ] = useState(false);
  const [ startCelebration, toggleStartCelebration ] = useState(false);
  const style = {
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    background: "#000",
    zIndex: 0,
  };
  // Functions
  const isToday = () => {
    const birthday = new Date(2021, 9, 16);
    const today = new Date();
    return (
      birthday.getDate() == today.getDate() &&
      birthday.getMonth() == today.getMonth() &&
      birthday.getFullYear() == today.getFullYear()
    );
  };
  const initialize = () => {
    if (window.innerWidth === 384 && window.innerHeight === 686 && isToday()) {
      toggleStartVideo(true);
    } else {
      audio.play();
      setAudioPlaying(true);
    }
  };
  const toggleFullScreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };
  useEffect(
    () => {
      if (startVideo) {
        toggleFullScreen();
        videoRef.current.play();
      }
    },
    [ startVideo ]
  );
  const videoEnded = () => {
    toggleStartCelebration(true);
    toggleStartVideo(false);
  };
  useEffect(
    () => {
      if (startCelebration) {
        const timer = setTimeout(() => {
          toggleStartCelebration(false);
        }, 15000);
        return () => clearTimeout(timer);
      }
    },
    [ startCelebration ]
  );
  return (
    <div>
      {startCelebration && <Fireworks options={options} style={style} />}
      <div className="content-without-overlay-wrapper">
        {startCelebration ? <Cake /> : null}
        {startVideo ? (
          <video
            src={HBJohnnyVid}
            onEnded={() => videoEnded()}
            className="video"
            ref={videoRef}
          />
        ) : null}
        {!startCelebration &&
        !startVideo && (
          <div className="pirate-button-wrapper">
            <button
              type="button"
              onClick={initialize}
              disabled={audioPlaying}
              className={`pirate-button ${audioPlaying ? "audio-playing" : ""}`}
            >
              <img
                className="pirates-img"
                src="https://www.seekpng.com/png/detail/22-226222_pirates-of-caribbean-logo.png"
                alt="Pirates Of Caribbean Logo@seekpng.com"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
