import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const UserInfoKey = 'UserInfo'
const timeKey = 'hrsaas-timestamp-key'

export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setUseInfoToCookie(usrIfo) {
  return Cookies.set(UserInfoKey, usrIfo, { expires: 7 })
}
export function removeUserInfoFromCookie() {
  return Cookies.remove(UserInfoKey)
}
export function getUserInfoFromCookie() {
  try {
    const user = JSON.parse(Cookies.get(UserInfoKey))
    return user
  } catch (error) {
    return error
  }
}
