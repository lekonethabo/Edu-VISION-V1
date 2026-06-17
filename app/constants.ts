import { 
  Student, 
  Teacher, 
  SupportStaff, 
  Transfer, 
  Dropout, 
  AbusedStudent, 
  ReEntrant, 
  TeacherMovement, 
  CseCategory, 
  Textbook, 
  Furniture, 
  EquipmentDisability, 
  BoardingFacility, 
  EquipmentItem, 
  RecreationalFacility, 
  Facilities, 
  SchoolInfo 
} from "./types";

export const INITIAL_STUDENTS: Student[] = [
  { id: "948325927", surname: "GAKEONYATSE", first: "MAIPELO LUNDY", nat: "Botswana", sex: "Female", dob: "2013-02-02", std: "Std 7", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "282820426", surname: "SANE", first: "KEOOBAMETSE ROSE", nat: "Botswana", sex: "Female", dob: "2013-04-26", std: "Std 7", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "644125529", surname: "KAJIMI", first: "TSEO LINDAH", nat: "Botswana", sex: "Female", dob: "2012-10-07", std: "Std 7", enrol: "RP - Returning on Promotion", social: "Ordinary", board: "No" },
  { id: "249514526", surname: "NTHUBU", first: "KITSO MORENA", nat: "Botswana", sex: "Male", dob: "2012-12-24", std: "Std 7", enrol: "RP - Returning on Promotion", social: "Ordinary", board: "No" },
  { id: "244113125", surname: "KARAMBUKA", first: "DUNCAN QOMA", nat: "Botswana", sex: "Male", dob: "2012-05-06", std: "Std 7", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "057715529", surname: "ABATSHO", first: "JOEL", nat: "Botswana", sex: "Male", dob: "2014-04-24", std: "Std 6", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "905626239", surname: "DIHAKABOI", first: "EMISANG", nat: "Botswana", sex: "Female", dob: "2013-11-20", std: "Std 6", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "307526631", surname: "DITHATHO", first: "REFILWE", nat: "Botswana", sex: "Female", dob: "2013-07-30", std: "Std 6", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "951017120", surname: "MAHATLHE", first: "PERCY VUSI", nat: "Botswana", sex: "Male", dob: "2014-07-15", std: "Std 5", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "083820022", surname: "KHOMATA", first: "BONNO PRECIOUS", nat: "Botswana", sex: "Female", dob: "2014-12-15", std: "Std 5", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "575627129", surname: "KHOMATA", first: "ELISA", nat: "Botswana", sex: "Female", dob: "2017-12-10", std: "Std 3", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "985816825", surname: "KHOMATA", first: "NIMROD", nat: "Botswana", sex: "Male", dob: "2017-03-08", std: "Std 3", enrol: "RP - Returning on Promotion", social: "Needy", board: "No" },
  { id: "795121529", surname: "TAMAMASI", first: "KHUMO KELLY CALIVER", nat: "Botswana", sex: "Female", dob: "2018-11-01", std: "Std 1", enrol: "N - First Entrant Citizen", social: "Needy", board: "No" },
  { id: "491819825", surname: "MOTSWASELE", first: "MELFA", nat: "Botswana", sex: "Male", dob: "2018-07-24", std: "Std 1", enrol: "N - First Entrant Citizen", social: "Ordinary", board: "No" }
];

