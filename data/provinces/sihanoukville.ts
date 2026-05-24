import { ProvinceData } from '../../types';
import { sihanoukvilleVillageDB } from '../../sihanoukville-data';

export const sihanoukvilleData: ProvinceData = {
  villages: sihanoukvilleVillageDB,
  boreys: [
    { developer: "បុរី ហ៊ីលតុន (Borey Hilton)", project: "ហ៊ីលតុន", province: "ខេត្តព្រះសីហនុ", district: "ក្រុងព្រះសីហនុ", locationNote: "ប្រភេទទី៤", marketValue: 600, baseValue: 600 },
    { developer: "បុរី ប៊ីអេស (Borey BS)", project: "ប៊ីអេស", province: "ខេត្តព្រះសីហនុ", district: "ក្រុងព្រះសីហនុ", locationNote: "ប្រភេទទី៤", marketValue: 600, baseValue: 600 },
    { developer: "បុរី ស៊ីអែនអាយ (Borey C&I)", project: "ស៊ីអែនអាយ", province: "ខេត្តព្រះសីហនុ", district: "ក្រុងព្រះសីហនុ", locationNote: "ប្រភេទទី៤", marketValue: 600, baseValue: 600 },
    { developer: "បុរី តជអាស៊ី (Borey Taj Asia)", project: "តជអាស៊ី", province: "ខេត្តព្រះសីហនុ", district: "ក្រុងព្រះសីហនុ", locationNote: "ប្រភេទទី៤", marketValue: 600, baseValue: 600 },
  ],
  zones: [
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី១",
        types: [
            { id: "shv_t1_main", label: "ផ្លូវមេ (Main Road)", desc: "វិថីអូរឈើទាល, វិថី៧-មករា, វិថីឯករាជ្យ, វិថី២ធ្នូ...", price: 1200 },
            { id: "shv_t1_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 1000 },
            { id: "shv_t1_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 800 }
        ]
    },
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី២",
        types: [
            { id: "shv_t2_main", label: "ផ្លូវមេ (Main Road)", desc: "តំបន់ពយកំពេញ, វិថីលំហែព្រះភូមិន្ទ, វិថីកោះពូឡូវៃ...", price: 1000 },
            { id: "shv_t2_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 800 },
            { id: "shv_t2_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 600 }
        ]
    },
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី៣",
        types: [
            { id: "shv_t3_main", label: "ផ្លូវមេ (Main Road)", desc: "តំបន់អូរត្រេះចាស់, វិថីកោះរ៉ុង, វិថីមិត្តភាព...", price: 800 },
            { id: "shv_t3_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 600 },
            { id: "shv_t3_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 400 }
        ]
    },
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី៤",
        types: [
            { id: "shv_t4_main", label: "ផ្លូវមេ (Main Road)", desc: "បុរី, តំបន់សេដ្ឋកិច្ចពិសេស, វិថីបុរីកម្មករ...", price: 600 },
            { id: "shv_t4_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 400 },
            { id: "shv_t4_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 200 }
        ]
    },
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី៥",
        types: [
            { id: "shv_t5_main", label: "ផ្លូវមេ (Main Road)", desc: "វិថីមិត្តភាព, វិថីសេរីភាព, វិថីផែ...", price: 400 },
            { id: "shv_t5_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 200 },
            { id: "shv_t5_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 100 }
        ]
    },
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី៦",
        types: [
            { id: "shv_t6_main", label: "ផ្លូវមេ (Main Road)", desc: "តំបន់ភ្នំ១០៨, វិថីសន្តិភាព, វិថីពោធិកំបោរ...", price: 200 },
            { id: "shv_t6_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 150 },
            { id: "shv_t6_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 100 }
        ]
    },
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី៧",
        types: [
            { id: "shv_t7_main", label: "ផ្លូវមេ (Main Road)", desc: "តំបន់ជុំវិញសាលាអនុវិទ្យាល័យហ៊ុនសែនមិត្តភាព, វិថីផែ...", price: 150 },
            { id: "shv_t7_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 100 },
            { id: "shv_t7_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 75 }
        ]
    },
    {
        name: "ក្រុងព្រះសីហនុ - ប្រភេទទី៨",
        types: [
            { id: "shv_t8_main", label: "ផ្លូវមេ (Main Road)", desc: "តិរវិថីសម្តេចហ៊ុនសែន, ផ្លូវជាតិលេខ៤...", price: 100 },
            { id: "shv_t8_sub", label: "ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបំបែកពីផ្លូវមេខាងលើ", price: 75 },
            { id: "shv_t8_alley", label: "ផ្លូវច្រក (Alley)", desc: "ផ្លូវតូចៗក្នុងតំបន់", price: 50 }
        ]
    }
  ]
};
