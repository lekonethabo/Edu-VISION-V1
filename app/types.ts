export interface Student {
  id: string; // NATIONAL_ID_PASSPORT
  surname: string; // SURNAME
  first: string; // FIRST_NAMES
  nat: string; // NATIONALITY
  sex: "Male" | "Female"; // SEX
  dob: string; // unified date string YYYY-MM-DD
  dobDay?: number; // DAY
  dobMonth?: number; // MONTH
  dobYear?: number; // YEAR
  std: string; // STANDARD
  enrol: string; // STUDENT_ENROLMENT_STATUS
  social?: string | string[]; // STUDENT_SOCIAL_STATUS (can be string or string[])
  supportOvc?: string[]; // SUPPORT_FOR_OVCs
  board: "Yes" | "No"; // BOARDING
  shifting?: "Morning" | "Afternoon" | "Full Day"; // SHIFTING
  prePrimary?: "Yes" | "No"; // PRE_PRIMARY_ATTENDANCE
  specialNeeds?: "Yes" | "No"; // SPECIAL_EDUCATION_NEEDS
  typeOfSend?: string[]; // TYPE_OF_SEND
  supportServicesSend?: string[]; // SUPPORT_SERVICES_TO_SEND
  sen?: string; // legacy support field
}

export interface Teacher {
  id: string;
  surname: string;
  first: string;
  sex: "Male" | "Female";
  contract: string;
  pos: string;
  qual: string;
  joined: string;
  ict: string;
  nat: string;
  dob: string;
  sped: "None" | "Hearing Impairment" | "Intellectual Disabilities" | "Hearing Disabilities" | "Visual Impairment" | "Multiple Disabilities";
  
  // Ministry Census Fields
  firstAppt: string; // Date of First Appointment
  onStudyLeave: "Yes" | "No";
  
  // In-Service Training & Assignments
  trainingIct: "Yes" | "No";
  trainingGuidance: "Yes" | "No";
  trainingLeadership: "Yes" | "No";
  trainingSubject: "Yes" | "No";
  numSubjectTeaching: number;
  teachingGuidance: "Yes" | "No";
  partTimeCourse: "Yes" | "No";
  teachersWithImpairments: "Yes" | "No" | "Hearing" | "Visual" | "Physical" | "Speech" | "Multiple" | "Other" | "None";
  
  // Absence tracking (Numbers of days in previous year)
  absNormalLeave: number;
  absLeaveAugmentation: number;
  absSpecialLeave: number;
  absUnpaidLeave: number;
  absUnauthorisedLeave: number;
  absMaternityLeave: number;
  absSickLeave: number;
  absAttendingTraining: number;
  absAttendingOtherDuties: number;
}

export interface SupportStaff {
  id: string;
  surname: string;
  first: string;
  sex: "Male" | "Female";
  pos: string;
  contract: string;
  qual: string;
  nat?: string;
  dobDay?: number | "";
  dobMonth?: number | "";
  dobYear?: number | "";
  firstApptDay?: number | "";
  firstApptMonth?: number | "";
  firstApptYear?: number | "";
  joinedDay?: number | "";
  joinedMonth?: number | "";
  joinedYear?: number | "";
  ict?: string;
  trainingIct?: string;
  trainingLeadership?: string;
  trainingProfession?: string;
  absNormalLeave?: number;
  absLeaveAugmentation?: number;
  absSpecialLeave?: number;
  absUnpaidLeave?: number;
  absUnauthorisedLeave?: number;
  absMaternityLeave?: number;
  absSickLeave?: number;
  absAttendingTraining?: number;
  absAttendingOtherDuties?: number;
}

export interface Transfer {
  id: string;
  surname: string;
  first: string;
  nat: string;
  sex: "Male" | "Female" | "";
  dobDay: number | "";
  dobMonth: number | "";
  dobYear: number | "";
  std: string;
  status: "Transfer In" | "Transfer Out";
  transferDay: number | "";
  transferMonth: number | "";
  transferYear: number | "";
  date: string;
  prev: string;
}

