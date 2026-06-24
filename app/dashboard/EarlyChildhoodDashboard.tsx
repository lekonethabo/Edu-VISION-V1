"use client";

import React, { useState, useMemo } from "react";
import { 
  Baby, 
  Building, 
  Layers, 
  Heart, 
  Scale, 
  TrendingUp, 
  Users, 
  Activity, 
  Smile, 
  FileSpreadsheet, 
  Wrench,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Edit,
  ClipboardList,
  AlertTriangle,
  GraduationCap,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkle,
  ArrowRight
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";

// ==========================================
// INTERFACES & CONTEXT SCHEMASFOR ALL REGISTRIES
// ==========================================

export interface ECStudent {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  nationality: string;
  sex: "Male" | "Female";
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  categoryLevel: string;
  attending: string;
  studentSocialStatus: string;
  supportForOvc: string;
  specialEducationNeedAndDisability: "Yes" | "No";
  typeOfSpecialEducationNeedsAndDisability: string;
  supportServiceToSend: string;
}

export interface ECTeachingStaff {
  id: string;
  nationalIdPassport: string;
  surname: string;
  firstNames: string;
  nationality: string;
  sex: string;
  dobYear: string;
  contractType: string;
  staffPosition: string;
  qualification: string;
  qualifyInSpecialEducation: string;
  onStudyLeave: string;
  ictSkills: string;
  teachingGuidanceCounselling: string;
}

export interface ECSupportStaff {
  id: string;
  nationalIdPassport: string;
  surname: string;
  firstNames: string;
  nationality: string;
  sex: "Male" | "Female" | "";
  staffPosition: string;
  qualification: string;
}

export interface ECDropout {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  sex: string;
  categoryLevel: string;
  reasonsForDroppingOut: string;
}

export interface ECTransfer {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  sex: string;
  transferStatus: "Transfer In" | "Transfer Out" | "";
}

export interface ECReEntrant {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  sex: string;
}

export interface ECGraduate {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  sex: "Male" | "Female" | "";
  graduated: "Yes" | "No" | "";
}

export interface ECAbusedStudent {
  id: string;
  nationalIdPassport: string;
  sex: string;
  categoryLevel: string;
  bullying: string;
  corporalPunishment: string;
  sexualHarassment: string;
  sexualAbuse: string;
  violence: string;
}

export interface ECAccident {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  sex: string;
  typeOfAccident1: string;
  accident1Outcome: string;
}

export interface SchoolFacilitiesData {
  A: number; // Classrooms
  B: number; // Pit latrines staff
  C: number; // Pit latrines pupils
  D: number; // Junior flush male
  E: number; // Junior flush female
  F: number; // Adult flush male
  G: number; // Adult flush female
  H: number; // Disabled adult
  I: number; // Disabled junior
  AI: number; // First Aid
  AM: number; // Fire extinguisher
  AS: number; // Swings
  AT: number; // Slides
  AX: number; // Roundabout
  AY: number; // Jungle jim
  AZ: number; // Climbing frame
}

interface SavedFacilityRecord {
  id: string;
  dateSubmitted: string;
  data: SchoolFacilitiesData;
  totalItems: number;
}

export interface MonitoringSupervisionData {
  A: number; // Home economics officer
  C: number; // Pre-primary officer
  D: number; // Special ed officer
  G: number; // Nurse
  H: number; // Social worker
  I: number; // Health inspector
  M: number; // Fire officer
}

interface SavedMonitoringRecord {
  id: string;
  dateSubmitted: string;
  data: MonitoringSupervisionData;
  totalVisits: number;
}

export interface ComprehensiveSexualityEducationData {
  A: string; // Physical safety guidelines
  B: string; // Stigma & discrimination guidelines
  C: string; // Sexual harassment rules
  P: string; // Life skills orientation
  Q: string; // Workplace programmes / HIV orientation
  R: string; // Prevention, care and support
  S: string; // Grievance procedures
}

interface SavedCseRecord {
  id: string;
  dateSubmitted: string;
  data: ComprehensiveSexualityEducationData;
  policiesApproved: number;
}

interface ECSchoolInfo {
  schoolName: string;
  district: string;
  educationRegion: string;
  centreRegistrationStatus: string;
  centreRegistrationNumber: string;
  ownership: string;
  sourceElectricity: string;
  sourceWater: string;
}

// ==========================================
// ROBUST DEFAULT FALLBACKS FOR QUALITY METRICS
// ==========================================

const DEFAULT_EC_STUDENTS: ECStudent[] = [
  { id: "ec-1", nationalIdPassport: "EC-2024-001", surname: "Mokgosi", studentNames: "Lerato", nationality: "Botswana", sex: "Female", dobDay: "12", dobMonth: "05", dobYear: "2021", categoryLevel: "Pre-primary (Excluding Reception)", attending: "Full day", studentSocialStatus: "Ordinary", supportForOvc: "N/A", specialEducationNeedAndDisability: "No", typeOfSpecialEducationNeedsAndDisability: "N/A", supportServiceToSend: "N/A" },
  { id: "ec-2", nationalIdPassport: "EC-2024-002", surname: "Tau", studentNames: "Tshepo", nationality: "Botswana", sex: "Male", dobDay: "24", dobMonth: "11", dobYear: "2021", categoryLevel: "Day Care/Nursery", attending: "Full day", studentSocialStatus: "Needy", supportForOvc: "Social Support", specialEducationNeedAndDisability: "Yes", typeOfSpecialEducationNeedsAndDisability: "Speech or communication", supportServiceToSend: "Speech therapy" },
  { id: "ec-3", nationalIdPassport: "EC-2024-003", surname: "Baletlhanye", studentNames: "Neo", nationality: "Botswana", sex: "Male", dobDay: "05", dobMonth: "08", dobYear: "2020", categoryLevel: "Reception", attending: "Full day", studentSocialStatus: "Orphan", supportForOvc: "Bursary", specialEducationNeedAndDisability: "No", typeOfSpecialEducationNeedsAndDisability: "N/A", supportServiceToSend: "N/A" },
  { id: "ec-4", nationalIdPassport: "EC-2024-004", surname: "Khama", studentNames: "Mpho", nationality: "Botswana", sex: "Female", dobDay: "19", dobMonth: "02", dobYear: "2020", categoryLevel: "Reception", attending: "Half day", studentSocialStatus: "Ordinary", supportForOvc: "N/A", specialEducationNeedAndDisability: "Yes", typeOfSpecialEducationNeedsAndDisability: "Visual", supportServiceToSend: "Glasses/lenses" },
  { id: "ec-5", nationalIdPassport: "EC-2024-005", surname: "Letsholo", studentNames: "Keone", nationality: "Botswana", sex: "Female", dobDay: "01", dobMonth: "10", dobYear: "2022", categoryLevel: "Baby Care", attending: "Both", studentSocialStatus: "Vulnerable", supportForOvc: "Social Support", specialEducationNeedAndDisability: "No", typeOfSpecialEducationNeedsAndDisability: "N/A", supportServiceToSend: "N/A" },
  { id: "ec-6", nationalIdPassport: "EC-2024-006", surname: "Sentsho", studentNames: "Otsile", nationality: "Botswana", sex: "Male", dobDay: "15", dobMonth: "03", dobYear: "2021", categoryLevel: "Day Care/Nursery", attending: "Full day", studentSocialStatus: "Ordinary", supportForOvc: "N/A", specialEducationNeedAndDisability: "No", typeOfSpecialEducationNeedsAndDisability: "N/A", supportServiceToSend: "N/A" },
  { id: "ec-7", nationalIdPassport: "EC-2024-007", surname: "Ramos", studentNames: "Tiago", nationality: "Zimbabwe", sex: "Male", dobDay: "09", dobMonth: "07", dobYear: "2021", categoryLevel: "Baby Care", attending: "Half day", studentSocialStatus: "Ordinary", supportForOvc: "N/A", specialEducationNeedAndDisability: "No", typeOfSpecialEducationNeedsAndDisability: "N/A", supportServiceToSend: "N/A" }
];

const DEFAULT_EC_TEACHERS: ECTeachingStaff[] = [
  { id: "ect-1", nationalIdPassport: "ECT-5912", surname: "Molomo", firstNames: "Onkabetse", nationality: "Botswana", sex: "Female", dobYear: "1988", contractType: "Permanent & Pensionable", staffPosition: "Senior Teacher", qualification: "Diploma in Early Childhood Education", qualifyInSpecialEducation: "Yes", onStudyLeave: "No", ictSkills: "Intermediate", teachingGuidanceCounselling: "Yes" },
  { id: "ect-2", nationalIdPassport: "ECT-6023", surname: "Phiri", firstNames: "Changu", nationality: "Botswana", sex: "Female", dobYear: "1994", contractType: "Temporary", staffPosition: "Teacher", qualification: "Bachelor of Education (Early Childhood)", qualifyInSpecialEducation: "No", onStudyLeave: "No", ictSkills: "Advanced", teachingGuidanceCounselling: "No" },
  { id: "ect-3", nationalIdPassport: "ECT-2211", surname: "Lekgowe", firstNames: "Thabo", nationality: "Botswana", sex: "Male", dobYear: "1990", contractType: "Permanent & Pensionable", staffPosition: "Teacher", qualification: "Certificate in Preschool Education", qualifyInSpecialEducation: "No", onStudyLeave: "Yes", ictSkills: "Basic", teachingGuidanceCounselling: "Yes" }
];

const DEFAULT_EC_SUPPORT: ECSupportStaff[] = [
  { id: "ecs-1", nationalIdPassport: "ECS-3304", surname: "Nisang", firstNames: "Masego", nationality: "Botswana", sex: "Female", staffPosition: "Cook", qualification: "Junior Certificate" },
  { id: "ecs-2", nationalIdPassport: "ECS-9021", surname: "Sefawe", firstNames: "Gaone", nationality: "Botswana", sex: "Female", staffPosition: "Cleaner", qualification: "Primary Leaving Certificate" }
];

const DEFAULT_EC_DROPOUTS: ECDropout[] = [
  { id: "ecd-1", nationalIdPassport: "EC-2024-002", surname: "Tau", studentNames: "Tshepo", sex: "Male", categoryLevel: "Day Care/Nursery", reasonsForDroppingOut: "Illness" },
  { id: "ecd-2", nationalIdPassport: "EC-2024-099", surname: "Molelowakgotla", studentNames: "Amogelang", sex: "Female", categoryLevel: "Reception", reasonsForDroppingOut: "Fees" },
  { id: "ecd-3", nationalIdPassport: "EC-2024-110", surname: "Kofi", studentNames: "Akeem", sex: "Male", categoryLevel: "Baby Care", reasonsForDroppingOut: "Relocation" }
];

const DEFAULT_EC_TRANSFERS: ECTransfer[] = [
  { id: "ectf-1", nationalIdPassport: "EC-24-901", surname: "Thebe", studentNames: "Gofaone", sex: "Male", transferStatus: "Transfer In" },
  { id: "ectf-2", nationalIdPassport: "EC-24-902", surname: "Moeti", studentNames: "Katlo", sex: "Female", transferStatus: "Transfer Out" }
];

const DEFAULT_EC_RE_ENTRANTS: ECReEntrant[] = [
  { id: "ecre-1", nationalIdPassport: "EC-24-811", surname: "Letebele", studentNames: "Kabo", sex: "Male" }
];

const DEFAULT_EC_GRADUATES: ECGraduate[] = [
  { id: "ecg-1", nationalIdPassport: "EC-2023-401", surname: "Makgaka", studentNames: "Tuelo", sex: "Female", graduated: "Yes" },
  { id: "ecg-2", nationalIdPassport: "EC-2023-402", surname: "Oageng", studentNames: "Gomolemo", sex: "Male", graduated: "Yes" },
  { id: "ecg-3", nationalIdPassport: "EC-2023-403", surname: "Ngwako", studentNames: "Lame", sex: "Female", graduated: "Yes" }
];

const DEFAULT_EC_ABUSED: ECAbusedStudent[] = [
  { id: "eca-1", nationalIdPassport: "EC-2024-004", sex: "Female", categoryLevel: "Reception", bullying: "Yes", corporalPunishment: "No", sexualHarassment: "No", sexualAbuse: "No", violence: "No" }
];

const DEFAULT_EC_ACCIDENTS: ECAccident[] = [
  { id: "ecac-1", nationalIdPassport: "EC-2024-001", surname: "Mokgosi", studentNames: "Lerato", sex: "Female", typeOfAccident1: "Fall on Playground", accident1Outcome: "Fully Recovered" }
];

const DEFAULT_EC_SCHOOL_INFO: ECSchoolInfo = {
  schoolName: "KGOMOTSO PRE-PRIMARY AND CRECHE",
  district: "Central District",
  educationRegion: "Central Region",
  centreRegistrationStatus: "Fully Registered",
  centreRegistrationNumber: "EMIS-ECCE-4029",
  ownership: "Private Community Board",
  sourceElectricity: "BPC National Grid",
  sourceWater: "Water Utilities Corporation"
};

const DEFAULT_FACILITIES: SavedFacilityRecord[] = [
  {
    id: "fac-init",
    dateSubmitted: "2026-06-01",
    totalItems: 85,
    data: {
      A: 4, B: 0, C: 0, D: 4, E: 4, F: 1, G: 1, H: 1, I: 1, 
      AI: 2, AM: 2, AS: 4, AT: 2, AX: 1, AY: 1, AZ: 2
    }
  }
];

const DEFAULT_MONITORING: SavedMonitoringRecord[] = [
  {
    id: "mon-init",
    dateSubmitted: "2026-06-10",
    totalVisits: 14,
    data: {
      A: 2, C: 4, D: 1, G: 2, H: 1, I: 3, M: 1
    }
  }
];

const DEFAULT_CSE: SavedCseRecord[] = [
  {
    id: "cse-init",
    dateSubmitted: "2026-06-11",
    policiesApproved: 3,
    data: {
      A: "Yes", B: "Yes", C: "Yes", P: "Yes", Q: "Yes", R: "Yes", S: "No"
    }
  }
];

// ==========================================
// COMPONENT IMPLEMENTATION
// ==========================================

export const EarlyChildhoodDashboard: React.FC = () => {
  // Pull data dynamically from all standard keys suffix paths
  const { items: students } = useLocalStorage<ECStudent>("edu_vision_ec_students", DEFAULT_EC_STUDENTS);
  const { items: teachers } = useLocalStorage<ECTeachingStaff>("edu_vision_ec_teaching_staff", DEFAULT_EC_TEACHERS);
  const { items: supportStaff } = useLocalStorage<ECSupportStaff>("edu_vision_ec_support_staff", DEFAULT_EC_SUPPORT);
  const { items: dropouts } = useLocalStorage<ECDropout>("edu_vision_ec_dropouts", DEFAULT_EC_DROPOUTS);
  const { items: transfers } = useLocalStorage<ECTransfer>("edu_vision_ec_transfers", DEFAULT_EC_TRANSFERS);
  const { items: reEntrants } = useLocalStorage<ECReEntrant>("edu_vision_ec_re_entrants", DEFAULT_EC_RE_ENTRANTS);
  const { items: graduates } = useLocalStorage<ECGraduate>("edu_vision_ec_graduates", DEFAULT_EC_GRADUATES);
  const { items: abused } = useLocalStorage<ECAbusedStudent>("edu_vision_ec_abused_students", DEFAULT_EC_ABUSED);
  const { items: accidents } = useLocalStorage<ECAccident>("edu_vision_ec_accidents", DEFAULT_EC_ACCIDENTS);
  const { items: schoolInfoArr } = useLocalStorage<ECSchoolInfo>("edu_vision_ec_school_info", [DEFAULT_EC_SCHOOL_INFO]);
  const { items: facilityRecords } = useLocalStorage<SavedFacilityRecord>("ec_facilities_list_v2", DEFAULT_FACILITIES);
  const { items: monitoringRecords } = useLocalStorage<SavedMonitoringRecord>("ec_monitoring_list_v2", DEFAULT_MONITORING);
  const { items: cseRecords } = useLocalStorage<SavedCseRecord>("ec_cse_list_v2", DEFAULT_CSE);

  const [activeTab, setActiveTab] = useState<"overview" | "demographics" | "staff" | "safety" | "facilities">("overview");

  const school = schoolInfoArr[0] || DEFAULT_EC_SCHOOL_INFO;
  const latestFacility = facilityRecords[0] || DEFAULT_FACILITIES[0];
  const latestMonitoring = monitoringRecords[0] || DEFAULT_MONITORING[0];
  const latestCse = cseRecords[0] || DEFAULT_CSE[0];

  // ==========================================
  // REAL-TIME ANALYTICAL METRICS CALCULATIONS
  // ==========================================

  const metrics = useMemo(() => {
    // 1- Demographics Metrics
    const totalEnrolled = students.length;
    const boysCount = students.filter((s) => s.sex === "Male").length;
    const girlsCount = students.filter((s) => s.sex === "Female").length;
    const boysPercent = totalEnrolled > 0 ? Math.round((boysCount / totalEnrolled) * 100) : 0;
    const girlsPercent = totalEnrolled > 0 ? Math.round((girlsCount / totalEnrolled) * 100) : 0;

    // Age distribution calculations
    const currentYear = new Date().getFullYear();
    let age3 = 0, age4 = 0, age5 = 0, age6Plus = 0;
    students.forEach((s) => {
      const year = parseInt(s.dobYear);
      if (!isNaN(year)) {
        const age = currentYear - year;
        if (age <= 3) age3++;
        else if (age === 4) age4++;
        else if (age === 5) age5++;
        else age6Plus++;
      }
    });

    // Level breakdown calculations
    const levelsMapping: { [key: string]: number } = {
      "Baby Care": 0,
      "Day Care/Nursery": 0,
      "Pre-primary (Excluding Reception)": 0,
      "Reception": 0
    };
    students.forEach((s) => {
      const lvl = s.categoryLevel;
      if (levelsMapping[lvl] !== undefined) {
        levelsMapping[lvl]++;
      } else {
        // Fallback checks
        if (lvl.toLowerCase().includes("baby")) levelsMapping["Baby Care"]++;
        else if (lvl.toLowerCase().includes("day care") || lvl.toLowerCase().includes("nursery")) levelsMapping["Day Care/Nursery"]++;
        else if (lvl.toLowerCase().includes("excluding")) levelsMapping["Pre-primary (Excluding Reception)"]++;
        else if (lvl.toLowerCase().includes("reception")) levelsMapping["Reception"]++;
      }
    });

    // Class attending modes
    const attendingFull = students.filter((s) => s.attending?.toLowerCase().includes("full")).length;
    const attendingHalf = students.filter((s) => s.attending?.toLowerCase().includes("half")).length;
    const attendingBoth = students.filter((s) => s.attending?.toLowerCase().includes("both")).length;

    // 2- Welfare & SEND Ratios
    const sendCount = students.filter((s) => s.specialEducationNeedAndDisability === "Yes").length;
    const sendPercent = totalEnrolled > 0 ? Math.round((sendCount / totalEnrolled) * 100) : 0;

    const vulnerableCount = students.filter((s) => ["orphan", "needy", "vulnerable"].includes(s.studentSocialStatus?.toLowerCase())).length;
    const ovcSupportedCount = students.filter((s) => s.supportForOvc !== "N/A" && s.supportForOvc !== "None").length;

    // SEND categories representation
    const sendTypes: { [key: string]: number } = {};
    students.forEach((s) => {
      if (s.specialEducationNeedAndDisability === "Yes" && s.typeOfSpecialEducationNeedsAndDisability) {
        const t = s.typeOfSpecialEducationNeedsAndDisability;
        if (t !== "N/A" && t !== "") {
          sendTypes[t] = (sendTypes[t] || 0) + 1;
        }
      }
    });

    // 3- Staffing & Caregiver KPIs
    const teacherCount = teachers.length;
    const supportCount = supportStaff.length;
    const totalStaff = teacherCount + supportCount;
    const studentTeacherRatio = teacherCount > 0 ? Math.round(totalEnrolled / teacherCount) : 0;

    // Qualification distribution mapping
    const qualCounts: { [key: string]: number } = {};
    teachers.forEach((t) => {
      const q = t.qualification || "Other/Untrained";
      qualCounts[q] = (qualCounts[q] || 0) + 1;
    });

    const specialEdQualifiedTeachers = teachers.filter((t) => t.qualifyInSpecialEducation === "Yes").length;
    const teachersOnStudyLeave = teachers.filter((t) => t.onStudyLeave === "Yes").length;
    const teachersIctSkills = teachers.filter((t) => t.ictSkills === "Advanced" || t.ictSkills === "Intermediate").length;

    // 4- Incident & Risk Levels (Health and Safeguarding)
    const dropoutCount = dropouts.length;
    const transferIn = transfers.filter((t) => t.transferStatus === "Transfer In").length;
    const transferOut = transfers.filter((t) => t.transferStatus === "Transfer Out").length;
    const reEntrantCount = reEntrants.length;
    const graduateCount = graduates.filter((g) => g.graduated === "Yes").length;

    // Abuses detail sum
    let bullyingCount = 0;
    let corporalPunishmentCount = 0;
    let sexualHarassmentCount = 0;
    let sexualAbuseCount = 0;
    let violenceCount = 0;

    abused.forEach((a) => {
      if (a.bullying === "Yes") bullyingCount++;
      if (a.corporalPunishment === "Yes") corporalPunishmentCount++;
      if (a.sexualHarassment === "Yes") sexualHarassmentCount++;
      if (a.sexualAbuse === "Yes") sexualAbuseCount++;
      if (a.violence === "Yes") violenceCount++;
    });

    const totalWelfareAlerts = abused.length;
    const totalAccidents = accidents.length;

    // Dropout causes
    const dropoutReasons: { [key: string]: number } = {
      "Fees": 0, "Illness": 0, "Bullying": 0, "Death": 0, "Truancy": 0, "Relocation / Other": 0
    };
    dropouts.forEach((d) => {
      const r = d.reasonsForDroppingOut;
      if (r === "Fees" || r === "Illness" || r === "Bullying" || r === "Death" || r === "Truancy") {
        dropoutReasons[r]++;
      } else {
        dropoutReasons["Relocation / Other"]++;
      }
    });

    // 5- Infrastructure & Monitoring Checks
    const classroomsCount = latestFacility?.data?.A || 4;
    const juniorToilets = (latestFacility?.data?.D || 0) + (latestFacility?.data?.E || 0) + (latestFacility?.data?.I || 0) || 8;
    const staffToilets = (latestFacility?.data?.B || 0) + (latestFacility?.data?.F || 0) + (latestFacility?.data?.G || 0) + (latestFacility?.data?.H || 0) || 2;
    const safetySuppliesScore = (latestFacility?.data?.AI > 0 ? 1 : 0) + (latestFacility?.data?.AM > 0 ? 1 : 0); // first aid & fire ext
    const playgroundEquipCount = (latestFacility?.data?.AS || 0) + (latestFacility?.data?.AT || 0) + (latestFacility?.data?.AX || 0) + (latestFacility?.data?.AY || 0);

    // Monitoring inspector visits count
    const visitingTimeline = [
      { name: "Pre-primary Officer", visits: latestMonitoring?.data?.C || 0 },
      { name: "Health inspector", visits: latestMonitoring?.data?.I || 0 },
      { name: "Clinical Nurse", visits: latestMonitoring?.data?.G || 0 },
      { name: "Social Worker", visits: latestMonitoring?.data?.H || 0 },
      { name: "Home Econ Officer", visits: latestMonitoring?.data?.A || 0 },
      { name: "Fire inspector", visits: latestMonitoring?.data?.M || 0 }
    ];

    const totalInspectionVisits = visitingTimeline.reduce((sum, item) => sum + item.visits, 0);

    // CSE compliance percentages
    const approvedCsePolicies = (latestCse?.data?.A === "Yes" ? 1 : 0) + (latestCse?.data?.B === "Yes" ? 1 : 0) + (latestCse?.data?.C === "Yes" ? 1 : 0);
    const approvedCseWorkplace = (latestCse?.data?.Q === "Yes" ? 1 : 0) + (latestCse?.data?.R === "Yes" ? 1 : 0) + (latestCse?.data?.S === "Yes" ? 1 : 0);
    const cseCompletionRate = Math.round(((approvedCsePolicies + approvedCseWorkplace + (latestCse?.data?.P === "Yes" ? 1 : 0)) / 7) * 100);

    return {
      totalEnrolled,
      boysCount,
      girlsCount,
      boysPercent,
      girlsPercent,
      age3,
      age4,
      age5,
      age6Plus,
      levelsMapping,
      attendingFull,
      attendingHalf,
      attendingBoth,
      sendCount,
      sendPercent,
      vulnerableCount,
      ovcSupportedCount,
      sendTypes,
      teacherCount,
      supportCount,
      totalStaff,
      studentTeacherRatio,
      qualCounts,
      specialEdQualifiedTeachers,
      teachersOnStudyLeave,
      teachersIctSkills,
      dropoutCount,
      transferIn,
      transferOut,
      reEntrantCount,
      graduateCount,
      bullyingCount,
      corporalPunishmentCount,
      sexualHarassmentCount,
      sexualAbuseCount,
      violenceCount,
      totalWelfareAlerts,
      totalAccidents,
      dropoutReasons,
      classroomsCount,
      juniorToilets,
      staffToilets,
      safetySuppliesScore,
      playgroundEquipCount,
      visitingTimeline,
      totalInspectionVisits,
      approvedCsePolicies,
      approvedCseWorkplace,
      cseCompletionRate
    };
  }, [students, teachers, supportStaff, dropouts, transfers, reEntrants, graduates, abused, accidents, latestFacility, latestMonitoring, latestCse]);

  // Dynamic visual charts datasets
  const levelChartData = useMemo(() => {
    return Object.keys(metrics.levelsMapping).map((key) => ({
      name: key,
      value: metrics.levelsMapping[key]
    }));
  }, [metrics.levelsMapping]);

  const sendChartData = useMemo(() => {
    return Object.keys(metrics.sendTypes).map((key) => ({
      name: key,
      value: metrics.sendTypes[key]
    }));
  }, [metrics.sendTypes]);

  const staffQualificationsChartData = useMemo(() => {
    return Object.keys(metrics.qualCounts).map((key) => ({
      name: key.replace("Education", "Ed"),
      Count: metrics.qualCounts[key]
    }));
  }, [metrics.qualCounts]);

  const dropoutsChartData = useMemo(() => {
    return Object.keys(metrics.dropoutReasons).map((key) => ({
      name: key,
      Count: metrics.dropoutReasons[key]
    }));
  }, [metrics.dropoutReasons]);

  // Evaluated Safe Index (Heuristics calculation)
  const evaluatedMetrics = useMemo(() => {
    let safetyScore = 100;
    if (metrics.totalWelfareAlerts > 0) safetyScore -= 15 * metrics.totalWelfareAlerts;
    if (metrics.totalAccidents > 0) safetyScore -= 8 * metrics.totalAccidents;
    if (latestFacility?.data?.AM === 0) safetyScore -= 15; // no fire extinguisher

    const performanceSafetyIndex = Math.max(10, Math.min(100, safetyScore));
    
    let staffingStatus: "OPTIMAL" | "UNDERSTAFFED" | "CRITICAL" = "OPTIMAL";
    if (metrics.studentTeacherRatio > 25) staffingStatus = "CRITICAL";
    else if (metrics.studentTeacherRatio > 15) staffingStatus = "UNDERSTAFFED";

    return {
      safetyIndex: performanceSafetyIndex,
      staffingStatus
    };
  }, [metrics.totalWelfareAlerts, metrics.totalAccidents, latestFacility, metrics.studentTeacherRatio]);

  return (
    <div className="space-y-6" id="ece-reporting-system-container">
      
      {/* 1- Header Context Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#00A3A3]/10 text-[#00A3A3] rounded-2xl flex-shrink-0 animate-pulse">
            <Baby className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full border border-amber-500/20 tracking-wider">
                Botswana EMIS Compliance Portal
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-teal-500/10 text-teal-500 px-2.5 py-0.5 rounded-full border border-teal-500/20 tracking-wider">
                Active Code: {school.centreRegistrationNumber || "EMIS-ECCE-4029"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#002652] dark:text-[#00A3A3] tracking-tight mt-1">
              KGOMOTSO PRE-PRIMARY CENTRAL COMMAND
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-relaxed">
              Consolidated pre-primary auditing matrix. Visualizing toddler metrics, caregiver ratios, physical learning space audits, and CSE mandate completions.
            </p>
          </div>
        </div>

        {/* Global Inspection Summary */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#000814] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 self-stretch lg:self-auto justify-between">
          <div>
            <span className="text-[9.5px] font-bold text-slate-450 block uppercase">Supervision Status</span>
            <span className="text-xs font-extrabold text-[#002652] dark:text-slate-200 block mt-0.5">
              {metrics.totalInspectionVisits} Officer Visits
            </span>
          </div>
          <div className="w-1.5 h-10 border-l border-slate-200 dark:border-slate-850"></div>
          <div>
            <span className="text-[9.5px] font-bold text-slate-450 block uppercase">CSE Alignment</span>
            <span className="text-xs font-black text-[#00A3A3] block mt-0.5">
              {metrics.cseCompletionRate}% Compliant
            </span>
          </div>
        </div>
      </div>

      {/* 2- High-Level KPIs Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Active Toddlers */}
        <div className="bg-white dark:bg-[#001020] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 text-[#00A3A3] rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Enrolled Census</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100 block mt-0.5 tracking-tight">
              {metrics.totalEnrolled}
            </span>
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-bold block truncate">
              {metrics.boysCount} Boys / {metrics.girlsCount} Girls
            </span>
          </div>
        </div>

        {/* KPI 2: Caregiver Power */}
        <div className="bg-white dark:bg-[#001020] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#002652]/10 text-sky-500 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Caregivers</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100 block mt-0.5 tracking-tight">
              {metrics.totalStaff}
            </span>
            <span className="text-[9.5px] font-bold text-[#00A3A3] block">
              Ratio: 1:{metrics.studentTeacherRatio} (Staff)
            </span>
          </div>
        </div>

        {/* KPI 3: SEND Coverage */}
        <div className="bg-white dark:bg-[#001020] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">SEND Support</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100 block mt-0.5 tracking-tight">
              {metrics.sendCount} <span className="text-[10px] font-normal text-slate-400">({metrics.sendPercent}%)</span>
            </span>
            <span className="text-[9.5px] text-[#00A3A3] font-bold block truncate">
              {metrics.ovcSupportedCount} OVC Services
            </span>
          </div>
        </div>

        {/* KPI 4: Welfare Risks / Safe Indices */}
        <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
          metrics.totalWelfareAlerts > 0 || metrics.totalAccidents > 0 
            ? "bg-rose-500/5 border-rose-500/20" 
            : "bg-white dark:bg-[#001020] border-slate-200 dark:border-slate-800"
        }`}>
          <div className={`p-3 rounded-xl ${
            metrics.totalWelfareAlerts > 0 || metrics.totalAccidents > 0
              ? "bg-rose-500/10 text-rose-500"
              : "bg-emerald-500/10 text-emerald-500"
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Welfare & Risks</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100 block mt-0.5 tracking-tight">
              {metrics.totalWelfareAlerts + metrics.totalAccidents}
            </span>
            <span className="text-[9.5px] font-bold block truncate text-rose-550 dark:text-rose-450">
              {metrics.totalWelfareAlerts} Abuses | {metrics.totalAccidents} Inj.
            </span>
          </div>
        </div>

        {/* KPI 5: Food & Water Security */}
        <div className="bg-white dark:bg-[#001020] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Sanitation Score</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100 block mt-0.5 tracking-tight">
              {metrics.juniorToilets} Toilets
            </span>
            <span className="text-[9.5px] text-[#00A3A3] font-bold block truncate">
              {metrics.classroomsCount} Learning Spaces
            </span>
          </div>
        </div>

      </div>

      {/* 3- Navigation Tab bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 scrollbar-none overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs font-bold uppercase transition-all whitespace-nowrap border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-[#00A3A3] text-[#00A3A3] font-black"
              : "border-transparent text-slate-500 hover:text-slate-750 hover:border-slate-300"
          }`}
        >
          <Sparkle className="w-4 h-4" />
          Strategic Context
        </button>
        <button
          onClick={() => setActiveTab("demographics")}
          className={`pb-3 px-4 text-xs font-bold uppercase transition-all whitespace-nowrap border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "demographics"
              ? "border-[#00A3A3] text-[#00A3A3] font-black"
              : "border-transparent text-slate-500 hover:text-slate-750 hover:border-slate-300"
          }`}
        >
          <Baby className="w-4 h-4" />
          Toddler Demographics
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`pb-3 px-4 text-xs font-bold uppercase transition-all whitespace-nowrap border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "staff"
              ? "border-[#00A3A3] text-[#00A3A3] font-black"
              : "border-transparent text-slate-500 hover:text-slate-750 hover:border-slate-300"
          }`}
        >
          <Users className="w-4 h-4" />
          Caregivers & Movements
        </button>
        <button
          onClick={() => setActiveTab("safety")}
          className={`pb-3 px-4 text-xs font-bold uppercase transition-all whitespace-nowrap border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "safety"
              ? "border-[#00A3A3] text-[#00A3A3] font-black"
              : "border-transparent text-slate-500 hover:text-slate-750 hover:border-slate-300"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Risk & Welfare Audits
        </button>
        <button
          onClick={() => setActiveTab("facilities")}
          className={`pb-3 px-4 text-xs font-bold uppercase transition-all whitespace-nowrap border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "facilities"
              ? "border-[#00A3A3] text-[#00A3A3] font-black"
              : "border-transparent text-slate-500 hover:text-slate-750 hover:border-slate-300"
          }`}
        >
          <Building className="w-4 h-4" />
          Infras & Monitor Audits
        </button>
      </div>

      {/* 4- Active Dashboard tab Content */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="tab-overview"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              
              {/* Left Column: School profile details and administrative details */}
              <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-[#00A3A3] uppercase block tracking-wider">EMIS Registration Information</span>
                  <h3 className="text-sm font-black text-[#002652] dark:text-slate-100 mt-1 uppercase">Official Licensing Profile</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs py-1 hover:bg-slate-50 dark:hover:bg-slate-900 px-1 rounded transition-colors">
                    <span className="text-slate-450 font-bold uppercase text-[9.5px]">School Name</span>
                    <span className="font-extrabold text-[#002652] dark:text-slate-200 text-right">{school.schoolName || "Kgomotso Pre-Primary"}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 hover:bg-slate-50 dark:hover:bg-slate-900 px-1 rounded transition-colors">
                    <span className="text-slate-450 font-bold uppercase text-[9.5px]">Registration Code</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{school.centreRegistrationNumber || "EMIS-ECCE-4029"}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 hover:bg-slate-50 dark:hover:bg-slate-900 px-1 rounded transition-colors">
                    <span className="text-slate-450 font-bold uppercase text-[9.5px]">Licensing Status</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                      {school.centreRegistrationStatus || "Fully Licensed"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 hover:bg-slate-50 dark:hover:bg-slate-900 px-1 rounded transition-colors">
                    <span className="text-slate-450 font-bold uppercase text-[9.5px]">District</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{school.district || "Central District"}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 hover:bg-slate-50 dark:hover:bg-slate-900 px-1 rounded transition-colors">
                    <span className="text-slate-450 font-bold uppercase text-[9.5px]">Ownership structure</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 text-right">{school.ownership || "Community Board"}</span>
                  </div>
                </div>

                {/* Facilities safety checklist mini alert */}
                <div className="bg-[#00A3A3]/5 border border-[#00A3A3]/10 p-4 rounded-xl flex items-start gap-3 mt-4">
                  <CheckCircle2 className="w-5 h-5 text-[#00A3A3] mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-extrabold text-[#002652] dark:text-[#00A3A3] block uppercase text-[10px]">ECCE Basic Utilities Security</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      WUC water access is <strong>Fully Connected</strong>. High voltage power supplied via <strong>{school.sourceElectricity || "BPC national grid"}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle: Proportional Quality Indicators Evaluation */}
              <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-extrabold text-teal-500 uppercase block tracking-wider">Evaluation Metrics</span>
                    <h3 className="text-sm font-black text-[#002652] dark:text-slate-100 mt-1 uppercase">Institutional Quality Indexes</h3>
                  </div>

                  <div className="space-y-4 mt-4">
                    {/* Security Index Bar */}
                    <div>
                      <div className="flex justify-between text-xs pb-1 font-bold">
                        <span className="text-slate-500 uppercase text-[9.5px]">Safeguarding & Protection Index</span>
                        <span className={`${
                          evaluatedMetrics.safetyIndex < 80 ? "text-rose-500 font-extrabold" : "text-emerald-500 font-extrabold"
                        }`}>
                          {evaluatedMetrics.safetyIndex}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-950">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            evaluatedMetrics.safetyIndex < 80 ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${evaluatedMetrics.safetyIndex}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block">Includes abuse complaints weightages, missing fire extinguishers weightings, and child inj. counts</span>
                    </div>

                    {/* Staffing sufficiency Status */}
                    <div>
                      <div className="flex justify-between text-xs pb-1 font-bold">
                        <span className="text-slate-500 uppercase text-[9.5px]">Caregiver Coverage Sufficiency</span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-black ${
                          evaluatedMetrics.staffingStatus === "OPTIMAL" 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-550/20" 
                            : "bg-amber-500/10 text-amber-500 border border-amber-550/20"
                        }`}>
                          {evaluatedMetrics.staffingStatus}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed mt-1.5">
                        Students to active teacher ratio is <strong>{metrics.studentTeacherRatio}:1</strong>. The recommended optimal Ministry ECCE compliance ceiling is 15:1.
                      </p>
                    </div>

                    {/* Community Engagement Intensity */}
                    <div>
                      <div className="flex justify-between text-xs pb-1 font-bold">
                        <span className="text-slate-500 uppercase text-[9.5px]">Parent orientation compliance</span>
                        <span className="text-[#00A3A3] font-black">
                          {latestCse?.data?.P === "Yes" ? "Fully Completed" : "Not Started"}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed mt-1.5">
                        Parents orientation seminar logs has been compiled. Includes basic sex-safety guidelines share rates and toddler first-aid.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-bold text-[#00A3A3]">
                  <span>AI EMIS Assessment Report</span>
                  <div className="flex items-center gap-1 cursor-pointer hover:underline text-[10.5px]" onClick={() => setActiveTab("safety")}>
                    <span>View Risk matrices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Right: Quick Action ECCE registry overview and status indicators */}
              <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-extrabold text-[#00A3A3] uppercase block tracking-wider">Exercise Progress Tracking</span>
                    <h3 className="text-sm font-black text-[#002652] dark:text-slate-100 mt-1 uppercase">ECCE Registries Audit List</h3>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-950 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-[#00A3A3]" />
                        <span className="font-bold">Student Directory Registry</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-extrabold">
                        {students.length} logged
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-950 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-500" />
                        <span className="font-bold">Teachers registry</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-extrabold">
                        {teachers.length} logged
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-950 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-amber-500" />
                        <span className="font-bold">Classrooms & Facilities registry</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-extrabold">
                        {latestFacility?.totalItems || 0} items
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-950 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                        <span className="font-bold">Sexuality Education Rules Registry</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#00A3A3]/10 text-[#00A3A3] font-extrabold">
                        {latestCse ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#000814] rounded-xl border border-slate-250/70 dark:border-slate-950 flex flex-col mt-4">
                  <span className="text-[10px] font-bold text-slate-450 uppercase block">Ministry Compliance Note</span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    This command dashboard aggregates direct submissions corresponding to the physical pre-primary books. Use individual registries to amend records.
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === "demographics" && (
            <motion.div
              key="tab-demographics"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Chart 1: Levels of Preschool enrolment */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850">
                    Education Level Breakdown
                  </h3>
                  <div className="h-56 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={levelChartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#00A3A3" radius={[4, 4, 0, 0]}>
                          {levelChartData.map((e, index) => (
                            <Cell key={`cell-${index}`} fill={["#00A3A3", "#ffd700", "#002652", "#97620C"][index % 4]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center mt-2">Active toddlers distribution by academic cohort levels</span>
                </div>

                {/* Visual Chart 2: Special Education Needs (SEND) Representation */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850">
                    Disability Representation Breakdown
                  </h3>
                  {sendChartData.length > 0 ? (
                    <div className="h-56 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sendChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${((percent || 0) * 105).toFixed(0)}%)`.replace("105", "100")}
                          >
                            {sendChartData.map((e, index) => (
                              <Cell key={`cell-${index}`} fill={["#E11D48", "#D97706", "#2563EB", "#059669", "#7C3AED"][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-56 mt-4 flex items-center justify-center border border-dashed border-slate-250 dark:border-slate-800 rounded-xl">
                      <span className="text-xs text-slate-450 italic">No students with disabilities recorded in directory</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-440 block text-center mt-2">Breakdown of support needs among SEND students ({metrics.sendCount} active)</span>
                </div>

                {/* Visual 3: Age Representation & Enrolment modes */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850">
                      Age & Attending Modes
                    </h3>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250/40 dark:border-slate-950 text-center">
                        <span className="text-slate-400 uppercase font-mono text-[9px] block">3 Years & Under</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block mt-1">{metrics.age3}</span>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250/40 dark:border-slate-950 text-center">
                        <span className="text-slate-400 uppercase font-mono text-[9px] block">4 Years Olds</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block mt-1">{metrics.age4}</span>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250/40 dark:border-slate-950 text-center">
                        <span className="text-slate-400 uppercase font-mono text-[9px] block">5 Years Olds</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block mt-1">{metrics.age5}</span>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250/40 dark:border-slate-950 text-center">
                        <span className="text-slate-400 uppercase font-mono text-[9px] block">6 Years & Older</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block mt-1">{metrics.age6Plus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-center text-[10px]">
                    <div>
                      <span className="text-slate-400 block font-bold">Full Day</span>
                      <strong className="text-xs text-slate-700 dark:text-slate-350">{metrics.attendingFull}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Half Day</span>
                      <strong className="text-xs text-slate-700 dark:text-slate-350">{metrics.attendingHalf}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Both</span>
                      <strong className="text-xs text-slate-700 dark:text-slate-350">{metrics.attendingBoth}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Vulnerabilities and Social Welfare indicators */}
              <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3]">
                    Social Welfare & Vulnerable Children (OVC) Trackers
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-950 space-y-2">
                    <span className="font-extrabold text-[#002652] dark:text-[#00A3A3] uppercase text-[10px] block">Vulnerable Cohorts</span>
                    <p className="text-slate-650 dark:text-slate-400">
                      Total toddlers categorized under vulnerable social status (Orphans, Needy, or Vulnerable) is <strong>{metrics.vulnerableCount}</strong>.
                    </p>
                    <span className="text-[10px] bg-sky-500/10 text-sky-500 font-extrabold px-2 py-0.5 rounded block w-max">
                      Requires Custom Care Plans
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-950 space-y-2">
                    <span className="font-extrabold text-[#002652] dark:text-[#00A3A3] uppercase text-[10px] block">OVC Support Services</span>
                    <p className="text-slate-650 dark:text-slate-400">
                      The number of underprivileged children receiving active educational bursaries or psychological social support represents <strong>{metrics.ovcSupportedCount} and counting</strong>.
                    </p>
                    <span className="text-[10px] bg-teal-500/10 text-[#00A3A3] font-extrabold px-2 py-0.5 rounded block w-max">
                      Ministry Supported
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#00A3A3]/5 border border-[#00A3A3]/10 space-y-2">
                    <span className="font-extrabold text-[#002652] dark:text-[#00A3A3] uppercase text-[10px] block">ECCE Special Education Ramps</span>
                    <p className="text-slate-650 dark:text-slate-400">
                      <strong>{metrics.sendPercent}% of students</strong> are flagged for Special Education support service schemes. Ensure accessible toilets and access ramps are submitting.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "staff" && (
            <motion.div
              key="tab-staff"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Staff Qualifications density bar chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850">
                    Staff Highest Qualifications Profiles
                  </h3>
                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={staffQualificationsChartData} layout="vertical">
                        <XAxis type="number" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                        <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9.5} width={130} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="Count" fill="#00A3A3" radius={[0, 4, 4, 0]}>
                          {staffQualificationsChartData.map((e, index) => (
                            <Cell key={`cell-${index}`} fill={["#00A3A3", "#002652", "#ffd700"][index % 3]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Professional training status insights */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850">
                      Caregiver Professionalization
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250/40 dark:border-slate-950 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 block">SEND Trained Teachers</span>
                          <span className="text-[10px] text-slate-400 block">Has certified training in special ed</span>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-[#00A3A3]/10 text-[#00A3A3] font-black text-xs">
                          {metrics.specialEdQualifiedTeachers} / {metrics.teacherCount}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250/40 dark:border-slate-950 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 block">Study Leave Scholars</span>
                          <span className="text-[10px] text-slate-400 block">Preschool teachers in upskilling</span>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-655 font-black text-xs">
                          {metrics.teachersOnStudyLeave} active
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-250/40 dark:border-slate-950 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 block">Advanced ICT literacy</span>
                          <span className="text-[10px] text-slate-400 block">ICT tools integration in classes</span>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-sky-500/10 text-sky-500 font-black text-xs">
                          {metrics.teachersIctSkills} certified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-[#000814] rounded-xl border border-slate-200 dark:border-slate-850 text-xs">
                    <span className="font-bold text-[#00A3A3] block uppercase text-[10px]">Ministry Ratio Target:</span>
                    <p className="text-[10.5px] text-slate-500 leading-normal mt-1">
                      Kgomotso Pre-Primary preserves <strong>{metrics.studentTeacherRatio}:1 toddler-caregiver density</strong>. This maintains optimal child educational engagement levels.
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "safety" && (
            <motion.div
              key="tab-safety"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Dropouts causes and reasons bar chart */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850">
                    Dropout Cause Analysis
                  </h3>
                  <div className="h-56 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dropoutsChartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="Count" fill="#E11D48" radius={[4, 4, 0, 0]}>
                          {dropoutsChartData.map((e, index) => (
                            <Cell key={`cell-${index}`} fill={["#E11D48", "#D97706", "#2563EB", "#7C3AED", "#059669"][index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-[10px] text-slate-440 block text-center mt-2">Historic reasons for pre-school dropouts ({metrics.dropoutCount} recorded)</span>
                </div>

                {/* Child abuse registry summary metrics */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-[#00D9D9]/20 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase text-rose-500 pb-3 border-b border-slate-50 dark:border-slate-850 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-bounce" />
                      Safeguarding Abuse audit
                    </h3>

                    <div className="space-y-3 mt-4 text-xs">
                      <div className="flex justify-between items-center py-2 border-b border-slate-105 dark:border-slate-850">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Bullying complaints</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          metrics.bullyingCount > 0 ? "bg-rose-500/15 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                          {metrics.bullyingCount} active
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-slate-105 dark:border-slate-850">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Corporal punishment reports</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          metrics.corporalPunishmentCount > 0 ? "bg-rose-500/15 text-rose-500 animate-pulse" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                          {metrics.corporalPunishmentCount} flagged
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-slate-105 dark:border-slate-850">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Harassment / abuse flags</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          metrics.sexualHarassmentCount + metrics.sexualAbuseCount > 0 ? "bg-rose-500/15 text-rose-500 animate-ping" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                          {metrics.sexualHarassmentCount + metrics.sexualAbuseCount} cases
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-slate-105 dark:border-slate-850">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Violence reports</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          metrics.violenceCount > 0 ? "bg-rose-500/15 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                          {metrics.violenceCount} incidents
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/20 text-xs text-slate-500 leading-normal mt-4">
                    <span className="font-bold text-rose-500 block uppercase text-[10px] pb-1">Unacceptable Behavior Warning:</span>
                    Any non-zero count of abusive allegations triggers immediate Ministry investigation. Conduct weekly staff briefings.
                  </div>
                </div>

                {/* Accidents Outcomes & Graduates / Re-entrants summary */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850">
                      Safety, Transfers & Graduates
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-250/40 dark:border-slate-950 rounded-xl">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Graduates Std 1</span>
                        <span className="text-2xl font-black text-[#00A3A3] mt-1 block">{metrics.graduateCount}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Primary Transit</span>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-250/40 dark:border-slate-950 rounded-xl">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Re-entrant logs</span>
                        <span className="text-2xl font-black text-sky-500 mt-1 block">{metrics.reEntrantCount}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">Returned to class</span>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-250/40 dark:border-slate-950 rounded-xl">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Transfers In</span>
                        <span className="text-2xl font-black text-emerald-500 mt-1 block">{metrics.transferIn}</span>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-250/40 dark:border-slate-950 rounded-xl">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Transfers Out</span>
                        <span className="text-2xl font-black text-amber-500 mt-1 block">{metrics.transferOut}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#00A3A3]/5 rounded-xl border border-[#00A3A3]/20 flex justify-between items-center text-xs mt-4">
                    <span className="text-slate-600 dark:text-slate-350 font-bold">Total Minor Play injuries:</span>
                    <strong className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white font-mono">
                      {metrics.totalAccidents} cases
                    </strong>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "facilities" && (
            <motion.div
              key="tab-facilities"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Columns: Visual display of official supervision timeline monitoring */}
                <div className="lg:col-span-2 bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-850">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#00A3A3] uppercase block tracking-wider">Quality Assurance Inspections</span>
                      <h3 className="text-sm font-black text-[#002652] dark:text-slate-100 mt-1 uppercase">Official Inspector Visits</h3>
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-905 text-slate-550 px-2 py-1 rounded font-extrabold uppercase font-mono border dark:border-slate-900">
                      Latest Submission: {latestMonitoring?.dateSubmitted || "N/A"}
                    </span>
                  </div>

                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.visitingTimeline}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="visits" fill="#00A3A3" radius={[4, 4, 0, 0]}>
                          {metrics.visitingTimeline.map((e, index) => (
                            <Cell key={`cell-${index}`} fill={["#00A3A3", "#002652", "#ffd700", "#97620C", "#D97706", "#2563EB"][index % 6]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center mt-2">Visits by various Ministries and Council bodies during active reporting cycle</span>
                </div>

                {/* Right Column: CSE Comprehensive Sexuality Education compliance check */}
                <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-[#00D9D9]/25 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-50 dark:border-slate-850 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#00A3A3]" />
                      CSE Policy Alignment Checks
                    </h3>

                    <div className="space-y-2 mt-4 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-250/30 dark:border-slate-950">
                        <span className="font-bold text-slate-650 dark:text-slate-400 text-[11px]">Physical safety policy approved</span>
                        <span className="text-[10px] uppercase font-bold text-[#00A3A3]">{latestCse?.data?.A === "Yes" ? "Verified Yes" : "Pending"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-250/30 dark:border-slate-950">
                        <span className="font-bold text-slate-650 dark:text-slate-400 text-[11px]">Anti-discrimination & stigma rules</span>
                        <span className="text-[10px] uppercase font-bold text-[#00A3A3]">{latestCse?.data?.B === "Yes" ? "Verified Yes" : "Pending"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-250/30 dark:border-slate-950">
                        <span className="font-bold text-slate-650 dark:text-slate-400 text-[11px]">Strict harassment & sexual abuse protocol</span>
                        <span className="text-[10px] uppercase font-bold text-[#00A3A3]">{latestCse?.data?.C === "Yes" ? "Verified Yes" : "Pending"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-250/30 dark:border-slate-950">
                        <span className="font-bold text-slate-650 dark:text-slate-400 text-[11px]">Workplace HIV prevention program</span>
                        <span className="text-[10px] uppercase font-bold text-[#00A3A3]">{latestCse?.data?.Q === "Yes" ? "Verified Yes" : "Pending"}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-250/30 dark:border-slate-950">
                        <span className="font-bold text-slate-650 dark:text-slate-400 text-[11px]">HIV prevention care and support</span>
                        <span className="text-[10px] uppercase font-bold text-[#00A3A3]">{latestCse?.data?.R === "Yes" ? "Verified Yes" : "Pending"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#00A3A3]/5 rounded-xl border border-[#00A3A3]/10 text-xs mt-4">
                    <span className="font-extrabold text-[#002652] dark:text-[#00A3A3] block uppercase text-[10px] pb-1">CSE Implementation Score</span>
                    <p className="text-[10.5px] text-slate-500 leading-normal">
                      Kgomotso Pre-Primary is currently evaluated at <strong>{metrics.cseCompletionRate}% CSE compliant</strong>. Ensures standard orientation rules targets are satisfied.
                    </p>
                  </div>
                </div>

              </div>

              {/* Premises Quality, Infrastructure & outdoor Play equipment Checklist */}
              <div className="bg-white dark:bg-[#001020] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3]">
                    Authorized Premises & Playing Infrastructure checklists
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans text-slate-650 dark:text-slate-400">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-250/35 dark:border-slate-950 rounded-xl text-center flex flex-col justify-center items-center">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">Active Classrooms</span>
                    <strong className="text-xl font-black text-[#002652] dark:text-slate-100 mt-1">{metrics.classroomsCount} Rooms</strong>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-250/35 dark:border-slate-950 rounded-xl text-center flex flex-col justify-center items-center">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">Sanitation Ratios (Junior : Staff)</span>
                    <strong className="text-xl font-black text-[#002652] dark:text-slate-100 mt-1">{metrics.juniorToilets} : {metrics.staffToilets} Toilets</strong>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-250/35 dark:border-slate-950 rounded-xl text-center flex flex-col justify-center items-center">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">Playgrounds Equipment Assets</span>
                    <strong className="text-xl font-black text-[#002652] dark:text-slate-100 mt-1">{metrics.playgroundEquipCount} items</strong>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-250/35 dark:border-slate-950 rounded-xl text-center flex flex-col justify-center items-center">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">Fire & First-Aid Score</span>
                    <strong className="text-xl font-black text-[#002652] dark:text-slate-100 mt-1">
                      {metrics.safetySuppliesScore === 2 ? "Fully Equipped" : "Partial Compliance"}
                    </strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default EarlyChildhoodDashboard;
