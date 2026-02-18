import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { httpService } from "../services/http.service"
import { Loader } from "../cmps/Loader"

export function ImagePrompts({ sipId: sipIdProp }) {
  const params = useParams()
  const sipId = sipIdProp || params.sipId

  const [prompts, setPrompts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const labels = useMemo(() => {
    // We expect 13 prompts:
    // 0 cover
    // 1..10 paragraphs 1..10
    // 11 wish
    // 12 back cover
    const arr = []
    arr.push("Cover")
    for (let i = 1; i <= 10; i++) arr.push(`Paragraph ${i}`)
    arr.push("Wish")
    arr.push("Back cover")
    return arr
  }, [])

  useEffect(() => {
    if (!sipId) return
    loadPrompts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sipId])

  async function loadPrompts() {
    try {
      setIsLoading(true)
      setErrMsg("")

      // 🔧 Change endpoint to your actual backend route
      // Example: "imagePrompt/generate" => /api/imagePrompt/generate
      const res = await httpService.post("images/generate", { sipId })

      if (!res?.prompts || !Array.isArray(res.prompts)) {
        throw new Error("Invalid response from server (expected {prompts: []})")
      }

      setPrompts(res.prompts)
    } catch (err) {
      console.error("Failed loading prompts:", err)
      setErrMsg("Failed to generate prompts. Check console + backend logs.")
    } finally {
      setIsLoading(false)
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Clipboard copy failed:", err)
      // Fallback (older browsers)
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
  }

  async function onCopyAll() {
    const joined = prompts.join("\n\n---\n\n")
    await copyToClipboard(joined)
  }

  if (!sipId) return <div>Missing sipId</div>
  if (isLoading) return <Loader text="Generating prompts..." />
  if (errMsg) {
    return (
      <section className="image-prompts">
        <h2>Midjourney Prompts</h2>
        <p style={{ color: "crimson" }}>{errMsg}</p>
        <button onClick={loadPrompts}>Try again</button>
      </section>
    )
  }

  return (
    <section className="image-prompts">
      <header style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h2 style={{ margin: 0 }}>Midjourney Prompts</h2>
        <button type="button" onClick={loadPrompts}>
          Regenerate
        </button>
        <button type="button" onClick={onCopyAll} disabled={!prompts.length}>
          Copy all
        </button>
      </header>

      {!prompts.length ? (
        <p>No prompts yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
          {prompts.map((prompt, idx) => (
            <PromptCard
              key={idx}
              idx={idx}
              label={labels[idx] || `Prompt ${idx + 1}`}
              prompt={prompt}
              onCopy={copyToClipboard}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function PromptCard({ idx, label, prompt, onCopy }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await onCopy(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 900)
  }

  return (
    <article
      className="prompt-card"
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "12px",
        background: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
          <strong>{label}</strong>
          <span style={{ opacity: 0.6 }}>#{idx + 1}</span>
        </div>

        <button type="button" onClick={handleCopy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <textarea
        value={prompt}
        readOnly
        rows={6}
        style={{
          width: "100%",
          resize: "vertical",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontFamily: "monospace",
          fontSize: "13px",
          lineHeight: 1.35,
        }}
      />
    </article>
  )
}
