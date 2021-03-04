import React, { useEffect, useState } from "react";
import "./App.css";
import AsyncSelect from "react-select/async";
import ReactPlayer from "react-player";
import Axios from "axios";

export default function App() {

  const [company, setCompany] = useState({
    id: -1,
    URL: "",
    Contact: ""
  })

  const [videos, setVideos] = useState([])
  
  const [videoCurrent, setVideoCurrent] = useState({
    Link: "",
    Name: ""
  })

  let url = window.location.href.slice(
    (window.location.href.search("/") + 2), -1
  )

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
          setVideoCurrent({
            Link: res.data[0].Link, 
            Name: res.data[0].Name
          })
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
      let videoLink = await videos.find(
        video => video.Name == data.value
      ).Link
      try {
        setVideoCurrent({
          Link: videoLink, 
          Name: data.value
        })
      }
      catch {
      }
  }

  return (
    <div id="AppContainer">
      <div id="SelectInputContainer">
        <AsyncSelect
          className="SelectInput"
          classNamePrefix="SelectInput"
          defaultOptions
          value={videoCurrent.Name}
          inputValue={videoCurrent.Name}
          loadOptions={getOptions}
          onChange={(data) => handleChange(data)}
          placeholder=""
        />
      </div>
      <div id="VideoContainer">
        <ReactPlayer
            key={videoCurrent.Name}
            url={videoCurrent.Link}
            controls={true}
            playsinline={true}
        />
      </div>
      <div id="ContactContainer">
        <h3 id="CompanyEmail">{company.Contact}</h3>
      </div>
    </div>
  );
}