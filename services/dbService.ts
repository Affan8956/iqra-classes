
export interface Inquiry {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  grade: string;
  timestamp: number;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  dob: string;
  gender: string;
  grade: string;
  schoolName: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  timestamp: number;
}

const INQUIRY_KEY = 'iqra_classes_inquiries';
const ADMISSION_KEY = 'iqra_classes_admissions';

export const dbService = {
  saveInquiry: (inquiry: Omit<Inquiry, 'id' | 'timestamp'>): void => {
    const inquiries = dbService.getInquiries();
    const newInquiry: Inquiry = {
      ...inquiry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    inquiries.push(newInquiry);
    localStorage.setItem(INQUIRY_KEY, JSON.stringify(inquiries));
  },

  getInquiries: (): Inquiry[] => {
    const data = localStorage.getItem(INQUIRY_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAdmission: (admission: Omit<AdmissionApplication, 'id' | 'timestamp'>): void => {
    const admissions = dbService.getAdmissions();
    const newAdmission: AdmissionApplication = {
      ...admission,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    admissions.push(newAdmission);
    localStorage.setItem(ADMISSION_KEY, JSON.stringify(admissions));
  },

  getAdmissions: (): AdmissionApplication[] => {
    const data = localStorage.getItem(ADMISSION_KEY);
    return data ? JSON.parse(data) : [];
  },

  clearAll: (): void => {
    localStorage.removeItem(INQUIRY_KEY);
    localStorage.removeItem(ADMISSION_KEY);
  }
};
