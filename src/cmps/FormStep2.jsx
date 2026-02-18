import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormStep2_Questions } from './FormStep2_Questions.jsx'

const STORAGE_KEY = "form_step2"

export function FormStep2 ({ onSubmit, addStepParam, back }) {
  
  // const { event } = data
  const [questions, setQuestions] = useState(
    ["איך הכרתם?", "איזה סוג של זוג אתם? מה מספרים עליכם", "מה התחביבים שלכם? (ביחד ולחוד)", "יש עוד משהו שהיית רוצה לשתף? שמות חיבה, בדיחות פרטיות, סיפורים מצחיקים"])

  // const defaultValues = {
  //   details: [
  //     { text: "", recordUrl: "" },
  //     { text: "", recordUrl: "" },
  //     { text: "", recordUrl: "" },
  //     { text: "", recordUrl: "" },
  //   ],
  // }
  // const { handleSubmit, register, setValue } = useForm({shouldUnregister: false, defaultValues})


  const defaultValues = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
    details: [
      { text: "", recordUrl: "" },
      { text: "", recordUrl: "" },
      { text: "", recordUrl: "" },
      { text: "", recordUrl: "" },
    ],
  }

  const { register, handleSubmit, setValue, watch } = useForm({
    shouldUnregister: false,
    defaultValues,
  })


  useEffect(() => {
            addStepParam()
    }, [])

  useEffect(() => {
    const sub = watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    })
    return () => sub.unsubscribe()
  }, [watch])

  

    return (
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
        <h2>The Questions</h2>
        {
          questions.map((question, idx) => {
            return (
            <FormStep2_Questions
              key={idx}
              question = {question}
              register={register}
              setValue={setValue}
              idx={idx}
              // watch={watch}
            />)

          })
        }


    <button type="submit">המשך</button>
      {back && (
          <button type="button" onClick={back}>
            חזרה
          </button>
        )}
      </form>

    </section>
    )

}
