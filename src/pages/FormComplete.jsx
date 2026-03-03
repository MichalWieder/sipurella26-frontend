import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { storyService } from '../services/story.service.js'
import { imagesService } from '../services/images.service.js'
import { loadSip, updateSip } from '../store/actions/sip.actions.js';

import { LOADING_START, LOADING_DONE } from '../store/reducers/system.reducer.js'
import { SET_SIP } from '../store/reducers/sip.reducer.js'

import { Loader } from "../cmps/Loader.jsx"
import { CardPreview } from "../cmps/CardPreview.jsx"
import { ImagePrompts } from "../cmps/ImagePrompts.jsx"


export function FormComplete () {
const loggedInUser = useSelector(storeState => storeState.userModule.user)
const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
const sip = useSelector(state => state.sipModule.sip)    
const { sipId } = useParams()
const isStoryReady = Array.isArray(sip?.story) && sip.story.length >= 10;
const [storyDraft, setStoryDraft] = useState([])


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
    if (!sip || sip._id !== sipId) {
        loadSip(sipId)
    }
}, [sipId])

useEffect(() => {
    generateStory()
    setStoryDraft(Array.isArray(sip?.story) ? sip.story : [])
}, [sip?._id, sip?.story])

useEffect(() => {
  if (!sip?._id) return
  if (!Array.isArray(sip.story)) return

  // initialize draft ONLY if empty
  setStoryDraft(prev =>
    prev.length === 0 ? sip.story : prev
  )
}, [sip?._id])


 async function generateStory() {
    if (!sip?._id) return
    if (sip.story) return
    try {
        dispatch({type: LOADING_START})

        const updateSip = await storyService.generate(sip._id)
        dispatch({ type: SET_SIP, sip: updateSip })


        dispatch({type: LOADING_DONE})
    } catch (err) {
        console.error("Story generation failed", err)
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

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}

function buildStoryText(sip) {
  const story = Array.isArray(sip.story) ? sip.story : []
  // const front = sip.receiverName ? `${sip.receiverName} - כריכה קדמית\n` : ""
  // const back = sip.backCover ? `\n\n${sip.backCover} - כריכה אחורית\n` : ""

  const body = story
    .join("\n\n") // separator between paragraphs

  // return `${front}\n${body}${back}`.trim()
  return body.trim()
}

async function onSaveStory() {
  try {
    dispatch({ type: LOADING_START })
    updateSip({...sip, story: storyDraft} )
    // const updated = await sipService.update(sip._id, { story: storyDraft })
    // dispatch({ type: SET_SIP, sip: updated })
  } catch (err) {
    console.error("Failed to save story", err)
  } finally {
    dispatch({ type: LOADING_DONE })
  }
}


if ((!sip || isLoading) && loggedInUser.role === 'admin') return <Loader text="בונים את הסיפורלה שלך..." />

  return (
    <>
    {loggedInUser.role === 'user'
      ? <div>
        <h2>הסיפורלה נשלח להכנה</h2>
      </div>
      : (
      <section className='form-complete'>
      
       <div className='story-generate'>
        <header>
        <h1>{sip.receiverName}</h1>

        <button
          type="button"
          disabled={!Array.isArray(sip.story) || !sip.story.length}
          onClick={() => {
            const text = buildStoryText(sip)
            const safeName = (sip.receiverName || "sip").replace(/[^\w\u0590-\u05FF\- ]+/g, "").trim()
            downloadTextFile(`${safeName || "sip"}-story.txt`, text)
          }}
        >Download as a txt
      </button>

      {/* Save story */}
      <button type="button" onClick={onSaveStory} disabled={!storyDraft.length}>
        Save story
      </button>
      </header>

        <CardPreview
                idx={0}
                label={labels[0]}
                text={`הסיפור של ${sip.receiverName}`}
                onCopy={copyToClipboard}
                onChange={handleParagraphChange}
        />
        {Array.isArray(sip.story) &&          
            storyDraft.map((paragraph, idx) => (

            <CardPreview
                key={idx}
                idx={idx}
                label={labels[idx + 1]}
                text={paragraph}
                onCopy={copyToClipboard}
                onChange={handleParagraphChange}
            />
            ))
           }

           <CardPreview
                idx={12}
                label={labels[12]}
                text={sip.backCover}
                onCopy={copyToClipboard}
                onChange={handleParagraphChange}
        />
        </div>

        {isStoryReady 
            ? <>
                <ImagePrompts sipId={sip._id} copyToClipboard={copyToClipboard} labels={labels} isMidjourney={true}/>
                <ImagePrompts sipId={sip._id} copyToClipboard={copyToClipboard} labels={labels} isMidjourney={false}/>
              </>
            : <Loader text="בונים את הסיפורלה שלך..." />
        }

    </section>
    )
    }
    </>
  )
}
