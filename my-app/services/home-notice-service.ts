import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface HomeNotice {
  _id?: ObjectId;
  title: string;
  "title-en"?: string;
  "title-ne"?: string;
  text: string;
  "text-en"?: string;
  "text-ne"?: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HomeNoticeCopy {
  title: string;
  text: string;
}

export function resolveHomeNoticeCopy(
  notice: HomeNotice | null,
  locale: "en" | "ne",
): HomeNoticeCopy {
  const titleEn = notice?.["title-en"] || notice?.title || "";
  const titleNe = notice?.["title-ne"] || notice?.title || titleEn;
  const textEn = notice?.["text-en"] || notice?.text || "";
  const textNe = notice?.["text-ne"] || notice?.text || textEn;

  return {
    title: locale === "ne" ? titleNe || titleEn : titleEn || titleNe,
    text: locale === "ne" ? textNe || textEn : textEn || textNe,
  };
}

function normalizeHomeNoticeData(
  data: Partial<HomeNotice>,
): Omit<HomeNotice, "_id"> {
  const titleEn = data["title-en"]?.trim() || data.title?.trim() || "";
  const titleNe = data["title-ne"]?.trim() || data.title?.trim() || titleEn;
  const textEn = data["text-en"]?.trim() || data.text?.trim() || "";
  const textNe = data["text-ne"]?.trim() || data.text?.trim() || textEn;

  return {
    title: titleEn,
    "title-en": titleEn,
    "title-ne": titleNe,
    text: textEn,
    "text-en": textEn,
    "text-ne": textNe,
    imageUrl: data.imageUrl?.trim() || "",
    imagePublicId: data.imagePublicId?.trim() || "",
  };
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
  const normalized = normalizeHomeNoticeData(data);

  const result = await db.collection<HomeNotice>(COLLECTION_NAME).insertOne({
    ...normalized,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return {
    _id: result.insertedId,
    ...normalized,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function updateHomeNotice(
  id: string,
  data: Partial<HomeNotice>,
): Promise<HomeNotice | null> {
  const db = await getDb();
  const updateData = normalizeHomeNoticeData(data);

  const result = await db
    .collection<HomeNotice>(COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
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