export const INITIAL_TEACHERS: Teacher[] = [
  { 
    id: "504527511", surname: "MONTSHIWA", first: "PAKANE", sex: "Female", contract: "Permanent & Pensionable Teacher", 
    pos: "Senior Teacher", qual: "Degree-Primary Education", joined: "2021-12-30", ict: "Basic Skills", nat: "Botswana", 
    dob: "1988-03-14", sped: "Hearing Impairment",
    firstAppt: "2012-05-10", onStudyLeave: "No",
    trainingIct: "Yes", trainingGuidance: "Yes", trainingLeadership: "No", trainingSubject: "Yes",
    numSubjectTeaching: 2, teachingGuidance: "No", partTimeCourse: "No", teachersWithImpairments: "No",
    absNormalLeave: 0, absLeaveAugmentation: 0, absSpecialLeave: 2, absUnpaidLeave: 0, absUnauthorisedLeave: 0,
    absMaternityLeave: 0, absSickLeave: 3, absAttendingTraining: 5, absAttendingOtherDuties: 1
  },
  { 
    id: "042121999", surname: "MOSEMELE", first: "DULSIE LORATANG", sex: "Female", contract: "Permanent & Pensionable Teacher", 
    pos: "Teacher", qual: "Degree + PGDE", joined: "2023-03-02", ict: "Basic Skills", nat: "Botswana", 
    dob: "1991-07-22", sped: "None",
    firstAppt: "2018-02-15", onStudyLeave: "No",
    trainingIct: "No", trainingGuidance: "No", trainingLeadership: "No", trainingSubject: "Yes",
    numSubjectTeaching: 3, teachingGuidance: "No", partTimeCourse: "Yes", teachersWithImpairments: "No",
    absNormalLeave: 0, absLeaveAugmentation: 0, absSpecialLeave: 0, absUnpaidLeave: 0, absUnauthorisedLeave: 0,
    absMaternityLeave: 84, absSickLeave: 5, absAttendingTraining: 3, absAttendingOtherDuties: 2
  },
  { 
    id: "993612709", surname: "SERUMOLA", first: "MASEGO", sex: "Male", contract: "Permanent & Pensionable Teacher", 
    pos: "Senior Teacher", qual: "Diploma-Primary Education", joined: "2022-02-28", ict: "Basic Skills", nat: "Botswana", 
    dob: "1985-11-05", sped: "None",
    firstAppt: "2010-09-01", onStudyLeave: "No",
    trainingIct: "Yes", trainingGuidance: "No", trainingLeadership: "Yes", trainingSubject: "Yes",
    numSubjectTeaching: 2, teachingGuidance: "No", partTimeCourse: "No", teachersWithImpairments: "No",
    absNormalLeave: 0, absLeaveAugmentation: 2, absSpecialLeave: 1, absUnpaidLeave: 0, absUnauthorisedLeave: 0,
    absMaternityLeave: 0, absSickLeave: 1, absAttendingTraining: 4, absAttendingOtherDuties: 0
  },
  { 
    id: "485820600", surname: "SEITSANG", first: "BOIKANYO ELLEN", sex: "Female", contract: "Permanent & Pensionable Teacher", 
    pos: "Deputy School Head", qual: "Diploma-Primary Education", joined: "2023-08-14", ict: "Basic Skills", nat: "Botswana", 
    dob: "1982-02-14", sped: "Visual Impairment",
    firstAppt: "2005-01-20", onStudyLeave: "No",
    trainingIct: "No", trainingGuidance: "Yes", trainingLeadership: "Yes", trainingSubject: "No",
    numSubjectTeaching: 1, teachingGuidance: "Yes", partTimeCourse: "No", teachersWithImpairments: "Yes",
    absNormalLeave: 0, absLeaveAugmentation: 0, absSpecialLeave: 3, absUnpaidLeave: 0, absUnauthorisedLeave: 0,
    absMaternityLeave: 0, absSickLeave: 10, absAttendingTraining: 6, absAttendingOtherDuties: 5
  },
  { 
    id: "805518800", surname: "PHORI", first: "ALDRIN", sex: "Male", contract: "Permanent & Pensionable Teacher", 
    pos: "Senior Teacher", qual: "Diploma-Primary Education", joined: "2019-05-25", ict: "NONE", nat: "Botswana", 
    dob: "1984-06-18", sped: "None",
    firstAppt: "2009-06-10", onStudyLeave: "Yes",
    trainingIct: "No", trainingGuidance: "No", trainingLeadership: "No", trainingSubject: "No",
    numSubjectTeaching: 0, teachingGuidance: "No", partTimeCourse: "No", teachersWithImpairments: "No",
    absNormalLeave: 0, absLeaveAugmentation: 0, absSpecialLeave: 0, absUnpaidLeave: 0, absUnauthorisedLeave: 0,
    absMaternityLeave: 0, absSickLeave: 2, absAttendingTraining: 0, absAttendingOtherDuties: 0
  },
  { 
    id: "480026300", surname: "NTHUBU", first: "SEIPONE BOITSHEPO", sex: "Female", contract: "Permanent & Pensionable Teacher", 
    pos: "Senior Teacher", qual: "Degree - Guidance & Counselling", joined: "2019-07-25", ict: "Basic Skills", nat: "Botswana", 
    dob: "1989-10-30", sped: "None",
    firstAppt: "2014-04-12", onStudyLeave: "No",
    trainingIct: "Yes", trainingGuidance: "Yes", trainingLeadership: "No", trainingSubject: "Yes",
    numSubjectTeaching: 1, teachingGuidance: "Yes", partTimeCourse: "No", teachersWithImpairments: "No",
    absNormalLeave: 0, absLeaveAugmentation: 0, absSpecialLeave: 1, absUnpaidLeave: 0, absUnauthorisedLeave: 0,
    absMaternityLeave: 0, absSickLeave: 4, absAttendingTraining: 2, absAttendingOtherDuties: 3
  }
];

