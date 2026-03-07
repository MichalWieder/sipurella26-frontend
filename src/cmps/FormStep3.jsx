import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { uploadService } from "../services/upload.service"
import { imagesService } from "../services/images.service"
import { storyService } from '../services/story.service.js'
import { LOADING_START, LOADING_DONE } from '../store/reducers/system.reducer'
import { SET_SIP } from '../store/reducers/sip.reducer.js'

import { Loader } from "./Loader"
import { ImgUploader } from "./ImgUploader"

const STORAGE_KEY = "form_step3"


export function FormStep3 ({ onSubmit, addStepParam, back }) {
  const sip = useSelector(storeState => storeState.sipModule.sip)
  const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
  const [characterImgs, setCharacterImgs] = useState({})
  const [generalImgs, setGeneralImgs] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isMidjourney, setIsMidjourney] = useState(true)

  const buildDefaultCharacters = (count = 2) =>
  Array.from({ length: count }, (_, i) => ({
    id: `c${i + 1}`,
    role: "main",
    name: "",
    uploadedImg: "",
    appearance: null,
  }))
  
  const defaultValues = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
  wish: "",
  backCover: "",
  characters: buildDefaultCharacters(sip?.charactersCount || 2)
}
  const { register, handleSubmit, watch } = useForm({defaultValues})
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    addStepParam()
  }, [])

  useEffect(() => {
    const sub = watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    })
    return () => sub.unsubscribe()
  }, [watch])


  async function onFinalSubmit(data) {
    dispatch({type: LOADING_START})
    
    // upload images to cloudinary and add to sip.images & characters
    const generalImgUrls = generalImgs.length ? await uploadService.uploadImages(generalImgs, sip._id) : []
    const updatedCharacters = await Promise.all(
    data.characters.map(async (char, idx) => {
      let uploadedImgUrl = ""
      const file = characterImgs[idx]

      if (file) {
        const uploaded = await uploadService.uploadImages([file, sip._id]) // wrap in array
        uploadedImgUrl = uploaded[0] || ""
      }

      return {...char, uploadedImg: uploadedImgUrl}
    })
  )

    await onSubmit({ ...data, imgs: generalImgUrls, characters: updatedCharacters })

    // clearSipDraft()
    
    dispatch({type: LOADING_DONE})
    // navigate(`/complete/`)
    navigate(`/complete/${sip._id}`)
  }


 async function generateStory(sipId) {
    if (!sipId) throw new Error("Missing sipId for story generation")
    try {
        const updateSip = await storyService.generate(sipId)
        dispatch({ type: SET_SIP, sip: updateSip })
        return updateSip
    } catch (err) {
        console.error("Story generation failed", err)
        throw err
    }
}

  async function generatePrompts(sipId, isMidjourney){
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

  if (isLoading) return <Loader text='מגישים את הטופס'/>

    return (
      <section className="container user-form">
      <h1>Final Step</h1>

      <form onSubmit={handleSubmit(onFinalSubmit)}>
        <div>
          <label htmlFor="wish">איחול</label>
          <textarea id="wish" {...register("wish")} rows="6" placeholder="איחול" />
        </div>

        <div>
          <label htmlFor="backCover">משפט לכריכה אחורית</label>
          <textarea
            id="backCover"
            {...register("backCover")}
            rows="6"
            placeholder="משפט לכריכה"
          />
        </div>

        
          <>
        {watch("characters")?.map((char, idx) => (
          <div key={char.id}>
            <h2>Character {idx + 1}</h2>

            <ImgUploader
              images={characterImgs[idx] ? [characterImgs[idx]] : []}
              setImages={(imgs) =>
                setCharacterImgs(prev => ({
                  ...prev,
                  [idx]: imgs[0] || null
                }))
              }
              inputId={`character-imgs-${idx}`}  
              multiple={false}                
              limit={1}
            />
          </div>
        ))}

         <h2>Images</h2>
            <ImgUploader
              images={generalImgs}
              setImages={setGeneralImgs}
              inputId="general-imgs"                
              multiple={true}
              limit={20}
            />
        </>
        
        <button type="submit" disabled={isUploading}>
          {isUploading ? "מעלה..." : "שליחה"}
        </button>

        {back && (
          <button type="button" onClick={back} disabled={isUploading}>
            חזרה
          </button>
        )}
      </form>

    </section>
    )

}

