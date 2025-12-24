
import React, { useState } from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  GraduationCap, 
  Users, 
  Star,
  X,
  Send,
  Loader2,
  Menu,
  Award,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
  Sparkles,
  Rocket
} from 'lucide-react';
import { geminiService } from './services/geminiService';
import { ClassGrade, ChatMessage } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Classes', href: '#classes' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const classes: ClassGrade[] = [
    {
      id: 'nursery',
      title: 'Foundation (Nursery - UKG)',
      description: 'A dedicated and fresh environment where we nurture curiosity and basic social skills.',
      ageGroup: '3 - 5 Years',
      subjects: ['Alphabets', 'Basic Math', 'Arts', 'Storytelling'],
      icon: '🎨'
    },
    {
      id: 'primary',
      title: 'Primary (1st - 5th)',
      description: 'Building strong academic foundations with modern, interactive and conceptual learning.',
      ageGroup: '6 - 10 Years',
      subjects: ['English', 'Math', 'Science', 'Social Studies'],
      icon: '📚'
    },
    {
      id: 'secondary',
      title: 'Middle School (6th - 8th)',
      description: 'Empowering students with analytical thinking and advanced academic focus.',
      ageGroup: '11 - 13 Years',
      subjects: ['Physics', 'Advanced Math', 'Computing', 'Literature'],
      icon: '🔬'
    }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    const history = chatMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await geminiService.sendMessage(chatInput, history);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-dark border-b border-brand-gold/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center p-0.5 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                   <div className="w-full h-full bg-brand-dark rounded-full flex items-center justify-center border-2 border-brand-gold">
                      <span className="text-brand-gold font-serif font-black text-xl italic">IC</span>
                   </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-brand-gold italic">
                  IQRA CLASSES
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hidden sm:block">
                  Your Child's Future is Our Priority
                </span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href}
                  className="text-white/70 hover:text-brand-gold transition-colors font-bold text-xs uppercase tracking-widest"
                >
                  {item.label}
                </a>
              ))}
              <button className="bg-brand-gold hover:bg-white text-brand-dark px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-gold/10">
                Enroll Now
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <button 
              className="md:hidden p-2 text-brand-gold"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-dark border-b border-brand-gold/10 p-6 space-y-4 animate-in slide-in-from-top duration-300">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                className="block text-white/70 hover:text-brand-gold transition-colors font-bold py-2 text-lg font-serif italic"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full bg-brand-gold text-brand-dark px-6 py-4 rounded-xl font-black uppercase tracking-widest">
              Enroll Now
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-32 overflow-hidden bg-brand-dark text-white grid-pattern">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <Rocket size={18} className="text-brand-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                  A New Era of Academic Excellence
                </span>
              </div>
              <h1 className="text-5xl lg:text-8xl font-black font-serif leading-[1.1] tracking-tighter">
                Modern <br />
                <span className="text-brand-gold italic">Education.</span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Empowering students from Nursery to 8th Standard with a fresh approach to learning, focusing on individual potential and contemporary educational values.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                <button className="bg-brand-gold hover:bg-white text-brand-dark px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-brand-gold/10 flex items-center gap-3 active:scale-95">
                  Admission Form <ChevronRight size={20} />
                </button>
                <button className="bg-transparent border-2 border-white/10 hover:border-brand-gold text-white px-10 py-5 rounded-2xl font-black text-lg transition-all">
                  Browse Curriculum
                </button>
              </div>
            </div>
            <div className="flex-1 relative w-full">
               <div className="relative aspect-square sm:aspect-auto sm:h-[600px] overflow-hidden rounded-[60px] border-4 border-white/5 shadow-2xl rotate-3 group">
                  <img 
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop" 
                    alt="Education and Learning" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-10 left-10 p-8 bg-brand-dark border-2 border-brand-gold rounded-3xl -rotate-3 group-hover:rotate-0 transition-all shadow-2xl">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-brand-dark">
                          <Sparkles size={24} />
                        </div>
                        <div>
                           <p className="text-xl font-serif font-black italic text-brand-gold">Fresh Approach</p>
                           <p className="text-[10px] uppercase font-black tracking-widest text-white/50">Modern Methodology</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 bg-white relative z-10 -mt-16 rounded-t-[80px] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <GraduationCap size={40} />, title: 'Dedicated Faculty', text: 'Our educators are passionate specialists focused on early and primary childhood development.' },
              { icon: <BookOpen size={40} />, title: 'Modern Facilities', text: 'Smart-enabled classroom setups designed for an engaging and interactive learning experience.' },
              { icon: <Users size={40} />, title: 'Small Batch Sizes', text: 'We maintain low student-to-teacher ratios to ensure personalized guidance for every child.' }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[40px] bg-slate-50 hover:bg-brand-dark hover:text-white transition-all duration-500 hover:-translate-y-4 shadow-sm">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-brand-dark mb-8 group-hover:bg-brand-gold group-hover:scale-110 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-3xl font-serif font-black mb-4 italic">{f.title}</h3>
                <p className="text-slate-500 group-hover:text-white/60 leading-relaxed font-medium">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-xs">Academic Structure</span>
            <h2 className="text-5xl md:text-6xl font-black font-serif italic text-brand-dark tracking-tighter">Academic Levels.</h2>
            <div className="w-24 h-2 bg-brand-gold mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10">
            {classes.map((grade) => (
              <div key={grade.id} className="bg-white rounded-[50px] overflow-hidden border border-slate-200 hover:border-brand-gold/50 hover:shadow-2xl transition-all duration-500 group">
                <div className="p-12 space-y-8">
                  <div className="text-6xl group-hover:scale-125 transition-transform duration-500">{grade.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif font-black italic text-brand-dark group-hover:text-brand-gold transition-colors">{grade.title}</h3>
                    <span className="inline-block px-4 py-1.5 bg-brand-gold/10 text-brand-dark rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-gold/20">
                      {grade.ageGroup}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium italic">
                    {grade.description}
                  </p>
                  <div className="pt-8 border-t border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Subject Matrix</h4>
                    <div className="flex flex-wrap gap-2">
                      {grade.subjects.map(subject => (
                        <span key={subject} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-700 text-xs rounded-xl font-bold hover:bg-brand-gold hover:text-brand-dark transition-colors cursor-default">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="text-brand-dark font-serif text-5xl font-black italic tracking-tighter">A Fresh Vision.</h2>
                <div className="w-20 h-2 bg-brand-gold rounded-full"></div>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed font-medium italic">
                Iqra Classes is founded on the principle that learning should be a journey of discovery, not just rote memorization.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: 'New Methodology', desc: 'Modern teaching techniques that prioritize understanding over memorization.' },
                  { title: 'Moral Growth', desc: 'Instilling core ethical values and character development.' },
                  { title: 'Secure Learning', desc: 'A safe, monitored environment where students can focus entirely on growth.' },
                  { title: 'Interactive Learning', desc: 'Engaging activities that bring subjects to life for every age group.' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-brand-dark font-black font-serif italic text-lg">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center gap-2 active:scale-95">
                Our Founding Vision <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex-1 relative order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/20 rounded-full blur-3xl animate-pulse"></div>
                <img src="https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=1974&auto=format&fit=crop" className="rounded-[60px] shadow-2xl relative z-10 aspect-square object-cover grayscale-0 hover:grayscale transition-all duration-700" alt="Learning Environment" />
                <div className="absolute -bottom-6 -right-6 z-20 bg-brand-dark p-8 rounded-[30px] shadow-2xl border-4 border-white">
                  <p className="text-4xl font-serif font-black text-brand-gold">100%</p>
                  <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-1">Dedication</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-16">
              <div className="space-y-6">
                <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-xs">Reach Out</span>
                <h2 className="text-6xl font-black font-serif italic tracking-tighter">Get in Touch.</h2>
                <p className="text-white/50 text-xl font-medium max-w-md leading-relaxed">
                  Join Iqra Classes today. We are now open for new enrollments. Feel free to contact us for more information.
                </p>
              </div>
              
              <div className="space-y-10">
                <div className="flex items-center gap-8 group">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                    <Mail size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Send an Email</p>
                    <a href="mailto:kumtheafaan@gmail.com" className="text-2xl font-serif font-black italic hover:text-brand-gold transition-colors">
                      kumtheafaan@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-8 group opacity-80">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                    <Phone size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Direct Call</p>
                    <p className="text-2xl font-serif font-black italic text-white/40 italic">[Phone Number TBD]</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 group opacity-80">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                    <MapPin size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Our Campus</p>
                    <p className="text-2xl font-serif font-black italic text-white/40 italic">[Campus Address TBD]</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[60px] p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-4xl font-serif font-black mb-10 italic text-brand-dark">Admissions Open.</h3>
              <form className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Parent Name</label>
                   <input type="text" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all text-slate-900 font-bold" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Email Address</label>
                   <input type="email" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all text-slate-900 font-bold" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Grade Applying For</label>
                   <select className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all text-slate-900 font-bold appearance-none">
                     <option>Select Option</option>
                     <option>Nursery - UKG</option>
                     <option>Grade 1 - 5</option>
                     <option>Grade 6 - 8</option>
                   </select>
                </div>
                <button className="w-full bg-brand-dark text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-brand-gold hover:text-brand-dark transition-all shadow-2xl active:scale-95">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-20 text-slate-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark font-serif font-black text-sm">IC</div>
                 <span className="text-3xl font-serif font-black italic text-white tracking-tighter italic">IQRA CLASSES</span>
              </div>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-gold italic text-center md:text-left">Your Child's Future is Our Priority</p>
            </div>
            
            <div className="flex gap-10 font-black text-[10px] uppercase tracking-widest">
              <a href="#" className="hover:text-brand-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Legal</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] opacity-30 text-center">
            <p>© {new Date().getFullYear()} IQRA CLASSES. ALL RIGHTS RESERVED.</p>
            <p>A MODERN ACADEMY FOR THE LEADERS OF TOMORROW.</p>
          </div>
        </div>
      </footer>

      {/* AI Assistant Button */}
      <div className="fixed bottom-10 right-10 z-[100]">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-brand-gold text-brand-dark rounded-full shadow-[0_20px_50px_rgba(220,199,157,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 border-white"
          >
            <div className="absolute -top-14 right-0 bg-brand-dark text-brand-gold text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hidden group-hover:block whitespace-nowrap">
              Academic Help
            </div>
            <MessageCircle size={32} />
          </button>
        ) : (
          <div className="bg-white w-[380px] h-[600px] rounded-[50px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-brand-dark p-8 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-dark shadow-xl">
                  <Star size={28} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-serif font-black italic text-brand-gold leading-none">Iqra AI Tutor</h4>
                  <span className="text-[10px] text-white/40 flex items-center gap-2 mt-2 font-black uppercase tracking-widest">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Ready to Assist
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-10 px-4 space-y-8">
                  <div className="w-24 h-24 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto border-2 border-brand-gold/20">
                    <GraduationCap size={48} />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-serif font-black italic text-2xl text-brand-dark">How can I help you today?</h5>
                    <p className="text-sm text-slate-400 font-medium text-center">I'm here to provide details about our new academy and curriculum.</p>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-[30px] text-sm leading-relaxed font-medium ${
                    msg.role === 'user' 
                    ? 'bg-brand-dark text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 px-6 py-4 rounded-[30px] rounded-tl-none shadow-sm flex items-center gap-3">
                    <Loader2 className="animate-spin text-brand-gold" size={16} />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Generating...</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..." 
                  className="w-full bg-slate-100 border-none rounded-3xl pl-8 pr-16 py-5 text-sm font-bold focus:ring-2 focus:ring-brand-dark transition-all"
                />
                <button 
                  type="submit"
                  disabled={isTyping}
                  className="absolute right-2 p-4 bg-brand-dark text-brand-gold rounded-2xl hover:scale-105 active:scale-95 disabled:bg-slate-300 transition-all shadow-xl shadow-brand-dark/20"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
