"use client";

interface PreviewStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
  vacancyId: string;
}

export default function PreviewStep({
  formData,
  onUpdate,
  vacancyId,
}: PreviewStepProps) {
  const pd = formData.personalDetails || {};
  const cd = formData.contactDetails || {};
  const edu = formData.education || [];
  const exp = formData.experience || [];
  const docs = formData.documents || {};

  return (
    <div className="space-y-8">
      {/* Candidate Detail */}
      <section>
        <h3 className="text-lg font-bold text-[#123451] mb-6 pb-2 border-b-2 border-[#d6e6ed]">
          Candidate Detail
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">Name (In English)</p>
            <p className="text-gray-900">
              {pd.firstName} {pd.middleName} {pd.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Name (In Nepali)</p>
            <p className="text-gray-900">
              {pd.firstNameNepali} {pd.middleNameNepali} {pd.lastNameNepali}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Gender</p>
            <p className="text-gray-900">{pd.gender || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Date of Birth</p>
            <p className="text-gray-900">
              {pd.dobAD} (AD) {pd.dobBS} (BS)
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Martial Status</p>
            <p className="text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Citizenship Number</p>
            <p className="text-gray-900">{pd.citizenshipNumber || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Citizenship Issue District</p>
            <p className="text-gray-900">{pd.issuedDistrict || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Citizenship Issue Date</p>
            <p className="text-gray-900">{pd.issuedDate || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Father Name</p>
            <p className="text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Mother Name</p>
            <p className="text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Spouse Name</p>
            <p className="text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">GrandFather Name</p>
            <p className="text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Religion</p>
            <p className="text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Disability</p>
            <p className="text-gray-900">-</p>
          </div>
        </div>
      </section>

      {/* Education Detail */}
      {edu.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-[#123451] mb-6 pb-2 border-b-2 border-[#d6e6ed]">
            Education Detail
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f9fcfe] border-b border-[#d6e6ed]">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    University/Board Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Institution Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Academic Degree
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Educational Faculty
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Marks Secured In
                  </th>
                </tr>
              </thead>
              <tbody>
                {edu.map((education: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#d6e6ed]">
                    <td className="px-4 py-3 text-gray-900">{education.university}</td>
                    <td className="px-4 py-3 text-gray-900">{education.institution}</td>
                    <td className="px-4 py-3 text-gray-900">{education.degree}</td>
                    <td className="px-4 py-3 text-gray-900">{education.faculty || "-"}</td>
                    <td className="px-4 py-3 text-gray-900">{education.marks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Experience Detail */}
      {exp.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-[#123451] mb-6 pb-2 border-b-2 border-[#d6e6ed]">
            Experience Detail
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f9fcfe] border-b border-[#d6e6ed]">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Name of Department/Organization
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Service From
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Service To
                  </th>
                </tr>
              </thead>
              <tbody>
                {exp.map((experience: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#d6e6ed]">
                    <td className="px-4 py-3 text-gray-900">
                      {experience.departmentName || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {experience.department || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{experience.level || "-"}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {experience.serviceFrom || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {experience.serviceTo || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Document Detail */}
      <section>
        <h3 className="text-lg font-bold text-[#123451] mb-6 pb-2 border-b-2 border-[#d6e6ed]">
          Document Detail
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f9fcfe] border-b border-[#d6e6ed]">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Document Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Document Title
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Download
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Preview
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#d6e6ed]">
                <td className="px-4 py-3 text-gray-900">Photo</td>
                <td className="px-4 py-3 text-gray-900">Photo</td>
                <td className="px-4 py-3">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    ⬇ Download
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    👁 Preview
                  </a>
                </td>
              </tr>
              <tr className="border-b border-[#d6e6ed]">
                <td className="px-4 py-3 text-gray-900">CV</td>
                <td className="px-4 py-3 text-gray-900">CV</td>
                <td className="px-4 py-3">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    ⬇ Download
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    👁 Preview
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact Detail */}
      <section>
        <h3 className="text-lg font-bold text-[#123451] mb-6 pb-2 border-b-2 border-[#d6e6ed]">
          Contact Detail
        </h3>

        <div className="mb-8">
          <h4 className="font-semibold text-gray-800 mb-4">Permanent Address</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">State</p>
              <p className="text-gray-900">{cd.permState || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">District</p>
              <p className="text-gray-900">{cd.permDistrict || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Local Level Type</p>
              <p className="text-gray-900">{cd.permLocalLevelType || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Municipality</p>
              <p className="text-gray-900">{cd.permMunicipality || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Ward No</p>
              <p className="text-gray-900">{cd.permWard || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Tole</p>
              <p className="text-gray-900">{cd.permTole || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Street Name</p>
              <p className="text-gray-900">{cd.permStreetName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">House No</p>
              <p className="text-gray-900">{cd.permHouseNo || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Phone No</p>
              <p className="text-gray-900">{cd.permPhone || "-"}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-semibold text-gray-800 mb-4">Temporary Address</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">State</p>
              <p className="text-gray-900">{cd.tempState || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">District</p>
              <p className="text-gray-900">{cd.tempDistrict || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Local Level Type</p>
              <p className="text-gray-900">{cd.tempLocalLevelType || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Municipality</p>
              <p className="text-gray-900">{cd.tempMunicipality || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Ward No</p>
              <p className="text-gray-900">{cd.tempWard || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Tole</p>
              <p className="text-gray-900">{cd.tempTole || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Street Name</p>
              <p className="text-gray-900">{cd.tempStreetName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">House No</p>
              <p className="text-gray-900">{cd.tempHouseNo || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Phone No</p>
              <p className="text-gray-900">{cd.tempPhone || "-"}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Contact Information</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700">Mobile</p>
              <p className="text-gray-900">{cd.mobile || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Email</p>
              <p className="text-gray-900">{cd.email || "-"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
