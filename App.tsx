
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Experts from './pages/Experts';
import Tools from './pages/Tools';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import AIAssistant from './pages/AIAssistant';
import Community from './pages/Community';
import ChatWidget from './components/ChatWidget';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LiveConsultation from './pages/LiveConsultation';
import VerifyEmail from './pages/VerifyEmail';
import HealthQuiz from './pages/HealthQuiz';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="ask-zeina" element={<AIAssistant />} />
              <Route path="community" element={<Community />} />
              <Route path="services" element={<Services />} />
              <Route path="experts" element={<Experts />} />
              <Route path="book/:expertId" element={<Booking />} />
              <Route path="tools" element={<Tools />} />
              <Route path="blog" element={<Blog />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="quiz" element={<HealthQuiz />} />
            </Route>
            {/* Live Consultation is outside Layout to be full screen */}
            <Route path="consultation/:appointmentId" element={<LiveConsultation />} />
          </Routes>
          <ChatWidget />
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
