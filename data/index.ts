import { Database, FlatVillage, Borey } from '../types';
import { phnomPenhData } from './provinces/phnom-penh';
import { kandalData } from './provinces/kandal';
import { sihanoukvilleData } from './provinces/sihanoukville';
import { kampotData } from './provinces/kampot';
import { kampongSpeuData } from './provinces/kampong-speu';
import { kampongChhnangData } from './provinces/kampong-chhnang';
import { kampongChamData } from './provinces/kampong-cham';
import { battambangData } from './provinces/battambang';

// The master database, structured by province name
// FIX: The original dynamic key logic was causing TypeScript errors and was overly complex.
// It has been replaced with static province names for clarity and correctness.
export const database: Database = {
  "រាជធានីភ្នំពេញ": phnomPenhData,
  "ខេត្តកណ្តាល": kandalData,
  "ខេត្តព្រះសីហនុ": sihanoukvilleData,
  "ខេត្តកំពត": kampotData,
  "ខេត្តកំពង់ស្ពឺ": kampongSpeuData,
  "ខេត្តកំពង់ឆ្នាំង": kampongChhnangData,
  "ខេត្តកំពង់ចាម": kampongChamData,
  "ខេត្តបាត់ដំបង": battambangData,
  // To add a new province, import it and add it here.
};

// --- Pre-processed flat lists for efficient searching in the UI ---

// Flattened list of all villages from all provinces
export const flatVillageList: FlatVillage[] = Object.values(database).flatMap(provinceData => {
  const provinceName = Object.keys(provinceData.villages)[0];
  const districts = provinceData.villages[provinceName];
  
  return Object.keys(districts).flatMap(districtName => {
    // FIX: The `_provinceName` property is no longer added, so the conditional check for it has been removed.
    const communes = districts[districtName];
    return Object.keys(communes).flatMap(communeName => {
      const villages = communes[communeName];
      return Object.keys(villages).map(villageName => ({
        province: provinceName,
        district: districtName,
        commune: communeName,
        village: villageName,
        prices: villages[villageName],
      }));
    });
  });
});


// Flattened list of all boreys from all provinces
export const flatBoreyList: Borey[] = Object.values(database).flatMap(provinceData => provinceData.boreys);

// Create a grouped map of boreys by developer for the UI dropdown
export const boreyDeveloperMap = flatBoreyList.reduce((acc, borey) => {
  if (!acc[borey.developer]) {
    acc[borey.developer] = [];
  }
  acc[borey.developer].push(borey);
  return acc;
}, {} as { [developer: string]: Borey[] });


// FIX: Removed problematic logic that was adding a `_provinceName` property at runtime.
// This property was added after the `database` object was initialized, which caused the errors.