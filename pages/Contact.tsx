
import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
       <div className="grid lg:grid-cols-2 gap-20">
          <div>
             <span className="text-zeina-600 font-bold uppercase tracking-wider text-sm">Get in touch</span>
             <h1 className="text-5xl font-serif font-bold text-slate-900 mt-4 mb-8">We're here to help.</h1>
             <p className="text-lg text-slate-600 mb-12">
               Have questions about the app, our experts, or your health data? Reach out to us.
             </p>
             
             <div className="space-y-8">
                <div className="flex items-start gap-4">
                   <div className="bg-zeina-100 p-3 rounded-full text-zeina-700"><Mail size={20} /></div>
                   <div>
                      <h4 className="font-bold text-slate-900">Email Us</h4>
                      <p className="text-slate-500">info@zeinahealth.info</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-zeina-100 p-3 rounded-full text-zeina-700"><Phone size={20} /></div>
                   <div>
                      <h4 className="font-bold text-slate-900">Call Us</h4>
                      <p className="text-slate-500">+966 54 944 6825</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-zeina-100 p-3 rounded-full text-zeina-700"><MapPin size={20} /></div>
                   <div>
                      <h4 className="font-bold text-slate-900">Office</h4>
                      <p className="text-slate-500">Al Janadryiah Riyadh, Saudi Arabia</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-zeina-50 border border-slate-100">
             <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200" placeholder="Jane" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200" placeholder="Doe" />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                   <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200" placeholder="jane@example.com" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                   <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zeina-200" placeholder="How can we help you?" />
                </div>
                <button type="button" className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium hover:bg-zeina-700 transition-colors">
                   Send Message
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};

export default Contact;
