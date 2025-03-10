// @ts-types="@types/bcrypt"
import bcrypt from "npm:bcrypt";
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
