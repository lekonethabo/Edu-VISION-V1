// Simulated API endpoints for Super Admin Dashboard

// Mock Data
export const mockData = {
  stats: {
    totalSchools: 1842,
    totalEnrolment: 636300,
    teachingStaff: 28450,
    systemUsers: 1248,
    dataCompleteness: 94.2,
    systemHealth: 99.9,
  },
  enrolmentTrends: [
    { year: "2020", primary: 345000, secondary: 185000, ecce: 25000 },
    { year: "2021", primary: 348000, secondary: 188000, ecce: 28000 },
    { year: "2022", primary: 351000, secondary: 192000, ecce: 32000 },
    { year: "2023", primary: 355000, secondary: 198000, ecce: 38000 },
    { year: "2024", primary: 360000, secondary: 205000, ecce: 45000 },
  ],
  regionalDistribution: [
    { region: "Central", schools: 412, students: 125000 },
    { region: "South", schools: 385, students: 110000 },
    { region: "Kweneng", schools: 215, students: 85000 },
    { region: "North West", schools: 156, students: 45000 },
    { region: "Kgatleng", schools: 120, students: 35000 },
    { region: "South East", schools: 145, students: 75000 },
  ],
  studentDemographics: {
    gender: [
      { name: "Male", value: 310500 },
      { name: "Female", value: 325800 },
    ]
  },
  dropoutAnalysis: [
    { reason: "Pregnancy", count: 1250 },
    { reason: "Truancy", count: 850 },
    { reason: "Illness", count: 420 },
    { reason: "Fees", count: 310 },
    { reason: "Other", count: 215 },
  ],
  alerts: [
    { type: "danger", title: "Incomplete School Profiles", desc: "42 schools in North West region are missing infrastructure data for Q2.", time: "2h ago" },
    { type: "warning", title: "High Dropout Anomaly", desc: "Spike in dropout rates (Pregnancy) detected in Central region secondary schools.", time: "5h ago" },
    { type: "info", title: "Pending Registrations", desc: "14 new ECCE centres require administrative approval.", time: "1d ago" },
    { type: "success", title: "Sync Completed", desc: "National offline database sync completed successfully.", time: "1d ago" },
  ]
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDashboardStats = async (filters: any = {}) => {
  await delay(800);
  return mockData.stats;
};

export const fetchEnrolmentTrends = async (filters: any = {}) => {
  await delay(900);
  return mockData.enrolmentTrends;
};

export const fetchRegionalDistribution = async (filters: any = {}) => {
  await delay(700);
  return mockData.regionalDistribution;
};

export const fetchStudentDemographics = async (filters: any = {}) => {
  await delay(600);
  return mockData.studentDemographics;
};

export const fetchDropoutAnalysis = async (filters: any = {}) => {
  await delay(850);
  return mockData.dropoutAnalysis;
};

export const fetchAlerts = async () => {
  await delay(500);
  return mockData.alerts;
};
