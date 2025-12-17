import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StorageService } from '../services/storage';
import { BookingDetails } from '../types';
import { useAuth } from '../context/AuthContext';

const LiveConsultation: React.FC = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [appointment, setAppointment] = useState<BookingDetails | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // 1. Check Auth
    if (!user) {
      navigate('/login');
      return;
    }

    // 2. Load Appointment (Simulation)
    if (appointmentId) {
       const appt = StorageService.getAppointmentById(appointmentId);
       if (appt) {
          setAppointment(appt);
          // Simulate connection delay
          setTimeout(() => setIsConnected(true), 1500);
       } else {
          // Fallback if ID invalid or just demo
          setAppointment({
             id: 'demo',
             userId: user.id,
             expertId: 'demo_expert',
             expertName: 'Dr. Fatima Al-Otaibi',
             expertImage: 'https://images.unsplash.com/photo-1594824476969-23362a2fb2bc?auto=format&fit=crop&q=80&w=400',
             date: new Date().toISOString(),
             time: 'Now',
             status: 'confirmed',
             createdAt: new Date().toISOString()
          });
          setTimeout(() => setIsConnected(true), 2000);
       }
    }
  }, [user, appointmentId, navigate]);

  // 3. Initialize WebRTC Local Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        setPermissionError(null);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setPermissionError("Camera/Mic access denied. Please enable permissions.");
      }
    };

    startMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Run once on mount

  // Timer
  useEffect(() => {
    let interval: any;
    if (isConnected) {
       interval = setInterval(() => {
          setCallDuration(prev => prev + 1);
       }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    } else {
        // Fallback UI toggle if stream fails
        setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    } else {
        // Fallback UI toggle
        setIsVideoOn(!isVideoOn);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
     if (window.confirm("Are you sure you want to end the consultation?")) {
        // Stop tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        navigate('/profile');
     }
  };

  if (!appointment) return (
     <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
           <p>Initializing Secure Session...</p>
        </div>
     </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
       {/* Top Bar */}
       <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg text-white/80">
                <Shield size={16} />
             </div>
             <div className="text-white">
                <h3 className="font-bold text-sm flex items-center gap-2">
                   {appointment.expertName} 
                   {isConnected && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                </h3>
                <p className="text-xs text-white/60">Encrypted Medical Session</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             {permissionError && (
                 <div className="bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
                     <AlertCircle size={12} /> {permissionError}
                 </div>
             )}
             <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white font-mono text-sm">
                {formatTime(callDuration)}
             </div>
          </div>
       </div>

       {/* Main Video Area (Remote Party - Simulated) */}
       <div className="flex-grow relative flex items-center justify-center overflow-hidden bg-slate-800">
          {!isConnected ? (
             <div className="text-white flex flex-col items-center animate-pulse z-0">
                <img src={appointment.expertImage} className="w-24 h-24 rounded-full mb-4 border-4 border-slate-700 object-cover" alt="Connecting" />
                <p className="text-lg font-bold">Connecting to {appointment.expertName}...</p>
             </div>
          ) : (
             <>
               {/* Remote Video Stream Simulation */}
               <img 
                 src={appointment.expertImage} 
                 alt="Remote Video" 
                 className="w-full h-full object-cover opacity-90 blur-sm scale-110" 
               />
               <div className="absolute inset-0 bg-black/20"></div>
               <img 
                  src={appointment.expertImage}
                  className="absolute w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl z-0 object-cover"
                  alt="Expert Face"
               />
             </>
          )}

          {/* Self View (PiP - Real WebRTC Stream) */}
          <motion.div 
             drag
             dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
             className="absolute bottom-24 right-6 w-32 h-48 md:w-48 md:h-64 bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-700 overflow-hidden cursor-move z-20 group"
          >
             <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transform scale-x-[-1] ${!isVideoOn ? 'hidden' : ''}`}
             />
             
             {!isVideoOn && (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white/30 flex-col gap-2">
                   <VideoOff size={24} />
                   <span className="text-[10px]">Camera Off</span>
                </div>
             )}

             <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-2 py-0.5 rounded">You</div>
          </motion.div>
       </div>

       {/* Bottom Controls */}
       <div className="h-24 bg-slate-900/90 backdrop-blur-md flex items-center justify-center gap-6 pb-6 pt-2">
          <button 
             onClick={toggleMic}
             className={`p-4 rounded-full transition-all ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}`}
             title={isMicOn ? "Mute" : "Unmute"}
          >
             {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          
          <button 
             onClick={toggleVideo}
             className={`p-4 rounded-full transition-all ${isVideoOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}`}
             title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
             {isVideoOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
          </button>

          <button 
             onClick={handleEndCall}
             className="bg-red-600 hover:bg-red-700 text-white p-4 px-8 rounded-full shadow-lg shadow-red-900/20 transition-all transform hover:scale-105"
             title="End Call"
          >
             <PhoneOff size={28} />
          </button>

          <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 md:hidden">
             <MessageSquare size={24} />
          </button>
       </div>
    </div>
  );
};

export default LiveConsultation;