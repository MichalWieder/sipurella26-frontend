import { sipService } from '../../services/sip.service'
import { store } from '../store'
import { ADD_SIP, REMOVE_SIP, SET_SIPS, SET_SIP, UPDATE_SIP } from '../reducers/sip.reducer'


export async function loadSips() {
    try {
        const sips = await sipService.query()
        store.dispatch(getCmdSetSips(sips))
    } catch (err) {
        console.log('Cannot load sips', err)
        throw err
    }
}

export async function loadSip(sipId) {
    try {
        const sip = await sipService.getById(sipId)
        store.dispatch(getCmdSetSip(sip))
    } catch (err) {
        console.log('Cannot load sip', err)
        throw err
    }
}


export async function removeSip(sipId) {
    try {
        await sipService.remove(sipId)
        store.dispatch(getCmdRemoveSip(sipId))
    } catch (err) {
        console.log('Cannot remove sip', err)
        throw err
    }
}

export async function addSip(sip) {
    try {
        const savedSip = await sipService.save(sip)
        store.dispatch(getCmdAddSip(savedSip))
        return savedSip
    } catch (err) {
        console.log('Cannot add sip', err)
        throw err
    }
}

export async function updateSip(sip) {
    console.log('sip from actions', sip)
    try {
        const savedSip = await sipService.save(sip)
        store.dispatch(getCmdUpdateSip(savedSip))
        return savedSip
    } catch (err) {
        console.log('Cannot save sip', err)
        throw err
    }
}

export async function addSipMsg(sipId, txt) {
    try {
        const msg = await sipService.addSipMsg(sipId, txt)
        store.dispatch(getCmdAddSipMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add sip msg', err)
        throw err
    }
}

// Command Creators:
function getCmdSetSips(sips) {
    return {
        type: SET_SIPS,
        sips
    }
}
function getCmdSetSip(sip) {
    return {
        type: SET_SIP,
        sip
    }
}
function getCmdRemoveSip(sipId) {
    return {
        type: REMOVE_SIP,
        sipId
    }
}
function getCmdAddSip(sip) {
    return {
        type: ADD_SIP,
        sip
    }
}
function getCmdUpdateSip(sip) {
    return {
        type: UPDATE_SIP,
        sip
    }
}
// function getCmdAddSipMsg(msg) {
//     return {
//         type: ADD_SIP_MSG,
//         msg
//     }
// }

// unitTestActions()
async function unitTestActions() {
    await loadSips()
    await addSip(sipService.getEmptySip())
    await updateSip({
        _id: 'm1oC7',
        vendor: 'Sip-Good',
    })
    await removeSip('m1oC7')
    // TODO unit test addSipMsg
}
