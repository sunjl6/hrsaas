const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.name,
  id: state => state.user.userInfo.id,
  userInfo: state => state.user.userInfo,
  photo: state => state.user.userInfo.photo
}
export default getters
