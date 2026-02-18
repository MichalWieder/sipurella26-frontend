import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const STORAGE_KEY = "form_step1"


export function FormStep1 ({ onSubmit, addStepParam }) {
  // const { register, handleSubmit } = useForm()
  const { register, handleSubmit, watch } = useForm({
    defaultValues: JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
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
  <section className="user-form1">
      <h1>שאלון קצרצר</h1>

    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="giverName"></label>
        <input placeholder="נותן המתנה" {...register("giverName")} />
      </div>

          <div>
        <label htmlFor="email"></label>
        <input
          placeholder="כתובת מייל"
          type="email"
          {...register("email")}
        />
      </div>

      <div>
        <label htmlFor="receiverName"></label>
        <input placeholder="מקבל המתנה" {...register("receiverName")} />
      </div>

      <div>
        <label htmlFor="relation"></label>
        <input placeholder="מה הקשר ביניכם?" {...register("relation")} />
      </div>

      <div>
        <label htmlFor="charactersCount"></label>
        <input type="number" min="1" max="7" placeholder="כמה דמויות ראשיות יש בסיפור?" {...register("charactersCount")} />
      </div>

      <div>
        <label htmlFor="event"></label>
        <select id="event"  {...register("event")} name="event">
          
          <option value="" style={{display:"none"}}>איזה אירוע?</option>
          <option value="ev1">יום הולדת</option>
          <option value="ev2">חתונה</option>
          <option value="ev3">אירוסין</option>
          <option value="ev4">בר/בת מצווה</option>
          <option value="ev5">יום נישואין</option>
          <option value="ev6">הריון</option>
          <option value="ev7">לידה</option>
          <option value="ev8">אחר</option>
      </select>
      </div>

    
      <button type="submit">המשך</button>
    </form>
  </section>
  )

}
