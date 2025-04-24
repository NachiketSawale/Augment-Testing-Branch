/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.cadimportconfig';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsEngineeringCadValidationDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		'ppsEngineeringCadImportConfigDataService'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor,
						 parentService) {

		function enSureInvalidValue(newItem) {
			if (newItem) {
				Object.keys(newItem).forEach(function (prop) {
					if (prop.endsWith('Fk')) {
						if (newItem[prop] === 0) {
							newItem[prop] = null;
						}
					}
				});
			}
		}

		var serviceInfo = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsEngineeringCadValidationDataService',
				entityNameTranslationID: 'productionplanning.cadimportconfig.validation.entityTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/cadvalidation/',
					endRead: 'getby',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = parentService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PpsEngineeringCadValidations',
						parentService: parentService
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var parentSelected = parentService.getSelected();
							creationData.Id = parentSelected.Id;
						}
					}
				},
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EngCadValidationDto',
			moduleSubModule: 'ProductionPlanning.CadImportConfig',
			validationService: 'ppsEngineeringCadValidationValidationService'
		});

		return container.service;
	}
})(angular);
