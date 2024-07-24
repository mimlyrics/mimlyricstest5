import {useState, useEffect, useRef} from "react";
import queryString from "query-string";
import { FaComment, FaShare, FaHeart, FaDownload, FaCommentDots, FaPlay, FaPause, FaVolumeHigh, FaForward, FaForwardFast, FaBackward } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FaX } from "react-icons/fa6";
import { BsForward, BsFullscreen, BsRepeat, BsThreeDots } from "react-icons/bs";
import {useSelector} from "react-redux";
import TimeAgo from "timeago-react";
import {IoMdSend, IoMdSettings, IoMdSpeedometer, IoMdVideocam} from "react-icons/io";
import Picker from "emoji-picker-react";
import {BsEmojiSmileFill} from "react-icons/bs";
import { FaCamera } from "react-icons/fa6";
import {BiCommentDetail} from "react-icons/bi";
const VIDEO_URL = "/api/v1/video";
const SEARCH_VIDEO_URL = "/api/v1/video/search";
const IMAGE_URL = "/api/v1/upload/avatar";
const COMMENT_VIDEO_URL = "/api/v1/video/comment";
const COMMENT_RESPONSE_VIDEO_URL = "/api/v1/video/comment/response"
const LIKE_COMMENT_RESPONSE_VIDEO_URL = "/api/v1/video/comment/response/like"
const VIEWS_VIDEO_URL = "/api/v1/video/views";
const DOWNLOAD_VIDEO_URL = "/api/v1/video/download";
const SIMILAR_VIDEO_URL = "/api/v1/video"
import axios from "../api/axios";

//import ReactPlayer from "react-player";
import Video from "./Video";
// Custom Video
import CustomVideo from "./CustomVideo";

// Speed // repeat

