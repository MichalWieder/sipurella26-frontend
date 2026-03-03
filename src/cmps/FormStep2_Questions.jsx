import { Switch } from '@mui/material'
import { useReactMediaRecorder } from "react-media-recorder"
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { uploadService } from "../services/upload.service"

export function FormStep2_Questions ({ question, register, setValue, idx }) {
  const loggedInUser = useSelector(storeState => storeState.userModule.user)
  const [recordingToggle, setRecordingToggle] = useState(true)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef(null)

  const textPath = `details.${idx}.text`
  const recordPath = `details.${idx}.recordUrl`

  const onRecordingToggle = () => {setRecordingToggle(prev => !prev)}

   const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl, blob) => {
      try {
        setPreviewUrl(blobUrl)
        const url = await uploadService.uploadAudio(blob)
        setValue(recordPath, url, { shouldDirty: true })
        setValue(textPath, "", { shouldDirty: true }) //optional
      } catch (err) {
        console.error(err)
      }
    },
  })

    async function onSelectAudioFile(ev) {
    const file = ev.target.files?.[0]
    if (!file) return

    // Preview locally
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    try {
      const url = await uploadService.uploadAudio(file)
      setValue(recordPath, url, { shouldDirty: true })
      setValue(textPath, "", { shouldDirty: true })
    } catch (err) {
      console.error(err)
      URL.revokeObjectURL(localUrl)
      setPreviewUrl("")
    } finally {
      ev.target.value = ""
    }
  }

    async function onDeleteRecording() {
    try {
      setValue(recordPath, "", { shouldDirty: true }) 
      setPreviewUrl("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error("Failed to delete recording", err)
    }
  }


  return (
    <section>
      <label htmlFor="info1">{question}</label>
      <div className='toggle'>
        <Switch
          size="small"
          checked={recordingToggle}
          onClick={onRecordingToggle}
        />
        {/* <button type="button" onClick={onRecordingToggle}>{`Toggle ${recordingToggle}`}</button> */}
      </div>

      <input type="hidden" {...register(recordPath)} />

      
      <div className='info'>
    {recordingToggle 
    ? <div>
        <button type="button" onClick={startRecording}>Start</button>
        <button type="button" onClick={stopRecording}>Stop</button>

        {/* Upload existing recording */}
        {loggedInUser.role === 'admin' &&
            <div className='audio-upload'>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/ogg,audio/*"
                onChange={onSelectAudioFile}
              />
            </div>
          }

        {previewUrl && (
          <>
          <audio src={previewUrl} controls />
          <button type="button" onClick={onDeleteRecording}>
                x
          </button>
          </>
        )}
      </div>
    : <div>
      <label htmlFor={textPath}>ספר לנו</label>
      <textarea
        id={textPath}
        {...register(textPath)}
        rows="6"
        placeholder="כאן מספרים"
      />
      </div>
    }
    </div>


</section>
  )

}
