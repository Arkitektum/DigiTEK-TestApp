import dummydata from '@/data/dummydata.json';
import models from '@/data/models.js';
import modelInputs from '@/data/modelInputs.js';
import modelOutputFields from '@/data/modelOutputFields.js';

import BrannklasseSubModel from '@/data/modelOutputs/BrannklasseSubModel.json';
import BranntekniskProsjekteringModel from '@/data/modelOutputs/BranntekniskProsjekteringModel.json';
import RisikoklasseSubModel from '@/data/modelOutputs/RisikoklasseSubModel.json';

export default {
  data: () => ({
    menuVisible: true,
    modelOutputs: {
      BrannklasseSubModel,
      BranntekniskProsjekteringModel,
      RisikoklasseSubModel
    },
    modelOutputFields,
    dummydata: dummydata,
    selectedModelName: null,
    selectedModel: null,
    currentSort: 'DmnId',
    currentSortOrder: 'asc',
    fields: [],
    models: models,
    selectedInputValues: modelInputs,
    visibleModelOutputFields: modelOutputFields
  }),
  watch: {
    selectedModelName() {
      this.selectedModel = this.getSelectedModel();
      this.dummydata = this.getSelectedDummyData();
      this.updateFields();
    }
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    translateInputType(modelInputType) {
      switch (modelInputType) {
        case 'string':
        return 'text';
        break;
        case 'integer':
        return 'number';
        break;
        default:
        return 'text';
      }
    },
    getSelectedModel() {
      if (this.selectedModelName && this.models && this.models.length) {
        return this.models.find(model => {
          return model.modelName === this.selectedModelName;
        });
      } else {
        return null;
      }
    },
    getSelectedDummyData() {
      if (this.selectedModelName && this.modelOutputs && this.modelOutputs[this.selectedModelName]) {
        return this.modelOutputs[this.selectedModelName];
      } else {
        return null;
      }
    },
    customSort(value) {
      if (value && value.length && value[0] && value[0][this.currentSort]) {
        return value.sort((a, b) => {
          const sortBy = this.currentSort;
          if (this.currentSortOrder === 'desc') {
            return a[sortBy].localeCompare(b[sortBy]);
          }
          return b[sortBy].localeCompare(a[sortBy]);
        });
      } else {
        return value;
      }
    },
    updateFields() {
      this.fields = this.getFields('input').concat(this.getFields('output'));
    },
    getFieldValue(dmnTable, field) {
      return this.dummydata.modelOutputs[dmnTable] && this.dummydata.modelOutputs[dmnTable][field.VariabelId]
        ? this.dummydata.modelOutputs[dmnTable][field.VariabelId]
        : null;
    },
    getFields(fieldType) {
      fieldType = fieldType === 'output' ? 'output' : 'input';
      const dataFieldTypeProperty = fieldType && fieldType === 'output' ? 'OutputVariablesInfo' : 'InputVariablesInfo';
      const dmnTables = this.dummydata.modelDataDictionary;
      const fields = [];
      Object.keys(dmnTables).forEach(dmnTableKey => {
        const dmnTable = dmnTables[dmnTableKey];
        dmnTable[dataFieldTypeProperty].forEach(field => {
          fields.push({
            ...field,
            fieldType: fieldType,
            DmnId: dmnTable.DmnId,
            DmnNavn: dmnTable.DmnNavn,
            TekBokstav: dmnTable.TekBokstav,
            TekKapittel: dmnTable.TekKapittel,
            TekLedd: dmnTable.TekLedd,
            TekTabell: dmnTable.TekTabell,
            TekWebLink: dmnTable.TekWebLink,
            fieldValue: this.getFieldValue(dmnTableKey, field)
          });
        });
      });
      return fields;
    },
    modelOutputFieldIsVisible(modelOutputField) {
      if (this.visibleModelOutputFields && this.visibleModelOutputFields.length) {
        console.log(this.visibleModelOutputFields.find(outputValue => {
          return outputValue === modelOutputField;
        }));
        return this.visibleModelOutputFields.find(outputValue => {
          return outputValue === modelOutputField;
        });
      } else {
        return true;
      }
    }
  }
};
