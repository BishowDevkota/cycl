import { getDb } from "./mongodb";
import { ObjectId } from "mongodb";

export interface HeroSlide {
  title: string;
  subtitle?: string;
  imageUrl: string;
  imagePublicId: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface HeroSection {
  _id?: ObjectId;
  title: string;
  slides: HeroSlide[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "hero_sections";

export async function getHeroSection(): Promise<HeroSection | null> {
  const db = await getDb();
  const hero = await db
    .collection<HeroSection>(COLLECTION_NAME)
    .findOne({ isActive: true });
  return hero || null;
}

export async function getAllHeroSections(): Promise<HeroSection[]> {
  const db = await getDb();
  const heroes = await db
    .collection<HeroSection>(COLLECTION_NAME)
    .find({})
    .toArray();
  return heroes;
}

export async function createHeroSection(
  data: Omit<HeroSection, "_id">,
): Promise<HeroSection> {
  const db = await getDb();

  // If this is being set as active, deactivate all others
  if (data.isActive) {
    await db
      .collection<HeroSection>(COLLECTION_NAME)
      .updateMany({}, { $set: { isActive: false } });
  }

  const result = await db
    .collection<HeroSection>(COLLECTION_NAME)
    .insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  return {
    _id: result.insertedId,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateHeroSection(
  id: string,
  data: Partial<HeroSection>,
): Promise<HeroSection | null> {
  const db = await getDb();

  // If this is being set as active, deactivate all others
  if (data.isActive) {
    await db
      .collection<HeroSection>(COLLECTION_NAME)
      .updateMany(
        { _id: { $ne: new ObjectId(id) } },
        { $set: { isActive: false } },
      );
  }

  const result = await db
    .collection<HeroSection>(COLLECTION_NAME)
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

export async function deleteHeroSection(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<HeroSection>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
