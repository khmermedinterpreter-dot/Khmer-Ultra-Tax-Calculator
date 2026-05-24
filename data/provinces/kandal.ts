import { ProvinceData } from '../../types';
import { kandalVillageDB } from '../../kandal-data';

export const kandalData: ProvinceData = {
  villages: kandalVillageDB,
  boreys: [
    // ក្រុងតាខ្មៅ
    { developer: "Borey The River", project: "បុរី The River", province: "ខេត្តកណ្តាល", district: "ក្រុងតាខ្មៅ", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 1200, baseValue: 1200 },
    { developer: "Borey Krystal", project: "បុរីគ្រីស្តាល់", province: "ខេត្តកណ្តាល", district: "ក្រុងតាខ្មៅ", locationNote: "ប្រភេទទី៥ (Zone 5)", marketValue: 300, baseValue: 300 },
    { developer: "Borey Pich", project: "បុរីពេជ្រ", province: "ខេត្តកណ្តាល", district: "ក្រុងតាខ្មៅ", locationNote: "ប្រភេទទី៥ (Zone 5)", marketValue: 300, baseValue: 300 },
    { developer: "បុរី ពិភពថ្មី (Borey Piphup Thmey)", project: "ក្រុងតាខ្មៅ ១ (Takhmao 1)", province: "ខេត្តកណ្តាល", district: "ក្រុងតាខ្មៅ", locationNote: "ប្រភេទទី៥ (Zone 5)", marketValue: 300, baseValue: 300 },
    { developer: "Borey Sim Bo", project: "បុរីស៊ឹម បូ", province: "ខេត្តកណ្តាល", district: "ក្រុងតាខ្មៅ", locationNote: "ប្រភេទទី៥ (Zone 5)", marketValue: 300, baseValue: 300 },
    { developer: "បុរី ពិភពថ្មី (Borey Piphup Thmey)", project: "ក្រុងតាខ្មៅ ២ (Takhmao 2)", province: "ខេត្តកណ្តាល", district: "ក្រុងតាខ្មៅ", locationNote: "ប្រភេទទី៦ (Zone 6)", marketValue: 250, baseValue: 250 },
    
    // ស្រុកអង្គស្នួល
    { developer: "Borey Sen Monorom", project: "បុរីសែនមនោរម្យ", province: "ខេត្តកណ្តាល", district: "ស្រុកអង្គស្នួល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
    { developer: "Borey Sola", project: "បុរីសុលឡា (ថ្នល់ទទឹង)", province: "ខេត្តកណ្តាល", district: "ស្រុកអង្គស្នួល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
    
    // ស្រុកពញាឮ
    { developer: "Borey Sen Monorom", project: "បុរីសែនមនោរម្យ", province: "ខេត្តកណ្តាល", district: "ស្រុកពញាឮ", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 100, baseValue: 100 },
    
    // ស្រុកកៀនស្វាយ
    { developer: "Borey Kien Svay Plaza", project: "បុរីកៀនស្វាយផ្លាស្សា", province: "ខេត្តកណ្តាល", district: "ស្រុកកៀនស្វាយ", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },

    // ស្រុកមុខកំពូល
    { developer: "Borey A-Teang Meas", project: "បុរីអាទាំងមាស", province: "ខេត្តកណ្តាល", district: "ស្រុកមុខកំពូល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
    { developer: "បុរី វិមានភ្នំពេញ (Vimean Phnom Penh)", project: "មុខកំពូល (Mukh Kampul)", province: "ខេត្តកណ្តាល", district: "ស្រុកមុខកំពូល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },

    // ស្រុកស្អាង
    { developer: "Borey Delta", project: "បុរីដែលតា", province: "ខេត្តកណ្តាល", district: "ស្រុកស្អាង", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },

    // ស្រុកខ្សាច់កណ្តាល
    { developer: "Borey Chaktomuk Svay Chrum", project: "បុរីចតុមុខស្វាយជ្រុំ", province: "ខេត្តកណ្តាល", district: "ស្រុកខ្សាច់កណ្តាល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
    { developer: "Borey US Land Home", project: "បុរីអ៊ុសលែដហូម", province: "ខេត្តកណ្តាល", district: "ស្រុកខ្សាច់កណ្តាល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
    { developer: "Borey Ly Senkheang", project: "បុរីលីសេងឃាង", province: "ខេត្តកណ្តាល", district: "ស្រុកខ្សាច់កណ្តាល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
    { developer: "Borey De Classic", project: "បុរីដីក្លាស៊ិក", province: "ខេត្តកណ្តាល", district: "ស្រុកខ្សាច់កណ្តាល", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },

    // ស្រុកល្វាឯម
    { developer: "បុរី ប៉េងហួត (Borey Peng Huoth)", project: "ល្វាឯម (Lvea Aem)", province: "ខេត្តកណ្តាល", district: "ស្រុកល្វាឯម", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
    { developer: "បុរី ទួលសង្កែ (Borey Tuol Sangke)", project: "ល្វាឯម (Lvea Aem)", province: "ខេត្តកណ្តាល", district: "ស្រុកល្វាឯម", locationNote: "ប្រភេទទី១ (Zone 1)", marketValue: 200, baseValue: 200 },
  ],
  zones: [
    {
      name: "តំបន់ក្រុងតាខ្មៅ (Takhmao Zones)",
      types: [
        { id: "tkm_z1", label: "ប្រភេទទី១: ជុំវិញផ្សារ", desc: "ជុំវិញផ្សារតាខ្មៅចាស់ និង ផ្សារតាខ្មៅសង់ថ្មី", price: 1200 },
        { id: "tkm_z2", label: "ប្រភេទទី២: ផ្លូវជាតិលេខ២", desc: "សងខាងផ្លូវជាតិលេខ២ ពីរង្វង់មូលតាម៉ៅ ដល់ភ្នំពេញ", price: 800 },
        { id: "tkm_z5", label: "ប្រភេទទី៥: តំបន់បុរី", desc: "បុរីគ្រីស្តាល់, បុរីពេជ្រ, ពិភពថ្មី១, ស៊ឹម បូ", price: 300 },
        { id: "tkm_z6", label: "ប្រភេទទី៦: តំបន់បុរី", desc: "បុរីពិភពថ្មី២ និងតំបន់ជុំវិញ", price: 250 },
      ]
    },
    {
      name: "តំបន់ទីប្រជុំជន (District Market Towns)",
      types: [
        { id: "angsnuol_z1", label: "ផ្សារស្រុកអង្គស្នួល", desc: "ផ្សារបែកចាន, ផ្សារអង្គស្នួល, ផ្សារថ្នល់ទទឹង", price: 200 },
        { id: "kandalstueng_z1", label: "ផ្សារស្រុកកណ្តាលស្ទឹង", desc: "ទីប្រជុំជនផ្សារកំពង់កន្ទួត", price: 150 },
        { id: "kandalstueng_z2", label: "ផ្សារស្រុកកណ្តាលស្ទឹង", desc: "ផ្សារសៀមរាប, បឹងខ្យាង, ព្រៃទទឹង, ដើមត្រាំង", price: 100 },
        { id: "ponhea_lueu_z1", label: "ផ្សារស្រុកពញាឮ", desc: "ផ្សារកំពង់ហ្លួង, ព្រែកក្តាម, កោះចិន", price: 100 },
        { id: "kien_svay_z1", label: "ផ្សារស្រុកកៀនស្វាយ", desc: "ទីប្រជុំជនផ្សារគគីរ", price: 200 },
        { id: "mukh_kampul_z1", label: "ផ្សារស្រុកមុខកំពូល", desc: "ទីប្រជុំជនផ្សារព្រែកអញ្ចាញ", price: 200 },
        { id: "lveuk_daek_z1", label: "ផ្សារស្រុកលើកដែក", desc: "ផ្សារកំពង់ចម្លង, ផ្សារក្អមសំណរ", price: 150 },
        { id: "saang_z1", label: "ផ្សារស្រុកស្អាង", desc: "ទីប្រជុំជនផ្សារស្អាង (សាលាស្រុក)", price: 200 },
        { id: "saang_z2", label: "ផ្សារស្រុកស្អាង", desc: "ផ្សារព្រែកអំបិល, កោះខែល, ព្រែកឃ្លោក", price: 100 },
        { id: "koh_thom_z1", label: "ផ្សារស្រុកកោះធំ", desc: "ផ្សារកោះធំ (សាលាស្រុក), ផ្សារជ្រៃធំ", price: 200 },
        { id: "khsach_kandal_z1", label: "ផ្សារស្រុកខ្សាច់កណ្តាល", desc: "ទីប្រជុំជនផ្សារព្រែកតាមាក់", price: 200 },
        { id: "lvea_aem_z1", label: "ផ្សារស្រុកល្វាឯម", desc: "ទីប្រជុំជនផ្សារអរិយក្សត្រ", price: 200 },
      ]
    }
  ],
};