export const INITIAL_SUPPORT: SupportStaff[] = [
  { id: "179811614", surname: "LEKONE", first: "THABO", sex: "Male", pos: "Computer Programmer", contract: "Contract", qual: "Bachelors" },
  { id: "140425315", surname: "MOTHETHI", first: "SEBETSO", sex: "Female", pos: "Cleaner", contract: "Permanent & Pensionable", qual: "Diploma" },
  { id: "271314502", surname: "KGOLO", first: "ONKEMETSE", sex: "Male", pos: "Security Personnel", contract: "Permanent & Pensionable", qual: "Certificate" },
  { id: "106428000", surname: "KHOMATA", first: "SANA", sex: "Female", pos: "Cook", contract: "Permanent & Pensionable", qual: "PSLE" },
  { id: "870027300", surname: "THANE", first: "KEBASALETSE", sex: "Female", pos: "Kitchen Hand", contract: "Permanent & Pensionable", qual: "PSLE" }
];

export const INITIAL_TRANSFERS: Transfer[] = [
  { id: "382321228", surname: "SEGOBATSO", first: "AASA HOPE", nat: "Botswana", sex: "Female", dobDay: 1, dobMonth: 1, dobYear: 2015, std: "Std 2", status: "Transfer In", transferDay: 9, transferMonth: 1, transferYear: 2024, date: "2024-01-09", prev: "Kgomodiatshaba Primary" },
  { id: "755816726", surname: "TLHAKO", first: "NICO", nat: "Botswana", sex: "Male", dobDay: 5, dobMonth: 7, dobYear: 2013, std: "Std 4", status: "Transfer In", transferDay: 9, transferMonth: 1, transferYear: 2024, date: "2024-01-09", prev: "Mosiiwa P.S" },
  { id: "119213456", surname: "HABE", first: "KELEPILE", nat: "Botswana", sex: "Female", dobDay: 20, dobMonth: 4, dobYear: 2014, std: "Std 3", status: "Transfer Out", transferDay: 10, transferMonth: 1, transferYear: 2024, date: "2024-01-10", prev: "N/A" }
];

export const INITIAL_DROPOUTS: Dropout[] = [
  { id: "110719001", surname: "KAXABE", first: "LEKANG", nat: "Botswana", sex: "Male", dropoutDay: 16, dropoutMonth: 4, dropoutYear: 2024, date: "2024-04-16", std: "Std 5", reason: "Illness", deathCause: "N/A", specialNeeds: "No" },
  { id: "481021443", surname: "TSWIIGA", first: "TSHEPANG", nat: "Botswana", sex: "Female", dropoutDay: 17, dropoutMonth: 6, dropoutYear: 2024, date: "2024-06-17", std: "Std 7", reason: "Desertion", deathCause: "N/A", specialNeeds: "No" }
];

