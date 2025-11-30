import mongoose from "mongoose";
export declare const Settings: mongoose.Model<{
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
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
        email: string;
        companyName: string;
        address: string;
        stateCode: string;
        gstin: string;
        city: string;
        companyLogo: string;
        contactNumber: string;
        panNumber: string;
        state: string;
        pincode: string;
        ownerName: string;
        ownerContact: string;
        ownerEmail: string;
        banks: mongoose.Types.DocumentArray<{
            bankName: string;
            bankAccountNumber: string;
            ifscCode: string;
            branchName: string;
            branchCity: string;
            swiftCode: string;
            accountType: string;
            upiId: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            bankName: string;
            bankAccountNumber: string;
            ifscCode: string;
            branchName: string;
            branchCity: string;
            swiftCode: string;
            accountType: string;
            upiId: string;
        }> & {
            bankName: string;
            bankAccountNumber: string;
            ifscCode: string;
            branchName: string;
            branchCity: string;
            swiftCode: string;
            accountType: string;
            upiId: string;
        }>;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        email: string;
        companyName: string;
        address: string;
        stateCode: string;
        gstin: string;
        city: string;
        companyLogo: string;
        contactNumber: string;
        panNumber: string;
        state: string;
        pincode: string;
        ownerName: string;
        ownerContact: string;
        ownerEmail: string;
        banks: mongoose.Types.DocumentArray<{
            bankName: string;
            bankAccountNumber: string;
            ifscCode: string;
            branchName: string;
            branchCity: string;
            swiftCode: string;
            accountType: string;
            upiId: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            bankName: string;
            bankAccountNumber: string;
            ifscCode: string;
            branchName: string;
            branchCity: string;
            swiftCode: string;
            accountType: string;
            upiId: string;
        }> & {
            bankName: string;
            bankAccountNumber: string;
            ifscCode: string;
            branchName: string;
            branchCity: string;
            swiftCode: string;
            accountType: string;
            upiId: string;
        }>;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    email: string;
    companyName: string;
    address: string;
    stateCode: string;
    gstin: string;
    city: string;
    companyLogo: string;
    contactNumber: string;
    panNumber: string;
    state: string;
    pincode: string;
    ownerName: string;
    ownerContact: string;
    ownerEmail: string;
    banks: mongoose.Types.DocumentArray<{
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }> & {
        bankName: string;
        bankAccountNumber: string;
        ifscCode: string;
        branchName: string;
        branchCity: string;
        swiftCode: string;
        accountType: string;
        upiId: string;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Settings.d.ts.map