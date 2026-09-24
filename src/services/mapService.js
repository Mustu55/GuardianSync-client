import { INDUSTRY_TEMPLATES } from '../utils/industryPresets';

export const getIndustryTemplate = (name) => {
  return INDUSTRY_TEMPLATES[name] || INDUSTRY_TEMPLATES.power_plant;
};

export const getAllIndustryNames = () => {
  return Object.keys(INDUSTRY_TEMPLATES);
};

export const getIndustryLabel = (name) => {
  const t = INDUSTRY_TEMPLATES[name];
  return t ? t.label : name;
};
