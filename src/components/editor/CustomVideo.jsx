import ReactPlayer from "react-player"
import {useState, useEffect} from "react";

const CustomVideo = ({path}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState("");
  const [progressContainer, setProgressContainer] = useState("");
  const [fullmode, setFullmode] = useState("");

  return (
    <section>
      
    <ReactPlayer
      playing={isPlaying}

    />
    <h1>Yeah Negro</h1>
    </section>
  )
}

export default CustomVideo
