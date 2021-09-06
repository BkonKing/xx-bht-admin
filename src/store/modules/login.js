
const login = {
  state: {
    accountInfo: JSON.parse(localStorage.getItem('accountInfo')) || {},
    isAutoLogin: localStorage.getItem('autoLogin') === 'true' || false,
    isLogout: localStorage.getItem('toLogout') === 'true' || false
  },

  mutations: {
    setAccountInfo (state, value) {
      state.accountInfo = value
    },
    setAutoLogin (state, value) {
      console.log(value)
      state.isAutoLogin = value
    },
    setLogout (state, value) {
      state.isLogout = value
      localStorage.setItem('toLogout', value)
    }
  },

  actions: {

  }
}

export default login
