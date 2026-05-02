import VacancyForm from "@/components/admin/VacancyForm";

export default function CreateVacancyPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Vacancy</h1>
        <p className="text-gray-600">
          Add a new job opening with custom application form fields.
        </p>
      </div>

      <VacancyForm />
    </div>
  );
}
