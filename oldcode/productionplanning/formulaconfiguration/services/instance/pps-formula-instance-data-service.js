(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaInstanceDataService', DataService);

	DataService.$inject = [
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'ppsFormulaDataService'
	];

	function DataService (platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		parentService) {
		let container;
		let serviceOptions = {
			flatNodeItem: {
				module: moduleName,
				serviceName: 'ppsFormulaInstanceDataService',
				entityNameTranslationID: 'productionplanning.formulaconfiguration.entityFormulaInstance',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/formulainstance/',
					endRead: 'listbyformula'
				},
				entityRole: {
					node: {
						itemName: 'PpsFormulaInstance',
						parentService: parentService,
						parentFilter: 'formulaId',
						useIdentification: true
					}
				},
				dataProcessor: [],
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							creationData.PKey1 = parentService.getSelected().Id;
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat',
				},
				translation: {
					uid: 'ppsFormulaInstanceDataService',
					title: 'productionplanning.formulaconfiguration.entityFormulaInstance',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'PpsFormulaInstanceDto',
						moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
					},
				}
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsFormulaInstanceDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
			validationService: 'ppsFormulaInstanceValidationService'
		});

		const service = container.service;

		service.reSelect = function () {
			// for load parameter values after created
			const selected = service.getSelected();
			service.deselect().then(() => service.setSelected(selected));
		};

		return service;
	}
})(angular);