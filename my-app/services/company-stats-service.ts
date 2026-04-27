import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface CompanyStats {
  _id?: ObjectId;
  heading: string;
  value: string;
  imageUrl: string;
  imagePublicId: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "company-stats";

export async function getCompanyStats(): Promise<CompanyStats | null> {
  const db = await getDb();
  const stats = await db
    .collection<CompanyStats>(COLLECTION_NAME)
    .findOne({ isActive: true }, { sort: { displayOrder: 1, createdAt: -1, _id: -1 } });

  return stats || null;
}

export async function getAllCompanyStats(): Promise<CompanyStats[]> {
  const db = await getDb();
  return db
    .collection<CompanyStats>(COLLECTION_NAME)
    .find({})
    .sort({ displayOrder: 1, createdAt: -1, _id: -1 })
    .toArray();
}

export async function createCompanyStats(
  data: Omit<CompanyStats, "_id">,
): Promise<CompanyStats> {
  const db = await getDb();
  const timestamp = new Date();

  const result = await db.collection<CompanyStats>(COLLECTION_NAME).insertOne({
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

export async function updateCompanyStats(
  id: string,
  data: Partial<CompanyStats>,
): Promise<CompanyStats | null> {
  const db = await getDb();

  const result = await db
    .collection<CompanyStats>(COLLECTION_NAME)
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

export async function deleteCompanyStats(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<CompanyStats>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
}