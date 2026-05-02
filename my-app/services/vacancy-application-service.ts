import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface ApplicationResponse {
  fieldId: string;
  fieldLabel: string;
  fieldType: "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "pdf";
  value: string | boolean | string[]; // for pdf type, this is the cloudinary public_id
  fileUrl?: string;
}

export interface VacancyApplication {
  _id?: ObjectId;
  vacancyId: ObjectId;
  userId: ObjectId;
  userEmail: string;
  userFullName: string;
  userPhone: string;
  responses: ApplicationResponse[];
  status: "submitted" | "reviewed" | "selected" | "rejected";
  pdfCloudinaryPublicId?: string; // for the generated thank you PDF
  createdAt: Date;
  updatedAt: Date;
}

const APPLICATIONS_COLLECTION = "vacancy_applications";

export async function createApplication(
  application: Omit<VacancyApplication, "_id" | "createdAt" | "updatedAt">,
): Promise<VacancyApplication> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const now = new Date();
  const result = await collection.insertOne({
    ...application,
    createdAt: now,
    updatedAt: now,
  });

  return {
    _id: result.insertedId,
    ...application,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getApplicationById(
  id: string | ObjectId,
): Promise<VacancyApplication | null> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  return await collection.findOne({ _id: objId });
}

export async function getApplicationsByVacancyId(
  vacancyId: string | ObjectId,
): Promise<VacancyApplication[]> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const objId = typeof vacancyId === "string" ? new ObjectId(vacancyId) : vacancyId;
  return await collection
    .find({ vacancyId: objId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getApplicationsByUserId(
  userId: string | ObjectId,
): Promise<VacancyApplication[]> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const objId = typeof userId === "string" ? new ObjectId(userId) : userId;
  return await collection
    .find({ userId: objId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getUserApplicationForVacancy(
  userId: string | ObjectId,
  vacancyId: string | ObjectId,
): Promise<VacancyApplication | null> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const userObjId = typeof userId === "string" ? new ObjectId(userId) : userId;
  const vacancyObjId = typeof vacancyId === "string" ? new ObjectId(vacancyId) : vacancyId;

  return await collection.findOne({
    userId: userObjId,
    vacancyId: vacancyObjId,
  });
}

export async function updateApplication(
  id: string | ObjectId,
  updates: Partial<Omit<VacancyApplication, "_id" | "createdAt">>,
): Promise<VacancyApplication | null> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  const result = await collection.findOneAndUpdate(
    { _id: objId },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  return result as VacancyApplication | null;
}

export async function deleteApplication(id: string | ObjectId): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  const result = await collection.deleteOne({ _id: objId });

  return result.deletedCount > 0;
}

export async function deleteApplicationsByVacancyId(
  vacancyId: string | ObjectId,
): Promise<number> {
  const db = await getDb();
  const collection = db.collection<VacancyApplication>(APPLICATIONS_COLLECTION);

  const objId = typeof vacancyId === "string" ? new ObjectId(vacancyId) : vacancyId;
  const result = await collection.deleteMany({ vacancyId: objId });

  return result.deletedCount;
}
