import mongoose from "mongoose";
export declare const Invoice: mongoose.Model<{
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
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
        customerId: mongoose.Types.ObjectId;
        paymentStatus: "partial" | "unpaid" | "paid";
        bookingIds: mongoose.Types.ObjectId[];
        invoiceNumber: string;
        invoiceDate: NativeDate;
        baseSellingAmount: number;
        serviceCharge: number;
        serviceChargeGst18: number;
        serviceChargeGst5: number;
        sgst: number;
        cgst: number;
        igst: number;
        totalAmount: number;
        amountReceived: number;
        remainingAmount: number;
        gstType: "igst" | "sgst_cgst";
        gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
        customerGstin?: string | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        customerId: mongoose.Types.ObjectId;
        paymentStatus: "partial" | "unpaid" | "paid";
        bookingIds: mongoose.Types.ObjectId[];
        invoiceNumber: string;
        invoiceDate: NativeDate;
        baseSellingAmount: number;
        serviceCharge: number;
        serviceChargeGst18: number;
        serviceChargeGst5: number;
        sgst: number;
        cgst: number;
        igst: number;
        totalAmount: number;
        amountReceived: number;
        remainingAmount: number;
        gstType: "igst" | "sgst_cgst";
        gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
        createdBy?: mongoose.Types.ObjectId | null;
        updatedBy?: mongoose.Types.ObjectId | null;
        customerGstin?: string | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    customerId: mongoose.Types.ObjectId;
    paymentStatus: "partial" | "unpaid" | "paid";
    bookingIds: mongoose.Types.ObjectId[];
    invoiceNumber: string;
    invoiceDate: NativeDate;
    baseSellingAmount: number;
    serviceCharge: number;
    serviceChargeGst18: number;
    serviceChargeGst5: number;
    sgst: number;
    cgst: number;
    igst: number;
    totalAmount: number;
    amountReceived: number;
    remainingAmount: number;
    gstType: "igst" | "sgst_cgst";
    gstCalculationMethod: "service_charge_only" | "full_amount" | "service_charge_5" | "selling_amount_5";
    createdBy?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    customerGstin?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Invoice.d.ts.map