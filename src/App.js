import React, {useState} from "react";
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import axios from "axios";
import './App.css'
//I created my own Counties.jsx file where I filled in the countries for the select component with their respective first and last zip code.
import { Countries } from './Countries.jsx'
require('dotenv').config()


/*THE API KEY FOR THE GOOGLE MAPS SHOULD BE TYPED AT THE END OF THE FILE, THE API KEY IS GIVEN TO YOU IN THE DEMANDO MESSAGE*/

function App(props) {
        /* Here is where I save all my states*/ 
    const [data,
        setData] = useState(null);
    const [error,
        setError] = useState(null);
    const [zipSearch,
        setZipSearch] = useState(null);
  const [country, setCountry] = useState("SE");
  
    //This code sends the request to get the zipcodes from Zippopotam
    const getLocation = (e) => {
        e.preventDefault();
        axios(`https://api.zippopotam.us/${country}/${zipSearch}`).then((response) => {
            //This saves the answer from the API to the setData state and the setError() clears the error message when you search for a new succsesfull search after a failed one.
            setData(response.data);
            setError(null)
        }).catch((error) => {
            console.error("Error fetching data: ", error);
            //This sets the error message after a failed api search.
          setError(error);
        })
    };
    /*This is the function for the "Delete" button
    It clears the search, the data and the error message*/
    const clearData = () => {
        setZipSearch("")
        setData(null)
        setError(null)
    };

    //This code takes the selected country and extracts the first and last zip and the name.
    const {firstZip="", lastZip="", name="" } = Countries.places.find(c => c.value === country) || {};

    return (
        <div className="mainDiv">
            <h1 className="title">Search for a zip code!</h1>
            <h2 className="subtitle">
                Fill in a zip code below and see where it takes you!
            </h2>
            {/* This code is for the zip input and the "getLocation" sends the zip to the api */}
            <form onSubmit={getLocation}>
                <div className="inputDiv">
                    <div>
                        <input
                            type="text"
                            className="zipInput"
                            value={zipSearch}
                            placeholder="Zip code"
                            onChange={(e) => setZipSearch(e.target.value)}/>
                    </div>
                        {/*This is the select component with an onChange where it sends the selected country to the API, the clearData function is there so when
                        you change country it resets the search and clears everything.*/}
                    <select className="countriesSelect" value={country} onChange={(e) => setCountry(e.target.value) + clearData()}>
                        {/*This code sorts through the array of countries and presents them alphabetically and also maps through the jsx file and fills the options of the 
                        select automatically*/}
                        {Countries.places.sort((a, b) => a.name > b.name ? 1: -1).map((countryName) => <option value={countryName.value}>{countryName.name}</option>)}
                    </select>
                </div>
            </form>
            <p>
                In {name} the first zipcode is {firstZip +" and the last is " + lastZip }
            </p>
            {/*This code is when there is an error, it displays this message.*/}
            <br/> {error && (
                <div className="errorMessageDiv">
                    The zipcode "{zipSearch}" is not available in this country, try again!
                </div>
            )}
            {/*Here is where the longitude and latitude is displayed, and it only shows them when there is data response from the API*/}
            {data !== null && data
                .places
                .map((place, i) => (
                    <article key={i} className="article">
                        <div className="buttonDiv">
                            {/*This button clears everything*/}
                            <button className="deleteBtn" onClick={clearData}>Delete</button>
                        </div>
                        <div className="placeInfo">
                            <p className="placeText">
                                |
                                <strong> City: </strong>
                                {place["place name"]}&nbsp; 
                                 |
                            </p>
                            <p className="placeText">
                                <strong> Latitude: </strong>
                                {place.latitude}&nbsp; 
                                |
                            </p>
                            <p className="placeText">
                                <strong> Longitude: </strong>
                                {place.longitude}&nbsp; 
                                 |
                            </p>
                            {/*This is the Google Maps component and it displays it only when you search the Marker is placed where the user searched.
                            The place.longitude and place.latitude is a response from the API that we can take and put it in the Maps component*/}
                            <Map
                                google={props.google}
                                zoom={15}
                                initialCenter={{
                                lat: place.latitude,
                                lng: place.longitude
                            }}>
                                <Marker
                                    position={{
                                    lat: place.latitude,
                                    lng: place.longitude
                                }}/>

                            </Map>
                        </div>
                    </article>
                ))}
        </div>
    );
}

export default GoogleApiWrapper({apiKey: "API KEY IS IN THE DEMANDO MESSAGE"})(App);