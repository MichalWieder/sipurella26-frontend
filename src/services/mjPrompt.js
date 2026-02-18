export function buildCharacterBlock(characters = []) {
  return characters
    .filter(c => c?.appearance?.oneLine)
    .map((c, idx) => {
      const label = c.name || `Character ${idx + 1}`
      return `${label}: ${c.appearance.oneLine}`
    })
    .join("\n")
}

export function buildCref(characters = []) {
  const urls = characters
    .flatMap(c => c.refImgs || [])
    .slice(0, 4) // MJ works best with max 4

  return urls.length ? `--cref ${urls.join(" ")}` : ""
}
