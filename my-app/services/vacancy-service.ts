import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "pdf";
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
}

export interface Vacancy {
  _id?: ObjectId;
  title: string;
  description: string;
  department: string;
  location: string;
  salary?: string;
  experience?: string;
  applicationDeadline?: Date;
  formFields: FormField[]; // dynamic form fields defined by admin
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId; // admin ID
}

const VACANCIES_COLLECTION = "vacancies";

export async function createVacancy(vacancy: Omit<Vacancy, "_id" | "createdAt" | "updatedAt">): Promise<Vacancy> {
  const db = await getDb();
  const collection = db.collection<Vacancy>(VACANCIES_COLLECTION);

  const now = new Date();
  const result = await collection.insertOne({
    ...vacancy,
    createdAt: now,
    updatedAt: now,
  });

  return {
    _id: result.insertedId,
    ...vacancy,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getVacancyById(id: string | ObjectId): Promise<Vacancy | null> {
  const db = await getDb();
  const collection = db.collection<Vacancy>(VACANCIES_COLLECTION);

  if (typeof id === "string" && !ObjectId.isValid(id)) {
    return null;
  }

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  return await collection.findOne({ _id: objId });
}

export async function getActiveVacancies(): Promise<Vacancy[]> {
  const db = await getDb();
  const collection = db.collection<Vacancy>(VACANCIES_COLLECTION);

  return await collection
    .find({ isActive: true })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getAllVacancies(adminId?: ObjectId): Promise<Vacancy[]> {
  const db = await getDb();
  const collection = db.collection<Vacancy>(VACANCIES_COLLECTION);

  const filter = adminId ? { createdBy: adminId } : {};
  return await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function updateVacancy(
  id: string | ObjectId,
  updates: Partial<Omit<Vacancy, "_id" | "createdAt">>,
): Promise<Vacancy | null> {
  const db = await getDb();
  const collection = db.collection<Vacancy>(VACANCIES_COLLECTION);

  if (typeof id === "string" && !ObjectId.isValid(id)) {
    return null;
  }

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  const result = await collection.findOneAndUpdate(
    { _id: objId },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  return result as Vacancy | null;
}

export async function deleteVacancy(id: string | ObjectId): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection<Vacancy>(VACANCIES_COLLECTION);

  if (typeof id === "string" && !ObjectId.isValid(id)) {
    return false;
  }

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  const result = await collection.deleteOne({ _id: objId });

  return result.deletedCount > 0;
}

export async function getVacancyFormFields(vacancyId: string | ObjectId): Promise<FormField[]> {
  const vacancy = await getVacancyById(vacancyId);
  return vacancy?.formFields || [];
}
