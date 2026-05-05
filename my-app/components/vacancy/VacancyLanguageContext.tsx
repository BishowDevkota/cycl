"use client";

import React, { createContext, useContext, useState } from "react";

type VacancyLanguage = "en" | "ne";

interface VacancyLanguageContextType {
  language: VacancyLanguage;
  setLanguage: (lang: VacancyLanguage) => void;
  t: (key: string) => string;
}

const VacancyLanguageContext = createContext<VacancyLanguageContextType | undefined>(undefined);

export const vacancyTranslations: Record<VacancyLanguage, Record<string, string>> = {
  en: {
    "vacancy.candidates": "Candidate Dashboard",
    "vacancy.portal": "Vacancy portal",
    "vacancy.title": "Open Positions",
    "vacancy.description": "Browse current openings and find the role that matches your skills and experience.",
    "vacancy.careers": "Careers",
    "vacancy.openCompetition": "Open Competition",
    "vacancy.internalCompetition": "Internal Competition",
    "vacancy.advertisementNo": "Advertisement No.",
    "vacancy.position": "Position",
    "vacancy.publishedDate": "Published Date",
    "vacancy.deadline": "Deadline",
    "vacancy.doubleFeeDeadline": "Double Fee Deadline",
    "vacancy.type": "Type",
    "vacancy.openInclusive": "Open / Inclusive",
    "vacancy.noOfPosts": "No. of Posts",
    "vacancy.action": "Action",
    "vacancy.filter": "Filter...",
    "vacancy.noVacancies": "No vacancies found.",
    "vacancy.loginToApply": "Login to Apply",
    "vacancy.viewDetails": "View Details",
    "vacancy.backToVacancies": "Back to Vacancies",
    "vacancy.aboutRole": "About this role",
    "vacancy.applyPosition": "Apply for this position",
    "vacancy.personalDetail": "Personal Detail",
    "vacancy.nameEnglish": "Name (In English)",
    "vacancy.nameNepali": "Name (In Nepali)",
    "vacancy.firstName": "First Name",
    "vacancy.middleName": "Middle Name",
    "vacancy.lastName": "Last Name",
    "vacancy.firstNamePreeti": "First Name (Preeti Unicode)",
    "vacancy.middleNamePreeti": "Middle Name (Preeti Unicode)",
    "vacancy.lastNamePreeti": "Last Name (Preeti Unicode)",
    "vacancy.required": "Required",
    "vacancy.profile": "Profile",
    "vacancy.changePassword": "Change Password",
    "vacancy.logoff": "Log off",
    // Contact fields
    "vacancy.contactDetail": "Contact Detail",
    "vacancy.permanentAddress": "Permanent Address",
    "vacancy.temporaryAddress": "Temporary Address",
    "vacancy.state": "State",
    "vacancy.district": "District",
    "vacancy.localLevelType": "Local Level Type",
    "vacancy.municipality": "Municipality/Rural Municipality",
    "vacancy.ward": "Ward No",
    "vacancy.tole": "Tole",
    "vacancy.street": "Street Name",
    "vacancy.houseNo": "House No",
    "vacancy.phone": "Phone",
    "vacancy.email": "Email",
    "vacancy.sameAsPermanent": "Same as Permanent Address",
    "vacancy.permanentAddressNepali": "Permanent Address (Nepali)",
    "vacancy.temporaryAddressNepali": "Temporary Address (Nepali)",
    "vacancy.contactInformation": "Contact Information",
    "vacancy.mobile": "Mobile",
    // Education fields
    "vacancy.education": "Education",
    "vacancy.addEducation": "+ Add Education Detail",
    "vacancy.university": "University/Board Name",
    "vacancy.institution": "Institution",
    "vacancy.degree": "Degree",
    "vacancy.faculty": "Faculty",
    "vacancy.marks": "Marks",
    "vacancy.educationNepali": "Education (In Nepali)",
    "vacancy.universityNepali": "University/Board Name (Preeti Unicode)",
    "vacancy.institutionNepali": "Institution (Preeti Unicode)",
    "vacancy.degreeNepali": "Degree (Preeti Unicode)",
    "vacancy.delete": "Delete",
    // Experience fields
    "vacancy.experience": "Experience",
    "vacancy.addExperience": "+ Add Experience",
    "vacancy.organization": "Organization Name",
    "vacancy.department": "Department",
    "vacancy.position": "Position",
    "vacancy.serviceFrom": "Service From",
    "vacancy.serviceTo": "Service To",
    "vacancy.organizationNepali": "Organization Name (Preeti Unicode)",
    "vacancy.departmentNepali": "Department (Preeti Unicode)",
    "vacancy.positionNepali": "Position (Preeti Unicode)",
  },
  ne: {
    "vacancy.candidates": "उम्मेदवार ड्यासबोर्ड",
    "vacancy.portal": "खाली स्थान पोर्टल",
    "vacancy.title": "खुला पदहरू",
    "vacancy.description": "वर्तमान अवसरहरू ब्राउज गर्नुहोस् र आपनो कौशल र अनुभवसँग मेल खाने भूमिका खोज्नुहोस्।",
    "vacancy.careers": "क्यारियर",
    "vacancy.openCompetition": "खुला प्रतिद्वन्द्विता",
    "vacancy.internalCompetition": "आन्तरिक प्रतिद्वन्द्विता",
    "vacancy.advertisementNo": "विज्ञापन नम्बर",
    "vacancy.position": "पद",
    "vacancy.publishedDate": "प्रकाशित मिति",
    "vacancy.deadline": "समय सीमा",
    "vacancy.doubleFeeDeadline": "दोहोरो शुल्क समय सीमा",
    "vacancy.type": "किसिम",
    "vacancy.openInclusive": "खुला / समावेशी",
    "vacancy.noOfPosts": "पदहरूको संख्या",
    "vacancy.action": "कार्य",
    "vacancy.filter": "फिल्टर गर्नुहोस्...",
    "vacancy.noVacancies": "कुनै खाली स्थान फेला परेन।",
    "vacancy.loginToApply": "लगइन गरेर आवेदन दिनुहोस्",
    "vacancy.viewDetails": "विवरण हेर्नुहोस्",
    "vacancy.backToVacancies": "खाली स्थानमा फर्किनुहोस्",
    "vacancy.aboutRole": "यो भूमिकाको बारेमा",
    "vacancy.applyPosition": "यो पदको लागि आवेदन दिनुहोस्",
    "vacancy.personalDetail": "व्यक्तिगत विवरण",
    "vacancy.nameEnglish": "नाम (अंग्रेजीमा)",
    "vacancy.nameNepali": "नाम (नेपालीमा)",
    "vacancy.firstName": "पहिलो नाम",
    "vacancy.middleName": "बीचको नाम",
    "vacancy.lastName": "अन्तिम नाम",
    "vacancy.firstNamePreeti": "पहिलो नाम (प्रीति युनिकोड)",
    "vacancy.middleNamePreeti": "बीचको नाम (प्रीति युनिकोड)",
    "vacancy.lastNamePreeti": "अन्तिम नाम (प्रीति युनिकोड)",
    "vacancy.required": "आवश्यक",
    "vacancy.profile": "प्रोफाइल",
    "vacancy.changePassword": "पासवर्ड परिवर्तन गर्नुहोस्",
    "vacancy.logoff": "लगआउट गर्नुहोस्",
    // Contact fields
    "vacancy.contactDetail": "सम्पर्क विवरण",
    "vacancy.permanentAddress": "स्थायी ठेगाना",
    "vacancy.temporaryAddress": "अस्थायी ठेगाना",
    "vacancy.state": "राज्य",
    "vacancy.district": "जिल्ला",
    "vacancy.localLevelType": "स्थानीय स्तर किसिम",
    "vacancy.municipality": "नगरपालिका/गाउँपालिका",
    "vacancy.ward": "वार्ड नम्बर",
    "vacancy.tole": "टोल",
    "vacancy.street": "सडकको नाम",
    "vacancy.houseNo": "घर नम्बर",
    "vacancy.phone": "फोन",
    "vacancy.email": "इमेल",
    "vacancy.sameAsPermanent": "स्थायी ठेगाना जस्तै",
    "vacancy.permanentAddressNepali": "स्थायी ठेगाना (नेपालीमा)",
    "vacancy.temporaryAddressNepali": "अस्थायी ठेगाना (नेपालीमा)",
    "vacancy.contactInformation": "सम्पर्क जानकारी",
    "vacancy.mobile": "मोबाइल",
    // Education fields
    "vacancy.education": "शिक्षा",
    "vacancy.addEducation": "+ शिक्षा विवरण थप्नुहोस्",
    "vacancy.university": "विश्वविद्यालय/बोर्ड नाम",
    "vacancy.institution": "संस्था",
    "vacancy.degree": "डिग्री",
    "vacancy.faculty": "संकाय",
    "vacancy.marks": "अङ्क",
    "vacancy.educationNepali": "शिक्षा (नेपालीमा)",
    "vacancy.universityNepali": "विश्वविद्यालय/बोर्ड नाम (प्रीति युनिकोड)",
    "vacancy.institutionNepali": "संस्था (प्रीति युनिकोड)",
    "vacancy.degreeNepali": "डिग्री (प्रीति युनिकोड)",
    "vacancy.delete": "हटाउनुहोस्",
    // Experience fields
    "vacancy.experience": "अनुभव",
    "vacancy.addExperience": "+ अनुभव थप्नुहोस्",
    "vacancy.organization": "संस्थाको नाम",
    "vacancy.department": "विभाग",
    "vacancy.position": "पद",
    "vacancy.serviceFrom": "सेवा शुरु गरिएको मिति",
    "vacancy.serviceTo": "सेवा समाप्त गरिएको मिति",
    "vacancy.organizationNepali": "संस्थाको नाम (प्रीति युनिकोड)",
    "vacancy.departmentNepali": "विभाग (प्रीति युनिकोड)",
    "vacancy.positionNepali": "पद (प्रीति युनिकोड)",
  },
};

export function VacancyLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<VacancyLanguage>("en");

  const t = (key: string): string => {
    return vacancyTranslations[language][key as keyof typeof vacancyTranslations["en"]] || key;
  };

  return (
    <VacancyLanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </VacancyLanguageContext.Provider>
  );
}

export function useVacancyLanguage() {
  const context = useContext(VacancyLanguageContext);
  if (!context) {
    throw new Error("useVacancyLanguage must be used within VacancyLanguageProvider");
  }
  return context;
}
