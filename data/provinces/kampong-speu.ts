import { ProvinceData } from '../../types';
import { kampongSpeuVillageDB } from '../../kampong-speu-data';

export const kampongSpeuData: ProvinceData = {
  villages: kampongSpeuVillageDB,
  boreys: [
    { developer: "បុរី ផ្សារកំពង់ស្ពឺថ្មី", project: "ផ្សារកំពង់ស្ពឺថ្មី", province: "ខេត្តកំពង់ស្ពឺ", district: "ក្រុងច្បារមន", locationNote: "មុខវិទ្យាល័យសុខាផល្លី", marketValue: 180, baseValue: 180 },
    { developer: "បុរី សុវណ្ណ", project: "សុវណ្ណ", province: "ខេត្តកំពង់ស្ពឺ", district: "ក្រុងច្បារមន", locationNote: "តំបន់បុរី", marketValue: 100, baseValue: 100 },
    { developer: "បុរី កណ្តោលដុំ", project: "កណ្តោលដុំ", province: "ខេត្តកំពង់ស្ពឺ", district: "ក្រុងច្បារមន", locationNote: "តំបន់បុរី", marketValue: 100, baseValue: 100 },
  ],
  zones: [
    {
      name: "ក្រុងច្បារមន (Chbar Mon City)",
      types: [
        { id: "kps_c_t1", label: "ប្រភេទទី១", desc: "ផ្លូវជាតិលេខ៤ (ពីគល់ស្ពានផ្សារ ដល់ផ្លូវលេខ៤៤)", price: 750 },
        { id: "kps_c_t2", label: "ប្រភេទទី២", desc: "ជុំវិញផ្សារកំពង់ស្ពឺ និងផ្លូវចូលផ្សារ", price: 500 },
        { id: "kps_c_t3", label: "ប្រភេទទី៣", desc: "ផ្លូវជាតិលេខ៤ (ពីគល់ស្ពានផ្សារ ដល់មន្ទីរសាធារណការ)", price: 350 },
        { id: "kps_c_t4", label: "ប្រភេទទី៤", desc: "ផ្លូវជាតិលេខ៤ (ពីផ្លូវ៤៤ ដល់ស្ពានអកទឹម)", price: 250 },
        { id: "kps_c_t5", label: "ប្រភេទទី៥", desc: "ផ្លូវជាតិលេខ៤ (ពីក្លោងទ្វារវត្តចំណារ ដល់ច្រមុះជ្រូក)", price: 200 },
        { id: "kps_c_t6", label: "ប្រភេទទី៦", desc: "បុរីផ្សារកំពង់ស្ពឺថ្មី និងតំបន់ជុំវិញ", price: 180 },
        { id: "kps_c_t7_main", label: "ប្រភេទទី៧ - ផ្លូវមេ", desc: "បុរីសុវណ្ណ, បុរីកណ្តោលដុំ, ផ្លូវជាតិ៤ (ពីវត្តសុព័រទេព ដល់ស្រុកសំរោងទង)", price: 100 },
        { id: "kps_c_t7_sub", label: "ប្រភេទទី៧ - ផ្លូវរណប", desc: "ផ្លូវរណបពាក់ព័ន្ធតំបន់បុរី", price: 75 },
        { id: "kps_c_t7_alley", label: "ប្រភេទទី៧ - ផ្លូវច្រក", desc: "ផ្លូវច្រកក្នុងតំបន់បុរី", price: 50 },
        { id: "kps_c_t8_main", label: "ប្រភេទទី៨ - ផ្លូវមេ", desc: "ផ្លូវជាតិ៤៤, ផ្លូវជាតិ៤ (ពីស្ពានអកទឹម ដល់ស្ពានឆ្ពោះលួង)", price: 70 },
        { id: "kps_c_t8_sub", label: "ប្រភេទទី៨ - ផ្លូវរណប", desc: "ផ្លូវរណបពាក់ព័ន្ធផ្លូវមេ", price: 40 },
        { id: "kps_c_t8_alley", label: "ប្រភេទទី៨ - ផ្លូវច្រក", desc: "ផ្លូវច្រកក្នុងតំបន់", price: 30 },
        { id: "kps_c_t9_main", label: "ប្រភេទទី៩ (លំនៅដ្ឋាន)", desc: "ផ្លូវជាតិ៤ (ពីច្រមុះជ្រូក ដល់ស្រុកសំរោងទង), ផ្លូវក្រោយវត្ត", price: 50 },
      ]
    },
    {
      name: "ស្រុកឧដុង្គ (Odongk District)",
      types: [
        { id: "odk_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារឧដុង្គ", price: 250 },
        { id: "odk_t2", label: "ប្រភេទទី២", desc: "ទីប្រជុំជនផ្សារបាត់ដឹង", price: 150 },
        { id: "odk_t3", label: "ប្រភេទទី៣", desc: "ទីប្រជុំជនផ្សារក្រាំងចេក", price: 70 },
        { id: "odk_t4", label: "ប្រភេទទី៤ (លំនៅដ្ឋាន)", desc: "ផ្លូវជាតិលេខ៥១ និង ៤៤", price: 50 },
      ]
    },
    {
        name: "ស្រុកសំរោងទង (Samraong Tong District)",
        types: [
            { id: "srt_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារត្រពាំងអំពិល", price: 250 },
            { id: "srt_t2", label: "ប្រភេទទី២", desc: "ទីប្រជុំជនផ្សារព្រៃផ្តៅ", price: 120 },
            { id: "srt_t3", label: "ប្រភេទទី៣", desc: "ផ្សារវត្តចំបក់, ផ្សារអង្គមេត្រី", price: 50 },
            { id: "srt_t4", label: "ប្រភេទទី៤ (លំនៅដ្ឋាន)", desc: "ផ្លូវជាតិលេខ៤ (ពីសាលាស្រុក ដល់ក្រុងច្បារមន)", price: 20 },
        ]
    },
    {
        name: "ស្រុកគងពិសី (Kong Pisei District)",
        types: [
            { id: "kps_d_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារត្រាំខ្មារ", price: 200 },
            { id: "kps_d_t2", label: "ប្រភេទទី២", desc: "ផ្សារដើមរកា, ផ្សារព្រៃទទឹង", price: 120 },
            { id: "kps_d_t3", label: "ប្រភេទទី៣", desc: "ផ្សារស្រង់, ផ្សារគ្រួស", price: 70 },
        ]
    },
    {
        name: "ស្រុកភ្នំស្រួច (Phnom Sruoch District)",
        types: [
            { id: "pns_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារត្រពាំងក្រឡឹង", price: 200 },
            { id: "pns_t2", label: "ប្រភេទទី២", desc: "ទីប្រជុំជនផ្សារតាឡាត់", price: 70 },
        ]
    },
    {
        name: "ស្រុកបសេដ្ឋ (Baset District)",
        types: [
            { id: "bst_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារប៉ាង្កសី", price: 150 },
            { id: "bst_t2", label: "ប្រភេទទី២", desc: "ទីប្រជុំជនផ្សារស្លាបលែង", price: 100 },
        ]
    },
    {
        name: "ស្រុកថ្ពង (Thpong District)",
        types: [
            { id: "thp_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារផ្លោច", price: 100 },
        ]
    },
    {
        name: "ស្រុកឱរ៉ាល់ (Aoral District)",
        types: [
            { id: "arl_t1", label: "ប្រភេទទី១", desc: "ទីប្រជុំជនផ្សារកន្ទួត", price: 100 },
        ]
    }
  ]
};