export interface Dropout {
  id: string; // NATIONAL ID/ PASSPORT
  surname: string;
  first: string;
  nat: string;
  sex: "Male" | "Female" | "";
  dropoutDay: number | "";
  dropoutMonth: number | "";
  dropoutYear: number | "";
  date: string;
  std: string;
  reason: string;
  deathCause: string;
  specialNeeds: "Yes" | "No" | "";
}

export interface AbusedStudent {
  id: string;
  surname: string;
  first: string;
  nat: string;
  sex: "Male" | "Female" | "";
  reportDay: number | "";
  reportMonth: number | "";
  reportYear: number | "";
  dateReported: string;
  std: string;
  typesOfAbuse: string;
  abuseBullying?: "Yes" | "No";
  abuseCorporal?: "Yes" | "No";
  abuseHarassment?: "Yes" | "No";
  abuseSexual?: "Yes" | "No";
  abuseViolence?: "Yes" | "No";
}

export interface TeacherSpecialProgramme {
  id: string;
  teacherId: string;
}

export interface ReEntrant {
  id: string;
  surname: string;
  first: string;
  nat: string;
  sex: "Male" | "Female" | "";
  reEnterDay: number | "";
  reEnterMonth: number | "";
  reEnterYear: number | "";
  date: string;
  std: string;
  reasonDropped: string;
  yearDroppedOut: number | "";
}

export interface TeacherMovement {
  id: string;
  name: string;
  type: "Arrival" | "Departure";
  pos: string;
  date: string;
  path: string;
  details: string;
  nationalId?: string;
  surname?: string;
  firstNames?: string;
  nationality?: string;
  sex?: string;
  dobDay?: number | "";
  dobMonth?: number | "";
  dobYear?: number | "";
  contractType?: string;
  staffPosition?: string;
  reasonsForLeaving?: string;
  deathReason?: string;
}

export interface CseCategory {
  id: string;
  academicYear: string;
  
  rulesPhysicalSafety: "Yes" | "No";
  rulesStigmaDiscrimination: "Yes" | "No";
  rulesSexualHarassmentAbuse: "Yes" | "No";

  sharingPhysicalStudents: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingPhysicalTeachers: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingPhysicalNonTeaching: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingPhysicalParents: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingPhysicalSchoolBoard: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";

  sharingStigmaStudents: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingStigmaTeachers: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingStigmaNonTeaching: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingStigmaParents: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingStigmaSchoolBoard: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";

  sharingHarassmentStudents: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingHarassmentTeachers: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingHarassmentNonTeaching: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingHarassmentParents: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";
  sharingHarassmentSchoolBoard: "Meeting" | "Writing" | "Meeting & Writing" | "Other" | "None";

  lifeSkillsOrientation: "Yes" | "No";

  workplaceHivTraining: "Yes" | "No";
  workplacePreventionCare: "Yes" | "No";
  workplaceGrievanceDiscipline: "Yes" | "No";
  workplaceHivProgramme: "Yes" | "No";
  workplaceEnforcementGrievance: "Yes" | "No";
  workplaceEnvironmentalAwareness: "Yes" | "No";

  recordedBy: string;
  lastUpdated: string;
}

export interface Textbook {
  id: string;
  subject: string;
  std: string;
  quantity: number;
  dateEntered: string;
  lastModified: string;
}

export interface Furniture {
  id: string;
  dateSubmitted: string;
  desk1: number;
  desk2: number;
  desk3: number;
  pupilsTables: number;
  pupilsChairs: number;
  teachersTables: number;
  teachersChairs: number;
  cupboardsLockers: number;
  fixedChalkBoard: number;
  whiteBoards: number;
  movableChalkBoard: number;
  smartboards: number;
}

export interface EquipmentDisability {
  id: string;
  itemType: string;
  available: number;
}

