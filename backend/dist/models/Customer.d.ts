import mongoose from "mongoose";
export declare const Customer: mongoose.Model<{
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
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
        name: string;
        tags: string[];
        travelers: mongoose.Types.DocumentArray<{
            name: string;
            email?: string | null;
            phone?: string | null;
            designation?: string | null;
            employeeId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name: string;
            email?: string | null;
            phone?: string | null;
            designation?: string | null;
            employeeId?: string | null;
        }> & {
            name: string;
            email?: string | null;
            phone?: string | null;
            designation?: string | null;
            employeeId?: string | null;
        }>;
        email?: string | null;
        phone?: string | null;
        companyName?: string | null;
        address?: string | null;
        stateCode?: string | null;
        gstNumber?: string | null;
        gstin?: string | null;
        reference?: string | null;
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        tags: string[];
        travelers: mongoose.Types.DocumentArray<{
            name: string;
            email?: string | null;
            phone?: string | null;
            designation?: string | null;
            employeeId?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name: string;
            email?: string | null;
            phone?: string | null;
            designation?: string | null;
            employeeId?: string | null;
        }> & {
            name: string;
            email?: string | null;
            phone?: string | null;
            designation?: string | null;
            employeeId?: string | null;
        }>;
        email?: string | null;
        phone?: string | null;
        companyName?: string | null;
        address?: string | null;
        stateCode?: string | null;
        gstNumber?: string | null;
        gstin?: string | null;
        reference?: string | null;
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    tags: string[];
    travelers: mongoose.Types.DocumentArray<{
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }> & {
        name: string;
        email?: string | null;
        phone?: string | null;
        designation?: string | null;
        employeeId?: string | null;
    }>;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    address?: string | null;
    stateCode?: string | null;
    gstNumber?: string | null;
    gstin?: string | null;
    reference?: string | null;
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Customer.d.ts.map