import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface HomeNotice {
  _id?: ObjectId;
  title: string;
  text: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "home_notices";

export async function getAllHomeNotices(): Promise<HomeNotice[]> {
  const db = await getDb();
  return db
    .collection<HomeNotice>(COLLECTION_NAME)
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .toArray();
}

export async function getHomeNoticeById(id: string): Promise<HomeNotice | null> {
  const db = await getDb();

  const notice = await db
    .collection<HomeNotice>(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) });

  return notice || null;
}

export async function createHomeNotice(
  data: Omit<HomeNotice, "_id">,
): Promise<HomeNotice> {
  const db = await getDb();
  const timestamp = new Date();

  const result = await db.collection<HomeNotice>(COLLECTION_NAME).insertOne({
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

export async function updateHomeNotice(
  id: string,
  data: Partial<HomeNotice>,
): Promise<HomeNotice | null> {
  const db = await getDb();

  const result = await db
    .collection<HomeNotice>(COLLECTION_NAME)
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

export async function deleteHomeNotice(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<HomeNotice>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
}
