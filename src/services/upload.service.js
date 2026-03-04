import { httpService } from "./http.service.js"

export const uploadService = {
  uploadAudio,
  uploadImages,
}

// POST /api/upload/audio with field "file"
async function uploadAudio(input) {
  const isFile = input instanceof File

  const mime = input.type || "audio/webm"
  const ext =
    mime.includes("ogg") ? "ogg" :
    mime.includes("webm") ? "webm" :
    mime.includes("mpeg") ? "mp3" :
    "audio"

  const file = isFile
    ? input
    : new File([input], `audio-${Date.now()}.${ext}`, { type: mime })

  const formData = new FormData()
  formData.append("file", file)

  const res = await httpService.post("upload/audio", formData)
  return res.url
}

// POST /api/upload/images with field "files" repeated
async function uploadImages(files, sipId) {
  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))
  formData.append("sipId", sipId)

  const res = await httpService.post("upload/images", formData)
  // backend returns: { urls: [] }
  return res.urls
}
