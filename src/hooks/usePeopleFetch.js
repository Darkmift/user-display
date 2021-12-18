import { useState, useEffect } from "react";
import axios from "axios";
import { storeToLocalStorage, retrieveFromLocalStorage, deepClone } from "../utils"

export const usePeopleFetch = () => {
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([])

  const FAVORITE_LS_KEY = 'favorite-users'
  const COUNTRIES_LS_KEY = 'countries'

  useEffect(() => {
    const countryList = retrieveFromLocalStorage(COUNTRIES_LS_KEY)
    if (!countryList?.length) return
    setCountries(countryList)
    const favoritesList = retrieveFromLocalStorage(COUNTRIES_LS_KEY)
    if (!favoritesList?.length) return
    setFavorites(FAVORITE_LS_KEY)
  }, []);

  useEffect(() => {
    fetchUsers();
    console.log("🚀 ~ file: usePeopleFetch.js ~ line 25 ~ useEffect ~ fetchUsers", fetchUsers)
    storeToLocalStorage(COUNTRIES_LS_KEY, countries)
  }, [countries]);

  useEffect(() => {
    const favoritesList = deepClone(users).filter(user => user.isFavorite)
    storeToLocalStorage(FAVORITE_LS_KEY, favoritesList)
    setFavorites(favoritesList)
  }, [users]);

  async function fetchUsers() {
    try {
      console.log("🚀 ~ file: usePeopleFetch.js ~ line 38 ~ fetchUsers ~ countries", countries)
      const apiUrl = `https://randomuser.me/api/?nat=${countries?.join(',')}&results=25&page=1`;
      setIsLoading(true);
      const response = await axios.get(apiUrl);
      setIsLoading(false);
      setUsers(deepClone(favorites).concat(response.data.results));
    } catch (error) {
      console.error("🚀 ~ file: usePeopleFetch.js ~ line 22 ~ fetchUsers ~ error", error)
    }
  }

  const toggleCountry = (country) => {
    const newCountryList = Array.from(new Set(deepClone(countries).concat(country)))
    console.log("🚀 ~ file: usePeopleFetch.js ~ line 50 ~ toggleCountry ~ newCountryList", { country, newCountryList })
    setCountries(newCountryList)
  }

  const toggleFavorite = (userEmail) => {
    const userList = deepClone(users)
    const user = userList.find(user => user.email === userEmail)
    if (!user) return console.warn('user with email not found->email: ', userEmail)
    user.isFavorite = !user.isFavorite;
    setUsers(userList)
  }

  return { users, isLoading, fetchUsers, countries, toggleCountry, toggleFavorite };
};
