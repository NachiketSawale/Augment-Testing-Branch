(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaDataService', DataService);

	DataService.$inject = ['$injector',
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension'
	];

	function DataService ($injector,
		platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension) {
		let container;
		let serviceOptions = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'ppsFormulaDataService',
				entityNameTranslationID: 'productionplanning.formulaconfiguration.entityFormula',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/formula/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PpsFormulaDto',
					moduleSubModule: 'ProductionPlanning.FormulaConfiguration'
				})],
				entityRole: {
					root: {
						itemName: 'PpsFormula',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsFormulaConfig',
						descField: 'Description',
						handleUpdateDone: function handleUpdateDone(updateData, response, data) {
							data.handleOnUpdateSucceeded(updateData, response, data, true);

							if (updateData['PpsFormulaInstanceToSave']) {
								$injector.get('ppsFormulaInstanceDataService').reSelect();
							}
						}
					}
				},
				entitySelection: { supportsMultiSelection: true },
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: null,
						pinningOptions: null,
						withExecutionHints: true
					}
				}
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsFormulaDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
			validationService: 'ppsFormulaValidationService'
		});

		return container.service;
	}
})(angular);