export default [
  {
    modelName: 'BranntekniskProsjekteringModel',
    modelId: 'branntekniskProsjekteringModel',
    modelInputs: {
      typeVirksomhet: 'string',
      antallEtasjer:	'integer',
      brtArealPrEtasje:	'integer',
      arealBrannseksjonPrEtasje: 'integer',
      brannenergi:	'integer',
      bygningOffentligUnderTerreng:	'boolean',
      utgangTerrengAlleBoenheter:	'boolean',
      avstandMellomMotstVinduerIMeter: 'integer',
      brtArealBygg: 'integer',
      kravOmHeis: 'boolean'
    }
  },
  {
    modelName: 'RisikoklasseSubModel',
    modelId: 'risikoklasseSubModel',
    modelInputs: {
      typeVirksomhet: 'string',
      bareSporadiskPersonopphold: 'boolean',
      alleKjennerRomningsVeiene: 'boolean',
      beregnetForOvernatting: 'boolean',
      liteBrannfarligAktivitet: 'boolean'
    }
  },
  {
    modelName: 'BrannklasseSubModel',
    modelId: 'brannklasseSubModel',
    modelInputs: {
      typeVirksomhet: 'string',
      antallEtasjer: 'integer',
      rkl: 'string',
      brtArealPrEtasje: 'integer',
      utgangTerrengAlleBoenheter: 'boolean',
      konsekvensAvBrann: 'string'
    }
  }
];
