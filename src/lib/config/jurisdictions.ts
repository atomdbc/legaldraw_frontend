// src/lib/config/jurisdictions.ts

export interface Jurisdiction {
    id: string;
    label: string;
    type: 'international' | 'regional' | 'national' | 'state' | 'special' | 'custom';
    region: 'africa' | 'asia' | 'europe' | 'north_america' | 'south_america' | 'oceania' | 'middle_east' | 'international' | 'other';
    description?: string;
  }
  
  export const JURISDICTIONS: Jurisdiction[] = [
    // International Frameworks
    { 
      id: 'int_uncitral', 
      label: 'UNCITRAL Model Law', 
      type: 'international',
      region: 'international',
      description: 'United Nations Commission on International Trade Law' 
    },
    { 
      id: 'int_ohada', 
      label: 'OHADA Uniform Acts', 
      type: 'regional',
      region: 'africa',
      description: 'Organization for the Harmonization of Business Law in Africa' 
    },
    { 
      id: 'int_eu_law', 
      label: 'European Union Law', 
      type: 'regional',
      region: 'europe',
      description: 'Laws of the European Union' 
    },
  
    // Africa
    { 
      id: 'za_south_africa', 
      label: 'South Africa', 
      type: 'national',
      region: 'africa',
      description: 'Republic of South Africa' 
    },
    { 
      id: 'ng_nigeria', 
      label: 'Nigeria', 
      type: 'national',
      region: 'africa',
      description: 'Federal Republic of Nigeria' 
    },
    { 
      id: 'ke_kenya', 
      label: 'Kenya', 
      type: 'national',
      region: 'africa',
      description: 'Republic of Kenya' 
    },
    { 
      id: 'eg_egypt', 
      label: 'Egypt', 
      type: 'national',
      region: 'africa',
      description: 'Arab Republic of Egypt' 
    },
    { 
      id: 'ma_morocco', 
      label: 'Morocco', 
      type: 'national',
      region: 'africa',
      description: 'Kingdom of Morocco' 
    },
  
    // Asia & Pacific
    { 
      id: 'sg_singapore', 
      label: 'Singapore', 
      type: 'national',
      region: 'asia',
      description: 'Republic of Singapore' 
    },
    { 
      id: 'jp_japan', 
      label: 'Japan', 
      type: 'national',
      region: 'asia',
      description: 'Japan' 
    },
    { 
      id: 'kr_south_korea', 
      label: 'South Korea', 
      type: 'national',
      region: 'asia',
      description: 'Republic of Korea' 
    },
    { 
      id: 'in_india', 
      label: 'India', 
      type: 'national',
      region: 'asia',
      description: 'Republic of India' 
    },
  
    // Europe
    { 
      id: 'gb_eng_wales', 
      label: 'England and Wales', 
      type: 'national',
      region: 'europe',
      description: 'English Common Law' 
    },
    { 
      id: 'de_germany', 
      label: 'Germany', 
      type: 'national',
      region: 'europe',
      description: 'Federal Republic of Germany' 
    },
    { 
      id: 'fr_france', 
      label: 'France', 
      type: 'national',
      region: 'europe',
      description: 'French Republic' 
    },
  
    // North America
    { 
      id: 'us_delaware', 
      label: 'State of Delaware', 
      type: 'state',
      region: 'north_america',
      description: 'United States - Delaware' 
    },
    { 
      id: 'us_newyork', 
      label: 'State of New York', 
      type: 'state',
      region: 'north_america',
      description: 'United States - New York' 
    },
    { 
      id: 'ca_ontario', 
      label: 'Ontario', 
      type: 'state',
      region: 'north_america',
      description: 'Canada - Ontario' 
    },
  
    // South America
    { 
      id: 'br_brazil', 
      label: 'Brazil', 
      type: 'national',
      region: 'south_america',
      description: 'Federative Republic of Brazil' 
    },
    { 
      id: 'ar_argentina', 
      label: 'Argentina', 
      type: 'national',
      region: 'south_america',
      description: 'Argentine Republic' 
    },
    { 
      id: 'cl_chile', 
      label: 'Chile', 
      type: 'national',
      region: 'south_america',
      description: 'Republic of Chile' 
    },
  
    // Middle East
    { 
      id: 'ae_difc', 
      label: 'DIFC', 
      type: 'special',
      region: 'middle_east',
      description: 'Dubai International Financial Centre' 
    },
    { 
      id: 'sa_saudi', 
      label: 'Saudi Arabia', 
      type: 'national',
      region: 'middle_east',
      description: 'Kingdom of Saudi Arabia' 
    },
  
    // Special Administrative Regions
    { 
      id: 'hk_sar', 
      label: 'Hong Kong SAR', 
      type: 'special',
      region: 'asia',
      description: 'Hong Kong Special Administrative Region' 
    }
  ];
  
  export const getJurisdictionsByRegion = (region: Jurisdiction['region']) => 
    JURISDICTIONS.filter(j => j.region === region);
  
  export const getJurisdictionsByType = (type: Jurisdiction['type']) => 
    JURISDICTIONS.filter(j => j.type === type);
  
  export const getJurisdictionById = (id: string) => 
    JURISDICTIONS.find(j => j.id === id);
  
  export const createCustomJurisdiction = (value: string): Jurisdiction => ({
    id: `custom_${value.toLowerCase().replace(/\s+/g, '_')}`,
    label: value,
    type: 'custom',
    region: 'other',
    description: 'Custom jurisdiction'
  });
  
  export const JURISDICTION_GROUPS = {
    popular: ['us_delaware', 'gb_eng_wales', 'sg_singapore', 'za_south_africa', 'ae_difc'],
    international: ['int_uncitral', 'int_eu_law', 'int_ohada'],
    africa: JURISDICTIONS.filter(j => j.region === 'africa').map(j => j.id),
    asia: JURISDICTIONS.filter(j => j.region === 'asia').map(j => j.id),
    europe: JURISDICTIONS.filter(j => j.region === 'europe').map(j => j.id),
    northAmerica: JURISDICTIONS.filter(j => j.region === 'north_america').map(j => j.id),
    southAmerica: JURISDICTIONS.filter(j => j.region === 'south_america').map(j => j.id),
    middleEast: JURISDICTIONS.filter(j => j.region === 'middle_east').map(j => j.id),
  };