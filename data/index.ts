// Data module for borey management with persistence
import { Database, FlatVillage, Borey } from '../types';
import { phnomPenhData } from './provinces/phnom-penh';
import { kandalData } from './provinces/kandal';
import { sihanoukvilleData } from './provinces/sihanoukville';
import { kampotData } from './provinces/kampot';
import { kampongSpeuData } from './provinces/kampong-speu';
import { kampongChhnangData } from './provinces/kampong-chhnang';
import { kampongChamData } from './provinces/kampong-cham';
import { battambangData } from './provinces/battambang';
import { preyVengData } from './provinces/prey-veng';
import { pursatData } from './provinces/pursat';
import { stungTrengData } from './provinces/stung-treng';
import { svayRiengData } from './provinces/svay-rieng';
import { tbongKhmumData } from './provinces/tbong-khmum';
import { pailinData } from './provinces/pailin';
import { takeoData } from './provinces/takeo';
import { ratanakiriData } from './provinces/ratanakiri';
import { preahVihearData } from './provinces/preah-vihear';
import { kepData } from './provinces/kep';
import { kohKongData } from './provinces/koh-kong';
import { mondulkiriData } from './provinces/mondulkiri';
import { siemReapData } from './provinces/siem-reap';
import { banteayMeancheyData } from './provinces/banteay-meanchey';
import { kampongThomData } from './provinces/kampong-thom';
import { oddarMeancheyData } from './provinces/oddar-meanchey';
import { kratieData } from './provinces/kratie';
// Master database (static data)
export const database: Database = {
  "រាជធានីភ្នំពេញ": phnomPenhData,
  "ខេត្តបន្ទាយមានជ័យ": banteayMeancheyData,
  "ខេត្តបាត់ដំបង": battambangData,
  "ខេត្តកំពង់ចាម": kampongChamData,
  "ខេត្តកំពង់ឆ្នាំង": kampongChhnangData,
  "ខេត្តកំពង់ស្ពឺ": kampongSpeuData,
  "ខេត្តកំពង់ធំ": kampongThomData,
  "ខេត្តកំពត": kampotData,
  "ខេត្តកណ្តាល": kandalData,
  "ខេត្តកែប": kepData,
  "ខេត្តកោះកុង": kohKongData,
  "ខេត្តក្រចេះ": kratieData,
  "ខេត្តមណ្ឌលគិរី": mondulkiriData,
  "ខេត្តឧត្តរមានជ័យ": oddarMeancheyData,
  "ខេត្តប៉ៃលិន": pailinData,
  "ខេត្តព្រះវិហារ": preahVihearData,
  "ខេត្តព្រៃវែង": preyVengData,
  "ខេត្តពោធិ៍សាត់": pursatData,
  "ខេត្តរតនគិរី": ratanakiriData,
  "ខេត្តសៀមរាប": siemReapData,
  "ខេត្តព្រះសីហនុ": sihanoukvilleData,
  "ខេត្តស្ទឹងត្រែង": stungTrengData,
  "ខេត្តស្វាយរៀង": svayRiengData,
  "ខេត្តតាកែវ": takeoData,
"ខេត្តត្បងឃ្មុំ": tbongKhmumData,
};

// Pre‑processed flat list of all villages
export const flatVillageList: FlatVillage[] = Object.values(database).flatMap(provinceData => {
  const provinceNames = Object.keys(provinceData.villages);
  if (provinceNames.length === 0) return [];
  const provinceName = provinceNames[0];
  const districts = provinceData.villages[provinceName] ?? {};
  return Object.keys(districts).flatMap(districtName => {
    const communes = districts[districtName] ?? {};
    return Object.keys(communes).flatMap(communeName => {
      const villages = communes[communeName] ?? {};
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

// -------------------------------------------------------------------
// Borey data – built from the static database on startup
// -------------------------------------------------------------------
export let flatBoreyList: Borey[] = Object.values(database).flatMap(p => p.boreys ?? []);

// Grouped map of boreys by developer for UI dropdowns
export const boreyDeveloperMap: { [developer: string]: Borey[] } = {};

function rebuildBoreyDeveloperMap(): void {
  for (const key in boreyDeveloperMap) delete boreyDeveloperMap[key];
  flatBoreyList.forEach(b => {
    if (!boreyDeveloperMap[b.developer]) boreyDeveloperMap[b.developer] = [];
    boreyDeveloperMap[b.developer].push(b);
  });
}

// Initialise map on load
rebuildBoreyDeveloperMap();

// -------------------------------------------------------------------
// CRUD – updates in-memory state AND writes to the TS source file
// via the Vite dev-server API plugin (/api/borey/add, /api/borey/delete)
// -------------------------------------------------------------------

/**
 * Write a Borey change to the source TypeScript file through the
 * Vite dev-server middleware exposed by plugins/borey-api.ts.
 */
async function persistToFile(action: 'add' | 'delete', borey: Borey): Promise<void> {
  try {
    const res = await fetch(`/api/borey/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(borey),
    });
    const result = await res.json();
    if (!res.ok) {
      console.error(`[borey-persist] ${action} failed:`, result.error);
    } else {
      console.log(`[borey-persist] ${action} success:`, result);
    }
  } catch (err) {
    console.error(`[borey-persist] ${action} network error:`, err);
  }
}

export function deleteBorey(borey: Borey): void {
  const idx = flatBoreyList.findIndex(
    b => b.project === borey.project && b.province === borey.province && b.district === borey.district
  );
  if (idx !== -1) {
    flatBoreyList.splice(idx, 1);
    rebuildBoreyDeveloperMap();
    // Write change to the actual TS source file
    persistToFile('delete', borey);
  }
}

export function addOrUpdateBorey(borey: Borey): void {
  const existingIndex = flatBoreyList.findIndex(
    b => b.project === borey.project && b.province === borey.province && b.district === borey.district
  );
  if (existingIndex !== -1) {
    flatBoreyList[existingIndex] = borey;
  } else {
    flatBoreyList.push(borey);
  }
  rebuildBoreyDeveloperMap();
  // Write change to the actual TS source file
  persistToFile('add', borey);
}