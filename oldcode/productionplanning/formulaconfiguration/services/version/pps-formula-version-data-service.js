(function (angular) {
	'use strict';
	/* global globals */
	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaVersionDataService', DataService);

	DataService.$inject = [
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'ppsFormulaDataService',
		'$http'
	];

	function DataService (platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		parentService,
		$http) {
		let container;
		let serviceOptions = {
			flatNodeItem: {
				module: moduleName,
				serviceName: 'ppsFormulaVersionDataService',
				entityNameTranslationID: 'productionplanning.formulaconfiguration.entityFormulaVersion',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/formulaversion/',
					endRead: 'listbyformula'
				},
				entityRole: {
					node: {
						itemName: 'PpsFormulaVersion',
						parentService: parentService,
						parentFilter: 'formulaId',
						useIdentification: true
					}
				},
				dataProcessor: [],
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function (creationData, data, creationOptions) {
							creationData.PKey1 = creationOptions || parentService.getSelected().Id;
						},
						incorporateDataRead: function(result, data) {
							createVersionAfterFormulaCreated(result);
							return data.handleReadSucceeded(result, data);
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat',
				}
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsFormulaVersionDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
			validationService: 'ppsFormulaVersionValidationService'
		});

		let service = container.service;

		service.changeStatus = function () {
			return $http.get(globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/formulaversion/changestatus?versionId=' + service.getSelected().Id);
		};

		service.copyVersion = function(version) {
			return $http.post(globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/formulaversion/copyversion', version);
		};

		function createVersionAfterFormulaCreated(result) {
			// create a new version if parent item is just created.
			if (result.length === 0) {
				const parent = parentService.getSelected();
				if (parent && parent.Version === 0) {
					service.createItem(parent.Id);
				}
			}
		}

		return service;
	}
})(angular);