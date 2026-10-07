import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Plaintext for college project demo clarity
  role: 'user' | 'admin';
  location: string;
  avatar?: string;
  created_at: string;
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
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string | null;
  user_name: string;
  project_id: string;
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

export interface DatabaseSchema {
  users: User[];
  projects: Project[];
  donations: Donation[];
  volunteers: Volunteer[];
  project_updates: ProjectUpdate[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'community_action.json');

// Realistic college project sample initial dataset
const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'u-admin-1',
      name: 'Dr. Anita Roy',
      email: 'admin@community.org',
      password: 'admin123',
      role: 'admin',
      location: 'Central District, City Center',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      created_at: '2026-09-01T10:00:00Z',
    },
    {
      id: 'u-user-1',
      name: 'Aarav Sharma',
      email: 'aarav@citizen.org',
      password: 'user123',
      role: 'user',
      location: 'North Ward, Green Valley',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      created_at: '2026-09-10T11:30:00Z',
    },
    {
      id: 'u-user-2',
      name: 'Priya Patel',
      email: 'priya@citizen.org',
      password: 'user123',
      role: 'user',
      location: 'South Extension, Riverside',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      created_at: '2026-09-15T14:15:00Z',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      creator_id: 'u-user-1',
      creator_name: 'Aarav Sharma',
      title: 'City Park Needs Cleaning & Waste Bins',
      description: 'Our neighborhood park has suffered from littering and lack of proper segregation bins. We want to organize a mass cleanup drive, install 6 weatherproof recycling bins, and plant flower beds along the walking trail.',
      category: 'Environment',
      location: 'Green Valley Community Park, North Ward',
      latitude: 19.0760,
      longitude: 72.8777,
      funding_goal: 15000,
      amount_raised: 11200,
      deadline: '2026-11-15',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      volunteers_needed: 25,
      volunteer_skills_needed: 'Trash collection, gardening, waste segregation, physical stamina',
      created_at: '2026-09-18T08:00:00Z',
    },
    {
      id: 'proj-2',
      creator_id: 'u-user-2',
      creator_name: 'Priya Patel',
      title: 'Local Primary School Needs Storybooks & Reading Corner',
      description: 'The Government Primary School in Riverside currently lacks children books for grades 1-5. We aim to set up an inviting library corner with 200+ illustrated storybooks, small beanbags, and sturdy wooden shelves.',
      category: 'Education',
      location: 'Riverside Govt Primary School, South Extension',
      latitude: 19.0820,
      longitude: 72.8950,
      funding_goal: 20000,
      amount_raised: 20000,
      deadline: '2026-10-30',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
      status: 'funded',
      volunteers_needed: 10,
      volunteer_skills_needed: 'Book cataloging, reading aloud to children, painting library wall murals',
      created_at: '2026-09-20T09:30:00Z',
    },
    {
      id: 'proj-3',
      creator_id: 'u-admin-1',
      creator_name: 'Dr. Anita Roy',
      title: 'Community Center Needs 5 Refurbished Computers',
      description: 'Underprivileged youth in our locality need digital literacy access. We want to procure 5 refurbished desktop computers, mice, keyboards, and basic internet connectivity for open evening study sessions.',
      category: 'Community',
      location: 'East Ward Civic Community Center, Market Road',
      latitude: 19.0650,
      longitude: 72.8600,
      funding_goal: 45000,
      amount_raised: 27500,
      deadline: '2026-11-20',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      volunteers_needed: 6,
      volunteer_skills_needed: 'Computer setup, basic MS Office/typing tutoring, hardware cabling',
      created_at: '2026-09-22T12:00:00Z',
    },
    {
      id: 'proj-4',
      creator_id: 'u-user-1',
      creator_name: 'Aarav Sharma',
      title: 'Plant 150 Native Shade Trees in Neighborhood',
      description: 'With rising summer heat, our streets need green canopy. We are coordinating with local authorities to plant 150 native neem, peepal, and gulmohar saplings with protective tree guards.',
      category: 'Environment',
      location: 'Old Cantonment Avenue & 4th Crossway',
      latitude: 19.0900,
      longitude: 72.8700,
      funding_goal: 18000,
      amount_raised: 7500,
      deadline: '2026-11-05',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      volunteers_needed: 30,
      volunteer_skills_needed: 'Digging pits, sapling handling, watering coordination',
      created_at: '2026-09-25T15:20:00Z',
    },
    {
      id: 'proj-5',
      creator_id: 'u-user-2',
      creator_name: 'Priya Patel',
      title: 'Renovate the Local Children Playground',
      description: 'The swing sets are rusted and the rubber safety tiles have degraded. We need funds to sandblast the frames, install two new safety swings, a seesaw, and safe child-friendly cushioning.',
      category: 'Infrastructure',
      location: 'Railway Colony Public Ground, West Sector',
      latitude: 19.0550,
      longitude: 72.8450,
      funding_goal: 35000,
      amount_raised: 18900,
      deadline: '2026-11-10',
      image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80',
      status: 'urgent',
      volunteers_needed: 15,
      volunteer_skills_needed: 'Carpentry, metal painting, safety inspection, weekend supervision',
      created_at: '2026-09-28T10:45:00Z',
    },
    {
      id: 'proj-6',
      creator_id: 'u-admin-1',
      creator_name: 'Dr. Anita Roy',
      title: 'Free Health & Eye Checkup Camp for Senior Citizens',
      description: 'Organizing a comprehensive weekend medical health screening camp including eye checkups, blood sugar testing, and free reading glasses distribution for over 150 elderly neighborhood residents.',
      category: 'Health',
      location: 'Community Hall, Sunshine Senior Housing Society',
      latitude: 19.0710,
      longitude: 72.8890,
      funding_goal: 22000,
      amount_raised: 16500,
      deadline: '2026-10-25',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
      status: 'urgent',
      volunteers_needed: 12,
      volunteer_skills_needed: 'Registration assistance, queue management, guiding seniors, hospitality',
      created_at: '2026-10-01T09:00:00Z',
    },
  ],
  donations: [
    {
      id: 'don-1',
      user_id: 'u-user-2',
      user_name: 'Priya Patel',
      project_id: 'proj-1',
      amount: 1500,
      message: 'Great initiative! Happy to contribute for clean parks.',
      payment_method: 'UPI Demo',
      created_at: '2026-09-19T14:20:00Z',
    },
    {
      id: 'don-2',
      user_id: 'u-admin-1',
      user_name: 'Dr. Anita Roy',
      project_id: 'proj-1',
      amount: 2500,
      message: 'Supporting sustainable waste segregation in our city.',
      payment_method: 'Card Demo',
      created_at: '2026-09-20T16:00:00Z',
    },
    {
      id: 'don-3',
      user_id: 'u-user-1',
      user_name: 'Aarav Sharma',
      project_id: 'proj-2',
      amount: 5000,
      message: 'For the children library books! Knowledge empowers all.',
      payment_method: 'UPI Demo',
      created_at: '2026-09-21T11:00:00Z',
    },
    {
      id: 'don-4',
      user_id: null,
      user_name: 'Kavita Deshmukh',
      project_id: 'proj-3',
      amount: 5000,
      message: 'Happy to support digital skills for young learners.',
      payment_method: 'NetBanking Demo',
      created_at: '2026-09-23T10:10:00Z',
    },
    {
      id: 'don-5',
      user_id: 'u-user-1',
      user_name: 'Aarav Sharma',
      project_id: 'proj-5',
      amount: 3000,
      message: 'Our neighborhood kids deserve safe swings and play space.',
      payment_method: 'UPI Demo',
      created_at: '2026-09-29T18:30:00Z',
    },
  ],
  volunteers: [
    {
      id: 'vol-1',
      user_id: 'u-user-2',
      user_name: 'Priya Patel',
      email: 'priya@citizen.org',
      phone: '+91 98201 54321',
      project_id: 'proj-1',
      skills: 'Waste segregation, event management',
      availability: 'Sunday mornings',
      status: 'approved',
      created_at: '2026-09-19T10:00:00Z',
    },
    {
      id: 'vol-2',
      user_id: 'u-user-1',
      user_name: 'Aarav Sharma',
      email: 'aarav@citizen.org',
      phone: '+91 98111 23456',
      project_id: 'proj-2',
      skills: 'Storytelling, book organization',
      availability: 'Weekends',
      status: 'approved',
      created_at: '2026-09-21T09:15:00Z',
    },
    {
      id: 'vol-3',
      user_id: null,
      user_name: 'Rohan Mehra',
      email: 'rohan.m@college.edu',
      phone: '+91 98450 99887',
      project_id: 'proj-1',
      skills: 'Gardening, heavy lifting',
      availability: 'Full weekend',
      status: 'registered',
      created_at: '2026-09-22T13:40:00Z',
    },
    {
      id: 'vol-4',
      user_id: 'u-user-2',
      user_name: 'Priya Patel',
      email: 'priya@citizen.org',
      phone: '+91 98201 54321',
      project_id: 'proj-6',
      skills: 'Registration management, first aid certified',
      availability: 'Saturday morning',
      status: 'approved',
      created_at: '2026-10-02T11:00:00Z',
    },
  ],
  project_updates: [
    {
      id: 'upd-1',
      project_id: 'proj-1',
      title: 'Dustbin procurement vendor finalized!',
      description: 'We have negotiated a 15% community discount with a local manufacturer for 6 high-density weatherproof segregation bins. Cleanup drive scheduled for next weekend!',
      created_at: '2026-09-24T10:00:00Z',
    },
    {
      id: 'upd-2',
      project_id: 'proj-2',
      title: 'Target reached! Book purchase underway',
      description: 'Thank you generous community! We have reached our 100% funding goal of ₹20,000. Book cataloging starts this Thursday at Riverside School.',
      created_at: '2026-10-01T15:30:00Z',
    },
  ],
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading database file, initializing sample data:', e);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing to database file:', e);
    }
  }

  public resetToSampleData(): DatabaseSchema {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData(this.data);
    return this.data;
  }

  // User operations
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'created_at'>): User {
    const newUser: User = {
      ...user,
      id: 'u-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  // Project operations
  public getProjects(): Project[] {
    return this.data.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.data.projects.find(p => p.id === id);
  }

  public createProject(project: Omit<Project, 'id' | 'amount_raised' | 'status' | 'created_at'>): Project {
    const newProject: Project = {
      ...project,
      id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      amount_raised: 0,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    this.data.projects.unshift(newProject);
    this.saveData(this.data);
    return newProject;
  }

  public deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    // Also cleanup associated donations, volunteers, and updates
    this.data.donations = this.data.donations.filter(d => d.project_id !== id);
    this.data.volunteers = this.data.volunteers.filter(v => v.project_id !== id);
    this.data.project_updates = this.data.project_updates.filter(u => u.project_id !== id);
    this.saveData(this.data);
    return this.data.projects.length < initialLen;
  }

  // Donation operations
  public getDonations(): Donation[] {
    return this.data.donations;
  }

  public getDonationsByProjectId(projectId: string): Donation[] {
    return this.data.donations.filter(d => d.project_id === projectId);
  }

  public getDonationsByUserId(userId: string): Donation[] {
    return this.data.donations.filter(d => d.user_id === userId);
  }

  public addDonation(params: {
    userId?: string | null;
    userName: string;
    projectId: string;
    amount: number;
    message?: string;
    paymentMethod?: string;
  }): { donation: Donation; project: Project } {
    const project = this.getProjectById(params.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const donation: Donation = {
      id: 'don-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      user_id: params.userId || null,
      user_name: params.userName || 'Anonymous Supporter',
      project_id: params.projectId,
      amount: Number(params.amount),
      message: params.message || 'Proud to support this community project!',
      payment_method: params.paymentMethod || 'Demo Payment',
      created_at: new Date().toISOString(),
    };

    project.amount_raised += donation.amount;
    if (project.amount_raised >= project.funding_goal) {
      project.status = 'funded';
    }

    this.data.donations.unshift(donation);
    this.saveData(this.data);

    return { donation, project };
  }

  // Volunteer operations
  public getVolunteers(): Volunteer[] {
    return this.data.volunteers;
  }

  public getVolunteersByProjectId(projectId: string): Volunteer[] {
    return this.data.volunteers.filter(v => v.project_id === projectId);
  }

  public getVolunteersByUserId(userId: string): Volunteer[] {
    return this.data.volunteers.filter(v => v.user_id === userId);
  }

  public addVolunteer(params: {
    userId?: string | null;
    userName: string;
    email: string;
    phone: string;
    projectId: string;
    skills: string;
    availability: string;
  }): Volunteer {
    const project = this.getProjectById(params.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const volunteer: Volunteer = {
      id: 'vol-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      user_id: params.userId || null,
      user_name: params.userName,
      email: params.email,
      phone: params.phone,
      project_id: params.projectId,
      skills: params.skills,
      availability: params.availability,
      status: 'registered',
      created_at: new Date().toISOString(),
    };

    this.data.volunteers.unshift(volunteer);
    this.saveData(this.data);
    return volunteer;
  }

  public updateVolunteerStatus(id: string, status: 'registered' | 'approved'): Volunteer | undefined {
    const vol = this.data.volunteers.find(v => v.id === id);
    if (vol) {
      vol.status = status;
      this.saveData(this.data);
    }
    return vol;
  }

  // Project updates operations
  public getUpdatesByProjectId(projectId: string): ProjectUpdate[] {
    return this.data.project_updates.filter(u => u.project_id === projectId);
  }

  public addProjectUpdate(projectId: string, title: string, description: string): ProjectUpdate {
    const update: ProjectUpdate = {
      id: 'upd-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      project_id: projectId,
      title,
      description,
      created_at: new Date().toISOString(),
    };
    this.data.project_updates.unshift(update);
    this.saveData(this.data);
    return update;
  }

  // System stats summary
  public getSummaryStats() {
    const totalProjects = this.data.projects.length;
    const totalRaised = this.data.projects.reduce((sum, p) => sum + p.amount_raised, 0);
    const totalVolunteers = this.data.volunteers.length;
    const totalUsers = this.data.users.length;
    const totalDonations = this.data.donations.length;
    const fundedProjects = this.data.projects.filter(p => p.amount_raised >= p.funding_goal).length;

    return {
      totalProjects,
      totalRaised,
      totalVolunteers,
      totalUsers,
      totalDonations,
      fundedProjects,
      communitiesHelped: Math.max(totalProjects, 14),
    };
  }
}

export const db = new Database();
