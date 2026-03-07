import { useDispatch } from 'react-redux'

import { LOADING_START, LOADING_DONE } from '../store/reducers/system.reducer.js'
import { updateSip } from '../store/actions/sip.actions.js'

import { CardPreview } from "../cmps/CardPreview.jsx"


export function SipStory({ sip, storyDraft, copyToClipboard, labels, handleParagraphChange }) {
const dispatch = useDispatch()


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

function buildStoryTextFile(sip) {
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
  } catch (err) {
    console.error("Failed to save story", err)
  } finally {
    dispatch({ type: LOADING_DONE })
  }
}

    return (
         <div className='sip-story'>
        <header>
        <h1>{sip.receiverName}</h1>

        <button
          type="button"
          disabled={!Array.isArray(sip.story) || !sip.story.length}
          onClick={() => {
            const text = buildStoryTextFile(sip)
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
    )
}