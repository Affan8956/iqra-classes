
import React, { useState, useEffect } from 'react';
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
  Menu
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
      description: 'Focusing on early childhood development through play and interactive learning.',
      ageGroup: '3 - 5 Years',
      subjects: ['Alphabets', 'Numbers', 'Rhymes', 'Moral Values'],
      icon: '🎨'
    },
    {
      id: 'primary',
      title: 'Primary (1st - 5th)',
      description: 'Building strong fundamentals in core subjects with creative methodologies.',
      ageGroup: '6 - 10 Years',
      subjects: ['English', 'Mathematics', 'Science', 'Social Studies'],
      icon: '📚'
    },
    {
      id: 'secondary',
      title: 'Middle School (6th - 8th)',
      description: 'Preparing students for higher academic challenges with structured learning.',
      ageGroup: '11 - 13 Years',
      subjects: ['Advanced Math', 'Science Lab', 'Literature', 'History'],
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
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                I
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Iqra Class
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href}
                  className="text-slate-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))}
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
                Enroll Now
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                className="block text-slate-600 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium">
              Enroll Now
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-32 overflow-hidden bg-emerald-50">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-200/50 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                Welcome to Iqra Class
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                Empowering Minds From <span className="text-emerald-600 underline decoration-emerald-200">Nursery to 8th</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
                At Iqra Class, we believe in nurturing every child's potential through a balanced blend of academic rigor, character building, and creative expression.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-emerald-200/50 flex items-center gap-2">
                  Get Started <ChevronRight size={20} />
                </button>
                <button className="bg-white border-2 border-slate-200 hover:border-emerald-600 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                  Our Curriculum
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-6 text-slate-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-white" alt="student" />
                  ))}
                </div>
                <p className="text-sm font-medium">Joined by 200+ happy parents</p>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop" 
                  alt="Students learning" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <Star fill="currentColor" size={24} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">4.9/5</p>
                  <p className="text-sm text-slate-500">Parent Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-emerald-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Faculty</h3>
              <p className="text-slate-600">Highly qualified and passionate educators dedicated to student success.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-emerald-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Curriculum</h3>
              <p className="text-slate-600">Interactive and inquiry-based learning that stays ahead of trends.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-emerald-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Individual Focus</h3>
              <p className="text-slate-600">Small batch sizes ensuring personalized attention for every learner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Academic Programs</h2>
            <p className="text-lg text-slate-600">Comprehensive curriculum designed specifically for each developmental stage.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {classes.map((grade) => (
              <div key={grade.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="h-2 bg-emerald-500"></div>
                <div className="p-8 space-y-6">
                  <div className="text-4xl">{grade.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">{grade.title}</h3>
                    <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {grade.ageGroup}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {grade.description}
                  </p>
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Core Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {grade.subjects.map(subject => (
                        <span key={subject} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-lg font-medium">
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
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-slate-900">Why Choose Iqra Class?</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                "Iqra" means to read, to learn, and to grow. Our philosophy is rooted in providing high-quality education that prepares students for a rapidly changing world. We focus not just on grades, but on the holistic development of the child.
              </p>
              <ul className="space-y-4">
                {[
                  'Holistic approach to child development',
                  'Strong emphasis on ethics and moral values',
                  'Safe and nurturing learning environment',
                  'Regular parent-teacher feedback sessions'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                      <ChevronRight size={14} />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <button className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Read our full mission statement <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/seed/school1/400/500" className="rounded-2xl shadow-lg mt-12" alt="School activities" />
              <img src="https://picsum.photos/seed/school2/400/500" className="rounded-2xl shadow-lg" alt="School classroom" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Get In Touch</h2>
                <p className="text-slate-400 text-lg">
                  Have questions? We're here to help! Reach out to us through any of the following channels.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Email Address</p>
                    <a href="mailto:kumtheafaan@gmail.com" className="text-xl font-bold hover:text-emerald-400 transition-colors">
                      kumtheafaan@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Phone Number</p>
                    <p className="text-xl font-bold">[TBD - Coming Soon]</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Our Location</p>
                    <p className="text-xl font-bold">[Address - TBD]</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-12 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Send an Inquiry</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500">
                  <option>Interested Grade</option>
                  <option>Nursery - UKG</option>
                  <option>1st - 5th Standard</option>
                  <option>6th - 8th Standard</option>
                </select>
                <textarea rows={4} placeholder="Your Message" className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500"></textarea>
                <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-slate-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold">I</div>
            <span className="text-xl font-bold text-white">Iqra Class</span>
          </div>
          <p>© {new Date().getFullYear()} Iqra Class. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Career</a>
          </div>
        </div>
      </footer>

      {/* AI Chat Bot */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
          >
            <div className="absolute -top-12 -left-32 bg-slate-900 text-white text-sm px-4 py-2 rounded-xl hidden group-hover:block whitespace-nowrap after:content-[''] after:absolute after:top-full after:right-8 after:border-8 after:border-transparent after:border-t-slate-900">
              Ask our AI Tutor!
            </div>
            <MessageCircle size={32} />
          </button>
        ) : (
          <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Chat Header */}
            <div className="bg-emerald-600 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Star size={20} />
                </div>
                <div>
                  <h4 className="font-bold leading-none">Iqra AI Assistant</h4>
                  <span className="text-xs text-emerald-100 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                    Always here to help
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-12 px-4 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={32} />
                  </div>
                  <h5 className="font-bold text-slate-800">Hi! I'm your Iqra AI Tutor</h5>
                  <p className="text-sm text-slate-500">Ask me anything about our classes, curriculum, or enrollment process!</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-emerald-600" size={16} />
                    <span className="text-xs text-slate-400 font-medium">Tutor is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question..." 
                  className="w-full bg-slate-100 border-none rounded-2xl pl-4 pr-12 py-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isTyping}
                  className="absolute right-2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 transition-colors"
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
