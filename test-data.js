const API_BASE = "http://localhost:5000";

// Test data - 10 customers with different states
const customers = [
  { name: "Rajesh Kumar", companyName: "Rajesh Travels", email: "rajesh@example.com", phone: "+91-9876543210", address: "123 Main St, Jaipur", stateCode: "08", gstin: "08ABCDE1234F1Z5", reference: "REF001" },
  { name: "Priya Sharma", companyName: "Priya Tours", email: "priya@example.com", phone: "+91-9876543211", address: "456 Park Ave, Udaipur", stateCode: "08", gstin: "08FGHIJ5678K2Z6", reference: "REF002" },
  { name: "Amit Patel", companyName: "Amit Holidays", email: "amit@example.com", phone: "+91-9876543212", address: "789 MG Road, Mumbai", stateCode: "27", gstin: "27KLMNO9012L3Z7", reference: "REF003" },
  { name: "Sneha Reddy", companyName: "Sneha Travels", email: "sneha@example.com", phone: "+91-9876543213", address: "321 Brigade Road, Bangalore", stateCode: "29", gstin: "29PQRST3456M4Z8", reference: "REF004" },
  { name: "Vikram Singh", companyName: "Vikram Tours", email: "vikram@example.com", phone: "+91-9876543214", address: "654 Connaught Place, Delhi", stateCode: "07", gstin: "07UVWXY7890N5Z9", reference: "REF005" },
  { name: "Anjali Mehta", companyName: "Anjali Holidays", email: "anjali@example.com", phone: "+91-9876543215", address: "987 Park Street, Kolkata", stateCode: "19", gstin: "19ZABCD1234O6Z0", reference: "REF006" },
  { name: "Rohit Agarwal", companyName: "Rohit Travels", email: "rohit@example.com", phone: "+91-9876543216", address: "147 Banjara Hills, Hyderabad", stateCode: "36", gstin: "36EFGHI5678P7Z1", reference: "REF007" },
  { name: "Kavita Joshi", companyName: "Kavita Tours", email: "kavita@example.com", phone: "+91-9876543217", address: "258 MG Road, Pune", stateCode: "27", gstin: "27JKLMN9012Q8Z2", reference: "REF008" },
  { name: "Manish Gupta", companyName: "Manish Holidays", email: "manish@example.com", phone: "+91-9876543218", address: "369 Sector 18, Noida", stateCode: "09", gstin: "09OPQRS3456R9Z3", reference: "REF009" },
  { name: "Deepika Nair", companyName: "Deepika Travels", email: "deepika@example.com", phone: "+91-9876543219", address: "741 MG Road, Chennai", stateCode: "33", gstin: "33TUVWX7890S0Z4", reference: "REF010" },
];

