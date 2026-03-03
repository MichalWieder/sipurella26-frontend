import { Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
// import { ImgUploader } from '../cmps/ImgUploader'

export function LoginSignup() {
    return (
        <div className="login-page">
            <nav>
                <NavLink to="login">Login</NavLink>
                <NavLink to="signup">Signup</NavLink>
            </nav>
            <Outlet/>
        </div>
    )
}

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })

    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username) return
        await login(credentials)
        navigate('/')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    return (
       <form onSubmit={onLogin}>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign in</button>
      </form>
    )
}

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const type = ev.target.type

        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>


            <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="שם מלא"
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                value={credentials.email}
                placeholder="כתובת מייל"
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="כינוי"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="סיסמה"
                onChange={handleChange}
                required
            />
            
            <button>הרשמה</button>

            <p>כבר יש לך חשבון? 
                <NavLink to="/auth/login">אפשר ללחוץ כאן</NavLink>
            </p>
        </form>
    )
}