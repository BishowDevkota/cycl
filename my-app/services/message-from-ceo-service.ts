import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface MessageFromCeo {
  _id?: ObjectId;
  heading: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "message_from_ceo";

export async function getMessageFromCeo(): Promise<MessageFromCeo | null> {
  const db = await getDb();
  const message = await db
    .collection<MessageFromCeo>(COLLECTION_NAME)
    .findOne({}, { sort: { createdAt: -1, _id: -1 } });

  return message || null;
}

export async function getAllMessagesFromCeo(): Promise<MessageFromCeo[]> {
  const db = await getDb();
  return db.collection<MessageFromCeo>(COLLECTION_NAME).find({}).toArray();
}

export async function createMessageFromCeo(
  data: Omit<MessageFromCeo, "_id">,
): Promise<MessageFromCeo> {
  const db = await getDb();
  const timestamp = new Date();

  const result = await db.collection<MessageFromCeo>(COLLECTION_NAME).insertOne({
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

export async function updateMessageFromCeo(
  id: string,
  data: Partial<MessageFromCeo>,
): Promise<MessageFromCeo | null> {
  const db = await getDb();

  const result = await db
    .collection<MessageFromCeo>(COLLECTION_NAME)
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

export async function deleteMessageFromCeo(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<MessageFromCeo>(COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
}