export interface BoardingFacility {
  id: string;
  blockName: string;
  sex: "Male" | "Female" | "Mixed";
  capacity: number;
  domRooms: number;
  standardBeds: number;
  flushToilets: number;
  pitLatrines: number;
  toiletsPwd: number;
  showers: number;
  washingBasins: number;
  washingTroughs: number;
  geysers: number;
  ramps: number;
  condition: "Good" | "Fair" | "Needs Renovation";
  activeOccupants: number;
}

export interface EquipmentItem {
  id: string;
  itemType: string;
  available: number;
  working: number;
  broken: number;
  notes: string;
}

export interface RecreationalFacility {
  id: string;
  name: string;
  status: "Functional" | "Needs Maintenance" | "Unavailable";
  lastInspected: string;
  notes: string;
  quantity?: number;
  accessible?: string;
  accessibilityFeatures?: string;
}

export interface Facilities {
  classrooms: number;
  classroomsWc: number;
  spedClassrooms: number;
  computerLabs: number;
  library: number;
  pitBoys: number;
  pitGirls: number;
  flushBoys: number;
  flushGirls: number;
  toiletsPwd: number;
  noticeBoards: number;
  computersTeaching: number;
  tablets: number;
  projectors: number;
  vehicles: number;
  adminBlock: number;
  staffRooms: number;
  staffOffices: number;
  adminOfficesWc: number;
  staffHouses1Bed: number;
  staffHouses2Bed: number;
  staffHouses3Bed: number;
  staffHouses4Bed: number;
  agricLabs: number;
  scienceLabs: number;
  homeEconLabs: number;
  artLabs: number;
  dtLabs: number;
  labsWc: number;
  resourceRoom: number;
  counselingRoom: number;
  multipurposeHall: number;
  assemblyHall: number;
  diningHall: number;
  hallsWc: number;
  kitchen: number;
  toiletsTeachers: number;
  toiletsTeachersPwd: number;
  toiletsTeachersWc: number;
  handRails: number;
  ramps: number;
  schoolGarden: number;
  otherFacilities?: Array<{ name: string; count: number }>;
}

export interface SchoolInfo {
  // Basic Info
  name: string;
  regNum: string;
  schoolType: "Government" | "Private" | "Mission" | "Government Aided";
  registrationStatus: "Registered" | "Pending" | "Closed" | "Provisionally Registered";
  
  // Location
  district: string;
  region: string;
  subRegion: string;
  village: string;
  extensionWard: string;
  
  // Contact
  email: string;
  tel: string;
  fax: string;
  
  // Streams
  totalStreams: number;
  streamsStd1: number;
  streamsStd2: number;
  streamsStd3: number;
  streamsStd4: number;
  streamsStd5: number;
  streamsStd6: number;
  streamsStd7: number;
  streamCheck: "Verified" | "Error / Review Needed" | "On Hold";
  
  // Operations
  shifting: "Yes" | "No";
  boarding: "Yes" | "No";
  multigradeClasses: "Yes" | "No";
  multigradeClassList: string;
  multigradeEnrolment: string;
  
  // Inclusive Education
  hasSpedUnit: "Yes" | "No";
  hasTransportDisabled: "Yes" | "No";
  securityInPlace: "Internal" | "Outsourced" | "Internal and Outsourced" | "NONE";
  
  // Utilities
  electricitySource: "Solar Power" | "Grid Power (BPC)" | "Generator" | "None";
  waterSource: "Stand Pipe (WUC)" | "Borehole" | "Water Tanker" | "None";
  internetType: "LAN + Wi-Fi" | "Wi-Fi Only" | "Mobile Data" | "Satellite / VSAT" | "None";
  internetSpeed: string;
  internetCoverage: "Full" | "Partial" | "None";
}

export interface SchoolFormField {
  label: string;
  key: keyof SchoolInfo;
  options?: string[];
  placeholder?: string;
}

