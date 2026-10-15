import { addDays, subDays } from "date-fns";
import { CONTRACT_TYPES, PAYMENT_STATUS } from "@/utils/Constants";
import type { Contract } from "@/types/contract";
import type { LookupEntity } from "@/types/lookup";

// ------------------------------------------------------------------
//  UI PREVIEW DATA. Contracts and dashboard are UI-only for now.
//  Shapes match the dt-contract-apis responses exactly, so wiring the
//  API only means replacing the source in hooks/useContractList.ts.
//  Delete this file once the contracts API is integrated.
// ------------------------------------------------------------------

const id = (prefix: string, index: number) => `${prefix}${String(index).padStart(24 - prefix.length, "0")}`;
const iso = (date: Date) => date.toISOString();
const today = new Date();

const lookup = (prefix: string, names: string[]): LookupEntity[] =>
  names.map((name, index) => ({
    _id: id(prefix, index + 1),
    name,
    description: null,
    image: null,
    createdAt: iso(subDays(today, 120)),
    updatedAt: iso(subDays(today, 120)),
  }));

export const MOCK_DEPARTMENTS = lookup("dd", ["Housekeeping", "Engineering", "F&B", "IT", "Front Office", "Security"]);
export const MOCK_VENDORS = lookup("ee", [
  "CleanCo",
  "LiftTech",
  "Fresh Foods Ltd.",
  "SafeCare",
  "Tech Solutions",
  "Gulf Security Services",
  "AquaPure Water",
]);

const [housekeeping, engineering, fnb, it, frontOffice, security] = MOCK_DEPARTMENTS.map((item) => item._id);
const [cleanCo, liftTech, freshFoods, safeCare, techSolutions, gulfSecurity, aquaPure] = MOCK_VENDORS.map((item) => item._id);

interface MockInput {
  title: string;
  vendorId: string;
  departmentId: string;
  startOffset: number;
  endOffset: number;
  duration: string;
  type: string;
  amount: number;
  paymentStatus: Contract["paymentStatus"];
  description?: string;
  notes?: string;
  supporting?: string[];
}

const contract = (input: MockInput, index: number): Contract => {
  const createdAt = iso(addDays(today, input.startOffset - 5));
  const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    _id: id("cc", index + 1),
    vendorId: input.vendorId,
    departmentId: input.departmentId,
    createdBy: id("aa", 1),
    title: input.title,
    description: input.description ?? null,
    startDate: iso(addDays(today, input.startOffset)),
    endDate: iso(addDays(today, input.endOffset)),
    duration: input.duration,
    type: input.type,
    amount: input.amount,
    paymentStatus: input.paymentStatus,
    notes: input.notes ?? null,
    attachments: {
      mainDocument: `/uploads/files-${index + 1}-${slug}-contract.pdf`,
      supportingDocuments: input.supporting ?? [],
    },
    createdAt,
    updatedAt: createdAt,
  };
};

export const MOCK_CONTRACTS: Contract[] = [
  {
    title: "Housekeeping Services",
    vendorId: cleanCo,
    departmentId: housekeeping,
    startOffset: -290,
    endOffset: 75,
    duration: "1 year",
    type: CONTRACT_TYPES.ANNUAL,
    amount: 120000,
    paymentStatus: PAYMENT_STATUS.PARTIAL,
    description: "Annual housekeeping services for hotel premises including rooms, public areas and office spaces.",
    supporting: ["/uploads/files-1-invoice-jan-2026.pdf"],
  },
  {
    title: "Elevator Maintenance",
    vendorId: liftTech,
    departmentId: engineering,
    startOffset: -340,
    endOffset: 21,
    duration: "1 year",
    type: CONTRACT_TYPES.ANNUAL,
    amount: 85000,
    paymentStatus: PAYMENT_STATUS.PAID,
    description: "Preventive maintenance and 24/7 breakdown support for all six passenger elevators.",
  },
  {
    title: "Food Supply Agreement",
    vendorId: freshFoods,
    departmentId: fnb,
    startOffset: -60,
    endOffset: 300,
    duration: "1 year",
    type: CONTRACT_TYPES.RECURRING,
    amount: 340000,
    paymentStatus: PAYMENT_STATUS.PENDING,
    description: "Daily supply of fresh produce, dairy and dry goods for the main kitchen.",
    notes: "Invoices are settled monthly against delivery notes.",
  },
  {
    title: "Pest Control Services",
    vendorId: safeCare,
    departmentId: housekeeping,
    startOffset: -400,
    endOffset: -35,
    duration: "1 year",
    type: CONTRACT_TYPES.ANNUAL,
    amount: 24000,
    paymentStatus: PAYMENT_STATUS.PAID,
  },
  {
    title: "IT Support Services",
    vendorId: techSolutions,
    departmentId: it,
    startOffset: -30,
    endOffset: 155,
    duration: "6 months",
    type: CONTRACT_TYPES.RECURRING,
    amount: 48000,
    paymentStatus: PAYMENT_STATUS.PARTIAL,
    description: "On-site IT helpdesk, network monitoring and PMS support.",
  },
  {
    title: "Security Guard Services",
    vendorId: gulfSecurity,
    departmentId: security,
    startOffset: -200,
    endOffset: 165,
    duration: "1 year",
    type: CONTRACT_TYPES.ANNUAL,
    amount: 210000,
    paymentStatus: PAYMENT_STATUS.OVERDUE,
    notes: "Q3 payment pending approval from finance.",
  },
  {
    title: "Drinking Water Supply",
    vendorId: aquaPure,
    departmentId: fnb,
    startOffset: -150,
    endOffset: 12,
    duration: "6 months",
    type: CONTRACT_TYPES.RECURRING,
    amount: 18500,
    paymentStatus: PAYMENT_STATUS.PAID,
  },
  {
    title: "Lobby Renovation Works",
    vendorId: liftTech,
    departmentId: frontOffice,
    startOffset: -95,
    endOffset: -10,
    duration: "3 months",
    type: CONTRACT_TYPES.ONE_TIME,
    amount: 96000,
    paymentStatus: PAYMENT_STATUS.PARTIAL,
  },
  {
    title: "Laundry Equipment Servicing",
    vendorId: cleanCo,
    departmentId: housekeeping,
    startOffset: -20,
    endOffset: 345,
    duration: "1 year",
    type: CONTRACT_TYPES.ANNUAL,
    amount: 32000,
    paymentStatus: PAYMENT_STATUS.PENDING,
  },
  {
    title: "CCTV System Upgrade",
    vendorId: techSolutions,
    departmentId: security,
    startOffset: -45,
    endOffset: 28,
    duration: "2 months",
    type: CONTRACT_TYPES.ONE_TIME,
    amount: 67500,
    paymentStatus: PAYMENT_STATUS.PENDING,
  },
  {
    title: "Front Desk Uniforms",
    vendorId: freshFoods,
    departmentId: frontOffice,
    startOffset: -380,
    endOffset: -200,
    duration: "6 months",
    type: CONTRACT_TYPES.OTHER,
    amount: 15000,
    paymentStatus: PAYMENT_STATUS.PAID,
  },
  {
    title: "HVAC Annual Maintenance",
    vendorId: liftTech,
    departmentId: engineering,
    startOffset: -10,
    endOffset: 355,
    duration: "1 year",
    type: CONTRACT_TYPES.ANNUAL,
    amount: 140000,
    paymentStatus: PAYMENT_STATUS.PENDING,
  },
].map(contract);
