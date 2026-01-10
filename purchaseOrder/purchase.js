/*
================================================================================
PURCHASE ORDER (PO) AND INVOICE MANAGEMENT SYSTEM
================================================================================
Processing of payments for freelancers:
-> Hourly
-> Daily
-> Monthly

The payments should happen after 30 days of raising the invoice.

Create a purchase order, an invoice, and calculate the total amount.
Example: Sharath Kumar - Java Full stack Training - For 5 months, 
1 lakh rupees per month and 10% TDS Deduction
================================================================================
*/

// ============================================================
// 1. GENERATE PO NUMBER (Format: 3 letters + 3 digits)
// ============================================================


function generatePONumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let po = '';

  for (let i = 0; i < 3; i++) {
    po += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 3; i++) {
    po += Math.floor(Math.random() * 10);
  }
  return po;
}

// ============================================================
// 2. GENERATE INVOICE NUMBER (Format: 3 letters + 3 digits)
// ============================================================
function generateInvoiceNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let invoice = '';
  for (let i = 0; i < 3; i++) {
    invoice += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 3; i++) {
    invoice += Math.floor(Math.random() * 10);
  }
  return invoice;
}

// ============================================================
// 3. CREATE PURCHASE ORDER (PO)
// ============================================================
function createPurchaseOrder(trainerInfo, trainingInfo, paymentType, rate, duration, tdsRate = 0.10) {
  // Validate inputs
  if (!trainerInfo || !trainingInfo || !paymentType || !rate || !duration) {
    return { error: 'Missing required fields' };
  }

  const poNumber = generatePONumber();
  let totalAmount = 0;

  // Calculate total amount based on payment type
  if (paymentType.toLowerCase() === 'hourly') {
    totalAmount = rate * duration; // duration = hours
  } else if (paymentType.toLowerCase() === 'daily') {
    totalAmount = rate * duration; // duration = days
  } else if (paymentType.toLowerCase() === 'monthly') {
    totalAmount = rate * duration; // duration = months
  } else {
    return { error: 'Invalid payment type. Use Hourly, Daily, or Monthly' };
  }

  const tdsDeduction = totalAmount * tdsRate;
  const netAmount = totalAmount - tdsDeduction;

  return {
    poNumber: poNumber,
    trainerName: trainerInfo.name,
    trainerEmail: trainerInfo.email,
    trainerExperience: trainerInfo.experience,
    courseName: trainingInfo.courseName,
    clientName: trainingInfo.clientName,
    startDate: trainingInfo.startDate,
    endDate: trainingInfo.endDate,
    paymentType: paymentType,
    ratePerUnit: rate,
    duration: duration,
    totalAmount: totalAmount,
    tdsRate: (tdsRate * 100),
    tdsDeduction: tdsDeduction,
    netAmount: netAmount,
    createdDate: new Date(),
    status: 'active',
    invoices: []
  };
}

// ============================================================
// 4. CALCULATE AMOUNT BASED ON PAYMENT TYPE
// ============================================================
function calculateAmount(paymentType, rate, duration) {
  let amount = 0;

  if (paymentType.toLowerCase() === 'hourly') {
    amount = rate * duration;
  } else if (paymentType.toLowerCase() === 'daily') {
    amount = rate * duration;
  } else if (paymentType.toLowerCase() === 'monthly') {
    amount = rate * duration;
  }

  return amount;
}

// ============================================================
// 5. GENERATE INVOICE (Only after training end date)
// ============================================================
function generateInvoice(po, invoiceDate = new Date()) {
  // Check if invoice can be generated (after training end date)
  const endDate = new Date(po.endDate);
  const currentDate = invoiceDate;

  if (currentDate <= endDate) {
    const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
    return {
      error: true,
      message: `❌ Invoice cannot be sent before training end date. Training ends on ${endDate.toLocaleDateString()}. Please wait ${remainingDays} more day(s).`
    };
  }

  // Calculate due date (30 days from invoice date)

  const dueDate =new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate()+30)
   

  //const dueDate = new Date(invoiceDate);
  //dueDate.setDate(dueDate.getDate() + 30);

  const invoice = {
    invoiceNumber: generateInvoiceNumber(),
    poNumber: po.poNumber,
    trainerName: po.trainerName,
    trainerEmail: po.trainerEmail,
    courseName: po.courseName,
    clientName: po.clientName,
    totalAmount: po.totalAmount,
    tdsDeduction: po.tdsDeduction,
    netAmount: po.netAmount,
    invoiceDate: invoiceDate,
    dueDate: dueDate,
    status: 'UNPAID',
    paymentDate: null
  };

  // Add invoice to PO
  po.invoices.push(invoice);

  return {
    error: false,
    message: '✅ Invoice generated successfully',
    invoice: invoice
  };
}

