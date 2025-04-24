
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).factory('ppsMaintenanceDataService', TemplateDataService);

	TemplateDataService.$inject = ['$http','platformDataServiceFactory',
		'ppsProductionPlaceDataService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor'];

	function TemplateDataService($http, platformDataServiceFactory,
		ppsProductionPlaceDataService,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor) {

		var container;
		var serviceOptions = {
			flatNodeItem: {
				module: moduleName,
				serviceName: 'ppsMaintenanceDataService',
				entityNameTranslationID: 'productionplanning.productionplace.entityPpsMaintenance',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/productionplace/ppsmaintenance/',
					endRead: 'listbyproductionplace'
				},
				entityRole: {
					leaf: {
						itemName: 'PpsMaintenance',
						parentService: ppsProductionPlaceDataService,
						parentFilter: 'prodPlaceId',
						useIdentification: true
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{typeName: 'PpsMaintenanceDto', moduleSubModule: 'ProductionPlanning.ProductionPlace'}
				)],
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var selected = ppsProductionPlaceDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat',
				}
			}
		};

		/* jshint -W003 */
		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsMaintenanceDto',
			moduleSubModule: 'ProductionPlanning.ProductionPlace',
			validationService: 'ppsMaintenanceValidationService',
			mustValidateFields: ['EndDate', 'StartDate']
		});

		return container.service;
	}
})(angular);
