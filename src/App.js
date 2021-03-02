import React, { useEffect, useState } from "react";
import "./App.css";
import AsyncSelect from "react-select/async";
import ReactPlayer from "react-player";
import Axios from "axios";
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

  useEffect(() => {
    getCompany();
  }, [])

  function getCompany() {
    Axios
    .get(`http://localhost:5000/api/companies/saveti.me`)
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
        .get(`http://localhost:5000/api/misc/options/saveti.me`)
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

  console.log(company.Socials.slice(company.Socials.search("Instagram.com"), company.Socials.search(",")))
  console.log(company.Socials.slice(company.Socials.search("Twitter.com")))
  console.log(`https://
    ${company.Socials.slice(
      company.Socials.search("Instagram.com"), 
      company.Socials.search(",")
  )}`)

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
            href={`https://${company.Socials.slice(company.Socials.search("Instagram.com"), company.Socials.search(","))}`}
            target="_blank"
          >
            <img id="InstagramIcon" src={InstagramIcon} alt="Instagram Icon"/>
          </a>
          <a 
            href={`https://${company.Socials.slice(company.Socials.search("Twitter.com"))}`}
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