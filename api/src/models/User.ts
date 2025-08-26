import { model, Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "organizer" | "attendee";
  profileInfo?: string;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["organizer", "attendee"], required: true },
    profileInfo: String,
  },
  {
    timestamps: true,
  }
);

export default model<IUserDocument>("User", UserSchema);
