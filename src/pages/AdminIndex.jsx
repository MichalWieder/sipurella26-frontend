import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { loadSips } from '../store/actions/sip.actions'
import { useNavigate } from 'react-router'

export function AdminIndex() {
    const navigate = useNavigate()

	const loggedInUser = useSelector(storeState => storeState.userModule.user)
	const sips = useSelector(storeState => storeState.sipModule.sips)
	const isLoading = useSelector(storeState => storeState.userModule.isLoading)

	useEffect(() => {
        if(!loggedInUser.role === 'user') navigate('/')
        loadSips()
	}, [])

	return <section className="admin-index">

        {/* <div>{JSON.stringify(sips, null, 2)}</div> */}
        {sips && (
            <ul>
                {sips.map(sip => (
                    <li key={sip._id}>
                        <p>{sip.createdAt}</p>
                        <p>{sip.giverName}</p>
                        <p>{sip.email}</p>
                        <p>{sip.receiverName}</p>
                        <p>{sip.charactersCount}</p>
                        <p>{sip.event}</p>
                        <NavLink to={`/complete/${sip._id}`}>לסיפור המלא</NavLink>
                    </li>
                ))}
            </ul>
        )}
    </section>
}
