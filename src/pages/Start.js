import axios from 'axios';

import models from '@/data/models.js';
import modelInputs from '@/data/modelInputs.js';
import modelOutputVariables from '@/data/modelOutputVariables.js';

import dibkLogo from '@/assets/images/dibk_logo_mob.svg';

export default {
  props: ['user'],
  data: () => ({
    dibkLogo,
    menuVisible: true,
    modelOutputVariables,
    testResults: null,
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
    }
  },
  mounted() {
    this.fetchModels();
    this.fetchBusinessTypes();
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    translateInputType(modelInputType) {
      switch (modelInputType) {
        case 'String':
          return 'text';
        case 'Int32':
          return 'number';
        case 'Int64':
          return 'number';
        default:
          return 'text';
      }
    },
    fetchModels() {
      axios.get('https://digitek-api-dev.azurewebsites.net/api/TestMotor/GetAvailablesBrannProsjekteringsModels').then(response => {
        this.models = response && response.data ? response.data : null;
      })
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
          return model.bpmnId === this.selectedModelId;
        });
      } else {
        return null;
      }
    },
    handleSubmitInputValuesClick() {
      const userInfo = { // TODO get user info
        navn: "Testmotor",
        organisasjonsnummer: null,
        organisasjonsNavn: null,
        email: this.user.email
      };
      const modelInputs = {};
      Object.keys(this.selectedModel.bpmnInputs).forEach(variableKey => {
        modelInputs[variableKey] = this.selectedInputValues[variableKey];
      });
      const selectedModelId = this.selectedModel.bpmnId;
      const apiUrl = `https://digitek-api-dev.azurewebsites.net/api/DigiTek17K11/${selectedModelId}`;
      axios({
        method: 'post',
        url: apiUrl,
        data: {
          userInfo,
          modelInputs
        }
      }).then(response => {
        this.testResults = response && response.data ? response.data : null;
        this.updateOutputVariables();
        this.searchOnTable();
      }).catch(error => {
        console.log(error);
      });
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
    getAugmentedVariableInfo(dmnTableKey, variableKey) {
      if (!dmnTableKey || !variableKey) return null;
      const dmnTableInfo = this.testResults && this.testResults.modelDataDictionary && this.testResults.modelDataDictionary[dmnTableKey] ? this.testResults.modelDataDictionary[dmnTableKey] : null;
      const variablesForDmnTable = dmnTableInfo && dmnTableInfo.OutputVariablesInfo ? dmnTableInfo.OutputVariablesInfo : null;
      if (dmnTableInfo && variablesForDmnTable) {
        const variableInfo = variablesForDmnTable.find(variable => {
          return variable && variable.VariabelId && variableKey === variable.VariabelId;
        });
        return {
          ...variableInfo,
          DmnId: dmnTableInfo.DmnId,
          DmnNavn: dmnTableInfo.DmnNavn,
          TekBokstav: dmnTableInfo.TekBokstav,
          TekKapittel: dmnTableInfo.TekKapitel,
          TekLedd: dmnTableInfo.TekLedd,
          TekTabell: dmnTableInfo.TekTabell,
          TekWebLink: dmnTableInfo.TekWebLink,
          Type: 'Beregnet verdi'
        } : null;
      } else {
        return null;
      }
    },
    getAugmentedInputVariableInfo(variableKey) {
      if (!variableKey) return null;
      return {
        Ifc: null,
        IfcUrl: null,
        VariabelBeskrivelse: null,
        VariabelId: variableKey,
        VariabelNavn: null,
        DmnId: null,
        DmnNavn: null,
        TekBokstav: null,
        TekKapittel: null,
        TekLedd: null,
        TekTabell: null,
        TekWebLink: null,
        Type: 'Inntastet verdi'
      };
    },
    getOutputVariables() {
      const outputVariables = [];
      if (this.testResults){
        const variablesByDmnTable = this.testResults.modelOutputs;
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
      }
      return outputVariables;
    },
    toLower(text) {
      return text.toString().toLowerCase();
    },
    searchByName(items, term) {
      if (term) {
        return items.filter(item => {
          return this.modelOutputVariables.find(outputVariableKey => {
            return (item[outputVariableKey] && this.toLower(item[outputVariableKey]).includes(this.toLower(term)));
          });
        });
      }
      return items;
    },
    searchOnTable() {
      this.filteredOutputVariables = this.searchByName(this.outputVariables, this.search);
    }
  }
};