export const INITIAL_ABUSED_STUDENTS: AbusedStudent[] = [
  { id: "083820022", surname: "KHOMATA", first: "BONNO PRECIOUS", nat: "Botswana", sex: "Female", reportDay: 10, reportMonth: 5, reportYear: 2024, dateReported: "2024-05-10", std: "Std 5", typesOfAbuse: "Ordinary", abuseBullying: "No", abuseCorporal: "No", abuseHarassment: "No", abuseSexual: "No", abuseViolence: "Yes" },
  { id: "244113125", surname: "KARAMBUKA", first: "DUNCAN QOMA", nat: "Botswana", sex: "Male", reportDay: 1, reportMonth: 6, reportYear: 2024, dateReported: "2024-06-01", std: "Std 7", typesOfAbuse: "Vulnerable", abuseBullying: "Yes", abuseCorporal: "No", abuseHarassment: "No", abuseSexual: "No", abuseViolence: "No" }
];

export const INITIAL_RE_ENTRANTS: ReEntrant[] = [
  { id: "901112345", surname: "MOLAPISI", first: "TEBOGO", nat: "Botswana", sex: "Male", reEnterDay: 15, reEnterMonth: 1, reEnterYear: 2025, date: "2025-01-15", std: "Std 5", reasonDropped: "Desertion", yearDroppedOut: 2024 },
  { id: "311212345", surname: "KEKANA", first: "MMAMIDI", nat: "Botswana", sex: "Female", reEnterDay: 12, reEnterMonth: 5, reEnterYear: 2025, date: "2025-05-12", std: "Std 6", reasonDropped: "Family Financial distress", yearDroppedOut: 2023 }
];

export const INITIAL_TEACHER_MOVEMENT: TeacherMovement[] = [
  { 
    id: "TM-201", 
    name: "KGAODI GALEBOE", 
    type: "Arrival", 
    pos: "Teacher", 
    date: "2025-01-10", 
    path: "Transferred from Gantsi Primary", 
    details: "Standard vacancy replacement",
    nationalId: "504527511", 
    surname: "GALEBOE", 
    firstNames: "KGAODI", 
    nationality: "Botswana", 
    sex: "Male", 
    dobDay: 12, 
    dobMonth: 8, 
    dobYear: 1984, 
    contractType: "Permanent & Pensionable Teacher", 
    staffPosition: "Teacher", 
    reasonsForLeaving: "N/A" 
  },
  { 
    id: "TM-202", 
    name: "SELERIO KEIKANTSE", 
    type: "Departure", 
    pos: "Senior Teacher", 
    date: "2025-04-30", 
    path: "Transferred to Lobatse Primary", 
    details: "Promotional transfer",
    nationalId: "042121999", 
    surname: "KEIKANTSE", 
    firstNames: "SELERIO", 
    nationality: "Botswana", 
    sex: "Female", 
    dobDay: 24, 
    dobMonth: 11, 
    dobYear: 1978, 
    contractType: "Permanent & Pensionable Teacher", 
    staffPosition: "Senior Teacher", 
    reasonsForLeaving: "Transfer to Non-Teaching Post",
    deathReason: "N/A"
  }
];

