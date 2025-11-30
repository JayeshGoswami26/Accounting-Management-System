import mongoose from "mongoose";
export declare const Payment: mongoose.Model<{
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
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
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
    accountOrCompany?: string | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    date: NativeDate;
    customerId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
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
        bookingId: mongoose.Types.ObjectId;
        amount: number;
        type?: string | null;
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
        method?: string | null;
        accountOrCompany?: string | null;
        note?: string | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        date: NativeDate;
        customerId: mongoose.Types.ObjectId;
        bookingId: mongoose.Types.ObjectId;
        amount: number;
        type?: string | null;
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
        method?: string | null;
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
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
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
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    type?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    method?: string | null;
    accountOrCompany?: string | null;
    note?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Payment.d.ts.map