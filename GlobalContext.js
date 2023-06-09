import React, { useState, useEffect, createContext } from "react";
import Appnotif from "./notificationHandler";

// Create a context for sharing data across components
const Context = createContext();

// Provider component that wraps the application and provides the context
const Provider = ({ children }) => {
  // State variables
  const [isLoggedin, setIsLoggedIn] = useState(false); // Indicates if the user is logged in
  const [Token, setToken] = useState(false); // User token (not used in this code)
  const [userObject, setUserObject] = useState(false); // User object (not used in this code)
  const [profileObject, setProfileObject] = useState(false); // User profile object
  const [serverUrl, setServerUrl] = useState('https://fb62-7992-137779-63-146.ngrok-free.app/'); // Server URL

  // Function to fetch user profile data
  function getProfiledata() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    // Construct the profile URL using the server URL
    const url = serverUrl + 'profile';

    // Fetch profile data from the server
    fetch(url, requestOptions)
      .then(response => response.json())
      .then((data) => {
        setProfileObject(data[0]); // Set the user profile object
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // useEffect hook to run the code when isLoggedin changes
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    // Construct the authentication URL using the server URL
    const url = serverUrl + `is_authenticated`;

    // Fetch authentication data from the server
    fetch(url, requestOptions)
      .then(response => response.json())
      .then((data) => {
        if (data === 'False') {
          setIsLoggedIn(false); // Set isLoggedin to false if authentication fails
        } else if (data === 'True') {
          setIsLoggedIn(true); // Set isLoggedin to true if authentication succeeds
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Fetch profile data if the user is logged in
    if (isLoggedin === true) {
      getProfiledata();
    }

  }, [isLoggedin]); // Run the effect only when isLoggedin changes

    // Create an object with all the context values
    const globalContext = {
      isLoggedin,
      setIsLoggedIn,
      Token,
      setToken,
      userObject,
      setUserObject,
      profileObject,
      setProfileObject,
      serverUrl,
      setServerUrl
    };
    return <Context.Provider value={globalContext}>{children}</Context.Provider>

};


export {Context, Provider};
