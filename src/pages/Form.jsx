
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { loadSip, updateSip, addSip, loadSips } from '../store/actions/sip.actions';
import {FormStep1} from '../cmps/FormStep1';
import {FormStep2} from '../cmps/FormStep2';
import {FormStep3} from '../cmps/FormStep3';

export function Form () {
  const [step, setStep] = useState(1)
  const sip = useSelector(storeState => storeState.sipModule.sip)
  const sips = useSelector(storeState => storeState.sipModule.sips)

  const [formData, setFormData] = useState({eventType: ''})
    const [searchParams, setSearchParams] = useSearchParams()



    useEffect(() => {
      loadSips()
      console.log('sips', sips)
  }, [])


  const nextStep = () => {setStep((s) => s + 1)}
  const prevStep = () => setStep((s) => s - 1)


  

  async function handleStepSubmit(data) {
    // setFormData((prev) => ({ ...prev, ...data }))
    if (step === 1) await addSip({...data, createdAt: Date.now()})
    else {await updateSip({...sip, ...data,})}

    console.log('sip', sip)
    console.log('step', step)
    nextStep()
  }

  function addStepParam() {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('step', step)
    setSearchParams(newParams)
  }


  return (
    <>
      {step === 1 && <FormStep1 onSubmit={handleStepSubmit} addStepParam={addStepParam} />}
      {step === 2 && <FormStep2 onSubmit={handleStepSubmit} addStepParam={addStepParam} back={prevStep} />}
      {step === 3 && <FormStep3 onSubmit={handleStepSubmit} addStepParam={addStepParam} back={prevStep} />}
    </>
  )
}
