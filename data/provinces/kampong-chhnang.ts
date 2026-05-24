import { ProvinceData } from '../../types';
import { kampongChhnangVillageDB } from '../../kampong-chhnang-data';

export const kampongChhnangData: ProvinceData = {
  villages: kampongChhnangVillageDB,
  boreys: [],
  zones: [
    {
      name: "ក្រុងកំពង់ឆ្នាំង (Kampong Chhnang City)",
      types: [
        { id: "kcn_c_t1", label: "ប្រភេទទី១", desc: "ជុំវិញផ្សារលើ, ចំណតរថយន្ត", price: 350 },
        { id: "kcn_c_t2", label: "ប្រភេទទី២", desc: "ផ្លូវមេ, បុរី (ស្តាំវិមានឯករាជ្យ, ផ្លូវជាតិលេខ៥...)", price: 300 },
        { id: "kcn_c_t3", label: "ប្រភេទទី៣", desc: "ផ្លូវមេ (ផ្លូវជាតិលេខ៥, ផ្លូវផ្សារក្រោម...)", price: 250 },
        { id: "kcn_c_t4", label: "ប្រភេទទី៤", desc: "ផ្លូវមេ (ផ្លូវផ្សារក្រោម ពីស្ពានត្រពាំងបី ដល់ចុងកោះ)", price: 150 },
        { id: "kcn_c_t5", label: "ប្រភេទទី៥", desc: "ផ្លូវមេ (ផ្លូវជាតិលេខ៥ ពីវិមានឯករាជ្យ ដល់ស្រុករលាប្អៀរ)", price: 100 },
        { id: "kcn_c_t6", label: "ប្រភេទទី៦", desc: "ផ្លូវមេ (ផ្លូវ៥៣, ផ្លូវសាលាបឋមសិក្សា...)", price: 70 },
      ]
    },
    {
      name: "ស្រុកកំពង់ត្រឡាច (Kampong Tralach District)",
      types: [
        { id: "ktl_d_t1", label: "ប្រភេទទី១", desc: "ជុំវិញផ្សារសាលាលេខ៥", price: 150 },
        { id: "ktl_d_t2", label: "ប្រភេទទី២", desc: "ទីប្រជុំជន (ផ្សារត្រាច, ផ្សារតាជេស, ផ្សារក្បាលថ្នល់សែប)", price: 100 },
        { id: "ktl_d_t3", label: "ប្រភេទទី៣ (លំនៅដ្ឋាន)", desc: "ផ្លូវជាតិលេខ៥ (ពីវិទ្យាល័យ ដល់ខេត្តកំពង់ស្ពឺ)", price: 15 },
        { id: "ktl_d_t4", label: "ប្រភេទទី៤ (លំនៅដ្ឋាន)", desc: "ផ្លូវទៅកំពង់ត្រឡាចក្រោម, ក្រាំងល្វា, វត្តត្រឡែងកែង", price: 5 },
      ]
    },
    {
      name: "ស្រុកសាមគ្គីមានជ័យ (Sameakki Mean Chey District)",
      types: [
          { id: "smc_d_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារត្រាច (ពីការ៉ាស់សាំងសូគីមិច ដល់ស្នាក់ការគណបក្ស)", price: 100 },
          { id: "smc_d_t2", label: "ប្រភេទទី២", desc: "ទីប្រជុំជនស្ពានពោធិ៍", price: 50 },
          { id: "smc_d_t3", label: "ប្រភេទទី៣", desc: "ជាប់ផ្លូវជាតិលេខ៥ (ពីស្ពានពោធិ៍ ដល់កំពង់ស្ពឺ)", price: 25 },
          { id: "smc_d_t4", label: "ប្រភេទទី៤ (លំនៅដ្ឋាន)", desc: "ផ្លូវទៅសាលាស្រុក, វត្តព្រះធាតុ", price: 5 },
          { id: "smc_d_t5", label: "ប្រភេទទី៥ (លំនៅដ្ឋាន)", desc: "ផ្លូវទៅសាលាស្រុក (ពីកសិដ្ឋានCP), វត្តព្រះធាតុ (ពីសាលាឃុំ)", price: 3 },
      ]
    },
    {
        name: "ស្រុករលាប្អៀរ (Rolea B'ier District)",
        types: [
            { id: "rlb_d_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារព្រៃខ្មែរ, ផ្សារពង្រ", price: 100 },
            { id: "rlb_d_t2", label: "ប្រភេទទី២ (លំនៅដ្ឋាន)", desc: "ផ្លូវជាតិលេខ៥ (ពីផ្សារព្រៃខ្មែរ/ពង្រ ដល់ក្រុង)", price: 15 },
            { id: "rlb_d_t3", label: "ប្រភេទទី៣ (លំនៅដ្ឋាន)", desc: "ផ្លូវជាតិលេខ៥ (ពីកំពង់ត្រឡាច ដល់បរិបូរណ៍), ផ្លូវព្រលាន", price: 10 },
            { id: "rlb_d_t4", label: "ប្រភេទទី៤ (លំនៅដ្ឋាន)", desc: "ផ្លូវជាតិលេខ៥៣, ផ្លូវទៅគ្រួស", price: 5 },
        ]
    },
    {
        name: "ស្រុកបរិបូណ៌ (Boribo District)",
        types: [
            { id: "brb_d_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារបរិបូណ៌", price: 70 },
            { id: "brb_d_t2", label: "ប្រភេទទី២ (លំនៅដ្ឋាន)", desc: "ជាប់ផ្លូវជាតិលេខ៥", price: 10 },
            { id: "brb_d_t3", label: "ប្រភេទទី៣ (លំនៅដ្ឋាន)", desc: "ផ្លូវខ្វាត់ខ្វែង", price: 5 }
        ]
    },
    {
        name: "ស្រុកទឹកផុស (Tuek Phos District)",
        types: [
            { id: "tkp_d_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារទឹកផុស", price: 50 },
            { id: "tkp_d_t2", label: "ប្រភេទទី២ (លំនៅដ្ឋាន)", desc: "ជាប់ផ្លូវជាតិលេខ៥៣", price: 8 }
        ]
    },
    {
        name: "ស្រុកកំពង់លែង (Kampong Leaeng District)",
        types: [
            { id: "kpl_d_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារកំពង់លែង", price: 30 },
            { id: "kpl_d_t2", label: "ប្រភេទទី២ (លំនៅដ្ឋាន)", desc: "ផ្លូវមាត់ទឹក", price: 5 }
        ]
    },
    {
        name: "ស្រុកជលគីរី (Chol Kiri District)",
        types: [
            { id: "ckr_d_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនជលគីរី", price: 20 },
            { id: "ckr_d_t2", label: "ប្រភេទទី២ (លំនៅដ្ឋាន)", desc: "ផ្លូវតាមមាត់ទន្លេ", price: 4 }
        ]
    }
  ]
};
