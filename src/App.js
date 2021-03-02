import React, { useEffect, useState } from "react";
import "./App.css";
import AsyncSelect from "react-select/async";
import ReactPlayer from "react-player";
import Axios from "axios";
import FacebookIcon from "./images/FacebookIcon.png";
import InstagramIcon from "./images/InstagramIcon.png";
import TwitterIcon from "./images/TwitterIcon.png";

function App() {
  const [company, setCompany] = useState({
    id: -1,
    URL: "",
    Name: "",
    Socials: "",
    Contact: ""
  })
  const [videos, setVideos] = useState([])
  const [videoCurrent, setVideoCurrent] = useState({
    Link: "",
    Name: ""
  })

  let url = window.location.href.slice((window.location.href.search("/") + 2), -1)

  if (url == 'localhost:3000') {
    url = 'energyti.me'
  }

  useEffect(() => {
    getCompany();
  }, [])

  function getCompany() {
    Axios
    .get(`http://localhost:5000/api/companies/${url}`)
    .then(res => {
        setCompany(res.data[0])
        getVideos(res.data[0])
    })
    .catch(err => {
    })
  }

  function getVideos(comp) {
    Axios
      .get(`http://localhost:5000/api/videos/${comp.id}`)
      .then(res => {
          setVideos(res.data)
          setVideoCurrent({Link: res.data[0].Link, Name: res.data[0].Name})
      })
      .catch(err => {

      })
  }

  function getOptions() {
    return (
      Axios
        .get(`http://localhost:5000/api/misc/options/${url}`)
        .then(res => res.data)
        .catch(err => err)
    )
  }

  async function handleChange(data) {
      let videoLink = await videos.find(video => video.Name == data.value).Link
      try {
        setVideoCurrent({Link: videoLink, Name: data.value})
      }
      catch {
        console.log("error")
      }
  }

  console.log(window.location.href.slice((window.location.href.search("/") + 2), -1))
  console.log(company.Socials.slice(company.Socials.search("Twitter.com")))
  console.log(company.Socials.slice(company.Socials.search("Facebook.com"), company.Socials.search(",")))

  return (
    <div>
      <div id="TopSection">
        <AsyncSelect
          name="Video select input"
          className="SelectInput"
          classNamePrefix="SelectInput"
          defaultOptions
          cacheOptions
          value={videoCurrent.Name}
          inputValue={videoCurrent.Name}
          loadOptions={getOptions}
          onChange={(data) => handleChange(data)}
          placeholder=""
        />
        <div id="CompanySocials">
          <a 
              href={`https://facebook.com/${company.Socials.slice(0, company.Socials.search("1"))}`}
              target="_blank"
            >
            <img id="FacebookIcon" src={FacebookIcon} alt="Facebook Icon"/>
          </a>
          <a 
            href={`https://instagram.com/${company.Socials.slice((company.Socials.search("1")+1), (company.Socials.search("2")))}`}
            target="_blank"
          >
            <img id="InstagramIcon" src={InstagramIcon} alt="Instagram Icon"/>
          </a>
          <a 
            href={`https://twitter.com/${company.Socials.slice((company.Socials.search("2")+1))}`}
            target="_blank"
          >
            <img id="TwitterIcon" src={TwitterIcon} alt="Twitter Icon"/>
          </a>
        </div>
     </div>
     <div id="MiddleSection">
      <div id="VideoContainer">
          <ReactPlayer
              key={videoCurrent.Name}
              url={videoCurrent.Link}
              controls={true}
              playsinline={true}
          />
        </div>
     </div>
     <div id="BottomSection">
        <h1 id="CompanyName">{company.Name}</h1>
        <h3 id="CompanyEmail">{company.Contact}</h3>
     </div>
    </div>
  );
}

export default App;