export const INITIAL_CSE: CseCategory[] = [
  {
    id: "CSE-2025",
    academicYear: "2025",
    rulesPhysicalSafety: "Yes",
    rulesStigmaDiscrimination: "Yes",
    rulesSexualHarassmentAbuse: "Yes",
    
    sharingPhysicalStudents: "Meeting",
    sharingPhysicalTeachers: "Meeting & Writing",
    sharingPhysicalNonTeaching: "Meeting",
    sharingPhysicalParents: "Writing",
    sharingPhysicalSchoolBoard: "Meeting",
    
    sharingStigmaStudents: "Meeting & Writing",
    sharingStigmaTeachers: "Writing",
    sharingStigmaNonTeaching: "None",
    sharingStigmaParents: "Other",
    sharingStigmaSchoolBoard: "Writing",
    
    sharingHarassmentStudents: "Meeting & Writing",
    sharingHarassmentTeachers: "Writing",
    sharingHarassmentNonTeaching: "Writing",
    sharingHarassmentParents: "Meeting & Writing",
    sharingHarassmentSchoolBoard: "Meeting",
    
    lifeSkillsOrientation: "Yes",
    
    workplaceHivTraining: "Yes",
    workplacePreventionCare: "Yes",
    workplaceGrievanceDiscipline: "No",
    workplaceHivProgramme: "Yes",
    workplaceEnforcementGrievance: "Yes",
    workplaceEnvironmentalAwareness: "Yes",
    recordedBy: "MONTSHIWA PAKANE",
    lastUpdated: "2025-11-14"
  },
  {
    id: "CSE-2026",
    academicYear: "2026",
    rulesPhysicalSafety: "Yes",
    rulesStigmaDiscrimination: "No",
    rulesSexualHarassmentAbuse: "Yes",
    
    sharingPhysicalStudents: "Meeting & Writing",
    sharingPhysicalTeachers: "Meeting & Writing",
    sharingPhysicalNonTeaching: "Meeting & Writing",
    sharingPhysicalParents: "Meeting & Writing",
    sharingPhysicalSchoolBoard: "Meeting & Writing",
    
    sharingStigmaStudents: "Meeting",
    sharingStigmaTeachers: "Meeting",
    sharingStigmaNonTeaching: "Meeting",
    sharingStigmaParents: "Meeting",
    sharingStigmaSchoolBoard: "Meeting",
    
    sharingHarassmentStudents: "Writing",
    sharingHarassmentTeachers: "Writing",
    sharingHarassmentNonTeaching: "Writing",
    sharingHarassmentParents: "Writing",
    sharingHarassmentSchoolBoard: "Writing",
    
    lifeSkillsOrientation: "No",
    
    workplaceHivTraining: "No",
    workplacePreventionCare: "Yes",
    workplaceGrievanceDiscipline: "Yes",
    workplaceHivProgramme: "No",
    workplaceEnforcementGrievance: "Yes",
    workplaceEnvironmentalAwareness: "No",
    recordedBy: "NTHUBU SEIPONE BOITSHEPO",
    lastUpdated: "2026-06-12"
  }
];

export const INITIAL_TEXTBOOKS: Textbook[] = (() => {
  const list: Textbook[] = [];
  let idCounter = 1;
  const now = new Date().toISOString().split("T")[0];
  
  for (let s = 1; s <= 7; s++) {
    const stdName = `Std${s}`;
    const subjects = s <= 4 
      ? ["English", "Setswana", "Mathematics", "Guidance & Counselling", "CAPA", "Environmental Science", "Cultural Studies"]
      : ["English", "Setswana", "Mathematics", "Guidance & Counselling", "CAPA", "Science", "Social Studies", "Agriculture", "Religious & Moral Education"];
      
    for (const subject of subjects) {
      const quantity = Math.floor(Math.random() * 50) + 10;
      
      list.push({
        id: `TX-${idCounter.toString().padStart(4, '0')}`,
        subject,
        std: stdName,
        quantity,
        dateEntered: now,
        lastModified: now
      });
      idCounter++;
    }
  }
  return list;
})();

export const INITIAL_FURNITURE: Furniture[] = [
  {
    id: "FN-01",
    dateSubmitted: "2024-01-15",
    desk1: 120,
    desk2: 60,
    desk3: 0,
    pupilsTables: 20,
    pupilsChairs: 160,
    teachersTables: 8,
    teachersChairs: 9,
    cupboardsLockers: 4,
    fixedChalkBoard: 8,
    whiteBoards: 1,
    movableChalkBoard: 0,
    smartboards: 0
  }
];

export const INITIAL_EQUIPMENT_DISABILITY: EquipmentDisability[] = [
  { id: "ED-01", itemType: "Braille books", available: 12 },
  { id: "ED-02", itemType: "Computers for pupils", available: 4 }
];

