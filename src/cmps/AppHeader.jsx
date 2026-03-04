import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	return (
		<header className="app-header full">
			<nav>
				<NavLink to="/" className="logo">
					<img src='../../public/logo_square.jpg'></img>
				</NavLink>
				<NavLink to="about">עלינו</NavLink>
				<NavLink to="sip">דוגמאות</NavLink>
				<NavLink to="contact">יצירת קשר</NavLink>
				{user && <NavLink to="build">לבנות סיפורלה</NavLink>}

                {user?.role === 'admin' && <NavLink to="/admin">ניהול סיפורלות</NavLink>}

				{!user && <NavLink to="auth/signup" className="login-link">כניסה</NavLink>}
				{user && (
					<div className="user-info">
						<Link to={`user/${user._id}`}>
							{user.fullname}
						</Link>
						<button onClick={onLogout}>logout</button>
					</div>
				)}
			</nav>
		</header>
	)
}
