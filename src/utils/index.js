export function storeToLocalStorage(key, payload) {
  localStorage.setItem(key, JSON.stringify({ payload: payload }))
}

export function retrieveFromLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)).payload
  } catch (error) {
    return null
  }
}

export function IsJsonString(str) {
  try {
    if (!str || !str.length) return false
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function deepClone(objOrArr) {
  return JSON.parse(JSON.stringify(objOrArr))
}