import { privateReq, publicReq } from '../../utils/axiosMethod'


// Register user
const register = async (userData) => {
  const response = await publicReq.post('/auth/register', userData)
          return response.data 
}

// Login user
const login = async (userData) => {
  const response = await publicReq.post('/auth/login', userData)
  console.log(response.data)
    return response.data
}


// Checkout user
const checkUser = async () => {
  const response = await privateReq.get('/auth/current')
  console.log(response.data)
    return response.data

}

// Logout user
const logout = async () => {
  const response = await privateReq.post('/auth/logout')
  return response.data
}

const authService = {
  register,
  logout,
  login,
  checkUser,
}

export default authService