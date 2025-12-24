
import React, { useState, useRef, useEffect } from 'react';
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
  Rocket,
  BrainCircuit,
  Cpu,
  Monitor,
  CheckCircle2,
  ClipboardList,
  User,
  Calendar,
  Map,
  Database,
  Trash2,
  LayoutDashboard,
  ExternalLink,
  Bot,
  FileText,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { geminiService } from './services/geminiService';
import { dbService, AdmissionApplication, Inquiry } from './services/dbService';
import { ClassGrade, ChatMessage } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'admissions' | 'inquiries'>('admissions');
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Admission Form State
  const [admissionForm, setAdmissionForm] = useState({
    studentName: '',
    dob: '',
    gender: '',
    grade: '',
    schoolName: '',
    parentName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setAdmissions(dbService.getAdmissions());
    setInquiries(dbService.getInquiries());
  }, [chatMessages, isTyping, isAdminOpen]);

  const generateAdmissionPDF = (data: Omit<AdmissionApplication, 'id' | 'timestamp'>) => {
    const doc = new jsPDF();
    const brandDark = '#1a3328';
    const brandGold = '#dcc79d';

    // Header Background
    doc.setFillColor(26, 51, 40); // brandDark
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(220, 199, 157); // brandGold
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('IQRA CLASSES', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text("YOUR CHILD'S FUTURE IS OUR PRIORITY", 105, 30, { align: 'center' });

    // Section: Admission Details
    doc.setTextColor(26, 51, 40);
    doc.setFontSize(18);
    doc.text('Admission Application Form', 20, 55);
    doc.setDrawColor(220, 199, 157);
    doc.line(20, 58, 100, 58);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${data.studentName}`, 25, 80);
    doc.text(`Date of Birth: ${data.dob}`, 25, 88);
    doc.text(`Gender: ${data.gender}`, 25, 96);
    doc.text(`Grade Applying For: ${data.grade}`, 25, 104);
    doc.text(`School Name: ${data.schoolName}`, 25, 112);

    doc.setFont('helvetica', 'bold');
    doc.text('GUARDIAN INFORMATION', 20, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(`Parent/Guardian Name: ${data.parentName}`, 25, 140);
    doc.text(`Mobile Number: ${data.phone}`, 25, 148);
    doc.text(`Email Address: ${data.email}`, 25, 156);
    doc.setFontSize(10);
    doc.text('Residential Address:', 25, 164);
    const splitAddress = doc.splitTextToSize(data.address, 160);
    doc.text(splitAddress, 25, 170);

    // Footer
    doc.setDrawColor(26, 51, 40);
    doc.line(20, 260, 190, 260);
    doc.setFontSize(9);
    doc.text('This is a computer-generated document from Iqra Classes Admission Portal.', 105, 270, { align: 'center' });
    doc.text('Contact: +91 8956578956 | Email: kumtheafaan@gmail.com', 105, 275, { align: 'center' });

    return doc;
  };

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

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      // 1. Save to DB
      dbService.saveAdmission(admissionForm);
      setAdmissions(dbService.getAdmissions());
      
      // 2. Generate PDF and Download
      const doc = generateAdmissionPDF(admissionForm);
      doc.save(`Admission_${admissionForm.studentName.replace(/\s+/g, '_')}.pdf`);

      // 3. Prepare Email Notification
      const subject = `New Admission Application - ${admissionForm.studentName}`;
      const body = `Hello Administration,\n\nA new admission application has been submitted.\n\nI have attached/downloaded the PDF application form.\n\nStudent Name: ${admissionForm.studentName}\nGrade: ${admissionForm.grade}\nParent: ${admissionForm.parentName}\nPhone: ${admissionForm.phone}\n\nPlease check the Staff Portal for full details.\n\nRegards,\nIqra Classes Automated System`;
      
      const mailtoLink = `mailto:kumtheafaan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form
      setAdmissionForm({
        studentName: '',
        dob: '',
        gender: '',
        grade: '',
        schoolName: '',
        parentName: '',
        phone: '',
        email: '',
        address: ''
      });

      // Show alert and then trigger mailto
      alert("Application saved! A PDF copy has been downloaded. Please send the generated email with the PDF attached.");
      window.location.href = mailtoLink;
    }, 1500);
  };

  const handleQuickInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const data = new FormData(target);
    
    const parentName = data.get('parent') as string;
    const email = data.get('email') as string;
    const phone = data.get('phone') as string;
    const grade = data.get('grade') as string;

    dbService.saveInquiry({ parentName, email, phone, grade });
    setInquiries(dbService.getInquiries());

    const subject = `New Inquiry for Iqra Classes - ${parentName}`;
    const body = `Hello Administration,\n\nYou have a new inquiry from the website:\n\nParent Name: ${parentName}\nEmail: ${email}\nPhone: ${phone}\nGrade: ${grade}\n\nPlease follow up accordingly.`;
    
    const mailtoLink = `mailto:kumtheafaan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    target.reset();
    alert('Thank you! Your inquiry has been saved and your email client has been opened.');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all records? This cannot be undone.')) {
      dbService.clearAll();
      setAdmissions([]);
      setInquiries([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-dark border-b border-brand-gold/10 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                   <GraduationCap className="text-brand-dark w-8 h-8" />
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
              <button 
                onClick={() => setIsAdmissionModalOpen(true)}
                className="bg-brand-gold hover:bg-white text-brand-dark px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-gold/10"
              >
                Enroll Now
              </button>
            </div>

            <button 
              className="md:hidden p-2 text-brand-gold"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

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
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                setIsAdmissionModalOpen(true);
              }}
              className="w-full bg-brand-gold text-brand-dark px-6 py-4 rounded-xl font-black uppercase tracking-widest"
            >
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
                <GraduationCap size={18} className="text-brand-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                  Nurturing Future Leaders
                </span>
              </div>
              <h1 className="text-5xl lg:text-8xl font-black font-serif leading-[1.1] tracking-tighter">
                Excellence in <br />
                <span className="text-brand-gold italic">Education.</span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Empowering students from Nursery to 8th Standard with a balanced approach to learning, focusing on individual potential and character building.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                <button 
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="bg-brand-gold hover:bg-white text-brand-dark px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-brand-gold/10 flex items-center gap-3 active:scale-95"
                >
                  Admission Form <ChevronRight size={20} />
                </button>
                <a 
                  href="#classes"
                  className="bg-transparent border-2 border-white/10 hover:border-brand-gold text-white px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center"
                >
                  Browse Curriculum
                </a>
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
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setIsAdminOpen(false)}></div>
          <div className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-brand-dark p-8 flex items-center justify-between text-white shrink-0 border-b border-brand-gold/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-brand-dark shadow-xl">
                   <LayoutDashboard size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-serif font-black italic text-brand-gold leading-none">Staff Dashboard</h3>
                   <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-1">Manage Submissions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} /> Clear All
                </button>
                <button onClick={() => setIsAdminOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex bg-slate-50 border-b border-slate-200">
               <button onClick={() => setAdminTab('admissions')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${adminTab === 'admissions' ? 'bg-white text-brand-dark border-b-2 border-brand-gold' : 'text-slate-400 hover:text-slate-600'}`}>
                 Admission Forms ({admissions.length})
               </button>
               <button onClick={() => setAdminTab('inquiries')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${adminTab === 'inquiries' ? 'bg-white text-brand-dark border-b-2 border-brand-gold' : 'text-slate-400 hover:text-slate-600'}`}>
                 Inquiries ({inquiries.length})
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {adminTab === 'admissions' ? (
                <div className="space-y-4">
                  {admissions.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 font-medium italic">No applications received yet.</div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <tr>
                            <th className="px-6 py-4">Student / Grade</th>
                            <th className="px-6 py-4">Parent / Contact</th>
                            <th className="px-6 py-4">Actions</th>
                            <th className="px-6 py-4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {admissions.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-6">
                                <p className="font-serif font-black italic text-brand-dark text-lg leading-none">{app.studentName}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-dark text-[10px] font-black rounded uppercase tracking-tighter">{app.grade}</span>
                                </div>
                              </td>
                              <td className="px-6 py-6">
                                <p className="font-bold text-slate-700">{app.parentName}</p>
                                <p className="text-xs text-slate-400 mt-1">{app.phone}</p>
                              </td>
                              <td className="px-6 py-6">
                                <button 
                                  onClick={() => generateAdmissionPDF(app).save(`Admin_Copy_${app.studentName.replace(/\s+/g, '_')}.pdf`)}
                                  className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-brand-gold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all"
                                >
                                  <FileText size={14} /> PDF
                                </button>
                              </td>
                              <td className="px-6 py-6">
                                <p className="text-xs font-mono text-slate-400">{new Date(app.timestamp).toLocaleDateString()}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 font-medium italic">No inquiries received yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 relative group hover:border-brand-gold transition-all">
                          <div className="flex justify-between items-start">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-gold shadow-sm border border-slate-100">
                                <Mail size={18} />
                             </div>
                             <span className="text-[9px] font-mono text-slate-400">{new Date(inq.timestamp).toLocaleString()}</span>
                          </div>
                          <div>
                            <p className="font-serif font-black italic text-brand-dark text-xl">{inq.parentName}</p>
                            <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-1">Inquiry for {inq.grade}</p>
                            <p className="text-xs text-slate-500 mt-2 font-bold">{inq.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admission Modal */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" onClick={() => { setIsAdmissionModalOpen(false); setIsSuccess(false); }}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-brand-dark p-8 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-brand-dark shadow-xl">
                   <ClipboardList size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-serif font-black italic text-brand-gold leading-none">Admission Application</h3>
                   <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-1">PDF Generation Enabled</p>
                </div>
              </div>
              <button onClick={() => { setIsAdmissionModalOpen(false); setIsSuccess(false); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
              {isSuccess ? (
                <div className="text-center py-20 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-black italic text-brand-dark">Submission Successful!</h2>
                    <p className="text-slate-500 max-w-md mx-auto font-medium">
                      Your admission PDF has been generated and downloaded. A copy of this detail has also been prepared for email to the administration.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => { setIsAdmissionModalOpen(false); setIsSuccess(false); }}
                      className="bg-brand-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark transition-all"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAdmissionSubmit} className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <User size={18} className="text-brand-gold" />
                      <h4 className="font-serif font-black italic text-brand-dark text-xl">Student Information</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Full Name</label>
                        <input required type="text" placeholder="Student's complete name" value={admissionForm.studentName} onChange={(e) => setAdmissionForm({...admissionForm, studentName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Date of Birth</label>
                          <input required type="date" value={admissionForm.dob} onChange={(e) => setAdmissionForm({...admissionForm, dob: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Gender</label>
                          <select required value={admissionForm.gender} onChange={(e) => setAdmissionForm({...admissionForm, gender: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800 appearance-none">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Grade Applying For</label>
                        <select required value={admissionForm.grade} onChange={(e) => setAdmissionForm({...admissionForm, grade: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800 appearance-none">
                          <option value="">Choose Grade</option>
                          <option value="Nursery">Nursery</option>
                          <option value="LKG">LKG</option>
                          <option value="UKG">UKG</option>
                          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={`Grade ${n}`}>Grade {n}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">School Name</label>
                        <input type="text" placeholder="Enter current/previous school" value={admissionForm.schoolName} onChange={(e) => setAdmissionForm({...admissionForm, schoolName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <Users size={18} className="text-brand-gold" />
                      <h4 className="font-serif font-black italic text-brand-dark text-xl">Guardian Information</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Parent Name</label>
                        <input required type="text" placeholder="Guardian's name" value={admissionForm.parentName} onChange={(e) => setAdmissionForm({...admissionForm, parentName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Mobile Number</label>
                        <input required type="tel" placeholder="Contact number" value={admissionForm.phone} onChange={(e) => setAdmissionForm({...admissionForm, phone: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Email Address</label>
                        <input required type="email" placeholder="Email for updates" value={admissionForm.email} onChange={(e) => setAdmissionForm({...admissionForm, email: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Residential Address</label>
                      <textarea required rows={3} placeholder="Complete home address" value={admissionForm.address} onChange={(e) => setAdmissionForm({...admissionForm, address: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all font-bold text-slate-800 resize-none"></textarea>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-brand-dark text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-brand-gold hover:text-brand-dark transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-300">
                      {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Generating Application PDF...</> : <><Download size={18} /> Submit & Generate PDF</>}
                    </button>
                    <p className="text-center text-[9px] uppercase font-black tracking-widest text-slate-400 mt-6">
                      A PDF will be generated and downloaded automatically upon submission.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Content (Reuse sections from current App.tsx) */}
      <section className="py-24 bg-white relative z-10 -mt-16 rounded-t-[80px] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <GraduationCap size={40} />, title: 'Dedicated Faculty', text: 'Our educators are passionate specialists focused on early and primary childhood development.' },
              { icon: <Monitor size={40} />, title: 'Modern Facilities', text: 'Smart-enabled classroom setups designed for an engaging and interactive learning experience.' },
              { icon: <Users size={40} />, title: 'Small Batch Sizes', text: 'We maintain low student-to-teacher ratios to ensure personalized guidance for every child.' }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[40px] bg-slate-50 hover:bg-brand-dark hover:text-white transition-all duration-500 hover:-translate-y-4 shadow-sm border border-transparent hover:border-brand-gold/20">
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
                Iqra Classes is founded on the principle that learning should be a journey of discovery, not just rote memorization. We integrate high standards of excellence into every aspect of our curriculum.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: 'Holistic Methodology', desc: 'Techniques that prioritize understanding and deep learning.' },
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
              <button onClick={() => setIsAdmissionModalOpen(true)} className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center gap-2 active:scale-95">
                Enroll Now <ChevronRight size={20} />
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

                <div className="flex items-center gap-8 group">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                    <Phone size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Direct Call</p>
                    <a href="tel:+918956578956" className="text-2xl font-serif font-black italic hover:text-brand-gold transition-colors">
                      +91 8956578956
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[60px] p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-4xl font-serif font-black mb-10 italic text-brand-dark">Quick Inquiry.</h3>
              <form onSubmit={handleQuickInquiry} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Parent Name</label>
                   <input required name="parent" type="text" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all text-slate-900 font-bold" placeholder="Enter full name" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Email Address</label>
                    <input required name="email" type="email" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all text-slate-900 font-bold" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Mobile Number</label>
                    <input required name="phone" type="tel" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all text-slate-900 font-bold" placeholder="Parent phone" />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-2">Grade Applying For</label>
                   <select required name="grade" className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-brand-gold transition-all text-slate-900 font-bold appearance-none">
                     <option value="">Select Option</option>
                     <option value="Nursery - UKG">Nursery - UKG</option>
                     <option value="Grade 1 - 5">Grade 1 - 5</option>
                     <option value="Grade 6 - 8">Grade 6 - 8</option>
                   </select>
                </div>
                <button type="submit" className="w-full bg-brand-dark text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-brand-gold hover:text-brand-dark transition-all shadow-2xl active:scale-95">
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
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 border border-brand-gold/30">
                    <GraduationCap className="text-brand-dark w-8 h-8" />
                 </div>
                 <span className="text-3xl font-serif font-black italic text-white tracking-tighter italic uppercase">IQRA CLASSES</span>
              </div>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-gold italic text-center md:text-left">Your Child's Future is Our Priority</p>
            </div>
            
            <div className="flex gap-10 font-black text-[10px] uppercase tracking-widest">
              <a href="#" className="hover:text-brand-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Legal</a>
              <a href="#contact" className="hover:text-brand-gold transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] opacity-30 text-center">
            <p>© {new Date().getFullYear()} IQRA CLASSES. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-4">
               <p>AN ACADEMY FOR THE LEADERS OF TOMORROW.</p>
               <button onClick={() => setIsAdminOpen(true)} className="hover:text-brand-gold transition-colors flex items-center gap-1 group">
                 <Database size={10} className="group-hover:animate-pulse" /> STAFF PORTAL
               </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat UI */}
      <div className="fixed bottom-10 right-10 z-[100]">
        {!isChatOpen ? (
          <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 bg-brand-gold text-brand-dark rounded-full shadow-[0_20px_50px_rgba(220,199,157,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 border-white">
            <Bot size={32} />
          </button>
        ) : (
          <div className="bg-white w-[380px] h-[600px] rounded-[50px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-brand-dark p-8 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-dark shadow-xl"><Bot size={28} /></div>
                <div>
                  <h4 className="font-serif font-black italic text-brand-gold leading-none">Iqra AI Tutor</h4>
                  <span className="text-[10px] text-white/40 flex items-center gap-2 mt-2 font-black uppercase tracking-widest">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Gemini 3 Pro Active
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-10 px-4 space-y-8">
                  <div className="w-24 h-24 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto border-2 border-brand-gold/20"><GraduationCap size={48} /></div>
                  <h5 className="font-serif font-black italic text-2xl text-brand-dark">How can I help you today?</h5>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-[30px] text-sm leading-relaxed font-medium ${msg.role === 'user' ? 'bg-brand-dark text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex justify-start"><Loader2 className="animate-spin text-brand-gold" size={16} /></div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." className="w-full bg-slate-100 border-none rounded-3xl pl-8 pr-16 py-5 text-sm font-bold focus:ring-2 focus:ring-brand-dark transition-all" />
                <button type="submit" className="absolute right-2 p-4 bg-brand-dark text-brand-gold rounded-2xl shadow-xl shadow-brand-dark/20"><Send size={20} /></button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
