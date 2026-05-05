"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useVacancyLanguage } from "@/components/vacancy/VacancyLanguageContext";
import BasicDetailsStep from "./steps/BasicDetailsStep";
import ContactDetailsStep from "./steps/ContactDetailsStep";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import DocumentStep from "./steps/DocumentStep";
import PreviewStep from "./steps/PreviewStep";
import SubmitStep from "./steps/SubmitStep";

interface FormData {
  personalDetails: any;
  contactDetails: any;
  education: any[];
  experience: any[];
  documents: any;
}

export default function ApplicationForm() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useVacancyLanguage();
  const vacancyId = params.id as string;
  const stepContainerRef = useRef<HTMLDivElement | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    personalDetails: {},
    contactDetails: {},
    education: [],
    experience: [],
    documents: {},
  });
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stepError, setStepError] = useState("");

  const steps = [
    { label: "आधारभूत", component: BasicDetailsStep },
    { label: "सम्पर्क", component: ContactDetailsStep },
    { label: "शिक्षा", component: EducationStep },
    { label: "अनुभव", component: ExperienceStep },
    { label: "कागजात", component: DocumentStep },
    { label: "पूर्वावलोकन", component: PreviewStep },
    { label: "बुझाउनुहोस्", component: SubmitStep },
  ];

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await fetch(`/api/vacancies/${vacancyId}`);
        if (res.ok) {
          const data = await res.json();
          setJobDetails(data);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [vacancyId]);

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      const personalDetails = formData.personalDetails || {};
      const requiredFields = [
        "firstName",
        "middleName",
        "lastName",
        "firstNameNepali",
        "middleNameNepali",
        "lastNameNepali",
        "dobBS",
        "dobAD",
        "gender",
        "citizenshipNumber",
        "issuedDistrict",
        "issuedDate",
      ];

      return requiredFields.every((field) => String(personalDetails[field] || "").trim().length > 0);
    }

    if (currentStep === 1) {
      const contactDetails = formData.contactDetails || {};
      const requiredFields = [
        "permState",
        "permDistrict",
        "permLocalLevelType",
        "permMunicipality",
        "permWard",
        "permTole",
        "permStreetName",
        "permHouseNo",
        "permPhone",
        "permMunicipalityNepali",
        "permToleNepali",
        "permStreetNameNepali",
        "tempState",
        "tempDistrict",
        "tempLocalLevelType",
        "tempMunicipality",
        "tempWard",
        "tempTole",
        "tempStreetName",
        "tempHouseNo",
        "tempPhone",
        "tempMunicipalityNepali",
        "tempToleNepali",
        "tempStreetNameNepali",
        "mobile",
        "email",
      ];

      return requiredFields.every((field) => String(contactDetails[field] || "").trim().length > 0);
    }

    if (currentStep === 2) {
      const educationEntries = formData.education || [];
      return (
        educationEntries.length > 0 &&
        educationEntries.every((education) =>
          ["university", "institution", "degree", "faculty", "universityNepali", "institutionNepali", "degreeNepali"].every(
            (field) => String(education[field] || "").trim().length > 0
          )
        )
      );
    }

    if (currentStep === 3) {
      const experienceEntries = formData.experience || [];
      return (
        experienceEntries.length > 0 &&
        experienceEntries.every((experience) =>
          ["organization", "department", "position", "serviceFrom", "serviceTo", "organizationNepali", "departmentNepali", "positionNepali"].every(
            (field) => String(experience[field] || "").trim().length > 0
          )
        )
      );
    }

    if (currentStep === 4) {
      const documents = formData.documents || {};
      return Boolean(documents.photo && documents.cv);
    }

    return true;
  };

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex > currentStep) {
      return;
    }

    setStepError("");
    setCurrentStep(stepIndex);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setStepError("कृपया यस चरणका सबै अनिवार्य विवरण भर्नुहोस्।");
      const firstInvalidField = stepContainerRef.current?.querySelector("input:invalid, select:invalid, textarea:invalid");
      if (firstInvalidField instanceof HTMLElement) {
        firstInvalidField.reportValidity();
      }
      return;
    }

    setStepError("");
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdateFormData = (section: keyof FormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading application form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0d837f] text-white shadow-md p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">अनलाइन आवेदन फाराम</h1>
          <p className="text-[#e0f2f1] mt-1">{jobDetails?.title}</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-[#d6e6ed] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-4 overflow-x-auto">
            {steps.map((step, index) => (
              <button
                key={step.label}
                onClick={() => handleStepChange(index)}
                className={`py-4 px-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  currentStep === index
                    ? "border-[#0d837f] text-[#0d837f]"
                    : currentStep > index
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-600 hover:text-[#0d837f]"
                }`}
              >
                {step.label}
                {currentStep > index && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {stepError && (
            <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {stepError}
            </div>
          )}

          <div ref={stepContainerRef}>
            <CurrentStepComponent
              formData={formData}
              onUpdate={handleUpdateFormData}
              vacancyId={vacancyId}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-[#d6e6ed]">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded font-medium transition ${
                currentStep === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#0a6b68] text-white hover:bg-[#085856]"
              }`}
            >
              ← पछाडि
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#0d837f] text-white rounded font-medium hover:bg-[#08716e] transition"
              >
                अर्को →
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
              >
                आवेदन बुझाउनुहोस्
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
