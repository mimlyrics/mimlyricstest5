import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import queryString from "query-string";
import TimeAgo from "timeago-react";
import axios from "../api/axios";
import { IoIosArrowDropup, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
const LYRIC_URL = "/api/v1/lyric";
const DELETE_LYRIC_URL = "/api/v1/lyric";
const SEARCH_LYRIC_URL = "/api/v1/lyric/search";
const APP_DATA_URL = "/api/v1/appData";
const EditorLyric = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory]  = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artists, setArtists] = useState("");
  const [country, setCountry] = useState("");
  const [points, setPoints] = useState("");
  const [famous, setFamous] = useState(false);
  const [file, setFile] = useState();
  const [showVideo, setShowVideo] = useState(false);
  const {userInfo} = useSelector(state => state.auth);
  const [searchId, setSearchId] = useState("");
  const [lyric, setLyric] = useState("");
  const [lyrics, setLyrics] = useState([]);
  const [searchLyrics, setSearchLyrics] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [Hi, setHi] = useState("");
  const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        var {categoryx} = queryString.parse(location.search);
        setCategory(categoryx);       
    }, [category]);

    console.log(category);

    useEffect(() => {
        const getLyrics = async () => {
            try {
                const res = await axios.get(`${LYRIC_URL}/${category}`, {headers: {withCredentials: true}});
                setLyrics(res.data.lyrics);
                console.log(res.data);
            }catch(err) {
                console.log(err?.data?.message);
            }
        }
        getLyrics();
    }, [category])

    console.log(lyrics);

  const searchLyric = async (e, searchId) => {
      e.preventDefault();
      try {
        const res = await axios.get(`${SEARCH_LYRIC_URL}/${searchId}`, {headers: {withCredentials: true}});
        console.log(res.data);
        setSearchLyrics(res.data.searchlyrics);
      }catch(err) {
        setErrMsg(err?.data?.message);
        console.log(err?.data);
      }
  }

  const deleteLyric = async (lyricId) => {
    try {
      await axios.delete(`${DELETE_LYRIC_URL}/${lyricId}`, {headers: {withCredentials: true}});
      setLyrics(lyrics.filter(lyric => lyric._id !== lyricId));
    }catch(err) {
      setErrMsg(err?.data?.message);
      console.log(err?.data);
    }
  }

  const [lyricsMore, setLyricsMore] = useState([])

  /*const handleShowMore = (i) => {
    if(showMore) {
      let indices = [...lyricsMore];
      indices.push(i)
      setLyricsMore([...indices]);
    }else {
      let indexes = [...lyricsMore];
      indexes.push(i);
      setLyricsMore([...indexes])
    }
  }*/

  return (
    <>
    { searchLyrics ?

    <section className=" mt-1 md:absolute md:top-16 md:w-[50%] mx-1 md:ml-48 lg:ml-64">
        <h1 className="text-center font-bold py-3 text-blue-600 bg-indigo-200">Lyrics found</h1>
        <button className=" mt-1 p-2 bg-indigo-200 rounded-md" 
          onClick={()=>setSearchLyrics(null)}>
          Show All Data
        </button>
        <ul className=" ">
            {searchLyrics.map(lyric => {
                return (
                    <div key={lyric._id} className="border-b-2 text-[17px] font-medium py-3">
                      {console.log(lyric.artists)}
                    <div>
                      {lyric.artists ? lyric.artists.map((lyric,i) => {
                        return(
                          <div key={i}>
                            <p className="flex text-gray-800">Artists: <p className="ml-2 text-blue-900">{lyric.artists}</p></p> 
                          </div> 
                        )
                      })
                        : null}
                    </div>
                        <p className="flex text-gray-800">Title: <p className="ml-2 text-blue-900">{lyric.title}</p></p>
                        <p className="flex text-gray-800">Created At: <TimeAgo className="ml-2 text-blue-900" datetime={lyric.createdAt}/></p>
                        <p className="flex text-gray-800">Updated At: <TimeAgo className="ml-2 text-blue-900" datetime={lyric.updatedAt}/></p>
                        <p className="flex text-gray-800">Country: <p className="ml-2 text-blue-900">{lyric.country}</p></p>
                        <p className="flex text-gray-800">Famous: <p className="ml-2 text-blue-900">{lyric.famous}</p></p>
                        <p className="flex text-gray-800">Points: <p className="ml-2 text-blue-900">{lyric.points}</p></p>                        
                        <p className="flex text-gray-800">Likes: <p className="ml-2 text-blue-900"></p></p>
                        <p className="flex text-gray-800">Size: <p className="ml-2 text-blue-900">{lyric.size}</p></p>
                        <p className="flex text-gray-800">Translated version: <p className="ml-2 text-blue-900">{lyric.translatedVersion}</p></p>                        
                        <p className="flex text-gray-800">Downloads: <p className="ml-2 text-blue-900">{lyric.downloads}</p></p>    
                        <p className="flex text-gray-800">Shares: <p className="ml-2 text-blue-900">{lyric.shares}</p></p>
                        <p className="flex text-gray-800">Comments: <p className="ml-2 text-blue-900">{lyric.comments}</p></p>    
                        <p className="flex text-gray-800">Category: <p className="ml-2 text-blue-900">{lyric.category}</p></p>
                        <p className="flex text-gray-800">Description: <p className="ml-2 f text-blue-900">{lyric.description.substring(0,100)}</p></p>
                        <div className="mt-3">
                            <button><Link onClick={e=> !lyric._id ? e.preventDefault(): null}  to= {`/editor/lyric/edit?lyricId=${lyric._id}`}  className=" p-3 border shadow rounded-lg bg-green-300" >Edit</Link> </button>
                            <button onClick={()=>deleteLyric(lyric._id)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Delete</button>
                        </div>                        
                    </div>
                ) 
            })}          
        </ul>  
    </section>
    :
    <section className=" md:absolute md:top-16 md:w-[50%] mx-1 md:ml-52 lg:ml-64">
        <div className="my-1 md:w-[100%]">
            <h1 className=" text-lg md:text-xl text-center bg-blue-200 font-semibold">Editor lyric's Management DashBoard</h1>
        </div>

        <div className="md:w-[100%]">
            <input 
              onKeyDown={(e)=>(e.key === "Enter" ? searchLyric(e,searchId) : null)} 
              placeholder="search..." className=" w-96 text-lg p-2 h-11 bg-indigo-200 text-gray-700" 
              type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button 
             onClick={(e) => searchLyric(e, searchId)} 
             className="h-11 py-2 px-3 md:px-10 ml-1 text-lg bg-blue-300 rounded-md text-gray-700 hover:bg-blue-500 hover:translate-y-[1px] ">
              Search
            </button>
        </div>

        <div className="my-3">
            <Link  to= "/editor/lyric/add"  className=" w-11 h-4 p-2 border shadow rounded-lg bg-blue-100 hover:bg-blue-300 hover:translate-y-1" >Add Lyrics</Link>
        </div>

        <div className="font-bold text-lg ">
            <h1>Lyric Info</h1>
        </div>

        <ul className="  ">
            {lyrics ? lyrics.map(lyric => {
                return (
                    <div key={lyric._id} className="border-b-2 text-[17px] font-medium py-3">
                    <div className="flex">
                      {lyric.artists.length > 0 ? <p>Arists: </p>: null}
                      {lyric.artists ? lyric.artists.map((lyricx,i) => {
                        return(
                          <div key={i} className=" flex space-x-4 ">
                            <p className="ml-2 text-blue-900">{lyricx}</p>
                          </div> 
                        )
                      })
                        : null}
                    </div>
                        <p className="flex text-gray-800">Title: <p className="ml-2 text-blue-900">{lyric.title}</p></p>
                        <p className="flex text-gray-800">Country: <p className="ml-2 text-blue-900">{lyric.country}</p></p>
                        <p className="flex text-gray-800">Genre: <p className="ml-2 text-blue-900">{lyric.genre}</p></p>
                        <p className="flex text-gray-800">Category: <p className="ml-2 text-blue-900">{lyric.category}</p></p>
                        <p className="flex text-gray-800">Description: <p className="ml-2 f text-blue-900">{lyric.description.substring(0,70)}</p></p>
                        <p className="flex text-gray-800">Created At: <TimeAgo className="ml-2 text-blue-900" datetime={lyric.createdAt}/></p>
                        {!showMore ? 
                          <div onClick={()=>setShowMore(!showMore)} className=" cursor-pointer items-center justify-center text-[18px] flex bg-stone-300 hover:bg-slate-300 text-white">
                            <p>More: </p>
                            <IoMdArrowDropdown className=" ml-[5px] w-8 h-8 text-slate-100 hover:text-sltate-300"/>
                          </div> :
                          <div>
                            <div className=" mt-1 grid grid-cols-2 ">
                            {console.log(lyric.isPopular)}
                            <p className="flex text-gray-800">Famous: <p className="ml-2 text-blue-900">{lyric.isPopular.toString()}</p></p>
                            <p className="flex text-gray-800">Points: <p className="ml-2 text-blue-900">{lyric.points}</p></p>                        
                            <p className="flex text-gray-800">Likes: <p className="ml-2 text-blue-900">{lyric.likes.length}</p></p>
                            <p className="flex text-gray-800">Translated version: <p className="ml-2 text-blue-900">{lyric.tLinks.length}</p></p>                        
                            <p className="flex text-gray-800">Downloads: <p className="ml-2 text-blue-900">{lyric.downloads}</p></p>    
                            <p className="flex text-gray-800">Shares: <p className="ml-2 text-blue-900">{lyric.shares}</p></p>
                            <p className="flex text-gray-800">Comments: <p className="ml-2 text-blue-900">{lyric.comments}</p></p>  
                            <p className="flex text-gray-800">Updated At: <TimeAgo className="ml-2 text-blue-900" datetime={lyric.updatedAt}/></p>  
                            </div>
   
                          <div className="mt-3">
                            <button><Link onClick={e=> !lyric._id ? e.preventDefault(): null}  to= {`/editor/lyric/edit?lyricId=${lyric._id}`}  
                              className=" p-3 border shadow rounded-lg bg-green-200 hover:bg-green-400" >Edit</Link> </button>
                            <button onClick={()=>deleteLyric(lyric._id)} 
                              className=" ml-4 p-2 border shadow rounded-lg bg-red-200 hover:bg-red-400">Delete</button>
                          </div>

                          <div onClick={() => setShowMore(!showMore)} className=" mt-1 cursor-pointer items-center justify-center text-[18px] flex bg-stone-300 hover:bg-slate-300 text-white">
                              <p>--- </p>
                              <IoIosArrowDropup className=" ml-[5px] w-7 h-7 text-slate-100 hover:text-sltate-300"/>
                           </div> 
                        </div>
                        }
                        
                    </div>
                )
            }) : null}          
        </ul>
    </section> }
    </>
  )
  }
export default EditorLyric;