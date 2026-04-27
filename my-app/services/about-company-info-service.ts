import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface AboutCompanyInfo {
  _id?: ObjectId;
  heading: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "about_company_info";

export async function getAboutCompanyInfo(): Promise<AboutCompanyInfo | null> {
  const db = await getDb();
  const aboutCompanyInfo = await db
    .collection<AboutCompanyInfo>(COLLECTION_NAME)
    .findOne({}, { sort: { createdAt: -1, _id: -1 } });

  return aboutCompanyInfo || null;
}

export async function getAllAboutCompanyInfos(): Promise<AboutCompanyInfo[]> {
  const db = await getDb();
  return db.collection<AboutCompanyInfo>(COLLECTION_NAME).find({}).toArray();
}

export async function createAboutCompanyInfo(
  data: Omit<AboutCompanyInfo, "_id">,
): Promise<AboutCompanyInfo> {
  const db = await getDb();
  const timestamp = new Date();

  const result = await db.collection<AboutCompanyInfo>(COLLECTION_NAME).insertOne({
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return {
    _id: result.insertedId,
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function updateAboutCompanyInfo(
  id: string,
  data: Partial<AboutCompanyInfo>,
): Promise<AboutCompanyInfo | null> {
  const db = await getDb();

  const result = await db
    .collection<AboutCompanyInfo>(COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

  return result || null;
}

export async function deleteAboutCompanyInfo(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<AboutCompanyInfo>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
}