// --- Normalization Helpers ---
export const normalizeStudent = (s: any): Student => {
  let dobDay = s.dobDay;
  let dobMonth = s.dobMonth;
  let dobYear = s.dobYear;
  if (s.dob && (!dobDay || !dobMonth || !dobYear)) {
    const parts = s.dob.split("-");
    if (parts.length === 3) {
      dobYear = parseInt(parts[0], 10);
      dobMonth = parseInt(parts[1], 10);
      dobDay = parseInt(parts[2], 10);
    }
  }

  let socialArr: string[] = [];
  if (s.social) {
    if (Array.isArray(s.social)) {
      socialArr = s.social;
    } else {
      socialArr = [s.social];
    }
  } else {
    socialArr = ["Ordinary"];
  }

  let subOvc: string[] = [];
  if (s.supportOvc) {
    subOvc = Array.isArray(s.supportOvc) ? s.supportOvc : [s.supportOvc];
  } else {
    subOvc = ["NONE"];
  }

  let sendArr: string[] = [];
  if (s.typeOfSend) {
    sendArr = Array.isArray(s.typeOfSend) ? s.typeOfSend : [s.typeOfSend];
  } else if (s.sen && s.sen !== "None") {
    sendArr = [s.sen];
  }

  let servicesArr: string[] = [];
  if (s.supportServicesSend) {
    servicesArr = Array.isArray(s.supportServicesSend) ? s.supportServicesSend : [s.supportServicesSend];
  } else {
    servicesArr = ["NONE"];
  }

  return {
    id: s.id || "",
    surname: (s.surname || "").toUpperCase(),
    first: s.first || "",
    nat: s.nat || "Botswana",
    sex: s.sex || "Female",
    dob: s.dob || "2015-01-01",
    dobDay: dobDay || 1,
    dobMonth: dobMonth || 1,
    dobYear: dobYear || 2015,
    std: s.std || "Std 1",
    enrol: s.enrol || "N - First Entrant Citizen",
    social: socialArr,
    supportOvc: subOvc,
    board: s.board || "No",
    shifting: s.shifting || "Full Day",
    prePrimary: s.prePrimary || "Yes",
    specialNeeds: s.specialNeeds || (s.sen && s.sen !== "None" ? "Yes" : "No"),
    typeOfSend: sendArr,
    supportServicesSend: servicesArr,
    sen: s.sen || (s.specialNeeds === "Yes" ? (sendArr[0] || "Yes") : "None")
  };
};

export const normalizeTeacher = (t: any): Teacher => {
  return {
    id: t.id || "",
    surname: (t.surname || "").toUpperCase(),
    first: t.first || "",
    sex: t.sex || "Female",
    contract: t.contract || "Permanent & Pensionable Teacher",
    pos: t.pos || "Teacher",
    qual: t.qual || "Primary Teaching Certificate",
    joined: t.joined || "2024-01-10",
    ict: t.ict || "Basic Skills",
    nat: t.nat || "Botswana",
    dob: t.dob || "1990-01-01",
    sped: t.sped || "None",
    firstAppt: t.firstAppt || "2015-01-01",
    onStudyLeave: t.onStudyLeave || "No",
    trainingIct: t.trainingIct || "No",
    trainingGuidance: t.trainingGuidance || "No",
    trainingLeadership: t.trainingLeadership || "No",
    trainingSubject: t.trainingSubject || "No",
    numSubjectTeaching: typeof t.numSubjectTeaching === 'number' ? t.numSubjectTeaching : (parseInt(t.numSubjectTeaching) || 0),
    teachingGuidance: t.teachingGuidance || "No",
    partTimeCourse: t.partTimeCourse || "No",
    teachersWithImpairments: t.teachersWithImpairments || "No",
    
    absNormalLeave: typeof t.absNormalLeave === 'number' ? t.absNormalLeave : (parseInt(t.absNormalLeave) || 0),
    absLeaveAugmentation: typeof t.absLeaveAugmentation === 'number' ? t.absLeaveAugmentation : (parseInt(t.absLeaveAugmentation) || 0),
    absSpecialLeave: typeof t.absSpecialLeave === 'number' ? t.absSpecialLeave : (parseInt(t.absSpecialLeave) || 0),
    absUnpaidLeave: typeof t.absUnpaidLeave === 'number' ? t.absUnpaidLeave : (parseInt(t.absUnpaidLeave) || 0),
    absUnauthorisedLeave: typeof t.absUnauthorisedLeave === 'number' ? t.absUnauthorisedLeave : (parseInt(t.absUnauthorisedLeave) || 0),
    absMaternityLeave: typeof t.absMaternityLeave === 'number' ? t.absMaternityLeave : (parseInt(t.absMaternityLeave) || 0),
    absSickLeave: typeof t.absSickLeave === 'number' ? t.absSickLeave : (parseInt(t.absSickLeave) || 0),
    absAttendingTraining: typeof t.absAttendingTraining === 'number' ? t.absAttendingTraining : (parseInt(t.absAttendingTraining) || 0),
    absAttendingOtherDuties: typeof t.absAttendingOtherDuties === 'number' ? t.absAttendingOtherDuties : (parseInt(t.absAttendingOtherDuties) || 0),
  };
};

