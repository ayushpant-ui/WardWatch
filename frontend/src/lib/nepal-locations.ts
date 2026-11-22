export const NEPAL_LOCATIONS: Record<string, Record<string, string[]>> = {
  Bagmati: {
    Kathmandu: ['Kathmandu Metro', 'Kirtipur Municipality', 'Budhanilkantha Municipality'],
    Lalitpur: ['Lalitpur Metro', 'Godawari Municipality'],
  },
  Sudurpashchim: {
    Kanchanpur: ['Bhimdatta Municipality', 'Bedkot Municipality', 'Krishnapur Municipality'],
    Kailali: ['Dhangadhi Sub-Metro', 'Tikapur Municipality'],
  },
};

export const WARDS_LIST = Array.from({ length: 15 }, (_, i) => `Ward ${i + 1}`);