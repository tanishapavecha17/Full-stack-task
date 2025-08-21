
import './App.css'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import Home from './pages/Home.jsx'
import Spassword from './pages/auth/Spassword.jsx'
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './context/privateRoute.jsx'
import NotFound from './pages/Notfound.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import MyProfile from './pages/MyProfile.jsx'
import MyDrafts from './pages/MyDrafts.jsx'
function App() {
  

  return (
 
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path="/home"
          element={
            <PrivateRoute roles={["Admin","User"]}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <PrivateRoute roles={["Admin","User"]}>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-drafts"
          element={
            <PrivateRoute roles={["Admin","User"]}>
              <MyDrafts />
            </PrivateRoute>
          }
        />
        <Route path='/setpassword' element={<Spassword />} />
        <Route path="*" element={<NotFound />} />
        
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    
  )
}

export default App
