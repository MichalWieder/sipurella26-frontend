import { httpService } from "./http.service"

export const charactersService = {
  describe,
}

async function describe(sipId) {
  console.log('sipId', sipId)
  return httpService.post("characters/describe", {sipId} )
}