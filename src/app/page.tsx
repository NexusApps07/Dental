"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, CalendarDays, Edit3, Trash2, X, ChevronRight, 
  CheckCircle, User, Plus, Download, MapPin, ShieldCheck, Sparkles
} from 'lucide-react';

import HeroTitle from "@/components/HeroTitle"; 
import SmartCity from "@/components/SmartCity";

export default function NexusMasterPortal() {
  const [activeTab, setActiveTab] = useState('experience');
  const [bookings, setBookings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // UI States
  const [isScheduling, setIsScheduling] = useState<any>(null); 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Form States - Pivoted for Dental Aesthetics
  const [newProfile, setNewProfile] = useState({ name: '', concern: '', notes: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // --- BRANDING DNA ---
  const brandCity = process.env.NEXT_PUBLIC_BUSINESS_CITY || "Beverly Hills";
  const brandColor = process.env.NEXT_PUBLIC_THEME_COLOR || "#0EA5E9"; // Clinical Blue

  const glassBase = {
    backgroundColor: `${brandColor}08`, 
    backdropFilter: 'blur(20px)',
    border: `1px solid ${brandColor}15`,
  };

  // --- CRASH-PROOF DATA LOADING ---
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedBookings = localStorage.getItem('nexus_vault_data');
      const savedProfiles = localStorage.getItem('nexus_patient_data');
      if (savedBookings) setBookings(JSON.parse(savedBookings));
      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    } catch (e) {
      console.error("Resetting vault.", e);
      localStorage.removeItem('nexus_vault_data');
      localStorage.removeItem('nexus_patient_data');
    }
  }, []);

  // --- LOGIC: DATES ---
  const availableDates = useMemo(() => {
    const days = [];
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + (i + 1)); // Skip today for high-ticket bookings
      days.push(d.toLocaleDateString('en-US', options));
    }
    return days;
  }, []);

  // --- LOGIC: BOOKINGS ---
  const saveBooking = () => {
    if (!selectedDate || !selectedTime) return;
    const newBooking = { id: Date.now(), service: isScheduling.name, price: isScheduling.price, date: selectedDate, time: selectedTime };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('nexus_vault_data', JSON.stringify(updated));
    setIsScheduling(null);
    showToast("Consultation Confirmed");
  };

  const deleteBooking = (id: number) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('nexus_vault_data', JSON.stringify(updated));
  };

  // --- LOGIC: PROFILES (ADD & EDIT) ---
  const openProfileModal = (profile?: any) => {
    if (profile) {
      setNewProfile(profile);
      setEditingProfileId(profile.id);
    } else {
      setNewProfile({ name: '', concern: '', notes: '' });
      setEditingProfileId(null);
    }
    setIsProfileModalOpen(true);
  };

  const saveProfile = () => {
    if (!newProfile.name) return;
    let updatedProfiles;
    if (editingProfileId) {
      updatedProfiles = profiles.map(p => p.id === editingProfileId ? { ...newProfile, id: editingProfileId } : p);
      showToast("Profile Updated");
    } else {
      const profileEntry = { id: Date.now(), ...newProfile };
      updatedProfiles = [profileEntry, ...profiles];
      showToast(`${newProfile.name} Added`);
    }
    setProfiles(updatedProfiles);
    localStorage.setItem('nexus_patient_data', JSON.stringify(updatedProfiles));
    setNewProfile({ name: '', concern: '', notes: '' });
    setEditingProfileId(null);
    setIsProfileModalOpen(false);
  };

  const deleteProfile = (id: number) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem('nexus_patient_data', JSON.stringify(updated));
    showToast("Profile Removed");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32 relative bg-[#050505] text-white selection:bg-white/20 font-sans">
      
      {/* PREMIUM FONT IMPORT */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&display=swap');
        body, button, input, textarea, select { font-family: 'Outfit', sans-serif; }
        h1, h2, h3 { letter-spacing: -0.02em; }
        .tracking-widest { letter-spacing: 0.2em !important; }
      `}</style>

      {/* BACKGROUND GLOW */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle at 50% -10%, ${brandColor}, transparent 80%)` }}
      />

      {/* HEADER */}
      <header className="px-6 pt-14 pb-8 relative z-10 flex justify-between items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase leading-none">
            <HeroTitle />
          </h1>
          <div className="flex items-center gap-2 mt-3 opacity-80">
             <MapPin size={14} style={{ color: brandColor }} />
             <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              <SmartCity />
             </p> 
          </div>
        </motion.div>
        <button onClick={() => setShowInstallHelp(true)} className="h-12 w-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 active:scale-95 transition-all">
          <Download size={20} />
        </button>
      </header>

      <main className="px-6 relative z-10 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'experience' && (
            <motion.div key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* HERO CARD */}
              <div 
                style={glassBase}
                className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-white/5"
              >
                 <div className="relative h-60 w-full">
                    <img 
                      src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800" 
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Dental Clinic Aesthetic"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                 </div>

                 <div className="p-6 pt-0 -mt-10 relative z-10">
                   <div className="flex justify-between items-center mb-4">
                      <div className="h-10 w-10 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                          <ShieldCheck size={20} style={{ color: brandColor }} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Board Certified</span>
                   </div>
                   <h2 className="text-3xl font-bold mb-2 leading-tight">Architects of the <br/>Perfect Smile.</h2>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6"> Bespoke cosmetic dentistry in <SmartCity />. Combining advanced clinical precision with an artistic eye. </p>
                   
                   <button 
                    onClick={() => setIsScheduling({name: "Comprehensive Assessment", price: "$250"})}
                    style={{ backgroundColor: brandColor }}
                    className="w-full py-4 rounded-xl text-black font-bold text-xs uppercase tracking-[0.1em] shadow-lg active:scale-95 transition-all"
                   >
                     Book Initial Assessment
                   </button>
                 </div>
              </div>

              {/* HIGH-TICKET SERVICES GRID */}
              <div className="grid grid-cols-1 gap-3">
                <ServiceCard color={brandColor} glass={glassBase} name="Signature Veneers Consult" price="$150" onSelect={() => setIsScheduling({name: "Veneers Consultation", price: "$150"})} />
                <ServiceCard color={brandColor} glass={glassBase} name="Invisalign® Scan & Plan" price="$95" onSelect={() => setIsScheduling({name: "Invisalign® Consult", price: "$95"})} />
                <ServiceCard color={brandColor} glass={glassBase} name="Zoom!® Laser Whitening" price="$650" onSelect={() => setIsScheduling({name: "Laser Whitening", price: "$650"})} />
              </div>
            </motion.div>
          )}

          {activeTab === 'vault' && (
              <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {bookings.length === 0 ? (
                  <div style={glassBase} className="py-20 text-center rounded-[2rem] flex flex-col items-center border border-white/5">
                      <History size={32} className="opacity-20 mb-4" />
                      <p className="opacity-40 text-xs font-bold uppercase tracking-widest">No Active Bookings</p>
                  </div>
                ) : (
                  bookings.map(b => (
                    <div key={b.id} style={glassBase} className="p-5 rounded-[1.5rem] flex justify-between items-center border border-white/5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: brandColor }}>{b.date} • {b.time}</p>
                        <h4 className="text-white font-bold text-lg">{b.service}</h4>
                      </div>
                      <button onClick={() => deleteBooking(b.id)} className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))
                )}
              </motion.div>
          )}

          {activeTab === 'profiles' && (
            <motion.div key="profiles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {profiles.map(p => (
                <div key={p.id} style={glassBase} className="p-5 rounded-[2rem] flex items-center justify-between border border-white/5 group">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-xl font-bold" style={{ color: brandColor }}>{p.name[0]}</div>
                    <div>
                        <h4 className="text-white font-bold">{p.name}</h4>
                        <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">{p.concern}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => openProfileModal(p)} className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                        <Edit3 size={16}/>
                      </button>
                      <button onClick={() => deleteProfile(p.id)} className="h-10 w-10 bg-red-500/5 rounded-xl flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 size={16}/>
                      </button>
                  </div>
                </div>
              ))}
              <button onClick={() => openProfileModal()} className="w-full py-5 border border-dashed border-white/10 rounded-[2rem] text-neutral-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 active:scale-95 transition-all">+ Add Patient Profile</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* NAVIGATION */}
      <nav className="fixed bottom-8 left-8 right-8 z-50">
        <div className="bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-full p-2 flex justify-between items-center shadow-2xl">
          <NavBtn active={activeTab === 'experience'} icon={<Sparkles size={20}/>} label="Services" onClick={() => setActiveTab('experience')} color={brandColor} />
          <NavBtn active={activeTab === 'vault'} icon={<CalendarDays size={20}/>} label="Visits" onClick={() => setActiveTab('vault')} color={brandColor} />
          <NavBtn active={activeTab === 'profiles'} icon={<User size={20}/>} label="Profile" onClick={() => setActiveTab('profiles')} color={brandColor} />
        </div>
      </nav>

      {/* SCHEDULING MODAL */}
      <AnimatePresence>
        {isScheduling && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-[#050505] p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold">Request Time</h2>
              <button onClick={() => setIsScheduling(null)} className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center"><X size={20}/></button>
            </div>
            <div className="space-y-8 flex-1 overflow-y-auto">
                <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4">Date</p>
                    <div className="grid grid-cols-4 gap-2">
                        {availableDates.map(d => (
                            <button key={d} onClick={() => setSelectedDate(d)} className={`py-4 rounded-xl text-[10px] font-bold border transition-all ${selectedDate === d ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white/40'}`}>
                                {d.split(' ')[0]}<br/>{d.split(' ')[1]}
                            </button>
                        ))}
                    </div>
                </section>
                <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4">Time Preference</p>
                    <div className="grid grid-cols-3 gap-2">
                        {['Morning', 'Mid-Day', 'Afternoon'].map(t => (
                            <button key={t} onClick={() => setSelectedTime(t)} className={`py-4 rounded-xl text-[10px] font-bold border transition-all ${selectedTime === t ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white/40'}`}>{t}</button>
                        ))}
                    </div>
                </section>
            </div>
            <button disabled={!selectedDate || !selectedTime} onClick={saveBooking} style={{ backgroundColor: brandColor }} className="w-full py-5 rounded-2xl text-black font-bold text-xs uppercase tracking-[0.2em] disabled:opacity-20 active:scale-95 transition-all">Submit Request</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PATIENT INTAKE MODAL (HIPAA Safe Form) */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-[#050505] p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold">{editingProfileId ? 'Update Profile' : 'Intake Details'}</h2>
              <button onClick={() => setIsProfileModalOpen(false)} className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center"><X size={20}/></button>
            </div>
            <div className="space-y-4 flex-1">
              <input type="text" placeholder="Legal First & Last Name" value={newProfile.name} onChange={e => setNewProfile({...newProfile, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm text-white focus:outline-none focus:border-white/30 transition-all" />
              
              <select value={newProfile.concern} onChange={e => setNewProfile({...newProfile, concern: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm text-white focus:outline-none focus:border-white/30 transition-all appearance-none">
                <option value="" disabled className="text-black">Primary Aesthetic Goal</option>
                <option value="Straightening / Invisalign" className="text-black">Straightening / Invisalign</option>
                <option value="Brightening / Whitening" className="text-black">Brightening / Whitening</option>
                <option value="Restoration / Veneers" className="text-black">Restoration / Veneers</option>
                <option value="General Consultation" className="text-black">General Consultation</option>
              </select>

              <textarea placeholder="Tell us about your timeline or goals (e.g., Upcoming wedding, fixing a chipped tooth). Do not include sensitive medical history." value={newProfile.notes} onChange={e => setNewProfile({...newProfile, notes: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm text-white focus:outline-none focus:border-white/30 transition-all h-32 resize-none" />
            </div>
            <button onClick={saveProfile} style={{ backgroundColor: brandColor }} className="w-full py-5 rounded-2xl text-black font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all">
                {editingProfileId ? 'Save Changes' : 'Create Profile'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>{toast && (<motion.div initial={{ y: -60 }} animate={{ y: 20 }} exit={{ y: -60 }} className="fixed top-0 left-6 right-6 z-[120] bg-white text-black p-4 rounded-xl flex items-center gap-3"><CheckCircle size={18} className="text-green-600" /><p className="text-xs font-bold uppercase tracking-tight">{toast}</p></motion.div>)}</AnimatePresence>
      
       {/* INSTALL HELP DRAWER */}
      <AnimatePresence>
        {showInstallHelp && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center">
            <Download size={48} className="text-white mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Install App</h2>
            <p className="text-neutral-400 text-sm mb-8">Tap 'Share' and select 'Add to Home Screen' for the ultimate concierge experience.</p>
            <button onClick={() => setShowInstallHelp(false)} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full">Got it</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceCard({ name, price, onSelect, glass, color }: any) {
  return (
    <div onClick={onSelect} style={glass} className="p-6 rounded-[1.5rem] flex justify-between items-center active:scale-[0.98] cursor-pointer transition-all border border-white/5">
      <div><h4 className="text-white font-bold text-lg">{name}</h4><p className="text-neutral-500 text-xs mt-1">Clinical Procedure</p></div>
      <div className="text-right">
        <span className="text-white text-xl block mb-1 font-bold">{price}</span>
        <div className="flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-widest" style={{ color }}>Details <ChevronRight size={14} /></div>
      </div>
    </div>
  );
}

function NavBtn({ active, icon, label, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${active ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>
      {icon}{active && <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>}
    </button>
  );
}
