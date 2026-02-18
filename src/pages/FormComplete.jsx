import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { storyService } from '../services/story.service.js'
import { loadSip, updateSip } from '../store/actions/sip.actions.js';

import { LOADING_START, LOADING_DONE } from '../store/reducers/system.reducer.js'
import { SET_SIP } from '../store/reducers/sip.reducer.js'

import { Loader } from "../cmps/Loader.jsx"
import { ImagePrompts } from "../cmps/ImagePrompts.jsx"


export function FormComplete () {
const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
const sip = useSelector(state => state.sipModule.sip)    
const { sipId } = useParams()

const dispatch = useDispatch()

useEffect(() => {
    console.log(sipId)
    if (!sip || sip._id !== sipId) {
        loadSip(sipId)
    }
}, [sipId])

useEffect(() => {
    generateStory()
}, [sip])


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

if (!sip || isLoading) return <Loader text="בונים את הסיפורלה שלך..." />

  return (
    <section className='user-complete'>
        <h1>הסיפור שלך מוכן</h1>
        {/* <pre>{sip.story}</pre> */}
       <div>
        {Array.isArray(sip.story) &&
            sip.story.map((paragraph, idx) => (
            <pre key={idx} className="paragraph">
                {paragraph}
                <hr></hr>
            </pre>
            ))}
        </div>


        <ImagePrompts sipId={sip.Id}/>
    </section>
  )
}
