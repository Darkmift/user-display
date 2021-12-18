import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { storeToLocalStorage, retrieveFromLocalStorage, deepClone } from "../utils"

export const usePeopleFetch = () => {
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [preventFetch, setPreventFetch] = useState(false)

  const FAVORITE_LS_KEY = 'favorite-users'
  const COUNTRIES_LS_KEY = 'countries'

  useEffect(() => {
    const path = window.location.hash.replace('#', '')
    console.log("🚀 ~ file: usePeopleFetch.js ~ line 19 ~ useEffect ~ path", path)
    setPreventFetch(path != '/')
  }, [window.location.hash])

  // fetch from LS
  useEffect(() => {
    const countryList = retrieveFromLocalStorage(COUNTRIES_LS_KEY)
    setCountries(countryList?.length ? countryList : [])
    const favoritesList = retrieveFromLocalStorage(FAVORITE_LS_KEY)
    setFavorites(favoritesList?.length ? favoritesList : [])
  }, []);

  // call new fetch on coutries change
  useEffect(() => {
    fetchUsers();
    storeToLocalStorage(COUNTRIES_LS_KEY, countries)
  }, [countries]);

  // update LS favorites on change
  useEffect(() => {
    storeToLocalStorage(FAVORITE_LS_KEY, favorites)
  }, [favorites]);


  useEffect(() => {

    if (!countries.length) {
      setFilteredList(deepClone(favorites).concat(deepClone(users)))
      return
    }

    const favoriteList = deepClone(favorites).filter(user => countries.includes(user.nat));
    const userList = deepClone(users);
    setFilteredList(favoriteList.concat(userList))

  }, [favorites, users, countries]);

  async function fetchUsers() {
    if (preventFetch) {
      console.log('no need on favorite page')
      return
    }
    try {
      const apiUrl = `https://randomuser.me/api/?nat=${countries?.join(',')}&results=25&page=1`;
      setIsLoading(true);
      const response = await axios.get(apiUrl);
      setIsLoading(false);

      let users = response.data.results
      setUsers(users);

    } catch (error) {
      console.error("🚀 ~ file: usePeopleFetch.js ~ line 22 ~ fetchUsers ~ error", error)
    }
  }

  const toggleCountry = (country) => {

    let countryList = deepClone(countries)
    if (countryList.includes(country)) {
      countryList = countryList.filter(c => c != country)
    } else {
      countryList.push(country)
    }
    setCountries(countryList)
  }

  const toggleFavorite = (userEmail) => {
    let userList = deepClone(users)
    let newFavoriteList = deepClone(favorites)
    let user = userList.find(user => user.email === userEmail) || newFavoriteList.find(u => u.email === userEmail)
    user.isFavorite = !user.isFavorite;

    if (!user.isFavorite) {
      newFavoriteList = newFavoriteList.filter(u => u.email != user.email)
      userList.unshift(user)

    } else {
      userList = userList.filter(u => u.email != user.email)
      newFavoriteList.unshift(user)
    }

    setUsers(userList)
    setFavorites(newFavoriteList)

  }



  return { users, filteredList, favorites, isLoading, fetchUsers, countries, toggleCountry, toggleFavorite };
};
