import mongoose from "mongoose";
export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    role: "admin" | "staff" | "manager" | "accountant";
    name: string;
    isActive: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map