
export interface NavItem {
  label: string;
  href: string;
}

export interface ClassGrade {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  subjects: string[];
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
