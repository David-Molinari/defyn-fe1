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

  const [rsValue, setRsValue] = useState("")

  const [rsInputValue, setRsInputValue] = useState("")

  const [searchingOptions, setSearchingOptions] = useState(false)

  let url = window.location.href.slice(
    (window.location.href.search("/") + 2), 
    -1
  )

  if (url == 'localhost:3000') {
    url = 'energyti.me'
  }

  useEffect(() => {
    getCompany();
  }, [])

  function getCompany() {
    Axios
    .get(`https://defyn-be.herokuapp.com/api/companies/${url}`)
    .then(res => {
        setCompany(res.data[0])
        getVideos(res.data[0])
    })
    .catch(err => {console.log(err)})
  }

  function getVideos(comp) {
    Axios
      .get(`https://defyn-be.herokuapp.com/api/videos/${comp.id}`)
      .then(res => {
          setVideos(res.data)
          setVideoCurrent({
            Link: res.data[0].Link, 
            Name: res.data[0].Name
          })
          setRsValue(res.data[0].Name)
          setRsInputValue(res.data[0].Name)
      })
      .catch(err => {console.log(err)})
  }

  function getOptions() {
    return (
      Axios
        .get(`https://defyn-be.herokuapp.com/api/misc/options/${url}`)
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
        setRsValue(data.value)
        setRsInputValue(data.value)
        setSearchingOptions(false)
      }
      catch {console.log('error')}
  }

  function handleInputChange(data) {
    setSearchingOptions(true)
    setRsInputValue(data)
  }

  function optionFilter(data) {
    let lcLabel = data.label.toLowerCase()
    let lcRsIv = rsInputValue.toLowerCase()
    if ((searchingOptions == false ||
      lcLabel.search(lcRsIv) != -1) 
      && rsInputValue.length != 0) {
      return true
    } else {
      return false
    }
  }

  return (
    <div id="AppContainer">
      <div id="SelectInputContainer">
        <AsyncSelect
          className="SelectInput"
          classNamePrefix="SelectInput"
          cacheOptions
          defaultOptions
          value={rsValue}
          inputValue={rsInputValue}
          loadOptions={getOptions}
          onChange={(data)=> handleChange(data)}
          onInputChange={(data)=> handleInputChange(data)}
          placeholder=""
          onMenuClose={()=> setRsInputValue(rsValue)}
          onMenuOpen={()=> setSearchingOptions(false)}
          filterOption={(data)=> optionFilter(data)}
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