// Helper function to make API calls
async function apiCall(method, path, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
    const errorMsg = error.message || error.error || `Request failed: ${res.status}`;
    console.error(`  ❌ Error at ${method} ${path}:`, errorMsg);
    if (body) {
      console.error(`  ❌ Request body:`, JSON.stringify(body, null, 2));
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

// Random number between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random date in the future
function randomFutureDate(daysFromNow = 30) {
  const date = new Date();
  date.setDate(date.getDate() + random(1, daysFromNow));
  return date.toISOString().split("T")[0];
}

// Random date in the past
function randomPastDate(daysAgo = 30) {
  const date = new Date();
  date.setDate(date.getDate() - random(1, daysAgo));
  return date.toISOString().split("T")[0];
}

// Generate random booking data
function generateBooking(customerId, index) {
  const types = ["flight", "hotel", "package", "other"];
  const type = types[index % types.length];
  const soldAt = random(5000, 50000);
  const supplierCost = Math.floor(soldAt * random(60, 85) / 100); // 60-85% of soldAt
  const feesAdjustments = random(-500, 500);
  
  const baseBooking = {
    customerId,
    type,
    soldAt,
    supplierCost,
    feesAdjustments,
    bookingDate: randomPastDate(60),
    travelDate: randomFutureDate(90),
    portal: ["MakeMyTrip", "Goibibo", "Booking.com", "Direct"][index % 4],
    paymentMethodHint: ["cash", "bank", "card"][index % 3],
  };

  if (type === "flight") {
    const fromCities = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai"];
    const toCities = ["Dubai", "Singapore", "Bangkok", "London", "New York"];
    return {
      ...baseBooking,
      from: fromCities[index % fromCities.length],
      to: toCities[index % toCities.length],
      airlineOrHotel: ["Air India", "IndiGo", "SpiceJet", "Vistara"][index % 4],
      pnr: `PNR${random(100000, 999999)}`,
      bookingType: ["Normal", "SME", "Corporate"][index % 3],
    };
  } else if (type === "hotel") {
    const cities = ["Mumbai", "Goa", "Delhi", "Bangalore", "Jaipur"];
    return {
      ...baseBooking,
      city: cities[index % cities.length],
      airlineOrHotel: ["Taj Hotels", "Oberoi", "ITC", "Marriott"][index % 4],
      checkInDate: randomFutureDate(30),
      checkOutDate: randomFutureDate(45),
      hotelReconfirmed: index % 2 === 0,
    };
  } else if (type === "package") {
    return {
      ...baseBooking,
      startDate: randomFutureDate(30),
      endDate: randomFutureDate(60),
      details: `Package ${index + 1}: ${random(3, 7)} days tour`,
      customFields: {
        hotel: random(2000, 10000),
        cab: random(1000, 5000),
        meals: random(500, 2000),
      },
    };
  } else {
    return {
      ...baseBooking,
      details: `Other booking ${index + 1}`,
      customFields: {
        service1: random(1000, 5000),
        service2: random(1000, 5000),
      },
    };
  }
}

async function runTest() {
  console.log("🚀 Starting comprehensive test...\n");
  
  const customerIds = [];
  const bookingIds = [];
  
  try {
    // Step 1: Create 10 customers
    console.log("📝 Step 1: Creating 10 customers...");
    for (let i = 0; i < customers.length; i++) {
      const customer = await apiCall("POST", "/api/customers", customers[i]);
      customerIds.push(customer._id);
      console.log(`  ✅ Created customer ${i + 1}: ${customer.name} (${customer.stateCode})`);
    }
    console.log(`\n✅ Created ${customerIds.length} customers\n`);

    // Step 2: Create 3 bookings for each customer (30 bookings total)
    console.log("📝 Step 2: Creating 3 bookings for each customer...");
    for (let i = 0; i < customerIds.length; i++) {
      for (let j = 0; j < 3; j++) {
        const bookingData = generateBooking(customerIds[i], i * 3 + j);
        const booking = await apiCall("POST", "/api/bookings", bookingData);
        bookingIds.push({ bookingId: booking._id, customerId: customerIds[i], soldAt: booking.soldAt });
        console.log(`  ✅ Created booking ${i * 3 + j + 1}/30: ${booking.type} for customer ${i + 1} (Sold: ₹${booking.soldAt})`);
      }
    }
    console.log(`\n✅ Created ${bookingIds.length} bookings\n`);

    // Step 3: Add payments (50-70% of soldAt) for each booking
    console.log("📝 Step 3: Adding payments (50-70% of sold amount)...");
    for (let i = 0; i < bookingIds.length; i++) {
      const { bookingId, soldAt } = bookingIds[i];
      const paymentPercent = random(50, 70) / 100;
      const paymentAmount = Math.floor(soldAt * paymentPercent);
      const paymentDate = randomPastDate(30);
      
      const payment = await apiCall("POST", "/api/payments", {
        bookingId,
        customerId: bookingIds[i].customerId,
        amount: paymentAmount,
        date: paymentDate,
        method: ["cash", "bank", "card"][i % 3],
        accountOrCompany: ["HDFC", "ICICI", "SBI", "Cash"][i % 4],
      });
      
      // Verify the booking was updated
      const updatedBooking = await apiCall("GET", `/api/bookings?customerId=${bookingIds[i].customerId}`);
      const thisBooking = updatedBooking.find(b => b._id === bookingId);
      console.log(`  ✅ Payment ₹${paymentAmount} (${(paymentPercent * 100).toFixed(0)}%) for booking ${i + 1}/30 - Remaining: ₹${thisBooking?.remainingBalance || 0}`);
    }
    console.log(`\n✅ Added payments for ${bookingIds.length} bookings\n`);

    // Step 4: Generate invoices for each booking
    console.log("📝 Step 4: Generating invoices for each booking...");
    let invoiceCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < bookingIds.length; i++) {
      const { bookingId } = bookingIds[i];
      const serviceCharge = random(500, 2000);
      const invoiceNumber = `INV-${String(i + 1).padStart(4, "0")}`;
      
      try {
        const invoice = await apiCall("POST", `/api/invoices/from-booking/${bookingId}`, {
          invoiceNumber,
          invoiceDate: new Date().toISOString().split("T")[0],
          baseSellingAmount: bookingIds[i].soldAt,
          serviceCharge,
          amountReceived: 0,
        });
        invoiceCount++;
        const gstType = invoice.gstType === "sgst_cgst" ? "SGST+CGST" : "IGST";
        console.log(`  ✅ Invoice ${i + 1}/30: ${invoiceNumber} (${gstType}) - Total: ₹${invoice.totalAmount}`);
      } catch (error) {
        errorCount++;
        console.log(`  ⚠️  Invoice ${i + 1}/30: ${error.message}`);
      }
    }
    console.log(`\n✅ Generated ${invoiceCount} invoices (${errorCount} errors)\n`);

    // Step 5: Verify data integrity
    console.log("📝 Step 5: Verifying data integrity...");
    
    // Check customers
    const allCustomers = await apiCall("GET", "/api/customers");
    console.log(`  ✅ Total customers: ${allCustomers.length}`);
    
    // Check bookings
    const allBookings = await apiCall("GET", "/api/bookings");
    console.log(`  ✅ Total bookings: ${allBookings.length}`);
    
    // Check payments
    const allPayments = await apiCall("GET", "/api/payments");
    console.log(`  ✅ Total payments: ${allPayments.length}`);
    
    // Check invoices
    const allInvoices = await apiCall("GET", "/api/invoices");
    console.log(`  ✅ Total invoices: ${allInvoices.length}`);
    
    // Verify payment balances
    let balanceIssues = 0;
    for (const booking of allBookings) {
      const bookingIdStr = booking._id?.toString();
      const bookingPayments = allPayments.filter(p => {
        const paymentBookingId = p.bookingId?._id?.toString() || p.bookingId?.toString();
        return paymentBookingId === bookingIdStr;
      });
      const calculatedTotal = bookingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      if (Math.abs(calculatedTotal - (booking.totalReceived || 0)) > 1) {
        balanceIssues++;
        console.log(`  ⚠️  Balance mismatch for booking ${bookingIdStr}: Calculated ${calculatedTotal}, Stored ${booking.totalReceived}, Payments found: ${bookingPayments.length}`);
      }
    }
    if (balanceIssues === 0) {
      console.log(`  ✅ All payment balances are correct`);
    } else {
      console.log(`  ⚠️  Found ${balanceIssues} balance mismatches`);
    }
    
    // Check GST types
    const sgstInvoices = allInvoices.filter(inv => inv.gstType === "sgst_cgst");
    const igstInvoices = allInvoices.filter(inv => inv.gstType === "igst");
    console.log(`  ✅ SGST+CGST invoices: ${sgstInvoices.length}, IGST invoices: ${igstInvoices.length}`);
    
    console.log("\n✅ Test completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Customers: ${allCustomers.length}`);
    console.log(`   - Bookings: ${allBookings.length}`);
    console.log(`   - Payments: ${allPayments.length}`);
    console.log(`   - Invoices: ${allInvoices.length}`);
    console.log(`   - Balance issues: ${balanceIssues}`);
    
  } catch (error) {
    console.error("\n❌ Test failed with error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === "undefined") {
  console.error("❌ This script requires Node.js 18+ with native fetch support");
  console.error("   Or install node-fetch: npm install node-fetch");
  process.exit(1);
}

runTest();

