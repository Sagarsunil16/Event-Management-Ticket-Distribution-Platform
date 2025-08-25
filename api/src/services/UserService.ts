import { IUserDocumnet } from "../models/User";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { CustomError } from "../utils/CustomError";
import { IUserService } from "./interfaces/IUserService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserService implements IUserService {
  private _userRepo: IUserRepository;
  constructor(userRepo: IUserRepository) {
    this._userRepo = userRepo;
  }

  async registerUser(data: {
    name: string;
    email: string;
    password: string;
    role: "organizer" | "attendee";
  }): Promise<IUserDocumnet> {
    const existing = await this._userRepo.findByEmail(data.email);
    if (existing) throw new CustomError("Email already registered", 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this._userRepo.create({ ...data, password: hashedPassword });
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUserDocumnet; token: string }> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new CustomError("Invalid credentials", 400);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new CustomError("Invalid credentials", 400);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { user, token };
  }

  async getUserById(id: string): Promise<IUserDocumnet | null> {
      return await this._userRepo.findById(id)
  }
}
