import mongoose from "mongoose";
export declare const Refund: mongoose.Model<{
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        date: NativeDate;
        customerId: mongoose.Types.ObjectId;
        method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
        bookingId: mongoose.Types.ObjectId;
        amount: number;
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
        accountOrCompany?: string | null;
        note?: string | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        date: NativeDate;
        customerId: mongoose.Types.ObjectId;
        method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
        bookingId: mongoose.Types.ObjectId;
        amount: number;
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
        accountOrCompany?: string | null;
        note?: string | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    method: "cash" | "upi" | "credit_card" | "bank_transfer" | "cheque";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    accountOrCompany?: string | null;
    note?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Refund.d.ts.map