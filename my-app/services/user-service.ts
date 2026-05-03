import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface User {
  _id?: ObjectId;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: Date;
}

const USERS_COLLECTION = "users";

export async function createUser(user: Omit<User, "_id" | "createdAt">): Promise<User> {
  const db = await getDb();
  const collection = db.collection<User>(USERS_COLLECTION);

  const result = await collection.insertOne({
    ...user,
    createdAt: new Date(),
  });

  return {
    _id: result.insertedId,
    ...user,
    createdAt: new Date(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection<User>(USERS_COLLECTION);

  return await collection.findOne({ email });
}

export async function getUserById(id: string | ObjectId): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection<User>(USERS_COLLECTION);

  if (typeof id === "string" && !ObjectId.isValid(id)) {
    return null;
  }

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  return await collection.findOne({ _id: objId });
}

export async function updateUser(
  id: string | ObjectId,
  updates: Partial<Omit<User, "_id" | "createdAt">>,
): Promise<User | null> {
  const db = await getDb();
  const collection = db.collection<User>(USERS_COLLECTION);

  if (typeof id === "string" && !ObjectId.isValid(id)) {
    return null;
  }

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  const result = await collection.findOneAndUpdate(
    { _id: objId },
    { $set: updates },
    { returnDocument: "after" },
  );

  return result as User | null;
}

export async function deleteUser(id: string | ObjectId): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection<User>(USERS_COLLECTION);

  if (typeof id === "string" && !ObjectId.isValid(id)) {
    return false;
  }

  const objId = typeof id === "string" ? new ObjectId(id) : id;
  const result = await collection.deleteOne({ _id: objId });

  return result.deletedCount > 0;
}
