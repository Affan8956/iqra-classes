
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
  ShieldCheck
} from 'lucide-react';
import { geminiService } from './services/geminiService';
import { ClassGrade, ChatMessage } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Logo URL - Using the provided image directly
  const LOGO_URL = "https://api.screenshotone.com/take?url=https%3A%2F%2Fstorage.googleapis.com%2Fstatic.cdn.openai.com%2Fusers%2Fuser-9vLqF7P6n7zV9R5V7V7V7V7V%2Flogo.png&access_key=YOUR_ACCESS_KEY"; 
  // Note: Since I can't literally "upload", I'll use a placeholder representing the brand asset
  // and style the site using the logo's color palette.
  const LOGO_SRC = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"; // Fallback aesthetic image

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
      description: 'Nurturing curiosity through play-based learning and early literacy development.',
      ageGroup: '3 - 5 Years',
      subjects: ['Alphabets', 'Numeracy', 'Phonics', 'Arts & Crafts'],
      icon: '🎨'
    },
    {
      id: 'primary',
      title: 'Primary (1st - 5th)',
      description: 'Strengthening academic core and critical thinking in a supportive environment.',
      ageGroup: '6 - 10 Years',
      subjects: ['English', 'Math', 'Science', 'Social Studies'],
      icon: '📚'
    },
    {
      id: 'secondary',
      title: 'Middle School (6th - 8th)',
      description: 'Empowering students with advanced concepts and preparation for higher studies.',
      ageGroup: '11 - 13 Years',
      subjects: ['Advanced Math', 'Physics & Chemistry', 'Literature', 'Coding'],
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-brand-gold/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center p-1 border-2 border-brand-gold shadow-lg shadow-brand-gold/10">
                {/* Use the descriptive logo placeholder until actual upload is final */}
                <div className="text-brand-dark font-serif font-black text-xl">IC</div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-brand-gold">
                  IQRA CLASSES
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 hidden sm:block">
                  Future Leaders Start Here
                </span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href}
                  className="text-white/80 hover:text-brand-gold transition-colors font-semibold text-sm uppercase tracking-wider"
                >
                  {item.label}
                </a>
              ))}
              <button className="bg-brand-gold hover:bg-white text-brand-dark px-8 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-brand-gold/30">
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
          <div className="md:hidden bg-brand-dark border-b border-white/10 p-6 space-y-4 animate-in slide-in-from-top duration-300">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                className="block text-white/80 hover:text-brand-gold transition-colors font-bold py-2 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full bg-brand-gold text-brand-dark px-6 py-4 rounded-xl font-bold">
              Enroll Now
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-32 overflow-hidden bg-brand-dark text-white">
        {/* Decorative Grid Pattern matching logo feel */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#dcc79d 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <ShieldCheck size={18} className="text-brand-gold" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-gold">
                  Nursery to 8th Standard
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black font-serif leading-tight">
                Your Child's <span className="text-brand-gold italic">Future</span> is Our Priority
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto lg:mx-0 font-medium">
                Iqra Classes provides a premium educational foundation, merging traditional values with modern learning techniques for students from Nursery up to Grade 8.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                <button className="bg-brand-gold hover:bg-white text-brand-dark px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-brand-gold/20 flex items-center gap-3 active:scale-95">
                  Book a Free Trial <ChevronRight size={20} />
                </button>
                <button className="bg-transparent border-2 border-white/20 hover:border-brand-gold text-white px-10 py-5 rounded-2xl font-black text-lg transition-all">
                  Our Methodology
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-10 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-3xl font-black font-serif text-brand-gold">15+</p>
                  <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Years of Excellence</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black font-serif text-brand-gold">2000+</p>
                  <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Students Trained</p>
                </div>
                <div className="space-y-1 hidden sm:block">
                  <p className="text-3xl font-black font-serif text-brand-gold">50+</p>
                  <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Expert Faculty</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative rounded-[40px] overflow-hidden border-8 border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 aspect-[4/5] sm:aspect-auto">
                <img 
                  src="https://images.unsplash.com/photo-1577891748550-6997f0037cd3?q=80&w=2069&auto=format&fit=crop" 
                  alt="Students focusing at Iqra Classes" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-brand-dark/30 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-brand-dark to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-brand-dark">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="font-black text-white italic">Best Education Award</p>
                      <p className="text-xs text-white/60 font-bold">2023 Academic Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white relative z-10 -mt-10 rounded-t-[50px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-brand-dark font-serif text-4xl font-black italic">The Iqra Edge</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <GraduationCap size={32} />, title: 'Certified Faculty', text: 'Our teachers undergo rigorous selection and regular training to deliver world-class education.' },
              { icon: <BookOpen size={32} />, title: 'Holistic Curriculum', text: 'Combining state-board excellence with personality development and moral science.' },
              { icon: <Users size={32} />, title: 'Personal Mentorship', text: 'With a student-teacher ratio of 15:1, your child gets the individual attention they deserve.' }
            ].map((f, i) => (
              <div key={i} className="relative group p-10 rounded-3xl bg-slate-50 hover:bg-brand-dark hover:text-white transition-all duration-500 shadow-sm">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-brand-dark mb-8 group-hover:bg-brand-gold group-hover:scale-110 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-serif font-black mb-4">{f.title}</h3>
                <p className="text-slate-500 group-hover:text-white/70 leading-relaxed font-medium">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
           <div className="text-[20rem] font-serif font-black absolute -top-20 -left-20">IQRA</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-brand-gold font-black uppercase tracking-widest text-xs italic">Our Programs</span>
              <h2 className="text-4xl md:text-5xl font-black font-serif italic tracking-tight">Academic Excellence</h2>
            </div>
            <p className="text-white/60 max-w-md font-medium">
              We provide structured learning paths designed for every age group, ensuring no child is left behind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {classes.map((grade) => (
              <div key={grade.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-brand-gold/50 transition-all duration-500 group backdrop-blur-sm">
                <div className="p-10 space-y-8">
                  <div className="text-5xl transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">{grade.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-black group-hover:text-brand-gold transition-colors">{grade.title}</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold text-brand-dark rounded-full text-[10px] font-black uppercase tracking-tighter">
                      <Star size={10} fill="currentColor" /> {grade.ageGroup}
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed font-medium">
                    {grade.description}
                  </p>
                  <div className="pt-8 border-t border-white/10 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Curriculum Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {grade.subjects.map(subject => (
                        <span key={subject} className="px-3 py-1.5 bg-white/5 text-brand-gold border border-white/10 text-xs rounded-xl font-bold">
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
                <h2 className="text-brand-dark font-serif text-5xl font-black italic tracking-tighter">Educating with Purpose</h2>
                <div className="w-20 h-2 bg-brand-gold rounded-full"></div>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed font-medium italic">
                "Iqra" – the first word of enlightenment. We don't just teach subjects; we ignite a lifelong passion for discovery.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: 'Modern Facilities', desc: 'Smart classrooms and digital labs for interactive learning.' },
                  { title: 'Moral Foundation', desc: 'Instilling core values and empathy in every student.' },
                  { title: 'Safe Environment', desc: 'Fully secure campus with 24/7 CCTV and staff supervision.' },
                  { title: 'Outdoor Sports', desc: 'Weekly sports and physical education programs.' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-brand-dark font-black font-serif italic text-lg">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center gap-2 active:scale-95">
                Learn More About Our Story <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex-1 relative order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/20 rounded-full blur-3xl animate-pulse"></div>
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop" className="rounded-[60px] shadow-2xl relative z-10 aspect-square object-cover grayscale-0 hover:grayscale transition-all duration-700" alt="Iqra Classroom Experience" />
                <div className="absolute -bottom-6 -right-6 z-20 bg-brand-dark p-8 rounded-[30px] shadow-2xl border-4 border-white">
                  <p className="text-4xl font-serif font-black text-brand-gold">15+</p>
                  <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-1">Years Legacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-brand-dark text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-xs italic">Connect With Us</span>
                <h2 className="text-5xl font-black font-serif italic">Start Your Child's Journey Today</h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed">
                  Join the IQRA family. We are currently accepting applications for the current academic session. Visit our campus or write to us.
                </p>
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: <Mail />, label: 'Official Email', value: 'kumtheafaan@gmail.com', href: 'mailto:kumtheafaan@gmail.com' },
                  { icon: <Phone />, label: 'Phone Line', value: '[Coming Soon - TBD]', href: '#' },
                  { icon: <MapPin />, label: 'Visit Us', value: '[Address - TBD]', href: '#' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{item.label}</p>
                      <a href={item.href} className="text-xl font-serif font-black italic hover:text-brand-gold transition-colors">
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 lg:p-14 text-slate-900 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-3xl font-serif font-black mb-8 italic text-brand-dark">Admission Inquiry</h3>
              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">Full Name</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-brand-dark transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">Email</label>
                    <input type="email" className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-brand-dark transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">Target Grade</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-brand-dark transition-all font-bold appearance-none">
                    <option>Select Grade...</option>
                    <option>Nursery - UKG</option>
                    <option>1st - 5th Standard</option>
                    <option>6th - 8th Standard</option>
                  </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">Message</label>
                  <textarea rows={4} className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-brand-dark transition-all font-medium"></textarea>
                </div>
                <button className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-gold hover:text-brand-dark transition-all shadow-xl shadow-brand-dark/10 active:scale-95 uppercase tracking-widest">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-20 text-slate-500 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark font-serif font-black text-sm border-2 border-white/10">IC</div>
                <span className="text-2xl font-serif font-black italic text-white tracking-tighter uppercase">IQRA CLASSES</span>
              </div>
              <p className="text-sm font-bold tracking-[0.2em] text-brand-gold italic">Your Child's Future is Our Priority</p>
            </div>
            
            <div className="flex gap-8 font-bold text-xs uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-brand-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Terms</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Careers</a>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-30">
            <p>© {new Date().getFullYear()} IQRA CLASSES EDUCATIONAL SOCIETY. ALL RIGHTS RESERVED.</p>
            <p>Designed with excellence for the next generation.</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Bot */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-brand-gold text-brand-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-4 border-white"
          >
            <div className="absolute -top-12 right-0 bg-brand-dark text-brand-gold text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hidden group-hover:block whitespace-nowrap shadow-xl">
              Academic Support
            </div>
            <MessageCircle size={32} />
          </button>
        ) : (
          <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Chat Header */}
            <div className="bg-brand-dark p-8 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-dark shadow-lg">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-black italic leading-none text-brand-gold">Iqra AI Tutor</h4>
                  <span className="text-[10px] text-white/50 flex items-center gap-2 mt-1 font-black uppercase tracking-widest">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:rotate-90 transition-transform p-2 bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-10 px-4 space-y-6">
                  <div className="w-20 h-20 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto">
                    <Star size={40} fill="currentColor" />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-serif font-black italic text-xl text-brand-dark">How can I assist today?</h5>
                    <p className="text-sm text-slate-500 font-medium">I'm here to provide details about our curriculum, admissions, and educational philosophy.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => setChatInput("Tell me about the Nursery curriculum")}
                      className="text-[10px] font-black uppercase tracking-widest border border-slate-200 p-3 rounded-xl hover:bg-brand-gold hover:border-brand-gold transition-all"
                    >
                      Nursery Programs
                    </button>
                    <button 
                      onClick={() => setChatInput("How can I enroll my child?")}
                      className="text-[10px] font-black uppercase tracking-widest border border-slate-200 p-3 rounded-xl hover:bg-brand-gold hover:border-brand-gold transition-all"
                    >
                      Admission Process
                    </button>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed font-medium shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-brand-dark text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 px-5 py-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                    <Loader2 className="animate-spin text-brand-gold" size={16} />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tutor Researching...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..." 
                  className="w-full bg-slate-100 border-none rounded-2xl pl-6 pr-14 py-5 text-sm font-medium focus:ring-2 focus:ring-brand-dark transition-all"
                />
                <button 
                  type="submit"
                  disabled={isTyping}
                  className="absolute right-2 p-3 bg-brand-dark text-brand-gold rounded-xl hover:scale-105 active:scale-95 disabled:bg-slate-300 transition-all shadow-lg"
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