export const normalizeSupport = (s: any): SupportStaff => {
  return {
    id: s.id || "",
    surname: (s.surname || "").toUpperCase(),
    first: s.first || "",
    sex: s.sex || "Female",
    pos: s.pos || "Cleaner",
    contract: s.contract || "Permanent & Pensionable",
    qual: s.qual || "PSLE",
    nat: s.nat || "Botswana",
    dobDay: s.dobDay !== undefined && s.dobDay !== "" ? Number(s.dobDay) : "",
    dobMonth: s.dobMonth !== undefined && s.dobMonth !== "" ? Number(s.dobMonth) : "",
    dobYear: s.dobYear !== undefined && s.dobYear !== "" ? Number(s.dobYear) : "",
    firstApptDay: s.firstApptDay !== undefined && s.firstApptDay !== "" ? Number(s.firstApptDay) : "",
    firstApptMonth: s.firstApptMonth !== undefined && s.firstApptMonth !== "" ? Number(s.firstApptMonth) : "",
    firstApptYear: s.firstApptYear !== undefined && s.firstApptYear !== "" ? Number(s.firstApptYear) : "",
    joinedDay: s.joinedDay !== undefined && s.joinedDay !== "" ? Number(s.joinedDay) : "",
    joinedMonth: s.joinedMonth !== undefined && s.joinedMonth !== "" ? Number(s.joinedMonth) : "",
    joinedYear: s.joinedYear !== undefined && s.joinedYear !== "" ? Number(s.joinedYear) : "",
    ict: s.ict || "NONE",
    trainingIct: s.trainingIct || "Computer Awareness",
    trainingLeadership: s.trainingLeadership || "",
    trainingProfession: s.trainingProfession || "",
    absNormalLeave: typeof s.absNormalLeave === 'number' ? s.absNormalLeave : (parseInt(s.absNormalLeave) || 0),
    absLeaveAugmentation: typeof s.absLeaveAugmentation === 'number' ? s.absLeaveAugmentation : (parseInt(s.absLeaveAugmentation) || 0),
    absSpecialLeave: typeof s.absSpecialLeave === 'number' ? s.absSpecialLeave : (parseInt(s.absSpecialLeave) || 0),
    absUnpaidLeave: typeof s.absUnpaidLeave === 'number' ? s.absUnpaidLeave : (parseInt(s.absUnpaidLeave) || 0),
    absUnauthorisedLeave: typeof s.absUnauthorisedLeave === 'number' ? s.absUnauthorisedLeave : (parseInt(s.absUnauthorisedLeave) || 0),
    absMaternityLeave: typeof s.absMaternityLeave === 'number' ? s.absMaternityLeave : (parseInt(s.absMaternityLeave) || 0),
    absSickLeave: typeof s.absSickLeave === 'number' ? s.absSickLeave : (parseInt(s.absSickLeave) || 0),
    absAttendingTraining: typeof s.absAttendingTraining === 'number' ? s.absAttendingTraining : (parseInt(s.absAttendingTraining) || 0),
    absAttendingOtherDuties: typeof s.absAttendingOtherDuties === 'number' ? s.absAttendingOtherDuties : (parseInt(s.absAttendingOtherDuties) || 0),
  };
};
