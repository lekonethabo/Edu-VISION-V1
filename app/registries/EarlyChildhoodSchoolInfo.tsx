"use client";

import React, { useState } from "react";
import { 
  Building, 
  MapPin, 
  Banknote, 
  Home, 
  PhoneCall, 
  Save, 
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";

interface ECSchoolInfo {
  schoolName: string;
  district: string;
  educationRegion: string;
  subRegion: string;
  cityTownVillage: string;
  extensionWard: string;
  
  centreRegistrationStatus: string;
  centreRegistrationNumber: string;
  yearOfEstablishment: string;
  typeOfCentreSchool: string;
  typeOfPremises: string;
  statusOfPremises: string;
  serviceProvided: string;
  ownership: string;
  
  feesHalfDay: string;
  feesFullDay: string;
  mealsGivenToChildren: string;
  
  internetType: string;
  speed: string;
  coverage: string;
  sourceElectricity: string;
  sourceWater: string;
  securityInPlace: string;
  
  telephone: string;
  fax: string;
  email: string;
}

const INITIAL_EC_SCHOOL_INFO: ECSchoolInfo = {
  schoolName: "",
  district: "",
  educationRegion: "",
  subRegion: "",
  cityTownVillage: "",
  extensionWard: "",
  centreRegistrationStatus: "Registered",
  centreRegistrationNumber: "",
  yearOfEstablishment: "",
  typeOfCentreSchool: "Pre-Primary",
  typeOfPremises: "Purpose Built",
  statusOfPremises: "Good",
  serviceProvided: "Full Day",
  ownership: "Private",
  feesHalfDay: "",
  feesFullDay: "",
  mealsGivenToChildren: "Yes",
  internetType: "None",
  speed: "",
  coverage: "None",
  sourceElectricity: "Grid Power (BPC)",
  sourceWater: "Stand Pipe (WUC)",
  securityInPlace: "Internal",
  telephone: "",
  fax: "",
  email: ""
};

export const EarlyChildhoodSchoolInfo: React.FC = () => {
  const { items, updateItem } = useLocalStorage<ECSchoolInfo>(
    "edu_vision_ec_school_info",
    [INITIAL_EC_SCHOOL_INFO]
  );

  const savedData = items[0] || INITIAL_EC_SCHOOL_INFO;
  const [formData, setFormData] = useState<ECSchoolInfo>({ ...savedData });
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleFieldChange = (key: keyof ECSchoolInfo, val: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateItem(formData);
    triggerAlert("Early Childhood Centre Information saved successfully.", "success");
  };

  const handleClear = () => {
    setFormData({ ...INITIAL_EC_SCHOOL_INFO });
    triggerAlert("Form cleared to defaults.", "success");
  };

  return (
    <div className="space-y-6" id="ece-school-info-registry">
      {/* Alerts */}
      {alert && (
        <div 
          className={`p-4 rounded-xl border flex items-start gap-3.5 text-xs font-semibold ${
            alert.type === "success" 
              ? "bg-[#00A3A3]/10 border-[#00A3A3] text-[#00A3A3]" 
              : "bg-amber-500/10 border-amber-500 text-amber-500"
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="space-y-0.5 mt-0.5">
            <span className="font-bold block uppercase tracking-wider">
              {alert.type === "success" ? "System Notification" : "Error"}
            </span>
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <SectionContainer
        title="Early Childhood School Info Registry"
        description="Maintain critical administrative, geographic, and operational indicators for Pre-Primary centres."
      >
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <h3 className="text-sm font-black text-[#002652] dark:text-[#00A3A3] uppercase tracking-wide">
                CENTRE CONFIGURATION
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Last updated state registry
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00A3A3] hover:bg-[#002652] text-[#F7FAFC] rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Registry</span>
              </button>
            </div>
          </div>

          {/* Section 1: School Identification */}
          <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#002652] dark:text-[#00A3A3] flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Section 1: School Identification</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SCHOOL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => handleFieldChange("schoolName", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  DISTRICT
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleFieldChange("district", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  EDUCATION REGION
                </label>
                <input
                  type="text"
                  value={formData.educationRegion}
                  onChange={(e) => handleFieldChange("educationRegion", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SUB-REGION
                </label>
                <input
                  type="text"
                  value={formData.subRegion}
                  onChange={(e) => handleFieldChange("subRegion", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  CITY/TOWN/ VILLAGE
                </label>
                <input
                  type="text"
                  value={formData.cityTownVillage}
                  onChange={(e) => handleFieldChange("cityTownVillage", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  EXTENSION/WARD
                </label>
                <input
                  type="text"
                  value={formData.extensionWard}
                  onChange={(e) => handleFieldChange("extensionWard", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Registration & Establishment */}
          <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#002652] dark:text-[#00A3A3] flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>Section 2: Registration & Establishment</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  CENTRE REGISTRATION STATUS
                </label>
                <select
                  value={formData.centreRegistrationStatus}
                  onChange={(e) => handleFieldChange("centreRegistrationStatus", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Registered">Registered</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                  <option value="Provisionally Registered">Provisionally Registered</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  CENTRE REGISTRATION NUMBER *
                </label>
                <input
                  type="text"
                  required
                  value={formData.centreRegistrationNumber}
                  onChange={(e) => handleFieldChange("centreRegistrationNumber", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-mono text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  YEAR OF ESTABLISHMENT
                </label>
                <input
                  type="number"
                  value={formData.yearOfEstablishment}
                  onChange={(e) => handleFieldChange("yearOfEstablishment", e.target.value)}
                  placeholder="e.g. 2015"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  TYPE OF CENTRE/ SCHOOL
                </label>
                <select
                  value={formData.typeOfCentreSchool}
                  onChange={(e) => handleFieldChange("typeOfCentreSchool", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Pre-Primary">Pre-Primary</option>
                  <option value="Nursery">Nursery</option>
                  <option value="Day Care">Day Care</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  TYPE OF PREMISES
                </label>
                <select
                  value={formData.typeOfPremises}
                  onChange={(e) => handleFieldChange("typeOfPremises", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Purpose Built">Purpose Built</option>
                  <option value="Converted Dwelling">Converted Dwelling</option>
                  <option value="Rented/Leased Facility">Rented/Leased Facility</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  STATUS OF PREMISES
                </label>
                <select
                  value={formData.statusOfPremises}
                  onChange={(e) => handleFieldChange("statusOfPremises", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Good">Good</option>
                  <option value="Needs Maintenance">Needs Maintenance</option>
                  <option value="Dilapidated">Dilapidated</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SERVICE PROVIDED
                </label>
                <select
                  value={formData.serviceProvided}
                  onChange={(e) => handleFieldChange("serviceProvided", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  OWNERSHIP
                </label>
                <select
                  value={formData.ownership}
                  onChange={(e) => handleFieldChange("ownership", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Community">Community</option>
                  <option value="NGO/Faith-based">NGO/Faith-based</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Fees & Meals */}
          <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#002652] dark:text-[#00A3A3] flex items-center gap-2">
              <Banknote className="w-4 h-4 text-[#97620C]" />
              <span>Section 3: Fees & Meals</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SCHOOL FEES PER TERM - HALF DAY
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">P</span>
                  <input
                    type="number"
                    value={formData.feesHalfDay}
                    onChange={(e) => handleFieldChange("feesHalfDay", e.target.value)}
                    className="w-full text-xs p-2.5 pl-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SCHOOL FEES PER TERM - FULL DAY
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">P</span>
                  <input
                    type="number"
                    value={formData.feesFullDay}
                    onChange={(e) => handleFieldChange("feesFullDay", e.target.value)}
                    className="w-full text-xs p-2.5 pl-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  MEALS GIVEN TO CHILDREN
                </label>
                <select
                  value={formData.mealsGivenToChildren}
                  onChange={(e) => handleFieldChange("mealsGivenToChildren", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Infrastructure & Utilities */}
          <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#002652] dark:text-[#00A3A3] flex items-center gap-2">
              <Home className="w-4 h-4 text-sky-500" />
              <span>Section 4: Infrastructure & Utilities</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  INTERNET INFRASTRUCTURE - TYPE
                </label>
                <select
                  value={formData.internetType}
                  onChange={(e) => handleFieldChange("internetType", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="LAN + Wi-Fi">LAN + Wi-Fi</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="LAN">LAN</option>
                  <option value="None">None</option>
                  <option value="Mobile Data Router">Mobile Data Router</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SPEED
                </label>
                <input
                  type="text"
                  value={formData.speed}
                  onChange={(e) => handleFieldChange("speed", e.target.value)}
                  placeholder="e.g. 10 Mbps"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  COVERAGE
                </label>
                <select
                  value={formData.coverage}
                  onChange={(e) => handleFieldChange("coverage", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Full">Full</option>
                  <option value="Partial">Partial</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SOURCE_ELECTRICITY
                </label>
                <select
                  value={formData.sourceElectricity}
                  onChange={(e) => handleFieldChange("sourceElectricity", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Grid Power (BPC)">Grid Power (BPC)</option>
                  <option value="Solar Power">Solar Power</option>
                  <option value="Generator">Generator</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SOURCE_WATER
                </label>
                <select
                  value={formData.sourceWater}
                  onChange={(e) => handleFieldChange("sourceWater", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Stand Pipe (WUC)">Stand Pipe (WUC)</option>
                  <option value="Borehole">Borehole</option>
                  <option value="Water Tanker">Water Tanker</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SECURITY IN PLACE
                </label>
                <select
                  value={formData.securityInPlace}
                  onChange={(e) => handleFieldChange("securityInPlace", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="Internal">Internal</option>
                  <option value="Outsourced">Outsourced</option>
                  <option value="Internal and Outsourced">Internal and Outsourced</option>
                  <option value="NONE">NONE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Contact Details */}
          <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#002652] dark:text-[#00A3A3] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>Section 5: Contact Details</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  TELEPHONE
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleFieldChange("telephone", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  FAX
                </label>
                <input
                  type="text"
                  value={formData.fax}
                  onChange={(e) => handleFieldChange("fax", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

        </form>
      </SectionContainer>
    </div>
  );
};