// ============================================================
// 6. CHECK INVOICE STATUS (UNPAID / OVERDUE / PAID)
// ============================================================
function checkInvoiceStatus(invoice) {
  if (invoice.status === 'PAID') {
    return 'PAID';
  }

  const today = new Date();
  const dueDate = new Date(invoice.dueDate);

  if (today > dueDate) {
    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    return {
      status: 'OVERDUE',
      daysOverdue: daysOverdue,
      message: `Invoice is ${daysOverdue} day(s) overdue`
    };
  }

  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  return {
    status: 'UNPAID',
    daysUntilDue: daysUntilDue,
    message: `Payment due in ${daysUntilDue} day(s)`
  };
}

// ============================================================
// 7. SEND OVERDUE NOTIFICATION (Email simulation)
// ============================================================
function sendOverdueNotification(invoice) {
  const invoiceStatus = checkInvoiceStatus(invoice);

  if (invoiceStatus.status === 'OVERDUE') {
    const emailContent = {
      to: 'accounts@company.com',
      subject: `⚠️ OVERDUE INVOICE ALERT - ${invoice.invoiceNumber}`,
      body: `
Dear Accounts Team,

This is to notify you that the following invoice is OVERDUE:

Invoice Number: ${invoice.invoiceNumber}
PO Number: ${invoice.poNumber}
Trainer: ${invoice.trainerName}
Course: ${invoice.courseName}
Amount Due: ₹${invoice.netAmount}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Days Overdue: ${invoiceStatus.daysOverdue}

Please take necessary action to collect the payment.

Best Regards,
Invoice Management System
      `,
      sentDate: new Date(),
      status: 'sent'
    };

    return emailContent;
  }

  return null;
}

// ============================================================
// 8. PROCESS PAYMENT (Mark invoice as paid)
// ============================================================
function processPayment(invoice, paymentDate = new Date()) {
  invoice.status = 'PAID';
  invoice.paymentDate = paymentDate;

  return {
    success: true,
    message: '✅ Payment processed successfully',
    paymentDetails: {
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.netAmount,
      paymentDate: paymentDate.toLocaleDateString(),
      status: 'PAID'
    }
  };
}

// ============================================================
// 9. DISPLAY PO DETAILS
// ============================================================
function displayPODetails(po) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           PURCHASE ORDER (PO) DETAILS                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`PO Number:              ${po.poNumber}`);
  console.log(`Created Date:           ${po.createdDate.toLocaleDateString()}`);
  console.log(`Status:                 ${po.status}`);
  console.log('\n--- TRAINER INFORMATION ---');
  console.log(`Name:                   ${po.trainerName}`);
  console.log(`Email:                  ${po.trainerEmail}`);
  console.log(`Experience:             ${po.trainerExperience} years`);
  console.log('\n--- TRAINING INFORMATION ---');
  console.log(`Course Name:            ${po.courseName}`);
  console.log(`Client Name:            ${po.clientName}`);
  console.log(`Start Date:             ${new Date(po.startDate).toLocaleDateString()}`);
  console.log(`End Date:               ${new Date(po.endDate).toLocaleDateString()}`);
  console.log('\n--- PAYMENT DETAILS ---');
  console.log(`Payment Type:           ${po.paymentType}`);
  console.log(`Rate per Unit:          ₹${po.ratePerUnit}`);
  console.log(`Duration:               ${po.duration} ${po.paymentType.toLowerCase()}`);
  console.log(`Total Amount:           ₹${po.totalAmount}`);
  console.log(`TDS (${po.tdsRate}%):             ₹${po.tdsDeduction}`);
  console.log(`Net Amount:             ₹${po.netAmount}`);
  console.log('\n');
}

