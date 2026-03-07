import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { storyService } from '../services/story.service.js'
import { imagesService } from '../services/images.service.js'
import { sipService } from '../services/sip.service'
import { clearSipDraft } from '../services/util.service'

import { LOADING_START, LOADING_DONE } from '../store/reducers/system.reducer.js'
import { SET_SIP } from '../store/reducers/sip.reducer.js'

import { Loader } from "../cmps/Loader.jsx"
import { SipPrompts } from "../cmps/SipPrompts.jsx"
import { SipStory } from "../cmps/SipStory.jsx"


export function FormComplete () {
const loggedInUser = useSelector(storeState => storeState.userModule.user)
const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
const sip = useSelector(state => state.sipModule.sip)    
const { sipId } = useParams()
const isStoryReady = Array.isArray(sip?.story) && sip.story.length >= 10
const [storyDraft, setStoryDraft] = useState([])
const [isMidjourney, setIsMidjourney] = useState(true)
const [generatorType, setGeneratorType] = useState('midjourney')


const dispatch = useDispatch()

 const labels = useMemo(() => {
    const arr = []
    arr.push("Front Cover")
    for (let i = 1; i <= 10; i++) arr.push(`Paragraph ${i}`)
    arr.push("Wish")
    arr.push("Back cover")
    return arr
  }, [])

useEffect(() => {
  if (!sipId) return
  runCompletionFlow()
}, [sipId, isMidjourney])

  useEffect(() => {
  if (generatorType === 'midjourney') {
    setIsMidjourney(true)
  } else setIsMidjourney(false)
  }, [generatorType])


useEffect(() => {
  if (!sip?._id) return
  if (!Array.isArray(sip.story)) return

  // initialize draft ONLY if empty
  setStoryDraft(prev =>
    prev.length === 0 ? sip.story : prev
  )
}, [sip?._id])

async function runCompletionFlow() {
  try {
    let currentSip = await sipService.getById(sipId)
    dispatch({ type: SET_SIP, sip: currentSip })

    const needsStory =
      !Array.isArray(currentSip.story) || currentSip.story.length < 10

    const promptsField = isMidjourney ? "promptsMj" : "promptsRc"
    const needsPrompts =
      !Array.isArray(currentSip[promptsField]) || !currentSip[promptsField].length

    if (!needsStory && !needsPrompts) {
      clearSipDraft()
      return
    }

    dispatch({ type: LOADING_START })

    if (needsStory) {
      currentSip = await generateStory()
    }

    await generatePrompts(true) 
    await generatePrompts(false)

    currentSip = await sipService.getById(sipId)
    dispatch({ type: SET_SIP, sip: currentSip })

    // if (needsPrompts) {
    //   await generatePrompts(isMidjourney)
    //   currentSip = await sipService.getById(sipId)
    //   dispatch({ type: SET_SIP, sip: currentSip })
    // }

    clearSipDraft()
  } catch (err) {
    console.error(err)
  } finally {
    dispatch({ type: LOADING_DONE })
  }
}

 async function generateStory() {
    try {
        const updateSip = await storyService.generate(sipId)
        dispatch({ type: SET_SIP, sip: updateSip })
        return updateSip
    } catch (err) {
        console.error("Story generation failed", err)
        throw err
    }
}

  async function generatePrompts(isMidjourney){
    try {
        const res = await imagesService.generatePrompts(sipId, isMidjourney)
         if (!Array.isArray(res?.prompts)) {
          throw new Error("Invalid response (expected { prompts: [] })")
        }  
        return res.prompts
        } catch (err) {
            console.error("Prompt generation failed", err)
            throw err
        }
  }

function handleParagraphChange(idx, newValue) {
    setStoryDraft((prev) => {
      const next = [...prev]
      next[idx] = newValue
      return next
    })
  }

async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Clipboard copy failed:", err)
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
  }

function onSelectGenerator(ev) {
  setGeneratorType(ev.target.value)
}


if ((!sip || isLoading) && loggedInUser.role === 'admin') return <Loader text="בונים את הסיפורלה..." />

  return (
    <section className='form-complete'>
    
    {loggedInUser.role === 'user'
      ? <div>
        <h2>הסיפורלה נשלח להכנה</h2>
      </div>
      : (
      <>

        {isStoryReady 
            ? <>
                <SipStory sip={sip} storyDraft={storyDraft} copyToClipboard={copyToClipboard} labels={labels} handleParagraphChange={handleParagraphChange} />
                <div>
                    <select name="generatorType" defaultValue={generatorType} onChange={(ev) => onSelectGenerator(ev)}>
                      <option value="midjourney">Midjorney</option>
                      <option value="recraft">Recraft</option>
                    </select>
                </div>
                <SipPrompts sipId={sip._id} copyToClipboard={copyToClipboard} labels={labels} isMidjourney={isMidjourney}/>
              </>
            : <Loader text="בונים את הסיפורלה..." />
        }

    </>
    )
    }
    </section>
  )
}
