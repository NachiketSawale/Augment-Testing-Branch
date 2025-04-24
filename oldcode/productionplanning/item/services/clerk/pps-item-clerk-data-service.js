(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);

	itemModule.factory('productionplanningItemClerkDataService', PPSItemClerkDataService);

	PPSItemClerkDataService.$inject = ['$injector', 'productionplanningItemDataService', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor', 'platformDataServiceProcessDatesBySchemeExtension'];

	function PPSItemClerkDataService($injector, ppsItemDataService, platformDataServiceFactory,
									 basicsCommonMandatoryProcessor, platformDataServiceProcessDatesBySchemeExtension) {

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'PPSItem2ClerkDto',
				moduleSubModule: 'ProductionPlanning.Item'
			}
		);

		var serviceInfo = {
			flatLeafItem: {
				module: itemModule,
				serviceName: 'productionplanningItemClerkDataService',
				entityNameTranslationID: 'productionplanning.item.entityItemClerk',
				httpCRUD: {route: globals.webApiBaseUrl + 'productionplanning/item/clerk/'},
				dataProcessor: [dateProcessor],
				entityRole: {
					leaf: {
						itemName: 'PPSItemClerk',
						parentService: ppsItemDataService,
						parentFilter: 'itemFk',
						doesRequireLoadAlways: true
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							creationData.Id = ppsItemDataService.getSelected().Id;
						}
					}
				},
				actions: {
					create: 'flat',
					delete: true
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PPSItem2ClerkDto',
			moduleSubModule: 'ProductionPlanning.Item',
			validationService: 'productionplanningItemClerkValidationService'
		});

		container.service.getContainerData = () => container.data;

		return container.service;
	}
})(angular);