// ============================================================
// 10. DISPLAY INVOICE DETAILS
// ============================================================
function displayInvoiceDetails(invoice) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║              INVOICE DETAILS                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`Invoice Number:         ${invoice.invoiceNumber}`);
  console.log(`PO Number:              ${invoice.poNumber}`);
  console.log(`Trainer:                ${invoice.trainerName}`);
  console.log(`Course:                 ${invoice.courseName}`);
  console.log(`Client:                 ${invoice.clientName}`);
  console.log(`Invoice Date:           ${invoice.invoiceDate.toLocaleDateString()}`);
  console.log(`Due Date:               ${new Date(invoice.dueDate).toLocaleDateString()}`);
  console.log('\n--- AMOUNT DETAILS ---');
  console.log(`Total Amount:           ₹${invoice.totalAmount}`);
  console.log(`TDS Deduction:          ₹${invoice.tdsDeduction}`);
  console.log(`Net Amount:             ₹${invoice.netAmount}`);
  console.log('\n--- STATUS ---');

  const status = checkInvoiceStatus(invoice);
  if (typeof status === 'string') {
    console.log(`Payment Status:         ${status}`);
    if (status === 'PAID') {
      console.log(`Paid Date:              ${new Date(invoice.paymentDate).toLocaleDateString()}`);
    }
  } else {
    console.log(`Payment Status:         ${status.status}`);
    console.log(`Message:                ${status.message}`);
  }

  console.log('\n');
}

// ============================================================
// EXAMPLE USAGE
// ============================================================

// Define trainer information
const trainerInfo = {
  name: 'Sharath Kumar',
  email: 'sharath.kumar@company.com',
  experience: 8
};

// Define training information
const trainingInfo = {
  courseName: 'Java Full Stack Training',
  clientName: 'TechCorp Industries',
  startDate: '2026-01-15',
  endDate: '2026-06-15'  // 5 months duration
};

// Create Purchase Order
console.log('📋 Creating Purchase Order...\n');
const po = createPurchaseOrder(
  trainerInfo,
  trainingInfo,
  'Monthly',  // Payment Type
  100000,     // Rate per month (1 lakh)
  5,          // Duration (5 months)
  0.10        // TDS Rate (10%)
);

displayPODetails(po);

// ============================================================
// TRY TO GENERATE INVOICE BEFORE END DATE (Should fail)
// ============================================================
console.log('📧 Attempting to generate invoice BEFORE training end date...\n');
const earlyInvoice = generateInvoice(po, new Date('2026-05-01'));
if (earlyInvoice.error) {
  console.log(earlyInvoice.message);
} else {
  displayInvoiceDetails(earlyInvoice.invoice);
}

// ============================================================
// GENERATE INVOICE AFTER END DATE (Should succeed)
// ============================================================
console.log('\n📧 Generating invoice AFTER training end date...\n');
const invoiceResult = generateInvoice(po, new Date('2026-06-20'));
if (!invoiceResult.error) {
  console.log(invoiceResult.message);
  const invoice = invoiceResult.invoice;
  displayInvoiceDetails(invoice);

  // ============================================================
  // CHECK INVOICE STATUS
  // ============================================================
  console.log('🔍 Checking invoice status...\n');
  const status = checkInvoiceStatus(invoice);
  console.log(`Status: ${status.status}`);
  console.log(`Message: ${status.message}\n`);

  // ============================================================
  // PROCESS PAYMENT
  // ============================================================
  console.log('💰 Processing payment...\n');
  const paymentResult = processPayment(invoice);
  console.log(paymentResult.message);
  console.log(`Payment Details: ${JSON.stringify(paymentResult.paymentDetails, null, 2)}\n`);

  // ============================================================
  // DISPLAY UPDATED INVOICE STATUS
  // ============================================================
  console.log('🔍 Updated invoice status after payment...\n');
  displayInvoiceDetails(invoice);
}

// ============================================================
// SIMULATE OVERDUE INVOICE & SEND NOTIFICATION
// ============================================================
console.log('\n⚠️ Simulating OVERDUE INVOICE...\n');
const overdueInvoice = {
  invoiceNumber: 'ABC123',
  poNumber: 'XYZ789',
  trainerName: 'Sharath Kumar',
  courseName: 'Java Full Stack Training',
  netAmount: 450000,
  invoiceDate: new Date('2026-01-01'),
  dueDate: new Date('2026-02-01'),
  status: 'UNPAID',
  paymentDate: null
};

const overdueStatus = checkInvoiceStatus(overdueInvoice);
console.log(`Invoice Status: ${overdueStatus.status}`);
console.log(`Message: ${overdueStatus.message}\n`);

const notification = sendOverdueNotification(overdueInvoice);
if (notification) {
  console.log('📧 OVERDUE NOTIFICATION SENT:\n');
  console.log(`To: ${notification.to}`);
  console.log(`Subject: ${notification.subject}`);
  console.log(`Sent Date: ${notification.sentDate.toLocaleDateString()}`);
  console.log(notification.body);
}