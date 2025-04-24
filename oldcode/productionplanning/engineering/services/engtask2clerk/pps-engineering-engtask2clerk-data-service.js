(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var module = angular.module(moduleName);
	module.factory('ppsEngTask2ClerkDataService', DataService);

	DataService.$inject = ['_', '$injector',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningEngineeringMainService'];

	function DataService(_, $injector,
						 basicsCommonMandatoryProcessor,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 parentService) {

		var service;
		var serviceName = 'ppsEngTask2ClerkDataService';
		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.engineering.entityEngTask2Clerk',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EngTask2ClerkDto',
					moduleSubModule: 'ProductionPlanning.Engineering'
				})],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/engtask2clerk/',
					initReadData: function (readData) {
						var parentSelected = parentService.getSelected();
						var ppsItemId = _.isNil(parentSelected.PPSItemFk) ? 0 : parentSelected.PPSItemFk;
						readData.filter = '?mainitemid=' + parentSelected.Id + '&ppsitemid=' + ppsItemId;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'EngTask2Clerk',
						parentService: parentService,
						doesRequireLoadAlways: true
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var selected = parentService.getSelected();
							if (selected) {
								creationData.Id = selected.Id;
							}
						}
					}
				}
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		service = container.service;
		container.data.usesCache = false;
		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EngTask2ClerkDto',
			moduleSubModule: 'ProductionPlanning.Engineering',
			validationService: 'ppsEngTask2ClerkValidationService'
		});

		container.service.getContainerData = () => container.data;

		return service;
	}
})();