export const INITIAL_BOARDING_FACILITIES: BoardingFacility[] = [
  { id: "BF-01", blockName: "Kgalagadi Boys Block", sex: "Male", capacity: 60, domRooms: 4, standardBeds: 50, flushToilets: 2, pitLatrines: 0, toiletsPwd: 0, showers: 4, washingBasins: 4, washingTroughs: 2, geysers: 2, ramps: 1, condition: "Good", activeOccupants: 48 },
  { id: "BF-02", blockName: "Kgalagadi Girls Block", sex: "Female", capacity: 60, domRooms: 4, standardBeds: 52, flushToilets: 2, pitLatrines: 0, toiletsPwd: 1, showers: 5, washingBasins: 5, washingTroughs: 2, geysers: 2, ramps: 1, condition: "Needs Renovation", activeOccupants: 51 }
];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  { id: "EQ-01", itemType: "Desktops / Laptops", available: 15, working: 12, broken: 3, notes: "Computer lab workstations" },
  { id: "EQ-02", itemType: "Digital Projectors", available: 2, working: 2, broken: 0, notes: "Shared visual aids" },
  { id: "EQ-03", itemType: "Duplicator Machine", available: 1, working: 1, broken: 0, notes: "High speed exam printer" }
];

export const INITIAL_RECREATIONAL_FACILITIES: RecreationalFacility[] = [
  { id: "RF-01", name: "Football Pitch", status: "Functional", lastInspected: "2025-05-12", notes: "Silt cleared, goals repainted." },
  { id: "RF-02", name: "Netball Court", status: "Needs Maintenance", lastInspected: "2025-03-22", notes: "Surface requires resurfacing." },
  { id: "RF-03", name: "Children Play Area", status: "Functional", lastInspected: "2025-06-01", notes: "Swings and slides inspected for safety." }
];

export const INITIAL_FACILITIES: Facilities = {
  classrooms: 8,
  classroomsWc: 1,
  spedClassrooms: 0,
  computerLabs: 1,
  library: 1,
  pitBoys: 7,
  pitGirls: 7,
  flushBoys: 2,
  flushGirls: 2,
  toiletsPwd: 1,
  noticeBoards: 2,
  computersTeaching: 15,
  tablets: 50,
  projectors: 3,
  vehicles: 0,
  adminBlock: 1,
  staffRooms: 1,
  staffOffices: 5,
  adminOfficesWc: 0,
  staffHouses1Bed: 0,
  staffHouses2Bed: 10,
  staffHouses3Bed: 0,
  staffHouses4Bed: 0,
  agricLabs: 1,
  scienceLabs: 1,
  homeEconLabs: 1,
  artLabs: 0,
  dtLabs: 0,
  labsWc: 0,
  resourceRoom: 1,
  counselingRoom: 1,
  multipurposeHall: 0,
  assemblyHall: 1,
  diningHall: 1,
  hallsWc: 0,
  kitchen: 1,
  toiletsTeachers: 2,
  toiletsTeachersPwd: 0,
  toiletsTeachersWc: 1,
  handRails: 4,
  ramps: 1,
  schoolGarden: 1,
  otherFacilities: []
};

export const INITIAL_SCHOOL_INFO: SchoolInfo = {
  name: "Inalegolo Primary School",
  regNum: "E5/7/29",
  district: "Kgalagadi",
  region: "Kgalagadi Region",
  subRegion: "Kgalagadi North",
  village: "Hukuntsi",
  extensionWard: "Inalegolo Ward",
  schoolType: "Government",
  registrationStatus: "Registered",
  email: "inalegolops@gmail.com",
  tel: "+267 6511173",
  fax: "+267 6511174",
  electricitySource: "Solar Power",
  waterSource: "Stand Pipe (WUC)",
  internetType: "LAN + Wi-Fi",
  internetSpeed: "10",
  internetCoverage: "Partial",
  totalStreams: 7,
  streamsStd1: 1,
  streamsStd2: 1,
  streamsStd3: 1,
  streamsStd4: 1,
  streamsStd5: 1,
  streamsStd6: 1,
  streamsStd7: 1,
  streamCheck: "Verified",
  shifting: "No",
  boarding: "No",
  multigradeClasses: "No",
  multigradeClassList: "None",
  multigradeEnrolment: "None",
  hasSpedUnit: "No",
  hasTransportDisabled: "No",
  securityInPlace: "Internal"
};
