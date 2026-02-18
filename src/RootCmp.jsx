import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { SipIndex } from './pages/SipIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { SipDetails } from './pages/SipDetails'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { ImagePrompts } from './cmps/ImagePrompts.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { Form } from './pages/Form.jsx'
import { FormComplete } from './pages/FormComplete.jsx'


export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />
            <UserMsg />

            <main>
            
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="sip" element={<SipIndex />} />
                    <Route path="sip/:sipId" element={<SipDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="user/:userId" element={<UserDetails />} />
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat" element={<ChatApp />} />
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="auth" element={<LoginSignup />} />
                    <Route path="build" element={<Form />} />
                    <Route path="complete/:sipId" element={<FormComplete />} />
                    <Route path="complete/:sipId/prompts" element={<ImagePrompts />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}


