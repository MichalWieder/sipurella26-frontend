// services/images.service.js (frontend)
import { httpService } from "./http.service"

export const imagesService = {
  generatePrompts,
}

async function generatePrompts(sipId) {
  // adjust URL to your API
  return httpService.post("images/generate", {sipId})
}
