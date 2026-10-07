import { Router } from 'express';
import { db } from './db.js';

export const apiRouter = Router();

// ==========================================
// 1. Authentication & Users
// ==========================================

// Register
apiRouter.post('/auth/register', (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = db.createUser({
      name,
      email,
      password,
      role: 'user',
      location: location || 'City Neighborhood',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Login
apiRouter.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Demo accounts list for fast testing/switching
apiRouter.get('/auth/demo-accounts', (_req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    location: u.location,
    avatar: u.avatar,
  }));
  return res.json({ demoAccounts: users });
});

// ==========================================
// 2. Projects
// ==========================================

// Get all projects with filters & search
apiRouter.get('/projects', (req, res) => {
  try {
    let projects = db.getProjects();
    const { category, status, search, location } = req.query;

    if (category && category !== 'All') {
      projects = projects.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (status && status !== 'All') {
      projects = projects.filter(p => p.status.toLowerCase() === String(status).toLowerCase());
    }

    if (location && String(location).trim()) {
      const loc = String(location).toLowerCase();
      projects = projects.filter(p => p.location.toLowerCase().includes(loc));
    }

    if (search && String(search).trim()) {
      const q = String(search).toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.creator_name.toLowerCase().includes(q)
      );
    }

    // Attach current volunteer count & donations count to each project
    const projectsWithCounts = projects.map(p => {
      const volunteersCount = db.getVolunteersByProjectId(p.id).length;
      const donationsCount = db.getDonationsByProjectId(p.id).length;
      return {
        ...p,
        volunteers_count: volunteersCount,
        donations_count: donationsCount,
      };
    });

    return res.json({ projects: projectsWithCounts });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get single project with detailed relationships
apiRouter.get('/projects/:id', (req, res) => {
  try {
    const project = db.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const donations = db.getDonationsByProjectId(project.id);
    const volunteers = db.getVolunteersByProjectId(project.id);
    const updates = db.getUpdatesByProjectId(project.id);

    return res.json({
      project: {
        ...project,
        volunteers_count: volunteers.length,
        donations_count: donations.length,
      },
      donations,
      volunteers,
      updates,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new project
apiRouter.post('/projects', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      funding_goal,
      deadline,
      location,
      latitude,
      longitude,
      image,
      volunteers_needed,
      volunteer_skills_needed,
      creator_id,
      creator_name,
    } = req.body;

    if (!title || !description || !funding_goal || !deadline || !location) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newProject = db.createProject({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Community',
      funding_goal: Number(funding_goal),
      deadline,
      location: location.trim(),
      latitude: Number(latitude) || 19.0760,
      longitude: Number(longitude) || 72.8777,
      image: image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      volunteers_needed: Number(volunteers_needed) || 5,
      volunteer_skills_needed: volunteer_skills_needed || 'General assistance',
      creator_id: creator_id || 'anonymous',
      creator_name: creator_name || 'Community Member',
    });

    return res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete project (Admin or Creator)
apiRouter.delete('/projects/:id', (req, res) => {
  try {
    const success = db.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ message: 'Project removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. Funding / Donations (Mock Payment)
// ==========================================

apiRouter.post('/projects/:id/donations', (req, res) => {
  try {
    const { amount, userName, userId, message, paymentMethod } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Please enter a valid donation amount greater than 0' });
    }

    const result = db.addDonation({
      projectId: req.params.id,
      amount: Number(amount),
      userName: userName || 'Generous Supporter',
      userId: userId || null,
      message: message || 'Supporting this community cause!',
      paymentMethod: paymentMethod || 'Demo Payment',
    });

    return res.status(201).json({
      message: `Donation successful! You contributed ₹${result.donation.amount.toLocaleString()} to "${result.project.title}".`,
      donation: result.donation,
      project: result.project,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// ==========================================
// 4. Volunteering
// ==========================================

apiRouter.post('/projects/:id/volunteers', (req, res) => {
  try {
    const { userName, email, phone, skills, availability, userId } = req.body;

    if (!userName || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone number are required' });
    }

    const volunteer = db.addVolunteer({
      projectId: req.params.id,
      userName: userName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      skills: skills || 'General volunteering & event support',
      availability: availability || 'Flexible / Weekends',
      userId: userId || null,
    });

    return res.status(201).json({
      message: 'Your volunteer request has been submitted successfully.',
      volunteer,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// ==========================================
// 5. Project Updates
// ==========================================

apiRouter.post('/projects/:id/updates', (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Update title and description are required' });
    }

    const update = db.addProjectUpdate(req.params.id, title, description);
    return res.status(201).json({
      message: 'Project update published successfully',
      update,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// ==========================================
// 6. User Dashboard Data
// ==========================================

apiRouter.get('/user/dashboard/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const user = db.getUserById(userId);

    // My projects
    const allProjects = db.getProjects();
    const myProjects = allProjects.filter(p => p.creator_id === userId);

    // My donations
    const myDonations = db.getDonationsByUserId(userId).map(d => {
      const proj = db.getProjectById(d.project_id);
      return {
        ...d,
        project_title: proj ? proj.title : 'Community Project',
      };
    });

    // My volunteering
    const myVolunteering = db.getVolunteersByUserId(userId).map(v => {
      const proj = db.getProjectById(v.project_id);
      return {
        ...v,
        project_title: proj ? proj.title : 'Community Project',
        project_location: proj ? proj.location : '',
      };
    });

    const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);

    return res.json({
      user,
      stats: {
        projectsCreated: myProjects.length,
        totalDonated,
        volunteerProjects: myVolunteering.length,
      },
      myProjects,
      myDonations,
      myVolunteering,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 7. Admin Overview & Management
// ==========================================

apiRouter.get('/admin/overview', (_req, res) => {
  try {
    const stats = db.getSummaryStats();
    const users = db.getUsers().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      location: u.location,
      created_at: u.created_at,
    }));

    const projects = db.getProjects().map(p => ({
      ...p,
      volunteers_count: db.getVolunteersByProjectId(p.id).length,
      donations_count: db.getDonationsByProjectId(p.id).length,
    }));

    const donations = db.getDonations().map(d => {
      const proj = db.getProjectById(d.project_id);
      return {
        ...d,
        project_title: proj ? proj.title : 'Community Project',
      };
    });

    const volunteers = db.getVolunteers().map(v => {
      const proj = db.getProjectById(v.project_id);
      return {
        ...v,
        project_title: proj ? proj.title : 'Community Project',
      };
    });

    return res.json({
      stats,
      users,
      projects,
      donations,
      volunteers,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update volunteer status (Admin action)
apiRouter.post('/admin/volunteers/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateVolunteerStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    return res.json({ message: 'Volunteer status updated', volunteer: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Reset demo database to initial sample data
apiRouter.post('/admin/reset-demo', (_req, res) => {
  try {
    const data = db.resetToSampleData();
    return res.json({
      message: 'Database has been successfully restored to pristine demo state!',
      stats: db.getSummaryStats(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Public Homepage Summary Stats
apiRouter.get('/stats/overview', (_req, res) => {
  return res.json(db.getSummaryStats());
});
