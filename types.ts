// --- NEW Data Structure Types ---

export interface Borey {
  developer: string;
  project: string; // Project name or location description
  province: string;
  district: string;
  locationNote: string; // Additional notes
  marketValue: number;
  baseValue: number;
}

export interface ZoneType {
  id: string;
  label: string;
  desc: string;
  price: number;
}

export interface ZoneData {
  name: string;
  types: ZoneType[];
}

// Village DB Structure: Province -> District -> Commune -> Village -> Prices[Main, Sub, NoRoad]
export interface VillageDB {
  [province: string]: {
    [district: string]: {
      [commune: string]: {
        [village: string]: number[];
      };
    };
  };
}

// A "Data Hub" for a single province
export interface ProvinceData {
  villages: VillageDB;
  boreys: Borey[];
  zones: ZoneData[];
}

// The master database object
export interface Database {
  [provinceName: string]: ProvinceData;
}


// --- Flat structures for easy searching ---

export interface FlatVillage {
  province: string;
  district: string;
  commune: string;
  village: string;
  prices: number[];
}


// --- Calculation and Input Types (Unchanged) ---

export interface FloorInput {
  id: string;
  size: number;
  cost: number;
}

export interface CalculationInputs {
  ownerName: string;
  phone: string;
  pin: string;
  landSize: number;
  marketPrice: number;
  basePrice: number;
  floors: FloorInput[];
  exportYears: number;
  skipPenalty: boolean;
  yearStart: number;
  yearEnd: number;
  monthEnd: number;
  dayEnd: number;
}

export interface YearlyDetail {
  year: number;
  yearlyTax: number;
  fine: number;
  interest: number;
  total: number;
  monthsLate: number;
  daysLate: number;
}

export interface CalculationResult {
  landValSale: number;
  buildVal: number;
  totalValSale: number;
  saleTax: number;
  yearlyTax: number;
  taxSvc: number;
  totalPaid: number;
  grandTotal: number;
  yearlyDetails: YearlyDetail[];
  timestamp: string;
}
