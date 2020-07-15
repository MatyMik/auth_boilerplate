import {Contract} from '../types';

const getPropValidation = (section : any, validation : any = {}) : any => {
  let nextValidation : [] | {};

  Object
    .keys(section)
    .filter(key => key !== "id" && key !== "parent")
    .map(key => {
      const value = section[key];
      if (key !== "children") {
        const nextValue = Array.isArray(value)
          ? value.map((_, i) => validation && validation[key] && validation[key][i] && validation[key][i].isValid === true
            ? validation[key][i]
            : {
              isValid: null,
              message: null
            })
          : validation && validation[key] && validation[key].isValid === true
            ? validation[key]
            : {
              isValid: null,
              message: null
            };
        nextValidation = {
          ...nextValidation,
          [key]: nextValue
        }
      } else {
        const children = !!value && value.length > 0 && value.map((item : any, _ : number) => {
          const childrenValidation = !!validation && !!validation.children && !!validation.children[_]
            ? validation.children[_]
            : {}
          return getPropValidation(item, childrenValidation);
        })
        nextValidation = {
          ...nextValidation,
          children
        }
      }
    });

  return nextValidation;
}

const getSection = (name : any, section : any, validation : any = {}) => {
  switch (name) {
    case 'data':
    case 'contact':
    case 'contract_contact':
      return getPropValidation(section, validation);
    case 'representative':
      return {
        "signatory": (!section.signatory || !section.signatory.length)
          ? []
          : section
            .signatory
            .map((item : any, _ : number) => getPropValidation(item, validation.signatory && validation.signatory[_] ? validation.signatory[_] : {} )),
        "representative": (!section.representative || !section.representative.length)
          ? []
          : section
            .representative
            .map((item : any, _ : number) => getPropValidation(item, validation.representative && validation.representative[_] ? validation.representative[_] : {}))
      };
    case 'owner':
      if (!section || !section.org_chart || !section.org_chart.length) 
        return {org_chart: []};
        
      return {
        org_chart: section
          .org_chart
          .map((item : any, _ : number) => getPropValidation(item, !!validation && !!validation.org_chart ? validation.org_chart[_] : {}))
      }
  }
}

export const getValidation = (contract : Contract, nextSection : any) => {
  const validation = contract.validation || {};
  const sections = Object.keys(nextSection);
  let nextValidation = {};
  sections.map(section => {
    nextValidation = {
      ...nextValidation,
      [section]: getSection(section, nextSection[section], validation[section])
    }
  });
  return nextValidation;
}