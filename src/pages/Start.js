import axios from 'axios';

import dummydata from '@/data/dummydata.json';
import models from '@/data/models.js';
import modelInputs from '@/data/modelInputs.js';
import modelOutputVariables from '@/data/modelOutputVariables.js';

import brannklasseSubModel from '@/data/modelOutputs/BrannklasseSubModel.json';
import branntekniskProsjekteringModel from '@/data/modelOutputs/BranntekniskProsjekteringModel.json';
import risikoklasseSubModel from '@/data/modelOutputs/RisikoklasseSubModel.json';

import dibkLogo from '@/assets/images/dibk_logo_mob.svg';

export default {
  data: () => ({
    dibkLogo,
    menuVisible: true,
    modelOutputs: {
      brannklasseSubModel,
      branntekniskProsjekteringModel,
      risikoklasseSubModel
    },
    modelOutputVariables,
    dummydata: dummydata,
    models: models,
    codeLists: {
      typeVirksomhet: null
    },
    selectedModel: null,
    selectedModelId: null,
    currentSort: 'DmnId',
    currentSortOrder: 'asc',
    outputVariables: [],
    filteredOutputVariables: [],
    visibleModelOutputVariables: modelOutputVariables,
    selectedInputValues: modelInputs,
    search: null
  }),
  watch: {
    selectedModelId() {
      this.selectedModel = this.getSelectedModel();
      this.dummydata = this.getSelectedDummyData();
      this.updateOutputVariables();
      this.searchOnTable();
    }
  },
  mounted() {
    this.fetchBusinessTypes();
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    translateInputType(modelInputType) {
      switch (modelInputType) {
        case 'string':
          return 'text';
        case 'integer':
          return 'number';
        default:
          return 'text';
      }
    },
    fetchBusinessTypes() {
      axios.get('https://register.geonorge.no/api/tek17/risikoklasseettertypevirksomhet.json')
        .then(response => {
          this.codeLists.typeVirksomhet = response && response.data && response.data.containeditems
            ? response.data.containeditems.map(item => {
              return {
                key: item.label,
                value: item.label
              };
            })
            : null;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSelectedModel() {
      if (this.selectedModelId && this.models && this.models.length) {
        return this.models.find(model => {
          return model.modelId === this.selectedModelId;
        });
      } else {
        return null;
      }
    },
    getSelectedDummyData() {
      if (this.selectedModelId && this.modelOutputs && this.modelOutputs[this.selectedModelId]) {
        return this.modelOutputs[this.selectedModelId];
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
    updateOutputVariables() {
      this.outputVariables = this.getOutputVariables();
    },
    getAugmentedVariableInfo(dmnTableKey, variableId) {
      const dmnTableInfo = this.dummydata && this.dummydata.modelDataDictionary && this.dummydata.modelDataDictionary[dmnTableKey] ? this.dummydata.modelDataDictionary[dmnTableKey] : null;
      const variablesForDmnTable = dmnTableInfo && dmnTableInfo.OutputVariablesInfo ? dmnTableInfo.OutputVariablesInfo : null;
      if (dmnTableInfo && variablesForDmnTable) {
        const variableInfo = variablesForDmnTable.find(variable => {
          return variableId === variable.VariabelId;
        });
        return {
          ...variableInfo,
          DmnId: dmnTableInfo.DmnId,
          DmnNavn: dmnTableInfo.DmnNavn,
          TekBokstav: dmnTableInfo.TekBokstav,
          TekKapittel: dmnTableInfo.TekKapitel,
          TekLedd: dmnTableInfo.TekLedd,
          TekTabell: dmnTableInfo.TekTabell,
          TekWebLink: dmnTableInfo.TekWebLink
        };
      } else {
        return null;
      }
    },
    getOutputVariables() {
      const outputVariables = [];
      const variablesByDmnTable = this.dummydata.modelOutputs;
      Object.keys(variablesByDmnTable).forEach(dmnTableKey => {
        const dmnTableOutputVariables = variablesByDmnTable[dmnTableKey];
        Object.keys(dmnTableOutputVariables).forEach(variableKey => {
          const variableValue = dmnTableOutputVariables[variableKey];
          const variableInfo = this.getAugmentedVariableInfo(dmnTableKey, variableKey);
          if (variableInfo) {
            outputVariables.push({
              ...variableInfo,
              variableValue
            });
          }
        });
      });
      return outputVariables;
    },
    toLower(text) {
      return text.toString().toLowerCase();
    },
    searchByName(items, term) {
      if (term) {
        return items.filter(item => this.toLower(item.VariabelNavn).includes(this.toLower(term)));
      }
      return items;
    },
    searchOnTable() {
      this.filteredOutputVariables = this.searchByName(this.outputVariables, this.search);
    }
  }
};
