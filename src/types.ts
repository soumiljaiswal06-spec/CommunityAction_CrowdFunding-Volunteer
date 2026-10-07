export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  location: string;
  avatar?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  creator_id: string;
  creator_name: string;
  title: string;
  description: string;
  category: 'Environment' | 'Education' | 'Community' | 'Health' | 'Infrastructure' | 'Animal Welfare';
  location: string;
  latitude: number;
  longitude: number;
  funding_goal: number;
  amount_raised: number;
  deadline: string;
  image: string;
  status: 'active' | 'funded' | 'urgent';
  volunteers_needed: number;
  volunteer_skills_needed: string;
  volunteers_count?: number;
  donations_count?: number;
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string | null;
  user_name: string;
  project_id: string;
  project_title?: string;
  amount: number;
  message: string;
  payment_method: string;
  created_at: string;
}

export interface Volunteer {
  id: string;
  user_id: string | null;
  user_name: string;
  email: string;
  phone: string;
  project_id: string;
  project_title?: string;
  project_location?: string;
  skills: string;
  availability: string;
  status: 'registered' | 'approved';
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface SummaryStats {
  totalProjects: number;
  totalRaised: number;
  totalVolunteers: number;
  totalUsers: number;
  totalDonations: number;
  fundedProjects: number;
  communitiesHelped: number;
}
