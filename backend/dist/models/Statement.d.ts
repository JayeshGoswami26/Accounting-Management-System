import mongoose from "mongoose";
export declare const Statement: mongoose.Model<{
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }> & {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    }>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
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
        type: "credit_card" | "bank";
        accountName: string;
        statementDate: NativeDate;
        transactions: mongoose.Types.DocumentArray<{
            date: NativeDate;
            description: string;
            amount: number;
            matched: boolean;
            reference?: string | null;
            balance?: number | null;
            matchedPaymentId?: mongoose.Types.ObjectId | null;
            matchedBookingId?: mongoose.Types.ObjectId | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            date: NativeDate;
            description: string;
            amount: number;
            matched: boolean;
            reference?: string | null;
            balance?: number | null;
            matchedPaymentId?: mongoose.Types.ObjectId | null;
            matchedBookingId?: mongoose.Types.ObjectId | null;
        }> & {
            date: NativeDate;
            description: string;
            amount: number;
            matched: boolean;
            reference?: string | null;
            balance?: number | null;
            matchedPaymentId?: mongoose.Types.ObjectId | null;
            matchedBookingId?: mongoose.Types.ObjectId | null;
        }>;
        reconciled: boolean;
        uploadedBy?: mongoose.Types.ObjectId | null;
        reconciledAt?: NativeDate | null;
        reconciledBy?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        type: "credit_card" | "bank";
        accountName: string;
        statementDate: NativeDate;
        transactions: mongoose.Types.DocumentArray<{
            date: NativeDate;
            description: string;
            amount: number;
            matched: boolean;
            reference?: string | null;
            balance?: number | null;
            matchedPaymentId?: mongoose.Types.ObjectId | null;
            matchedBookingId?: mongoose.Types.ObjectId | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            date: NativeDate;
            description: string;
            amount: number;
            matched: boolean;
            reference?: string | null;
            balance?: number | null;
            matchedPaymentId?: mongoose.Types.ObjectId | null;
            matchedBookingId?: mongoose.Types.ObjectId | null;
        }> & {
            date: NativeDate;
            description: string;
            amount: number;
            matched: boolean;
            reference?: string | null;
            balance?: number | null;
            matchedPaymentId?: mongoose.Types.ObjectId | null;
            matchedBookingId?: mongoose.Types.ObjectId | null;
        }>;
        reconciled: boolean;
        uploadedBy?: mongoose.Types.ObjectId | null;
        reconciledAt?: NativeDate | null;
        reconciledBy?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: string | null;
        matchedBookingId?: string | null;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: string | null;
        matchedBookingId?: string | null;
        _id: string;
    }> & ({
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: string | null;
        matchedBookingId?: string | null;
        _id: string;
    })>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    type: "credit_card" | "bank";
    accountName: string;
    statementDate: NativeDate;
    transactions: mongoose.Types.DocumentArray<{
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: string | null;
        matchedBookingId?: string | null;
        _id: string;
    }, mongoose.Types.Subdocument<string | mongoose.mongo.BSON.ObjectId, unknown, {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: string | null;
        matchedBookingId?: string | null;
        _id: string;
    }> & ({
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: mongoose.Types.ObjectId | null;
        matchedBookingId?: mongoose.Types.ObjectId | null;
    } | {
        date: NativeDate;
        description: string;
        amount: number;
        matched: boolean;
        reference?: string | null;
        balance?: number | null;
        matchedPaymentId?: string | null;
        matchedBookingId?: string | null;
        _id: string;
    })>;
    reconciled: boolean;
    uploadedBy?: mongoose.Types.ObjectId | null;
    reconciledAt?: NativeDate | null;
    reconciledBy?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Statement.d.ts.map