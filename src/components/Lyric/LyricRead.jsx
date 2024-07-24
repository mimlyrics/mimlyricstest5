import queryString from 'query-string';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { BsEye, BsViewStacked } from 'react-icons/bs';
import { FaBackward, FaForward, FaLanguage, FaPause, FaPhoneVolume, FaPlay,FaUnderline, FaVolumeHigh, FaVolumeOff, FaVolumeXmark } from 'react-icons/fa6';
import { FaItalic } from 'react-icons/fa6';
import { FaBold } from 'react-icons/fa6';
import { FaSearchengin } from 'react-icons/fa6';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa6';
import { IoMdSearch } from 'react-icons/io';
import { useMimlyrics } from '../context/AppProvider';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Lyric from './Lyric';
const ROOM_URL = "/api/v1/room";
const LYRIC_URL = "/api/v1/lyric";
const GET_LYRIC_URL = "/api/v1/lyric/get";
const EDIT_LYRIC_URL = "/api/v1/lyric/edit";
const DELETE_LYRIC_URL = "/api/v1/lyric";
const VIEWS_LYRIC_URL = "/api/v1/lyric/views";
const LIKES_LYRIC_URL = "/api/v1/lyric/likes";
const RECOMMENDED_LYRIC_URL = "/api/v1/lyric/recommendation";
const SEARCH_LYRIC_URL = "/api/v1/lyric/search";
const ARTIST_URL= "/api/v1/artist/name";
import { useSelector } from 'react-redux';
const LyricRead = () => {
  const [searchLyrics, setSearchLyrics] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [errMsg, setErrMsg] = useState("");   
  const [sLyrics, setSLyrics] = useState([]);
  const [lyric, setLyric] = useState({});
  const [text, setText] = useState([]);
  const [id, setId] = useState("");
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [likes, setLikes] = useState("");
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressContainer, setProgressContainer] = useState('');
  const [volumeX, setVolumeX] = useState(100);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef();
  const imageRef = useRef();
  const playedRef = useRef();
  const durationRef = useRef();
  const progressContainerRef = useRef();
  const [clientWidth, setClientWidth] = useState("");

  const navigate = useNavigate();
  const [lyricy, setLyricy] = useState([]);

  useEffect(() => {
    const element = audioRef.current
    let width = element.clientWidth || element.getBoundingClientRect().width;
    setClientWidth(width);
    setTimeout(() => {
      let width = element.clientWidth || element.getBoundingClientRect().width;
      setClientWidth(width);
    }, [1000])
  } , [])

  function getUserInfo () {
    if(localStorage.getItem('userInfo')) {
      let {_id, firstName} = useSelector(state => state.auth.userInfo) 
      return {_id, firstName}
    }
  }

   let {_id, firstName} = getUserInfo() || {};
  
  
  useEffect(() => {
    if(_id) {
      setIsLoggedin(true);
      //console.log("TRUUUE")
    }else {
      setIsLoggedin(false);
      //console.log("FAAALSE");
    }
  }, [])

  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(0);
  const {isActiveModalNavbar} = useMimlyrics();
  const [rLyrics, setRLyrics] = useState(null);
  const [category, setCategory] = useState("");
  const [artistName, setArtistName] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [artists, setArtists] = useState(null);
  const progressRef = useRef();
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // transformed lyrics
  const [tLyrics, setTLyrics] = useState([]);
  const [showAnimeLyrics, setShowAnimeLyrics] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState("");
  

  useEffect(() => {
    const {lyricId} = queryString.parse(location.search);
    setId(lyricId);
  }, [id])

    let lyricsT = [];
    function convertToMs() {
      // -----> format time in ms       min:sec:ms
      console.log('creating lyricy');
      
      if(lyricy) {
        console.log(lyricy);
        for(let i =0; i<lyricy.length;i++) {
          //console.log('humm');
          let idy = lyricy[i]._id
          console.log(idy);
          const splitStartTime = lyricy[i].startTime.split(":");
          const splitEndTime = lyricy[i].endTime.split(":");
          let formatEndTime = 0;
          let formatStartTime = 0;
          let formatText = lyricy[i].text;
          console.log(splitStartTime, splitEndTime);
          if(splitStartTime[0] == 0) {
            console.log("ok");
            formatStartTime = splitStartTime[1] + "." + splitStartTime[2];
            parseFloat(formatStartTime);
          }
          if(splitEndTime[0] == 0) {
            console.log('yep');
            formatEndTime = parseFloat(splitEndTime[1] + "." + splitEndTime[2]);
          }        
          if(splitStartTime[0] != 0) {
            formatStartTime = parseFloat(splitStartTime[0] * 60) + (parseFloat(splitStartTime[1] + "." + splitStartTime[2]));        
          }
          if(splitEndTime[0] !=0) {
            console.log('oui');
            formatEndTime = parseFloat(splitEndTime[0] * 60) + (parseFloat(splitEndTime[1] + "." + splitEndTime[2]));      
          }
          const updatedData = {_id: idy, startTime: formatStartTime, endTime: formatEndTime, text: formatText}
          lyricsT.push(updatedData);
          setTLyrics([...lyricsT]);
          console.log(lyricsT);
          console.log(tLyrics);
        }        
      }
    }


  useEffect(() => {
    const getLyric = async () => {
      try {
        const res = await axios.get(`${GET_LYRIC_URL}/${id}`, {headers: {withCredentials: true}})
        //console.log(res.data.lyric);
       setLikes(res.data.lyric.likes.length);
       setViews(res.data.lyric.views);
       setArtists(res.data.lyric.artists);
       //console.log("--------(((")
       setCategory(res.data.lyric.category);
       setText(res.data.lyric.text);
       setLyricy(res.data.lyric.lyric);  
        setLyric((prevState) => {
          return {prevState, ...res.data.lyric}
        });
      if(_id) {
        const foundLikes = res.data.lyric.likes.find(like => like == _id);
        if(foundLikes) {
          setHasLiked(true);
        } else {
          setHasLiked(false);
        } 
      }
      lyricy ? convertToMs() : null; 
       
       //console.log("XXXXXXx");   
      }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.data?.message);
      }
    }
    getLyric();
  }, [id, hasLiked, category,likes])

  const searchLyricsF = async () => {
    try {
        const res = await axios.get(`${SEARCH_LYRIC_URL}/${searchId}`, 
          {headers: {withCredentials: true}});
        setSearchLyrics(res.data.searchlyrics);
    }catch(err) {
        setErrMsg(err?.data?.message);
    }
   }

   useEffect(() => {
    const similarLyrics = async () => {
        try {
            const res = await axios.put(`${LYRIC_URL}/${category}/recommendation`, {artists},
             {headers: {withCredentials: true}});
            setSLyrics(res.data.lyricx);
            setRLyrics(res.data.lyrics);        
            console.log(res.data);
        }catch(err) {
            setErrMsg(err?.data?.message);
        }
    }
    similarLyrics();
    }, [id, artists])

    useEffect(() => {
      setTimeout(() => {
      const lyricViews = async () => {
        try {
          /*const res = await axios.put(`${VIEWS_LYRIC_URL}/${id}`, 
            { headers: {"Content-Type": "application/json"}});
          console.log(res.data);
          setViews(res.data.lyric.views);  */ 
        }catch(err) {
          setErrMsg(err?.data?.message);      
        }
      }
      lyricViews();
      }, [10000])
    }, [id])

  const likeLyricFunc = async (e) => {
    if(isLoggedin) {
      e.preventDefault();
      try {
        const res = await axios.put(`${LIKES_LYRIC_URL}/${id}`, {userId: _id}, 
          { headers: {"Content-Type": "application/json"}});
        console.log(res.data);
        setLikes(res.data.lyric.likes.length);   
        if(_id) {
          const foundLike = res.data.lyric.likes.find(like => like == _id);
          if(foundLike) {
            setHasLiked(true);
          }else {
            setHasLiked(false);
          }
        }
      }catch(err) {
        setErrMsg(err?.data?.message);      
      }
    }else {
      navigate('/login');      
    }
  }

  {/**Audio customization */}

  function playSong() {
    console.log('playSong');
    if(isAudioPlaying) {
      pauseSong();
    }
    setIsAudioPlaying(true);
    console.log(audioRef.current);
    audioRef.current.play();    
  }

  function pauseSong() {
    if(isAudioPlaying) {
      console.log('pauseSong');
      setIsAudioPlaying(false);
      console.log(audioRef);
      audioRef.current.pause();
    }else {
      playSong();
    }
  }

  useEffect(() => {
    const updateLyricAudio = () => {
      console.log(tLyrics.length);
      for(let i=0; i<tLyrics.length; i++) {
        console.log(audioCurrentTime, tLyrics[i].startTime);
        if(audioCurrentTime >= parseFloat(tLyrics[i].startTime)
         && audioCurrentTime <= parseFloat(tLyrics[i].endTime)) {
          console.log(tLyrics[i].text);
          console.log('yepp');
          setCurrentLyrics(tLyrics[i].text);
        }else {
          console.log('hummm');
          //console.log(lyricy[i].text);
        }
        if(audioCurrentTime > 4) console.log('true');
      }  
    }
    updateLyricAudio();
  }, [audioCurrentTime])

  useEffect(() => { 
    const setDuration = () =>  {
      let durationX = audioRef.current.duration
      const hrs = Math.floor(durationX/3600);
      const mins = Math.floor((durationX%3600)/60);
      const secs = Math.round(durationX%60, 2);
      hrs ? durationRef.current.innerHTML = `${hrs}:${mins}:${secs}`: durationRef.current.innerHTML = `${mins}:${secs}`;
    }

    setDuration()
  })

  function updateProgress(e) {
    const {duration, currentTime} = e.nativeEvent.srcElement;
    //console.log(duration, currentTime, volume);
    let progressX = (currentTime/duration) * 100;
    setProgress(progressX);
    progressRef.current.style.width = `${progress}%`;
    const hrs = Math.floor(currentTime/3600);
    const mins = Math.floor((currentTime%3600)/60);
    const secs = Math.round(currentTime%60, 2);
    hrs ? playedRef.current.innerHTML = `${hrs}:${mins}:${secs}`: playedRef.current.innerHTML = `${mins}:${secs}`;
    setAudioCurrentTime(currentTime);
    durationRef.current.innerHTML = `${duration}`
  }

  console.log(window.innerWidth)

  function handleCurrentProgress(e) {
    console.log(window.innerWidth);
    const {clientX, screenX} = e;
    // this.clientwidth, clickx/width*duration
    const progress = (screenX/window.innerWidth)*audioRef.current.duration
    audioRef.current.currentTime = progress;
    setAudioCurrentTime(progress);
  }

  function onClickVolume() {
    setShowVolume(!showVolume);    
  }

  return (
    <section className={ isActiveModalNavbar ? "relative -z-50 opacity-60" : "md:absolute md:top-16 md:ml-[20%] mx-1 md:mx-3"}>
      <div className=' my-1 '>
        <div className=' my-1 bg-indigo-200 py-3'>
          <h1 className='mx-1 my-1'>Basic Options</h1>
          <div className='flex space-x-2'>
            <button className=' rounded-md px-2 py-1 text-white bg-slate-600 hover:rounded-lg hover:bg-slate-900 translate-y-[1px]'>Language</button>
            <button className=' rounded-md px-2 py-1 text-white bg-slate-600 hover:rounded-lg hover:bg-slate-900 translate-y-[1px]'>Animations</button>
            <button className=' rounded-md px-2 py-1 text-white bg-slate-600 hover:rounded-lg hover:bg-slate-900 translate-y-[1px]'>Font</button>
            <button className=' rounded-md px-2 py-1 text-white bg-slate-600 hover:rounded-lg hover:bg-slate-900 translate-y-[1px]'>share</button>
          </div>
        </div>

        <div className=' mx-3 flex space-x-8 items-center'>
          {lyric.photo ? <img className=' w-[35vw] md:w-[15vw] md:h-[30vh] 
            ring-2 ring-sky-600' src={lyric.photo} alt='x'/>: null}
          <div className=''>
            <h1>---</h1>
          </div>
          <div className='flex flex-col space-y-3 md:space-y-2 '>
            <div className=' text-center ring-2  ring-sky-600'>
            {lyric.title?  <p className=' p-1 md:p-2 '>{lyric.title}</p>: null}
            </div>
            <div className=' md:py-2 flex space-x-6 '>
              <FaUnderline onClick={() => setIsUnderlined(!isUnderlined)} className = { isUnderlined ? `text-blue-700 font-bold text-lg` :`text-blue-300 text-lg` }/>
              <FaItalic onClick={() => setIsItalic(!isItalic)} className = { isItalic ? `text-blue-700 font-bold text-lg` :`text-blue-300 text-lg`}/>
              <FaBold onClick={() => setIsBold(!isBold)} className = { isBold ? `text-blue-700 font-bold text-lg` :`text-blue-300 text-lg`}/>
            </div>
            <div className=' flex space-x-6'>
              <div className=''>
                <FaThumbsUp onClick={(e) => likeLyricFunc(e)} 
                  className={ hasLiked ? ' cursor-pointer text-gray-900 w-6 h-6 md:w-7 md:h-7' :
                 'cursor-pointer text-gray-200 w-6 h-6 md:w-7 md:h-7'}
                />
                { lyric.likes ? <h1>{likes}</h1> : <h1>0</h1> }
              </div>
              <div className='py-1'>
                <BsEye className='text-gray-700 w-6 h-6 md:w-7 md:h-7'/>
                { lyric.views ? <h1>{lyric.views} </h1> : <h1>0</h1>}
              </div>
            </div>
          </div>
        </div>
       
        {/** AUDIO CUSTOMIZATION */}
        <section className=' my-3 bg-slate-100 p-2  '>

          <div>
            <audio 
              onTimeUpdate={(e) => updateProgress(e)} 
              ref={audioRef} src={lyric.path} 
              className=' w-[70%] my-3' 
            />   
          </div> 

          <div className='  flex space-x-4 md:w-[50vw] relative music-container p-[10px] text-gray-700  '>
            <div className=' flex space-x-4 '>
              <div>
                {isAudioPlaying  ? 
                  <FaPause onClick={() => pauseSong()}
                     className=' cursor-pointer text-gray-600 hover:text-gray-900 w-5 h-5'
                  /> : 
                  <FaPlay onClick={()=> playSong()} 
                    className='cursor-pointer text-gray-600 hover:text-gray-900 w-5 h-5'
                  />
                }
              </div>

              <div className='flex space-x-1'>
                <p className="ml-1 text-teal-600 " ref={playedRef}>0:00</p><span className="text-teal-300">/</span>
                <p ref={durationRef} className="text-teal-400">00:00</p>
              </div>
            </div>

            <div className=' ml-20 '>
              <h1 className=' text-slate-600 '> play -- {lyric.title}</h1>
            </div>  

            <div className=' absolute flex space-x-3 right-4 md:right-[1%] '>
              <div className=''>
              { showVolume ? 
                <input 
                  id="volume" className={ `w-[100%] my-2`} onChange={(e) => setVolumeX(e.target.value)} 
                  type='range' value={volumeX} min={0} max={100} step={1} /> : null}
              </div>

              <div className=''>
                { volumeX == 0 ? 
                  <FaVolumeXmark onClick={() => onClickVolume()}
                    className='cursor-pointer w-5 h-5 text-slate-600 hover:text-slate-800'/>
                    : 
                  <FaVolumeHigh onClick={() => onClickVolume()}
                    className='cursor-pointer w-5 h-5 text-slate-600 hover:text-slate-800'/>
                }
                <label className='text-[15px] text-teal-700 opacity-30' htmlFor='volume'>{volumeX}</label>
              </div>
            </div>

        </div>

        <div className=' '>
            <div onClick={handleCurrentProgress} ref={progressContainerRef}
              className={` relative mx-7 w-[85%] lg:w-[85%] h-[10px] bg-slate-600 rounded-lg cursor-pointer `}>
                <div  ref={progressRef}  className={` absolute top-[3px] w-[0%] h-[4px] bg-rose-400 rounded-lg `}></div>
            </div>
        </div>

        </section> 

        <div className=' my-4 flex space-x-4 '>
            <button onClick={() => setShowAnimeLyrics(!showAnimeLyrics)} 
            className=' rounded-lg py-2 px-3 bg-blue-100 hover:bg-blue-300 '>Anime Lyrics</button>
            <button className='' >Easy Lyrics</button>
        </div>

        <div className=' my-2 '>
        {showAnimeLyrics || isAudioPlaying ? <div className=' my-2 px-3 py-2 md:w-[50%] text-center font-semibold font-mono text-teal-600 '>
            {currentLyrics?  <h1>{currentLyrics}</h1> : null}
            {showAnimeLyrics && !currentLyrics ? <p>Not Available</p>: null}
          </div> : null}
        </div>

        <div className=' md:w-[50vw] text-sky-950  '>
            <div 
                className={ isUnderlined && isItalic && isBold ? ' mx-3 underline italic font-semibold': null ||
                isUnderlined && isItalic ? ' mx-3 underline italic': null  ||
                isUnderlined && isBold ? ' mx-3 underline font-semibold': null || 
                isItalic && isBold ? ' mx-3 italic font-semibold ': null ||
                isUnderlined ? ' mx-3 underline' : null || 
                isBold ? ' mx-3 font-semibold' : null ||
                isItalic ? ' mx-3 italic' : null || ' mx-3'}
                >
                <hr></hr>     
            </div>
          
          <div className='my-2 px-[7%] md:px-[10%]'>
            <p className=' '>{text}</p>
          </div>
        </div>
        <div className='  py-1 text-gray-900 '>
          <p className=' mb-1 font-semibold text-lg text-gray-700 '>Description:</p>
          <p className=' mx-8 md:w-[40vw]'>{lyric.description}</p>       
        </div>
        <div className='  py-1 text-gray-900 '>
          <p className=' mb-1 font-semibold text-lg text-gray-700 '>Meaning:</p>
          <p className=' mx-8 md:w-[40vw]'>{lyric.meaning}</p>       
        </div>
      </div>

      <div className='flex space-x-2  '>
          <h1 className='text-gray-700 font-semibold '>OTHERS - </h1>
          { artistName ?  artistName.map((a,i) => {
            return( <div className='' key={i}>
               {artistName.length <= i+1  ? <h1 >{a} </h1> : <h1>{a} & </h1>} 
            </div>)
          }) : null}
      </div>

      <div className='mx-2 rounded-md '>
          { rLyrics ? rLyrics.map((lyric,i) => {
            return (<div className=' ' key={lyric._id}>
              <Link to={`/lyric/read?lyricId=${lyric._id}`} 
               className=' '>
               <div className=' mx-8 px-2 bg-blue-50 hover:bg-blue-200 py-2 flex space-x-3 space-y-0'>
                <p className='text-gray-900 font-bold'>{i+1}.</p>
                <p>{lyric.title}</p>
               </div>
              </Link>
            </div>)
          }) : null}
      </div>
          
      <h1 className='text-gray-700 font-semibold text-lg'>Recommendation:</h1>
      <div className='my-2 md:mt-1 grid max-w-[700px] grid-cols-2 px-5 lg:grid-cols-3 gap-2 lg:gap-5'>          
        { sLyrics ? sLyrics.map(lyricy => {
          return  <Lyric key={lyricy._id} lyricy={lyricy} />
        })
      : null}
      </div>
    </section>
  )
}

export default LyricRead
