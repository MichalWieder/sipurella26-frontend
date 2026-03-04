import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { ADD_REQUEST } from '../store/reducers/user.reducer'

export function ContactUs() {
const userRequests = useSelector(storeState => storeState.userModule.userRequests)
const loggedInUser = useSelector(storeState => storeState.userModule.user)
const [userLocalRequest, setUserLocalRequest] = useState(getEmptyUserRequest())

const dispatch = useDispatch()

function getEmptyUserRequest(){
    return {
        fullname: '', 
        email: '', 
        phone: '', 
        request: '', 
        createdAt: Date.now(), 
        userId: loggedInUser ? loggedInUser._id : '', 
        status:'sent'
    }
}

function handleChange(ev) {
    const type = ev.target.type

    const field = ev.target.id
    const value = ev.target.value

    setUserLocalRequest(prev => ({ ...prev, [field]: value }))
}

function onSubmit(ev) {
    ev.preventDefault()

    dispatch({ type: ADD_REQUEST, userRequests: userLocalRequest })

    setUserLocalRequest({ fullname: '', email: '', phone: '', request: '' })
}

    return (
        <section className='contact-us'>
            <h2>יצירת קשר</h2>
           
            <p>מייל</p>
            <p>אינסטגרם</p>
            <p>וואטסאפ</p>

            <h2>שנחזור אלייך?</h2>

            <form onSubmit={onSubmit}>
                <label></label>
                <label htmlFor="fullname">שם מלא</label>
                <input
                    type="text"
                    id="fullname"
                    value={userLocalRequest.fullname}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="email">כתובת מייל</label>
                <input
                    type="email"
                    id="email"
                    value={userLocalRequest.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="phone">מספר טלפון</label>
                <input
                    type="number"
                    id="phone"
                    value={userLocalRequest.phone}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="request">סיבת הפניה</label>
                <textarea
                    id="request"
                    onChange={handleChange}
                    value={userLocalRequest.request}
                    rows="6"
                    placeholder="כאן מספרים"
                />

                <button>שליחה</button>
            </form>

        </section>

)
}