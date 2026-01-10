
const BASE_PRICE = 20000;
const TAX_RATE = 0.18;
const EXTRA_PERSON_RATE = 0.10;

// Customer Information
let customerName = "Jafrash";
let days = 1;
let people = 5; 
let basePeople = 4;

function calculateTotalAmount(days, people) {
    let totalPrice = BASE_PRICE * days;


    if (people > basePeople) {
        let extraPeople = people - basePeople;
        let extraCharge = BASE_PRICE * EXTRA_PERSON_RATE * extraPeople;
        totalPrice += extraCharge;
    }

  
    let taxAmount = totalPrice * TAX_RATE;
    let finalAmount = totalPrice + taxAmount;

    return {
        totalPrice,
        taxAmount,
        finalAmount
    };
}

let bill = calculateTotalAmount(days, people);

// Output

/*
console.log("Customer Name:", customerName);
console.log("Days:", days);
console.log("People:", people);
console.log("Base Price:", bill.totalPrice - bill.taxAmount);
console.log("Tax (18%):", bill.taxAmount);
console.log("Final Amount to Pay:", bill.finalAmount);

*/

const empId=Symbol('employeeId')
 
let user={
    [empId]:"EMP1001",
    employeeName:"Jafrash",
    emailId:"jafrash123@gmail.com",
    contactNumber:"7013291919"
}

console.log(user)


/* Create a bus booking system criteria:-
100km-24hrs-5000 rupees
If increment of every 1km per 24 hrs - 5 rupees,
If hrs increases - 3 rupees 
20 seater bus - 5000
30 seater bus - 7000
40 seater bus - 9000
50 seater bus - 12000*/

const BUS = {
  types: ['20 seater', '30 seater', '40 seater', '50 seater'],
  baseFares: { 20: 5000, 30: 7000, 40: 9000, 50: 12000 },
  EXTRA_KM_RATE: 5, // ₹ per extra km
  EXTRA_HOUR_RATE: 3 
};

function calclateBusFare(km,hrs){
    
    let bustType=[5000,7000,9000,12000];
    let baseFare=5000;
    if(km>100){
        let extraKm=km-100;
        baseFare+=extraKm*5;
    }

    if(hrs>24){
        extraHrs=hrs-24;
        baseFare+=extraHrs*3;
    }
    return baseFare;
}

function calculateBusFare(busSize, km = 100, hrs = 24) {
  const size = typeof busSize === 'string' ? parseInt(busSize, 10) : Number(busSize);
  if (!BUS.baseFares[size]) {
    throw new Error('Invalid bus size. Choose one of: 20, 30, 40, 50');
  }

  km = Math.max(0, Number(km));
  hrs = Math.max(0, Number(hrs));

  const baseFare = BUS.baseFares[size];
  const extraKm = Math.max(0, km - 100);
  const extraKmCharge = extraKm * BUS.EXTRA_KM_RATE;
  const extraHrs = Math.max(0, hrs - 24);
  const extraHrsCharge = extraHrs * BUS.EXTRA_HOUR_RATE;

  const totalFare = baseFare + extraKmCharge + extraHrsCharge;

  return {
    busSize: size,
    baseFare,
    extraKm,
    extraKmCharge,
    extraHrs,
    extraHrsCharge,
    totalFare
  };
}

// example usage
try {
  console.log('\n-- Bus fare examples --');
  console.log(calculateBusFare(20, 100, 24)); // default: base fare
  console.log(calculateBusFare(20, 150, 30)); // extra km & hrs
  console.log(calculateBusFare('50 seater', 200, 50));
} catch (err) {
  console.error(err.message);
}





