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

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_TEACHERS: Teacher[] = [];

export const INITIAL_SUPPORT: SupportStaff[] = [];

export const INITIAL_TRANSFERS: Transfer[] = [];

export const INITIAL_DROPOUTS: Dropout[] = [];

export const INITIAL_ABUSED_STUDENTS: AbusedStudent[] = [];

export const INITIAL_RE_ENTRANTS: ReEntrant[] = [];

export const INITIAL_TEACHER_MOVEMENT: TeacherMovement[] = [];

export const INITIAL_CSE: CseCategory[] = [];

export const INITIAL_TEXTBOOKS: Textbook[] = [];

export const INITIAL_FURNITURE: Furniture[] = [];

export const INITIAL_EQUIPMENT_DISABILITY: EquipmentDisability[] = [];

export const INITIAL_BOARDING_FACILITIES: BoardingFacility[] = [];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [];

export const INITIAL_RECREATIONAL_FACILITIES: RecreationalFacility[] = [];

export const INITIAL_FACILITIES: Facilities = {
  classrooms: 0,
  classroomsWc: 0,
  spedClassrooms: 0,
  computerLabs: 0,
  library: 0,
  pitBoys: 0,
  pitGirls: 0,
  flushBoys: 0,
  flushGirls: 0,
  toiletsPwd: 0,
  noticeBoards: 0,
  computersTeaching: 0,
  tablets: 0,
  projectors: 0,
  vehicles: 0,
  adminBlock: 0,
  staffRooms: 0,
  staffOffices: 0,
  adminOfficesWc: 0,
  staffHouses1Bed: 0,
  staffHouses2Bed: 0,
  staffHouses3Bed: 0,
  staffHouses4Bed: 0,
  agricLabs: 0,
  scienceLabs: 0,
  homeEconLabs: 0,
  artLabs: 0,
  dtLabs: 0,
  labsWc: 0,
  resourceRoom: 0,
  counselingRoom: 0,
  multipurposeHall: 0,
  assemblyHall: 0,
  diningHall: 0,
  hallsWc: 0,
  kitchen: 0,
  toiletsTeachers: 0,
  toiletsTeachersPwd: 0,
  toiletsTeachersWc: 0,
  handRails: 0,
  ramps: 0,
  schoolGarden: 0,
  otherFacilities: []
};

export const INITIAL_SCHOOL_INFO: SchoolInfo = {
  name: "",
  regNum: "",
  district: "",
  region: "",
  subRegion: "",
  village: "",
  extensionWard: "",
  schoolType: "Government",
  registrationStatus: "Registered",
  email: "",
  tel: "",
  fax: "",
  electricitySource: "Grid Power (BPC)",
  waterSource: "Stand Pipe (WUC)",
  internetType: "None",
  internetSpeed: "",
  internetCoverage: "None",
  totalStreams: 0,
  streamsStd1: 0,
  streamsStd2: 0,
  streamsStd3: 0,
  streamsStd4: 0,
  streamsStd5: 0,
  streamsStd6: 0,
  streamsStd7: 0,
  streamCheck: "Verified",
  shifting: "No",
  boarding: "No",
  multigradeClasses: "No",
  multigradeClassList: "",
  multigradeEnrolment: "",
  hasSpedUnit: "No",
  hasTransportDisabled: "No",
  securityInPlace: "NONE"
};
