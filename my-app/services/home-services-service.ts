import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface HomeServiceItem {
  _id?: ObjectId;
  title: string;
  description: string;
  route: string;
  stat: string;
  imageUrl: string;
  imagePublicId: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HomeServicesSectionMeta {
  _id?: ObjectId;
  key: "home-services-section";
  heading: string;
  description: string;
  updatedAt?: Date;
}

const COLLECTION_NAME = "home_services";
const META_COLLECTION_NAME = "home_services_meta";
const META_KEY = "home-services-section";

export async function getAllHomeServices(): Promise<HomeServiceItem[]> {
  const db = await getDb();

  return db
    .collection<HomeServiceItem>(COLLECTION_NAME)
    .find({})
    .sort({ displayOrder: 1, createdAt: -1, _id: -1 })
    .toArray();
}

export async function getActiveHomeServices(): Promise<HomeServiceItem[]> {
  const db = await getDb();

  return db
    .collection<HomeServiceItem>(COLLECTION_NAME)
    .find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: -1, _id: -1 })
    .toArray();
}

export async function getHomeServiceById(id: string): Promise<HomeServiceItem | null> {
  const db = await getDb();

  return db
    .collection<HomeServiceItem>(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) });
}

export async function createHomeService(
  data: Omit<HomeServiceItem, "_id">,
): Promise<HomeServiceItem> {
  const db = await getDb();
  const timestamp = new Date();

  const result = await db.collection<HomeServiceItem>(COLLECTION_NAME).insertOne({
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

export async function updateHomeService(
  id: string,
  data: Partial<HomeServiceItem>,
): Promise<HomeServiceItem | null> {
  const db = await getDb();

  return db
    .collection<HomeServiceItem>(COLLECTION_NAME)
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
}

export async function deleteHomeService(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<HomeServiceItem>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
}

export async function getHomeServicesSectionMeta(): Promise<HomeServicesSectionMeta | null> {
  const db = await getDb();

  return db
    .collection<HomeServicesSectionMeta>(META_COLLECTION_NAME)
    .findOne({ key: META_KEY });
}

export async function upsertHomeServicesSectionMeta(data: {
  heading: string;
  description: string;
}): Promise<HomeServicesSectionMeta> {
  const db = await getDb();

  const result = await db
    .collection<HomeServicesSectionMeta>(META_COLLECTION_NAME)
    .findOneAndUpdate(
      { key: META_KEY },
      {
        $set: {
          key: META_KEY,
          heading: data.heading,
          description: data.description,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" },
    );

  return (
    result || {
      key: META_KEY,
      heading: data.heading,
      description: data.description,
      updatedAt: new Date(),
    }
  );
}
