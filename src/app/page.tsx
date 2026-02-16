"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, ShoppingBag, Edit3, Trash2, X, ChevronRight, 
  CheckCircle, Bell, User, Plus, Heart, Dog, Download, 
  Smartphone 
} from 'lucide-react';

// --- INTERFACES ---
interface Booking { id: number; service: string; price: string; date: string; time: string; }
interface Pet { id: number; name: string; breed: string; notes: string; }

export default function NexusMasterPortal() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('experience');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // UI Modals & Notifications
  const [isScheduling, setIsScheduling] = useState<{id?: number, name: string, price: string} | null>(null); 
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [newPet, setNewPet] = useState({ name: '', breed: '', notes: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // PWA Logic
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // --- BRANDING DNA (Injected by hunt.sh) ---
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Nexus Master Lab";
  const businessCity = process.env.NEXT_PUBLIC_BUSINESS_CITY || "Premium Experience";
  const brandColor = process.env.NEXT_PUBLIC_THEME_COLOR || "#38bdf8";

  // --- PERSISTENCE & MOUNTING ---
  useEffect(() => {
    setIsMounted(true);
    const savedBookings = localStorage.getItem('nexus_vault_data');
    const savedPets = localStorage.getItem('nexus_pet_data');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedPets) setPets(JSON.parse(savedPets));

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // --- LOGIC: BOOKING ---
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
      updated = bookings.map(b => b.id === isScheduling.id ? 
        { ...b, date: selectedDate, time: selectedTime } : b
      );
      showToast("Schedule Updated");
    } else {
      const newEntry: Booking = {
        id: Date.now(),
        service: isScheduling.name,
        price: isScheduling.price,
        date: selectedDate,
        time: selectedTime
      };
      updated = [newEntry, ...bookings];
      showToast("Booking Confirmed");
    }

    setBookings(updated);
    localStorage.setItem('nexus_vault_data', JSON.stringify(updated));
    closeScheduler();
  };

  const deleteBooking = (id: number) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('nexus_vault_data', JSON.stringify(updated));
    showToast("Booking Removed");
  };

  // --- LOGIC: PETS ---
  const savePet = () => {
    if (!newPet.name) return;
    const petEntry: Pet = { id: Date.now(), ...newPet };
    const updated = [petEntry, ...pets];
    setPets(updated);
    localStorage.setItem('nexus_pet_data', JSON.stringify(updated));
    setNewPet({ name: '', breed: '', notes: '' });
    setIsAddingPet(false);
    showToast(`${newPet.name} Added`);
  };

  // --- UI UTILS ---
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const closeScheduler = () => {
    setIsScheduling(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      setInstallPrompt(null);
    } else {
      setShowInstallHelp(true);
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32 relative bg-[#050505] text-neutral-200 font-sans overflow-x-hidden selection:bg-sky-500/30">
      
      {/* LUXURY GLOW */}
      <div className="fixed top-[-5%] left-[-10%] w-72 h-72 bg-[#38bdf8]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER: Personalization Focus */}
      <header className="px-6 pt-12 pb-6 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif text-white tracking-wide italic">
              {businessName}
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
               <div className="h-1 w-1 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                 {businessCity}
               </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleInstallClick} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all">
              <Download size={18} />
            </button>
            <button onClick={() => setShowNotifications(!showNotifications)} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white relative active:scale-95 transition-all">
              <Bell size={18} />
              <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATION CENTER */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-6 mb-6">
            <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-5 backdrop-blur-xl">
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4">Live Updates</p>
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-[#38bdf8]/20 rounded-2xl flex items-center justify-center text-[#38bdf8]"><CheckCircle size={18}/></div>
                <div><p className="text-xs text-white">System Optimized</p><p className="text-[10px] text-neutral-500">Welcome to {businessName} Portal.</p></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-6 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'experience' && (
            <motion.div key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="relative w-full h-60 overflow-hidden rounded-[2.5rem] border border-white/5 group">
                <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7" className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6"><span className="px-2 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded">Priority Access</span><h2 className="text-white text-2xl font-serif mt-2 italic">Refined Care.</h2></div>
              </div>
              <ServiceCard name="Essential Session" price="$65" onSelect={() => setIsScheduling({name: "Essential Session", price: "$65"})} />
              <ServiceCard name="Full Grooming" price="$95" onSelect={() => setIsScheduling({name: "Full Grooming", price: "$95"})} />
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div key="vlt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {bookings.length === 0 ? (
                <div className="py-20 text-center bg-neutral-900/20 border border-white/5 rounded-[2.5rem] mt-4 flex flex-col items-center">
                   <History size={32} className="text-neutral-800 mb-4" />
                   <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Vault is Empty</p>
                </div>
              ) : (
                bookings.map(b => (
                  <div key={b.id} className="bg-neutral-900/40 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center">
                    <div><p className="text-[10px] font-black text-[#38bdf8] uppercase tracking-widest mb-1">{b.date} • {b.time}</p><h4 className="text-white font-medium">{b.service}</h4></div>
                    <div className="flex gap-2">
                      <button onClick={() => { setIsScheduling({id: b.id, name: b.service, price: b.price}); setSelectedDate(b.date); setSelectedTime(b.time); }} className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white transition-all"><Edit3 size={16}/></button>
                      <button onClick={() => deleteBooking(b.id)} className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'family' && (
            <motion.div key="fam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {pets.map(p => (
                <div key={p.id} className="bg-neutral-900/30 border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-6">
                  <div className="h-14 w-14 bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-500 text-xl font-serif">{p.name[0]}</div>
                  <div><h4 className="text-white font-medium">{p.name}</h4><p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">{p.breed}</p></div>
                </div>
              ))}
              <button onClick={() => setIsAddingPet(true)} className="w-full py-6 border-2 border-dashed border-white/5 rounded-[2.5rem] text-neutral-600 font-bold text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all">+ Add Family</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SCHEDULING MODAL */}
      <AnimatePresence>
        {isScheduling && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif text-white italic">{isScheduling.id ? 'Modify Slot' : 'Reserve Slot'}</h2>
              <button onClick={closeScheduler} className="h-12 w-12 bg-neutral-900 rounded-full flex items-center justify-center text-neutral-400"><X size={20}/></button>
            </div>
            <div className="space-y-12 flex-1 overflow-y-auto no-scrollbar">
              <section>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-6">Select Date</p>
                <div className="grid grid-cols-4 gap-3">
                  {availableDates.map(d => (
                    <button key={d} onClick={() => setSelectedDate(d)} className={`py-5 rounded-2xl text-[10px] font-black border transition-all ${selectedDate === d ? 'bg-white text-black border-white' : 'bg-neutral-900/50 border-white/5 text-neutral-500'}`}>{d.split(' ')[0]}<br/>{d.split(' ')[1]}</button>
                  ))}
                </div>
              </section>
              <section>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-6">Select Time</p>
                <div className="grid grid-cols-3 gap-3">
                  {['09:00', '12:00', '15:00', '17:30'].map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)} className={`py-4 rounded-2xl text-[10px] font-black border transition-all ${selectedTime === t ? 'bg-white text-black border-white' : 'bg-neutral-900/50 border-white/5 text-neutral-500'}`}>{t}</button>
                  ))}
                </div>
              </section>
            </div>
            <button disabled={!selectedDate || !selectedTime} onClick={saveBooking} style={{ backgroundColor: brandColor }} className="w-full py-6 rounded-[2.5rem] text-black font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl mt-8 disabled:opacity-20 active:scale-95 transition-all">Confirm Booking</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PET MODAL */}
      <AnimatePresence>
        {isAddingPet && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif text-white italic">Add Pet</h2>
              <button onClick={() => setIsAddingPet(false)} className="h-12 w-12 bg-neutral-900 rounded-full flex items-center justify-center text-neutral-400"><X size={20}/></button>
            </div>
            <div className="space-y-6 flex-1">
              <input type="text" placeholder="Pet Name" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-[#38bdf8]/50" />
              <input type="text" placeholder="Breed" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-[#38bdf8]/50" />
              <textarea placeholder="Special Notes" value={newPet.notes} onChange={e => setNewPet({...newPet, notes: e.target.value})} className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-[#38bdf8]/50 h-32 resize-none" />
            </div>
            <button onClick={savePet} style={{ backgroundColor: brandColor }} className="w-full py-6 rounded-[2.5rem] text-black font-black text-[11px] uppercase tracking-[0.4em] mt-8 active:scale-95 transition-all">Create Profile</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST & NAVIGATION */}
      <AnimatePresence>{toast && (<motion.div initial={{ y: -60 }} animate={{ y: 20 }} exit={{ y: -60 }} className="fixed top-0 left-6 right-6 z-[120] bg-white text-black p-4 rounded-2xl flex items-center gap-3"><CheckCircle size={18} className="text-green-600" /><p className="text-[10px] font-black uppercase tracking-tight">{toast}</p></motion.div>)}</AnimatePresence>

      <nav className="fixed bottom-8 left-8 right-8 z-50">
        <div className="bg-[#0c0c0c]/80 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 flex justify-between items-center shadow-2xl">
          <NavBtn active={activeTab === 'experience'} icon={<ShoppingBag size={20}/>} label="Book" onClick={() => setActiveTab('experience')} />
          <NavBtn active={activeTab === 'vault'} icon={<History size={20}/>} label="Vault" onClick={() => setActiveTab('vault')} />
          <NavBtn active={activeTab === 'family'} icon={<User size={20}/>} label="Family" onClick={() => setActiveTab('family')} />
        </div>
      </nav>

      {/* INSTALL HELP DRAWER */}
      <AnimatePresence>
        {showInstallHelp && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl p-8 flex flex-col items-center justify-center text-center">
            <Smartphone size={48} className="text-white mb-6" />
            <h2 className="text-2xl font-serif text-white mb-4">Install App</h2>
            <p className="text-neutral-400 text-sm mb-8">Tap 'Share' and select 'Add to Home Screen' for the best experience.</p>
            <button onClick={() => setShowInstallHelp(false)} className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full">Got it</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function ServiceCard({ name, price, onSelect }: any) {
  return (
    <div onClick={onSelect} className="bg-neutral-900/40 p-6 rounded-[2.5rem] border border-white/5 flex justify-between items-center active:scale-[0.98] transition-all">
      <div><h4 className="text-white font-medium text-lg">{name}</h4><p className="text-neutral-500 text-xs">Premium styling.</p></div>
      <div className="text-right">
        <span className="text-white text-xl block mb-2 font-light">{price}</span>
        <div className="flex items-center gap-1 text-[#38bdf8] text-[9px] font-black uppercase tracking-widest">Reserve <ChevronRight size={14} /></div>
      </div>
    </div>
  );
}

function NavBtn({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 ${active ? 'bg-white text-black shadow-xl' : 'text-neutral-500 hover:text-neutral-300'}`}>
      {icon}{active && <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );
}
