import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
//import "./css/video.css";
import { FaUpDown, FaUpload } from "react-icons/fa6";
import {countries} from "country-data-list";
import axios from "../api/axios";
import { BsArrowDown, BsX } from "react-icons/bs";
import { Link } from "react-router-dom";
const ROOM_URL = "/api/v1/room";
const LYRIC_URL = "/api/v1/lyric";
const LYRIC_READ_URL = "/api/v1/lyric/reaad";
const APP_DATA_URL = "/api/v1/appData";
const EditorPostLyric = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory]  = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artistName, setArtistName] = useState("");
  const [country, setCountry] = useState("");
  const [countriesx, setCountriesx] = useState([]);
  const [points, setPoints] = useState("");
  const [famous, setFamous] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [files, setFiles] = useState(null);
  const [showAudio, setShowAudio] = useState(false);
  const {userInfo} = useSelector(state => state.auth);
  const [audio, setAudio] = useState();
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [Hi, setHi] = useState("");
  const [text, setText] = useState("");
  const [lyricText, setLyricText] = useState("");
  const [lyric, setLyric] = useState([]);
  const [photo, setPhoto] = useState();
  const test = countriesx.map(country => country);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [artistField, setArtistField] = useState([{artist: "", show: true}]);
  const [artists, setArtists] = useState([]);
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState(null);
  const [audioDataURL, setAudioDataURL] = useState(null);
  const [uid, setUid] = useState("");
  const [meaning, setMeaning] = useState("");
  const [textArr, setTextArr] = useState([]);
  

  const [updateArtist, setUpdateArtist] = useState(false);
  const [showLyric, setShowLyric] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  const [audioX, setAudioX] = useState();
  const [photoX, setPhotoX] = useState();

  const [showTypeOne, setShowTypeOne] = useState(false);
  const [showTypeTwo, setShowTypeTwo] = useState(false);

  const [hasUpload, setHasUpload] = useState(false);
  const [runFunc, setRunFunc] = useState(false);
  const [lyricId, setLyricId] = useState("");

  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);

  const [validPhoto, setValidPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [validAudio, setValidAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const [errPhoto, setErrPhoto] = useState("");
  const [errAudio ,setErrAudio] = useState("");

  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUplaoding] = useState(false);

  //GET country
  useEffect(() => {
    setCountriesx(countries.all); 
    setCountry("+33");
  }, [])

  // GET GENRES
  useEffect(() => {
    const getGenres = async () => {
      try {
        const res = await axios.get(APP_DATA_URL, {withCredentials: true});
        setGenres(res.data.appData[0].genres);
        setGenre(res.data.appData[0].genres[0]);
      }catch(err) {
        setErrMsg(err?.data?.message);
      }
    }
    getGenres();
  }, [])

  useEffect(() => {
    const getRooms = async () => {
      const res = await axios.get(ROOM_URL, {headers: {withCredentials: true}});
      setCategories(res.data.rooms);
      setCategory(res.data.rooms[0].name);
    }
    getRooms();
  }, [])

  // PREVIEW AUDIO
  useEffect(() => {
    let fileReader, isCancel = false;
    if(audioX) {
      setHasUpload(true);
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const {result} = e.target;
        if(result && !isCancel) {
          setAudioDataURL(result);
        }
      }
      fileReader.readAsDataURL(audioX);
    }
    return () => {
      isCancel = true;
      if(fileReader && fileReader.readyState == 1) {
        fileReader.abort();
      }
    }
  }, [audioX, runFunc])

  // PREVIEW PHOTO
  useEffect(() => {
    let fileReader, isCancel = false;
    //console.log("photo: ", files);
    if(photoX) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
            const {result} = e.target;
            if(result && !isCancel) {
                setFileDataURL(result);
            }
        }

        fileReader.readAsDataURL(photoX);
    }
    //console.log(fileDataURL);
    return () => {
      isCancel = true;
      if(fileReader && fileReader.readyState == 1) {
        fileReader.abort();
      }
    }

  }, [photoX])


  {/** REctification */}
  useEffect(() => {
    async function getLyric() {
      try {
        if(userInfo) {
          const userId = userInfo._id;
          const res = await axios.get(`api/v1/upload/audio/lyric`, {headers: {withCredentials: true}});
          console.log("resss ", res.data);
          setAudio(res.data.lyrics[1].path);
        }
      }
      catch(err) {
          console.log(err);
      }     
    }
    getLyric();
  }, []) 

  const onChangeCategory = (e) => setCategory(e.target.value);

  // Post Lyric

  useEffect(() => {
    createPhotoCover();
    //console.log("Thumbnail also created");
  }, [lyricId]);

  const createLyric = async () => {
    //try {
      let timeArr = []
      let lyricx = []
      const splitText = lyricText.split("\n\n");
      //console.log(splitText);
      for(let i=0; i<splitText.length; i++) {
        //timeArr = splitText[i].split("\n")[0];
        let splitLineByLine = splitText[i].split("\n");
        timeArr = splitLineByLine[0]
        let fullText = '';
        for(let j=1; j<splitLineByLine.length; j++) {
          fullText = fullText + splitLineByLine[j] + "\n";
        }
        //console.log(splitLineByLine)
        let updatedData = {text: fullText, 
          startTime: timeArr.split("-->")[0].trimEnd(),
          endTime: timeArr.split("-->")[1].trimStart()
        };
        lyricx.push(updatedData);
        setLyric(lyricx);
      }
      //console.log(lyric);
      if(lyric[0].text === undefined) {
        lyric.splice(0, 1);
        setLyric(lyric);
      }    
  }

  const createPhotoCover = async () => {
    //console.log(lyricId);
    if(photoX) {
      try {
        const formData = new FormData();
        formData.append("photo", photoX);
        const res = await axios.put(`${LYRIC_URL}/${lyricId}/cover`, formData, {headers: {"Content-Type": "multipart/form-data"},withCredentials: true});
        console.log(res.data);
        if(res) {
          window.scrollTo(0,50);
          setSuccess("Lyric audio/text has been posted successfully ");
          setErrMsg("");
          setTimeout(() => {
            setSuccess("");
            setHi(true);
          }, [4000])
        }
      }catch(err) {
        setErrMsg(err?.data?.message);
      }
    }else {
      setErrPhoto("Error, photo cover is required");
    }
  }

  const formatArtists = () => {
    console.log("\n---");
    console.log(artistField);
    const arr = []
    if(artistField) {
      for(let i=0;i<artistField.length;i++) {
        arr.push(artistField[i].artist)
      }
    }
    return arr
  }


  useEffect(() => {
    setShowUploadProgress((showUploadProgressx) => showUploadProgressx)
  }, [showUploadProgress])


  const handlePostSubmit = async (e) => {
    e.preventDefault();
    console.log('create lyric');
    createLyric();
    console.log('lyrics created')

    const arr = []
    if(artistField) {
      for(let i=0;i<artistField.length;i++) {
        arr.push(artistField[i].artist)
      }
    }
    setArtists(arr)

    try {
      const formData = new FormData();
      /*if(text) {
        if(text.includes("\n\n")) {
          console.log('yes');
          const splitText = text.split("\n\n");
          for(let i=0; i<splitText.length; i++) {
            formData.append('text', splitText[i]);
          }
          console.log(text);
        }else {
          console.log("OUI");
          setTextArr([...text]);
          for(let i =0; i<textArr.length; i++) {
            formData.append('text', textArr[i]);
          } 
        }
      }*/
      formData.append("audio", audioX);
      for(let i=0;i<lyric.length;i++) {
        formData.append("lyric", lyric[i]);
      }
      formData.append("category", category);
      formData.append("title", title);
      formData.append("description", description);
      for(let i=0;i<arr.length; i++) {
        formData.append("artists", arr[i]);
        console.log(arr[i])
      }
      formData.append("points", points);
      formData.append("country", country);
      formData.append("isPopular", isPopular);
      formData.append("genre", genre);
      formData.append("text", text);
      formData.append("meaning", meaning);
      if(artists) {
        console.log('true');
        // const postLyric = null
        const postLyric = await axios.post(`${LYRIC_URL}`, formData,
          {headers:{ "Content-Type": "multipart/form-data"}, withCredentials: true, 
            onUploadProgress: (progressEvent) => {
              const {loaded, total} = progressEvent;
              let percentage = Math.floor((loaded*100)/total);
              //console.log(percentage)
              setProgress1(percentage);
              setIsUplaoding(true);
            }});
        window.scrollTo(0, 50);
        if(isUploading) {
          console.log("progress1: ", progress1);
          setShowUploadProgress(true);
        }
        
        if (postLyric) {
          setLyricId(postLyric.data.lyric._id);
          lyricId ? createPhotoCover : null
          console.log(postLyric);
          let empty_array = []
          let obj = {artist: "", show:true}
          setArtistField([obj]);
          setArtists([...empty_array]);
          setText("");
          setLyric([...empty_array]);
        }
      }  
    }      
    catch(err) {
      console.log(err);
      setErrMsg(err?.data?.message);
    }
  }


  const onChangeArtistName = (e, i) => {
    let data = [...artistField];
    data[i][e.target.name] = e.target.value;
    setArtistField(data);
  } 

  const AddMoreArtistField = (i) => {
    let newField = {artist: "", show: true};
    setArtistField([...artistField, newField])
    let data = [...artistField]
    for(let i=data.length-1; i>=0; i--) {
      data[i]['show'] = false;
    }
    data[i]['show'] = true;
    setArtistField(data);
  }

  useEffect(() => {
    setArtistField(artistField);
  }, [updateArtist])

  const deleteArtistField = (e,i) => {
    //console.log(e,i);
    if(i> 0 && artistField.length-1 === i ) {
      //console.log('yess');
      //console.log(i);
      artistField.splice(i,1);
      let data = [...artistField];
      data[i-1]['show'] = true;
      setArtistField(data);
    } 
    else if(i==0 && artistField.length == 1) {
      artistField.splice(i,1);
      let newField = {artist: "", show: true};
      setArtistField([...artistField, newField]);
    }else {
      //console.log(artistField.length, i);
      artistField.splice(i,1);
      //console.log(artistField);
      setArtistField(artistField);
    }
    setUpdateArtist(!updateArtist);
  }  

  const showLyricFunc = (e) => {
    e.preventDefault();
    setShowLyric(!showLyric);
  }

  const showFileFunc = () => {
    setShowLyric(false);
  }

  const typeOne = () => {
    setShowTypeOne(!typeOne);
    setShowTypeTwo(false);
  }

  const typeTwo = () => {
    setShowTypeTwo(!typeTwo);
    setShowTypeOne(false);
  }

  const ImportAudioFile = (e) => {
    const filename = e.target.files[0].name;
    const validExtensions = ['mp3', 'mp4', 'wav', 'aac', 'm4a']
    let splittedFilename = filename.split(".");
    let fileExtension = splittedFilename[splittedFilename.length-1]
    if(validExtensions.includes(fileExtension)) {
      setValidAudio(true);
      setAudioX(e.target.files[0]);
      setRunFunc(!runFunc);
    }else {
      setValidAudio(false);
      setAudioError('Audio file extension not of correct type!');
      setTimeout(() => {
        setAudioError(false);
      }, [5000])
    }
  }

  const handlePhotoUpload = (e) => {
    const filename = e.target.files[0].name;
    const validExtensions = ['jpg', 'png']
    let splittedFilename = filename.split(".");
    let fileExtension = splittedFilename[splittedFilename.length-1]
    if(validExtensions.includes(fileExtension)) {
      setValidPhoto(true);
      setPhotoX(e.target.files[0]);
      setRunFunc(!runFunc);
    }else {
      setValidAudio(false);
      setPhotoError('Image file extension not of correct type, \nonly png & jpg files are allowed!');
      setTimeout(() => {
        setPhotoError(false);
      }, [5000])
    }    
  }

  return (
    <>

    {!showUploadProgress ? <div>
    
    {!hasUpload && !validAudio ?
      <section className=" md:ml-[20%] md:w-[55vw]">
        <div className=" py-5 bg-slate-700 text-[30px] font-serif">
        {audioError ? <div>
              <p className="text-red-300 animate-bounce">{audioError}</p>
          </div>: null}
          <div className=" py-[40%] h-screen text-white font-semibold bg-slate-700 ">
            <div className=" block">
              <label htmlFor="audio" className=" cursor-pointer  " >
                <FaUpload className=" ml-[40%] w-10 h-10 text-teal-300"/>
                <p className=" text-center text-[25px]">Import An Audio File</p>            
                <p className=" text-center text-gray-200">(mp3, mp4, m4a, wav, aac, wvma)</p>
              </label>
              <input onChange={(e) => ImportAudioFile(e)}  id="audio" type="file" hidden/>
            </div>
          </div>

        <div className="mx-10 text-[40px]">
            <div className="w-12 h-12 bg-blue-300 ">
              <div className="text-red-300 ">{progress1}</div>
            </div>
        </div>
        </div>
          {audioDataURL ? 
            <audio controls className="" 
              src={audioDataURL} 
              alt="X"
            ></audio>
            : null
          }  
      </section>
      : 
    <section className=" md:ml-[21%] md:w-[55vw] bg-gradient-to-r from-purple-200 to-violet-300 md:bg-zinc-200
        px-1">
      <div className=" my-2 mt-1 bg-gradient-to-l from-fuchsia-400 ">
        <h1 className="text-2xl text-center ">Editor DashBoard</h1>
      </div>
          {audioDataURL ? 
            <audio controls className="" 
              src={audioDataURL} 
              alt="X"
            ></audio>
            : null
          }  
      {/** Get videos to post */}
      <div className=" p-2 mx-1 my-2 bg-gradient-to-r from-[rgba(0,120,120,0.1)] to-[rgba(0,100,150,0.3)] "
           >
            {Hi ? null : null}      
            {errMsg ? <div className="font-serif text-xl text-red-800 font-semibold"><h1>{errMsg}</h1></div> : null}
            {success ? <div className=" animate-bounce font-serif text-xl text-teal-800 font-semibold"><h1>{success}</h1></div> : null}
        <div className="">
          {fileDataURL ? 
            <img className=" border-2 rounded-md border-blue-200
              mt-1 w-[40vw] h-[35vh] md:w-[20vw] md:h-[40vh] " 
              src={fileDataURL} 
              alt="X"
            />
            : null
          }              
          <div className={ fileDataURL ? " absolute ml-[45vw] top-[30vh] md:ml-[25vw] " : "relative my-2 w-[25%] md:w-[22%]" }>
            {photoError ? <div className=" w-[90vw] md:w-[50vw] text-[17px] md:text-[20px] font-semibold font-mono">
                <p className="text-white animate-bounce">{photoError}</p>
            </div>: null}
            <p  className=" text-xl text-teal-800 ml-2 font-semibold mb-2 md:text-lg ">{ fileDataURL ? "Change Pic " : "Select Pic"}</p>
            <div className=" py-1 rounded-lg pr-3 hover:bg-indigo-200">
              <label className=" cursor-pointer" htmlFor='photo'>
                <FaUpload className=" ml-7 h-7 w-11"/>
                <p className=" font-serif font-semibold text-purple-900 text-lg mx-6 ">Upload</p>
              </label>
              <input type='file' id="photo" onChange={handlePhotoUpload} hidden/>
            </div> 
          </div> 
        </div>

        <div className="my-3 text-lg ">
          <label htmlFor='category'>Category</label>
          <select className="h-11 px-5 text-gray-700 font-semibold rounded-md shadow-sm border outline-none
            w-[80%] block" value={category} onChange={e=>setCategory(e.target.value)}
          > 
            {categories ? categories.map(category => {
              return (<option className=" rounded-lg font-sans m-3" key={category._id} value={category.name}>{category.name}</option>)
            }) : null}
          </select>
        </div>
        <div className="my-3 text-lg ">
          <label htmlFor='genre'>Genres</label>
          <select className="h-11 px-5 text-gray-700 font-semibold rounded-md shadow-sm border outline-none
            w-[80%] block" value={genre} onChange={e=>setGenre(e.target.value)}
          > 
            {genres ? genres.map((genre,i) => {
              return (<option className=" rounded-lg font-sans m-3" key={i} value={genre}>{genre}</option>)
            }) : null}
          </select>
        </div>
        <div className="my-2 md:my-3 ">
            <label htmlFor="title">Title</label>
            <input className=" rounded-md shadow-sm px-2 py-2
             md:py-3  w-[80%] block focus:outline 
             focus:outline-[0.16rem] outline-sky-300
             border-sky-300 " type="text" value={title} 
             onChange={e=> setTitle(e.target.value)}  
            />
        </div>
        <div className="text-lg">
            <label htmlFor="">Lyric</label>
            <div className="flex space-x-6">
              <button onClick={(e)=> showLyricFunc(e)} className="my-2 px-4 py-1 border shadow-md shadow-sky-300 bg-indigo-100 hover:bg-indigo-300 hover:translate-y-[1px] rounded-md hover:rounded-lg" >Custom</button>
            {/*<button onClick={() => showFileFunc()} className="my-2 px-4 py-1 border shadow-md shadow-sky-300 bg-indigo-100 hover:bg-indigo-300 hover:translate-y-[1px] rounded-md hover:rounded-lg" >Import files(vtt)</button>*/}
            </div>
                    
            {showLyric ? 
              <div className="">
              <textarea id="text" placeholder="Add timeline/text..." 
                className=" h-40 w-[80%] rounded-md py-2 md:py-3 shadow p-2
                focus:outline-[0.16rem] outline-sky-300 block " type="text" 
                value={lyricText} onChange={e=>setLyricText(e.target.value)}>
              </textarea>
              </div> : null
            }
        </div>
        <div className="text-lg">
            <label htmlFor="text">Text</label>
            <textarea id="text" placeholder="Add text..." 
              className=" h-40 w-[80%] rounded-md py-2 md:py-3 shadow p-2
            focus:outline-[0.16rem] outline-sky-300 block " type="text"
             value={text} onChange={e=>setText(e.target.value)}>
            </textarea>
        </div>
        <div>
          <label className=" font-serif text-xl text-teal-800 font-semibold " htmlFor="artist">Artist</label>  
          <div className=" grid grid-cols-2 md:grid-cols-3 ">
            {artistField.map((a,i) => {
            return (
              <div key={i} className=" flex  my-1 md:my-2">        
                  <input 
                    name="artist" 
                    autoComplete="off" 
                    placeholder="artist" 
                    className=" h-14 w-[98%] text-lg border rounded-md shadow block p-2 md:p-2 focus:outline-sky-300" type="text" 
                    value={a.artist} 
                    onChange={(e) => onChangeArtistName(e,i)}/>
                  <div onClick={ (e) => AddMoreArtistField(e,i)} className=" mt-8 hover:bg-teal-100">
                    {a.show ? <BsArrowDown className="  cursor-pointer text-blue-700
                  hover:text-teal-800 w-6 h-6 "/> : null}
                  </div>
                  <div>
                    <BsX onClick={(e) => deleteArtistField(e,i)} className=" hover:bg-slate-300 text-red-500 hover:text-red-700 w-7 h-7 cursor-pointer "/>
                  </div>
              </div>
            )
            })}
          </div>
        </div>
        <div className="my-2 my:py-3">
            <label>Points</label>
            <input className=" h-11 border rounded-md 
            shadow w-[80%] block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " type="text" value={points} min={1} max={100} onChange={e=>setPoints(e.target.value)}/>
        </div>
        <div className="my-2 md:my-3">
          <label>Country</label>
          <select className="h-11 px-5 rounded-md shadow-sm border outline-none bg-gray-200 w-[80%] block" value={country} onChange={e=>setCountry(e.target.value)}> 
            {countriesx ? countriesx.map((countr,i) => {
              return (
                <option className="border m-3" key={i} value={countr.countryCallingCodes[0]}> 
                    <p className=" mx-5">{countr.emoji}</p> <p className=" mr-6">{countr.countryCallingCodes[0]}</p>  <p className=" mr-6">{countr.name}</p>
                </option>
                )
              }) : null}
          </select>           
        </div>
        <div className="my-2 md:my-3">
            <label className="text-lg">Popular</label>
            <input className=" h-6 w-6 ml-7 md:p-3" type="checkbox" value={isPopular} onChange={e=>setIsPopular(e.target.checked)} />
        </div>
        <div className="text-lg">
            <label htmlFor=" description">Description</label>
            <textarea className=" h-32 border w-[80%] rounded-md py-2 
              md:py-3 shadow p-2 outline-sky-300 focus:outline-[0.16rem] block" type="text" value={description} onChange={e=>setDescription(e.target.value)}></textarea>
        </div>
        <div className="text-lg">
            <label htmlFor=" description">Meaning</label>
            <textarea className=" h-32 border w-[80%] rounded-md py-2 
              md:py-3 shadow p-2 outline-sky-300 focus:outline-[0.16rem] block" type="text" value={meaning} onChange={e=>setMeaning(e.target.value)}></textarea>
        </div>
        <div onClick={(e) => handlePostSubmit(e)} className="w-48 my-2 md:my-1 ">
          <button className=" p-2 w-40 text-lg animation delay-150 duration-300 
            border rounded-md shadow-sm bg-indigo-300 hover:bg-indigo-400 
            hover:translate-y-[2px]" 
            type="submit">Post
          </button>
        </div>
      </div>

    </section> }

    </div> : 

      <div className=" md:ml-[20%] m-[1px] relative w-[100%] h-[90vh] text-white bg-slate-800">
      <div className=" pt-[25%] md:pt-[10%] ml-[20%] md:mx-[26%] opacity-30  ">
          <div className=" "> 
            <img className="w-[50vw] h-[40vh] md:w-[25vw] md:h-[50vh] border rounded-full" src={fileDataURL} alt="No image"/>
          </div>
          
          <div className=" absolute top-[38%] md:top-[42%] left-[44%] md:left-[38%] z-50 text-[40px] ">
            <p className=" shadow-2xl shadow-indigo-500 ">{progress1}</p>
          </div>
      </div>
      <div className=" mt-12 text-[19px] text-white font-semibold font-mono ml-[30%]">
        {!isUploading ? <p>Uploading...</p> : 

        <div>
          <h1>Upload completed</h1>
          <Link to={`${LYRIC_READ_URL}?lyricId=${lyricId}`}
           className=" text-white hover:text-gray-400">View post</Link>
        </div>}
      </div>
    </div>   
    }
    </>
  )
}

export default EditorPostLyric