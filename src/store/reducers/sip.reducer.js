export const SET_SIPS = 'SET_SIPS'
export const SET_SIP = 'SET_SIP'
export const REMOVE_SIP = 'REMOVE_SIP'
export const ADD_SIP = 'ADD_SIP'
export const UPDATE_SIP = 'UPDATE_SIP'

const initialState = {
    sips: [],
    sip: {},
    // data: {}
}

export function sipReducer(state = initialState, action) {
    var newState = state
    var sips
    switch (action.type) {
        case SET_SIPS:
            newState = { ...state, sips: action.sips }
            break
        case SET_SIP:
            newState = { ...state, sip: action.sip }
            break
        case REMOVE_SIP:
            const lastRemovedSip = state.sips.find(sip => sip._id === action.sipId)
            sips = state.sips.filter(sip => sip._id !== action.sipId)
            newState = { ...state, sips, lastRemovedSip }
            break
        case ADD_SIP:
            newState = { ...state, sips: [...state.sips, action.sip], sip: action.sip }
            break
        case UPDATE_SIP:
            sips = state.sips.map(sip => (sip._id === action.sip._id) ? action.sip : sip)
            newState = { ...state, sips, sip: action.sip }
            break
            default:
            }
            return newState
        }
        
        // case ADD_SIP_MSG:
        //     if (action.msg && state.sip) {
        //         newState = { ...state, sip: { ...state.sip, msgs: [...state.sip.msgs || [], action.msg] } }
        //         break
        //     }
// unitTestReducer()

// function unitTestReducer() {
//     var state = initialState
//     const sip1 = { _id: 'b101', vendor: 'Sip ' + parseInt('' + Math.random() * 10), speed: 12, owner: null, msgs: [] }
//     const sip2 = { _id: 'b102', vendor: 'Sip ' + parseInt('' + Math.random() * 10), speed: 13, owner: null, msgs: [] }

//     state = sipReducer(state, { type: SET_SIPS, sips: [sip1] })
//     console.log('After SET_SIPS:', state)

//     state = sipReducer(state, { type: ADD_SIP, sip: sip2 })
//     console.log('After ADD_SIP:', state)

//     state = sipReducer(state, { type: UPDATE_SIP, sip: { ...sip2, vendor: 'Good' } })
//     console.log('After UPDATE_SIP:', state)

//     state = sipReducer(state, { type: REMOVE_SIP, sipId: sip2._id })
//     console.log('After REMOVE_SIP:', state)

//     state = sipReducer(state, { type: SET_SIP, sip: sip1 })
//     console.log('After SET_SIP:', state)

//     // const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some msg', by: { _id: 'u123', fullname: 'test' } }
//     // state = sipReducer(state, { type: ADD_SIP_MSG, sipId: sip1._id, msg })
//     // console.log('After ADD_SIP_MSG:', state)
// }

