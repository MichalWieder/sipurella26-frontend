
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'sip'

export const sipService = {
    query,
    getById,
    save,
    remove,
    addSipMsg
}
window.cs = sipService


async function query() {
    const sip = await storageService.query(STORAGE_KEY)
    return sip
}

function getById(sipId) {
    return storageService.get(STORAGE_KEY, sipId)
}

async function remove(sipId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, sipId)
}

async function save(sip) {
    var savedSip
    if (sip._id) {
        const sipToSave = {
            _id: sip._id,
            giverName: sip.giverName,
            email: sip.email,
            receiverName: sip.receiverName,
            relation: sip.relation,
            charactersCount: sip.charactersCount,
            event: sip.event,
            story: sip.story,
            details: sip.details,
            wish: sip.wish,
            backCover: sip.backCover,
            imgs: sip.imgs,
            characters: sip.characters
        }
        savedSip = await storageService.put(STORAGE_KEY, sipToSave)
    } else {
        const sipToSave = {
            giverName: sip.giverName,
            email: sip.email,
            receiverName: sip.receiverName,
            relation: sip.relation,
            charactersCount: sip.charactersCount,
            event: sip.event,
            story: sip.story,
            details: sip.details,
            wish: sip.wish,
            backCover: sip.backCover,
            imgs: sip.imgs,
            characters: sip.characters
            // Later, owner is set by the backend
            // owner: userService.getLoggedinUser(),
            // msgs: []
        }
        savedSip = await storageService.post(STORAGE_KEY, sipToSave)
    }
    return savedSip
}

async function addSipMsg(sipId, txt) {
    // Later, this is all done by the backend
    const sip = await getById(sipId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    sip.msgs.push(msg)
    await storageService.put(STORAGE_KEY, sip)

    return msg
}