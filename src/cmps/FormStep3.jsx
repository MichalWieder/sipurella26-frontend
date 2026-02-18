import React, { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { uploadService } from "../services/upload.service"
import { LOADING_START, LOADING_DONE } from '../store/reducers/system.reducer'

import { Loader } from "./Loader"
import { ImgUploader } from "./ImgUploader"

const STORAGE_KEY = "form_step3"


export function FormStep3 ({ onSubmit, addStepParam, back }) {
  const sip = useSelector(storeState => storeState.sipModule.sip)
  const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
  const [characterImgs, setCharacterImgs] = useState({})
  const [generalImgs, setGeneralImgs] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const buildDefaultCharacters = (count = 2) =>
  Array.from({ length: count }, (_, i) => ({
    id: `c${i + 1}`,
    role: "main",
    name: "",
    refImg: "",
    appearance: null,
  }))
  
  const defaultValues = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
  wish: "",
  backCover: "",
  characters: buildDefaultCharacters(sip?.charactersCount || 2)
}
  const { register, handleSubmit, setValue, watch } = useForm({defaultValues})

    // const { handleSubmit, register, setValue } = useForm({shouldUnregister: false, defaultValues})


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
    const generalImgUrls = generalImgs.length ? await uploadService.uploadImages(generalImgs) : []
    const updatedCharacters = await Promise.all(
    data.characters.map(async (char, idx) => {
      let refImgUrl = ""
      const file = characterImgs[idx]

      if (file) {
        const uploaded = await uploadService.uploadImages([file]) // wrap in array
        refImgUrl = uploaded[0] || ""
      }

      return {...char, refImg: refImgUrl}
    })
  )

    await onSubmit({ ...data, imgs: generalImgUrls, characters: updatedCharacters })

    localStorage.removeItem("form_step")
    localStorage.removeItem("form_step1")
    localStorage.removeItem("form_step2")
    localStorage.removeItem("form_step3")
    
    dispatch({type: LOADING_DONE})
    navigate(`/complete/`)
    // navigate(`/complete/${sip._id}`)
  }

  
// if (isLoading) return <Loader />

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
         {/* <ImgUploader images={characterImg} setImages={setCharacterImg}/> */}

        {isLoading 
          ? <Loader />
          : <>
            <h2>Images</h2>
            <ImgUploader
              images={generalImgs}
              setImages={setGeneralImgs}
              inputId="general-imgs"                
              multiple={true}
              limit={20}
            />
          </>
        }

        
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

