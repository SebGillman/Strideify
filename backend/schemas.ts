import * as mongoose from "npm:mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  token: { type: String, required: true },
});

export interface IUser {
  username: string;
  token: string;
}

export const User = mongoose.model("User", UserSchema);
