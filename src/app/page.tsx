"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, ShoppingBag, Edit3, Trash2, X, ChevronRight, 
  CheckCircle, Bell, User, Plus, Heart, Dog, Download, 
  Smartphone, MapPin, Sparkles, Award, ShieldCheck
} from 'lucide-react';

// --- INTERFACES ---
interface Booking { id: number; service: string; price: string; date: string; time: string; }
interface Pet { id: number; name: string; breed: string; notes: string; }

export default function NexusMasterPortal() {
  const [activeTab, setActiveTab] = useState('experience');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // UI Modals
  const [isScheduling, setIsScheduling] = useState<{id?: number, name: string, price: string} | null>(null); 
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [newPet, setNewPet] = useState({ name: '', breed: '', notes: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // --- BRANDING DNA (Dynamic Injection) ---
  const brandName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Nexus Master Lab";
  const brandCity = process.env.NEXT_PUBLIC_BUSINESS_CITY || "Premium Experience";
  const brandColor = process.env.NEXT_PUBLIC_THEME_COLOR || "#38bdf8";

  // Glassmorphism Utility (Tinted based on brandColor)
  const glassBase = {
    backgroundColor: `${brandColor}12`, // 12% opacity tint
    backdropFilter: 'blur(16px)',
    border: `1px solid ${brandColor}25`,
  };

  useEffect(() => {
    setIsMounted(true);
    const savedBookings = localStorage.getItem('nexus_vault_data');
    const savedPets = localStorage.getItem('nexus_pet_data');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedPets) setPets(JSON.parse(savedPets));
  }, []);

  // --- LOGIC: BOOKING & PETS (As provided in your base code) ---
  const availableDates = useMemo(() => {
    const days = [];
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toLocaleDateString('en-US', options));
    }
    return days;
  }, []);

  const saveBooking = () => {
    if (!selectedDate || !selectedTime || !isScheduling) return;
    let updated: Booking[];
    if (isScheduling.id) {
      updated = bookings.map(b => b.id === isScheduling.id ? { ...b, date: selectedDate, time: selectedTime } : b);
      showToast("Schedule Updated");
    } else {
      updated = [{ id: Date.now(), service: isScheduling.name, price: isScheduling.price, date: selectedDate, time: selectedTime }, ...bookings];
      showToast("Booking Confirmed");
    }
    setBookings(updated);
    localStorage.setItem('nexus_vault_data', JSON.stringify(updated));
    setIsScheduling(null);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32 relative bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-sky-500/30">
      
      {/* DYNAMIC BACKGROUND GLOW */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ background: `radial-gradient(circle at 50% -10%, ${brandColor}, transparent 70%)` }}
      />

      {/* HEADER: Personalization & City Visibility Fix */}
      <header className="px-6 pt-12 pb-8 relative z-10">
        <div className="flex justify-between items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold tracking-tight uppercase italic flex items-center gap-2">
              <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: brandColor }} />
              {brandName}
            </h1>
            {/* CITY DISPLAY: Fixed visibility */}
            <div className="flex items-center gap-1.5 mt-2 pl-4">
               <MapPin size={12} style={{ color: brandColor }} />
               <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
                 {brandCity}
               </p>
            </div>
          </motion.div>
          <button onClick={() => setShowInstallHelp(true)} className="h-10 w-10 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 active:scale-90 transition-all">
            <Download size={18} />
          </button>
        </div>
      </header>

      <main className="px-5 relative z-10 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'experience' && (
            <motion.div key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* HERO GLASS CARD */}
              <div 
                style={glassBase}
                className="relative overflow-hidden rounded-[2.5rem] p-6 group border border-white/5 shadow-2xl"
              >
                 <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10">
                        <ShieldCheck size={24} style={{ color: brandColor }} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Verified Partner</span>
                 </div>
                 <h2 className="text-2xl font-bold italic mb-2">Refined Care for <br/>Your Family.</h2>
                 <p className="text-xs opacity-60 leading-relaxed mb-6">Experience boutique grooming services tailored for {brandCity}'s elite pets.</p>
                 <div className="absolute -right-8 -bottom-8 w-32 h-32 blur-3xl rounded-full opacity-20" style={{ backgroundColor: brandColor }} />
              </div>

              {/* SERVICES */}
              <div className="space-y-3">
                <ServiceCard color={brandColor} glass={glassBase} name="Essential Session" price="$65" onSelect={() => setIsScheduling({name: "Essential Session", price: "$65"})} />
                <ServiceCard color={brandColor} glass={glassBase} name="Full Grooming" price="$95" onSelect={() => setIsScheduling({name: "Full Grooming", price: "$95"})} />
              </div>
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div key="vlt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {bookings.length === 0 ? (
                <div style={glassBase} className="py-20 text-center rounded-[2.5rem] flex flex-col items-center">
                   <History size={32} className="opacity-20 mb-4" />
                   <p className="opacity-40 text-[10px] font-black uppercase tracking-widest">Vault is Empty</p>
                </div>
              ) : (
                bookings.map(b => (
                  <div key={b.id} style={glassBase} className="p-6 rounded-[2rem] flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: brandColor }}>{b.date} • {b.time}</p><h4 className="text-white font-medium">{b.service}</h4></div>
                    <div className="flex gap-2">
                      <button onClick={() => deleteBooking(b.id)} className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'family' && (
            <motion.div key="fam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {pets.map(p => (
                <div key={p.id} style={glassBase} className="p-6 rounded-[2.5rem] flex items-center gap-6">
                  <div className="h-14 w-14 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-xl font-bold italic" style={{ color: brandColor }}>{p.name[0]}</div>
                  <div><h4 className="text-white font-medium">{p.name}</h4><p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">{p.breed}</p></div>
                </div>
              ))}
              <button onClick={() => setIsAddingPet(true)} className="w-full py-6 border-2 border-dashed border-white/5 rounded-[2.5rem] text-neutral-600 font-bold text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all">+ Add Profile</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* NAVIGATION: Glassmorphism Floating Bar */}
      <nav className="fixed bottom-8 left-8 right-8 z-50">
        <div className="bg-[#0c0c0c]/60 backdrop-blur-3xl border border-white/10 rounded-full p-1.5 flex justify-between items-center shadow-2xl">
          <NavBtn active={activeTab === 'experience'} icon={<ShoppingBag size={20}/>} label="Book" onClick={() => setActiveTab('experience')} color={brandColor} />
          <NavBtn active={activeTab === 'vault'} icon={<History size={20}/>} label="Vault" onClick={() => setActiveTab('vault')} color={brandColor} />
          <NavBtn active={activeTab === 'family'} icon={<User size={20}/>} label="Pets" onClick={() => setActiveTab('family')} color={brandColor} />
        </div>
      </nav>

      {/* SCHEDULING MODAL: FIXED UI */}
      <AnimatePresence>
        {isScheduling && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold italic">{isScheduling.id ? 'Edit Slot' : 'New Reserve'}</h2>
              <button onClick={() => setIsScheduling(null)} className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center"><X size={20}/></button>
            </div>
            <div className="space-y-8 flex-1">
                <section>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Select Schedule</p>
                    <div className="grid grid-cols-4 gap-2">
                        {availableDates.map(d => (
                            <button key={d} onClick={() => setSelectedDate(d)} className={`py-4 rounded-xl text-[10px] font-bold border transition-all ${selectedDate === d ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white/40'}`}>
                                {d.split(' ')[0]}<br/>{d.split(' ')[1]}
                            </button>
                        ))}
                    </div>
                </section>
                <section>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Preferred Time</p>
                    <div className="grid grid-cols-3 gap-2">
                        {['09:00', '12:00', '15:00'].map(t => (
                            <button key={t} onClick={() => setSelectedTime(t)} className={`py-4 rounded-xl text-[10px] font-bold border transition-all ${selectedTime === t ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white/40'}`}>{t}</button>
                        ))}
                    </div>
                </section>
            </div>
            <button disabled={!selectedDate || !selectedTime} onClick={saveBooking} style={{ backgroundColor: brandColor }} className="w-full py-6 rounded-[2rem] text-black font-black text-[11px] uppercase tracking-[0.3em] disabled:opacity-20 active:scale-95 transition-all">Confirm Booking</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>{toast && (<motion.div initial={{ y: -60 }} animate={{ y: 20 }} exit={{ y: -60 }} className="fixed top-0 left-6 right-6 z-[120] bg-white text-black p-4 rounded-2xl flex items-center gap-3"><CheckCircle size={18} className="text-green-600" /><p className="text-[10px] font-black uppercase tracking-tight">{toast}</p></motion.div>)}</AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function ServiceCard({ name, price, onSelect, glass, color }: any) {
  return (
    <div onClick={onSelect} style={glass} className="p-6 rounded-[2rem] flex justify-between items-center active:scale-[0.98] transition-all">
      <div><h4 className="text-white font-medium text-lg italic">{name}</h4><p className="text-neutral-500 text-xs">Premium Session</p></div>
      <div className="text-right">
        <span className="text-white text-xl block mb-2 font-bold">{price}</span>
        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest" style={{ color }}>Select <ChevronRight size={14} /></div>
      </div>
    </div>
  );
}

function NavBtn({ active, icon, label, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3.5 rounded-full transition-all duration-500 ${active ? 'bg-white text-black shadow-2xl' : 'text-white/40 hover:text-white'}`}>
      {icon}{active && <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );
}