const VideoStream = () => {
  const [id, setId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [videoy, setVideoy] = useState("");
  const [title, setTitle] = useState("");
  const [downloads, setDownloads] = useState("");
  const [commentv, setCommentv] = useState("");
  const [path, setPath] = useState();
  var [likes, setLikes] = useState(0);
  const [shares, setShares] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [commentLikes, setCommentLikes] = useState("");
  const [responseCommentLikes, setResponseCommentLikes] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [sVideo, setSVideo] = useState([]);
  const [views, setViews] = useState("");
  const [genre, setGenre] = useState("");
  const [room, setRoom] = useState("");
  const [country, setCountry] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [hasLike, setHasLike] = useState(false);
  const [likesArr, setLikesArr] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchvideos, setSearchvideos] = useState(null);
  const [rec, setRec] = useState(null);
  const [runComment, setRunComment] = useState(false);
  const [showAnswerComment, setShowAnswerComment] = useState(false);
  const answerCommentRef = useRef();
  const [isShort, setIsShort] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);

  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState("");
  const [fullScreen, setFullScreen] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef();
  const progressRef = useRef();
  const progressContainerRef = useRef();
  const volumeRef = useRef();
  const playedRef = useRef();
  const durationRef = useRef();
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [durationO, setDurationO] = useState({hr: 0, min: 0, secs: 0});

  const [volume, setVolume] = useState(100);
  const [showVolumeRange, setShowVolumeRange] = useState(false);
  const [widthV, setwidthV] = useState('100%');
  const [heightV, setHeightV] = useState('100%');
  const [resolution, setResolution] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);

  console.log("\n\n***********")
  console.log(sVideo);



  useEffect(() => {
    const {videoId} = queryString.parse(location.search);
    setId(videoId);
  }, [id])
  
  const handleEmojiPicker =  () => {
    setShowEmojiPicker(!showEmojiPicker);
  }
  const handleEmojiClick = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    let txt = text;
    txt += emoji
    setText(txt);
    console.log("emoji: ", emoji);
    console.log("MMM: ", text);
  }

  

  function getUserInfo () {
    if(localStorage.getItem('userInfo')) {
      console.log('Yesss NOOO Garrr');
      let {_id, firstName} = useSelector(state => state.auth.userInfo) 
      return {_id, firstName}
    }
  }

   let {_id, firstName} = getUserInfo() || {};
  console.log("IDD:_ ", _id);
  
  useEffect(() => {
    if(_id) {
      setIsLoggedin(true);
      console.log("TRUUUE")
    }else {
      setIsLoggedin(false);
      console.log("FAAALSE");
    }
  }, [])
  
  useEffect (() => {
    const getImage = async () => {
      try {
        const res = await axios.get(`${IMAGE_URL}/${_id}`, {headers: {withCredentials: true}});
        console.log(res.data);
        setImage(res.data.user.avatar);
      }catch(err) {
        setErrMsg(err?.data?.message);
      }
    }
    getImage();
  }, [isLoggedin])

  useEffect(() => {
    const getVideoById = async () => {
        try {
            const res = await axios.get(`${VIDEO_URL}/${id}/get`, {headers: {withCredentials: true}});
            setPath(res.data.video.path);
            setTitle(res.data.video.title);
            setViews(res.data.video.views);
            setCreatedAt(res.data.video.createdAt);
            res.data.video.likes ? setLikes(res.data.video.likes.length) : setLikes(0);
            setLikesArr(res.data.video.likes);
            setCommentv(res.data.video.comments);
            setShares(res.data.video.shares);
            setDownloads(res.data.video.download);
            setIsShort(res.data.video.isShort);
            //console.log(res.data.video);
            //console.log(videoy);
            const answ = res.data.video.likes.find(like => like ==_id );
            if(answ) {
              setHasLike(true);
            }else {
              setHasLike(false);
            }

        }catch(err) {
            setErrMsg(err?.data?.message);
        }
    }
    getVideoById();
  }, [id])

  useEffect(() => {
    const videoViews = async () => {
      try{
        const res = await axios.put(`${VIEWS_VIDEO_URL}/${id}`, {headers: {"Content-Type": "application/json", withCredentials: true}});
        console.log(res.data);
      }catch(err) {
        setErrMsg(err?.data?.message);
      }
    }
  }, [id])


  const downloadVideo = async (e) => {
    e.preventDefault();
    console.log("Heyy");
    try {
        const res = await axios.get(`${DOWNLOAD_VIDEO_URL}/${id}`, {headers: {withCredentials: true}});
        console.log(res.data);
    }catch(err) {
        setErrMsg(err?.data?.message);
    }
  }

  useEffect(() => {
    const similarVideo = async () => {
      const details = {genre: genre, room: room, country:country};
      try {
        const res = await axios.get(`${SIMILAR_VIDEO_URL}/${id}/similar`, {details}, {"Content-Type": "application/json"});
        setSVideo(res?.data.videos);
      }catch(error) {
        console.log(error)
      }
    }
    similarVideo();
  }, [id, genre, room])
  

  const commentVideo = async (e) => {
    e.preventDefault();
    if(isLoggedin) {
      try {
        const res = await axios.post(COMMENT_VIDEO_URL, 
          {mediaId: id, userId: _id, text: text, username: firstName, userprofile: image, type: 'video'}, 
          {headers: {withCredentials: true}});
        setComments(res.data.comments);
        window.scrollTo(0,1000);
        console.log(res.data);
        setRunComment(true);
      }catch(err) {
        setErrMsg(err?.data?.message);
      }
    }else {
      console.log('ok'); 
      navigate('/login');    
    }
  } 

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`${COMMENT_VIDEO_URL}/${id}/get`, {headers: {withCredentials: true}});
        setComments(res.data.comments);      
        setRunComment(false);
        setShowAnswerComment(false);
      }catch(err) {
        setErrMsg(err?.data?.message);
      }
    }
    getComments();
  }, [id, runComment])

  const answerComment = async (e,commentId) => {
    e.preventDefault();
    if(isLoggedin) {
      setShowAnswerComment(true);
      console.log('ok');
      try {
        //const res = await axios.put(`${COMMENT_RESPONSE_VIDEO_URL}/${commentId}`, 
        //{ userId:_id, txt: text, username: firstName, userprofile: image}, {headers: {withCredentials: true}});
        //console.log(res.data);
      }catch(err) {
        setErrMsg(err?.data?.message);
      }
    }else {
      navigate('/login')
    }
  }

  const getCommentResponse = async (e) => {
    e.preventDefault();
    setShowResponse(!showResponse);
  }


  const likeFunction = async (e) => {
    if(isLoggedin) {
      e.preventDefault();
      try {
        const res = await axios.put(`${VIDEO_URL}/${id}/likes`, {userId: _id}, { headers: {"Content-Type": "application/json"}});
        console.log(res.data);
        setLikes(res.data.video.likes.length);   
        const foundLikes = res.data.video.likes.find(like => like === _id);
        console.log('foundLikes: ', foundLikes);
        if(foundLikes) {
          setHasLike(true);
        }else {
          setHasLike(false);
        }
        console.log('haaaLike: ', hasLike);
      }catch(err) {
        setErrMsg(err?.data?.message);      
      }
    }else {
      navigate('/login');
    }
  }

  const likeCommentFunction = async (e, commentId) => {
    e.preventDefault();
    if(isLoggedin) {
      console.log("Yess");
      try {
        const res = await axios.put(`${COMMENT_VIDEO_URL}/${commentId}/${_id}/likes`, 
          {headers: {"Content-Type": "application/json"}});
        console.log(res.data.comment);
        setCommentLikes(res.data.comment.likes.length);
        setRunComment(true);
      }catch(err) {
        console.log(err);
        setErrMsg(err?.data?.message);      
      }
    }else {
      navigate('/login');
    }
  }

  const likeResponseCommentFunction = async (e, commentId) => {
    if(isLoggedin) {
      e.preventDefault();
      try {
        const res = await axios.put(`${LIKE_COMMENT_RESPONSE_VIDEO_URL}/${commentId}`, {userId: _id}, { headers: {"Content-Type": "application/json"}});
        console.log(res.data);
        setResponseCommentLikes(res.data.comment.response.length);
      }catch(err) {
        setErrMsg(err?.data?.message);      
      }
    }else {
      navigate('/login');
    }
  }
  
  const viewComment = () => {
    setShowComments(true);
    setShowAnswerComment(false);
  }

  /*const handleProgress = (e) => {
    console.log(e.playedSeconds);    
    let progressX = (e.playedSeconds/duration) * 100;
    console.log(progressX);
    setProgress(progressX);
    progressRef.current.style.width = `${progress}%`;
    const hrs = Math.floor(e.playedSeconds/3600);
    const mins = Math.floor((e.playedSeconds%3600)/60);
    const secs = Math.round(e.playedSeconds%60, 2);
    console.log(hrs, mins);
    console.log(playedRef);
    hrs ? playedRef.current.innerHTML = `${hrs}:${mins}:${secs}`: playedRef.current.innerHTML = `${mins}:${secs}`;
  }

  const handleDuration = (e) => {
    console.log('\n\n\ne: ', e);
    setDuration(parseFloat(e));
    const hrs = Math.floor(e/3600);
    const mins = Math.floor((e%3600)/60);
    const secs = Math.round(e%60, 2);
    console.log(hrs, mins);
    console.log(durationRef);
    hrs ? durationRef.current.innerHTML = `${hrs}:${mins}:${secs}`: durationRef.current.innerHTML = `${mins}:${secs}`;
  }

  const handleEnd = (e) => {
    console.log('e: ', e);
  }

  const handleCurrentProgress = (e) => {
    console.log(e);
    const clickX = e.screenX
    const clientWidth = e.clientX
    console.log(clickX, clientWidth);
    const newTime = (clickX / clientWidth) * duration;
    console.log(videoRef.current);

  }

  const ShowFullScreen = () => {
    let width = '100%'
    let height = '100%'
    setwidthV(width)
    setHeightV(height)
  }

  const PlayNextVideo = () => {
    let randomId = Math.floor(Math.random() * sVideo.length)
    const selectedId = sVideo[randomId]._id;
    setId(selectedId)
    setTimeout(() => {
      navigate(`/video/stream?videoId=${selectedId}`)
      window.location.reload();
    }, [50])
      /*console.log(sVideo);
      // Play next video---> sVideo[0] sVideo[1]
      let length = sVideo.length
      setPath(sVideo[randomId].path)
      setTitle(sVideo[randomId].title);
      setViews(sVideo[randomId].views);
      setCreatedAt(sVideo[randomId].createdAt);
      sVideo[randomId].likes ? setLikes(sVideo[randomId].likes.length) : setLikes(0);
      setLikesArr(sVideo[randomId].likes);
      setCommentv(sVideo[randomId].comments);
      setShares(sVideo[randomId].shares);
      setDownloads(sVideo[randomId].download);
      setIsShort(sVideo[randomId].isShort);
    }, [path, title, views, createdAt, shares, downloads, isShort])

    PlayNextVideo()
  }

  const ToggleVideo = () => {
    setIsPlaying(!isPlaying);
  }

  const PlayRecentVideo = () => {

  }

  const videoWidth = `${100 - 25}%`
  const videoHeight = `50%`*/

  return (
    <section className={ showSettings ? ` opacity-80 bg-zinc-200 z-50 mt-1 md:mt-2 md:ml-[20%] md:w-[97%]` 
      : ` opacity-100 mt-1 md:mt-2 md:ml-[20%] md:h-[${videoHeight}] md:w-[${videoWidth}]`}>
           
      <div className="relative md:w-[100%] ">

        {/**  ABSOLUTE LEFT FOR SINGLE VIDEO **/}
        
        <div className="  ">
          {/*<video className= {!isShort ? " w-[98%] mx-1 md:w-[48%] h-[50vh] md:[50vw] rounded-lg ": 
  " bg-sky-100 w-[90vw] md:w-[45%] h-[75vh] mx-2  rounded-lg "} src={path} controls />*/}
        
        {/** React Player */}
     
          {/*<div className="relative mx-[0%] h-[90%] bg-teal-600 ">
        <ReactPlayer
          ref={videoRef}
          url={path}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnd}
          playing={isPlaying}
          volume={volume}
          className=" m-auto "
          width={'100%'} 
          height={'100%'}   
        />
        
        <div className=" h-[100%] w-[100%] absolute top-0 left-0">
          <div className="">
            <div className="cursor-pointer">
              <FaBackward onClick={PlayRecentVideo} 
                className="absolute bg-gray-500 top-[40%] left-[10%] text-slate-300 w-6 h-6"/>
              <FaPause onClick={ToggleVideo} className="absolute top-[40%] left-[45%] text-slate-300 w-6 h-6"/>
              <FaForward onClick={PlayNextVideo} className="absolute top-[40%] right-[6%] text-slate-300 w-6 h-6"/>
            </div>
          </div>

          <div className="absolute top-[80%] w-[95%] mx-[2%] md:top-[75vh]  p-2 rounded-lg shadow-sm shadow-gray-100 bg-gray-600 bg-opacity-50">     
            <div className="flex space-x-6">
              <div className="flex">
              { isPlaying ? 
                <FaPause className=" cursor-pointer w-6 h-6 text-slate-200" onClick={() => setIsPlaying(false)}/>:
                <FaPlay className="cursor-pointer w-6 h-6 text-slate-200" onClick={() => setIsPlaying(true)}/>   
              }
              <div className="flex space-x-2">
                <p className="ml-3 text-teal-100 " ref={playedRef}>0:00</p><span className="text-teal-300">/</span>
                <p ref={durationRef} className="text-teal-400">00:00</p>
                <div className="flex">
                  {showVolumeRange? <input type="range" min={0} max={1} step={'any'} value={volume} onChange={e=>setVolume(e.target.value)}/>: null}
                  <FaVolumeHigh onMouseEnter={() => setShowVolumeRange(!showVolumeRange)}   className=" cursor-pointer w-6 h-6 text-slate-100"/>  
                </div>
            </div> 
              <div onClick={ShowFullScreen} className=" absolute top-2 right-[5%] cursor-pointer shadow-sm shadow-gray-100 ">
                <BsFullscreen className="w-5 h-5 text-slate-200"/>
              </div>
            </div>
            </div> 
          </div>

          <div className=" absolute top-[96%] md:top-[96%] left-[0%] md:w-[95%] lg-w[45%] w-[90%]">
            <div onClick={handleCurrentProgress} ref={progressContainerRef}
              className={` relative mx-7 w-[100%] lg:w-[85%] h-[10px] bg-slate-600 rounded-lg cursor-pointer `}>
                <div  ref={progressRef}  className={` absolute top-[3px] w-[0%] h-[4px] bg-rose-400 rounded-lg `}></div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="">
        <video src={path} controls></video>/
      </div>


      <div className=" ">
        <h1 className=" text-lg mt-2 md:text-xl font-medium mx-2 md:ml-2 text-gray-800">{title}</h1>
        <div className=" md:text-[15px] text-[15px] mx-2 mt-0 flex space-x-3 ">
        <h1><TimeAgo datetime={createdAt}/></h1>
        <h1 className="font-medium">{views} view(s)</h1>
        </div>
      
     
        <div className=" mx-2 md:ml-2 flex space-x-20 md:space-x-20">
          {/*Like*/}   
            <FaHeart 
              className= { hasLike ?  "cursor-pointer w-6 h-6 md:w-7 md:h-7 text-red-500" : "cursor-pointer w-6 h-6 md:w-7 md:h-7"} 
              onClick={(e) => likeFunction(e)}/>   
            <FaComment onClick={() => viewComment()} className=" cursor-pointer w-6 h-6 md:w-7 md:h-7 text-slate-900"/>
            <FaShare className="  w-6 h-6 md:w-7 md:h-7 text-slate-900"/>
            <FaDownload onClick={(e)=>downloadVideo(e)} className="  w-6 h-6 md:w-7 md:h-7 bg-yellow-500 cursor-pointer text-slate-900"/>
        </div>
        <div className=" text-[17px] mx-2 md:ml-2 flex space-x-24 md:space-x-24">
            <p >{likes}</p>
            {comments ? <Link to={`video/comments/${id}`}>{comments.length} </Link> : null}
            {shares ? <Link to="/video/share">{shares}</Link> : <Link to="/video/share">0</Link>}
            <p>{downloads}</p>
        </div>
      
        { showComments ?
        comments ?       
          <div className="mx-1 md:w-[46vw]">
          <div className="mt-2 bg-violet-100 mb-3">
            <button className=" mx-3 text-lg font-medium text-blue-950 mb-4">Comments</button>
            <button className=" ml-80 md:ml-[70%] mt-2 "><FaX className="w-5 h-5" onClick={() => setShowComments(false)}/></button>
          </div>
          <div className=" mb-3">
            <button className="shadow p-3 bg-slate-100 mr-7 rounded-md hover:bg-slate-400">Most Popular</button>
            <button className="shadow p-3 bg-slate-300 rounded-md hover:bg-slate-500 ">Most recent</button>  
          </div>

          {/** COMMENTS__SECTion  */}
          {!showAnswerComment ?

            comments.map(comment => {
              return(
                <div className=" md:w-[50vw] mx-2 mb-6 border-b-[1px]" key={comment._id}>
                  <div className=" relative flex space-x-9">
                    <img className=" absolute top-1 md:-top-2 w-6 h-6 md:w-7 md:h-7 rounded-full mr-4" src={comment.userprofile} alt="X"/>      
                  </div>
                  <div className="ml-11 flex space-x-28 mb-2">
                    <h1 className=" text-slate-700 font-sans ">{comment.username}</h1>       
                  </div>
                  <div className="flex space-x-7">
                    <h1 className="ml-11 w-[70%]">{comment.text}</h1> 
                    <div className="flex space-x-0"> 
                      <FaHeart 
                        onClick={e=>likeCommentFunction(e, comment._id)} 
                        className={ isLoggedin && comment.likes.find(like => like == _id) ? 
                          "w-5 h-5 cursor-pointer text-red-500 mr-1": 
                          "w-5 h-5 cursor-pointer text-blue-300 mr-1"}/>
                        {comment.likes.length > 0 ? <p>{comment.likes.length}</p> : <p>0</p>}
                    </div> 
                      <BiCommentDetail  onClick={e=>answerComment(e, comment._id)} className="w-5 h-5 text-blue-500 cursor-pointer"/>
                  </div> 
                  {comment.response.length > 0 ? 
                    <p onClick={e=>getCommentResponse(e)} className="cursor-pointer text-blue-500"> {comment.response.length} response(s)</p>
                    :null
                  }

            {showResponse ? 
              comment.response.map(res => {
                return(
                  <div key={res._id} className="flex flex-col py-2 relative space-x-9">
                    <img className="absolute top-5 w-5 h-5 md:w-7 md:h-7 rounded-full mr-4" src={res.userprofile}/>
                    <h1 className="font-medium">{res.username}</h1> 
                  <div className="flex space-x-9">
                    <h1 className="">{res.text}</h1>   
                    <FaHeart onClick={e=>likeResponseCommentFunction(e, res._id) } className="w-5 h-5 text-blue-500 mr-2"/>
                    {res.likes > 0 ? <p>{res.likes.length}</p> : <p>0</p>}
                  </div>
                  </div>
                )
              }) : null
            }
              
            </div>
              ) 
            }) 
            
            :
            
            <div className=" text-lg text-center text-teal-700 font-semibold border h-32 shadow-sky-300">
              {_id? <h1 >{`We are sorry ${firstName}, it will soon be available`}</h1> : <h1>HO Login</h1> }
              <button onClick={() => setShowAnswerComment(false)} className=" mt-3 px-4 py-2 rounded-lg border bg-blue-600 text-white ">Back</button>
            </div>
          
          } 


          <div className="relative mt-5 ">
            <div className="absolute top-2 left-0 ">
              <BsEmojiSmileFill className="w-10 h-6" onClick={handleEmojiPicker}/>
              {showEmojiPicker && <Picker onClick={handleEmojiClick}/>}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? commentVideo(e) : null)}
              placeholder="add a comment..."
              className=" md:text-lg px-9 py-2 font-sans w-[90%] md:w-[97%] h-11 md:h-16 border shadow rounded"
            />
          <button >
            <IoMdSend className={text ? "text-slate-600 absolute -top-1 ml-1 w-11 h-14 ": "text-slate-200 absolute -top-1 ml-1 w-11 h-14 "} onClick={e=>commentVideo(e)}/>
          </button>
          </div> 
          </div>
        :       
        <div className="relative ml-2  ">
          <h1>Hummm</h1>
            <div className="absolute top-2 left-0 ">
              <BsEmojiSmileFill className="absolute top-6 w-10 h-6" onClick={handleEmojiPicker}/>
              {showEmojiPicker && <Picker onClick={handleEmojiClick}/>}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? commentVideo(e) : null)}
              placeholder="add a comment..."
              className=" px-9 py-2 bg-slate-100 text-gray-900 w-[80%] md:w-[65%] h-11 border shadow rounded"
            />
          <button >
            <IoMdSend className="absolute top-4 ml-1 w-11 h-14 " onClick={e=>commentVideo(e)}/>
          </button>
          </div>
        : null
        }
        </div> 
     </div>
      
     <div className="relative mt-2 ">
        <h1 className="text-gray-700 font-semibold text-lg ml-3">__Recommendations__</h1>
          <div className="  ">
              <div className=" mt-[1%] md:mt-[0%] grid grid-cols-1 lg:grid-cols-3">
              {sVideo.map(videoy => {
                  return <Video key={videoy._id} videoy={videoy} />
              })}
              </div>
          </div>    
          
      </div>
      </div> 
    </section>
  )
}

export default VideoStream;
