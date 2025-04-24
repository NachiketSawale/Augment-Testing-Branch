(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonCalendarSiteServiceFactory', ['$translate', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService',
		'$injector',
		'ppsCommonCalendarSiteValidationServiceFactory',
		'basicsCommonMandatoryProcessor',

		function ($translate,
				  platformDataServiceFactory,
				  platformDataServiceProcessDatesBySchemeExtension,
				  platformRuntimeDataService,
				  $injector,
				  validationServiceFactory,
				  basicsCommonMandatoryProcessor) {

			var serviceCache = {};

			function getServiceBy(service) {
				return _.isObject(service) ? service : $injector.get(service);
			}

			function createNewComplete(serviceOptions) {
				var parentService = getServiceBy(serviceOptions.parentService);

				var serviceInfo = {
					flatLeafItem: {
						module: moduleName,
						serviceName: parentService.getServiceName() + 'CalendarSiteService',
						entityNameTranslationID: 'productionplanning.common.calendarSite.entityCalendarSite',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'productionplanning/common/calendar4site/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								var selected = parentService.getSelected();
								readData.filter = '?mainItemId=' + selected.Id;
							}
						},
						entityRole: {
							leaf: {
								itemName: 'CalendarSite',
								parentService: parentService,
								parentFilter: 'BasSiteFk'
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectedItem = parentService.getSelected();
									creationData.Id = selectedItem.Id;
								}
							}
						}
					}
				};

				var container = platformDataServiceFactory.createNewComplete(serviceInfo);
				container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					mustValidateFields: true,
					typeName: 'PpsCalendarForSiteDto',
					moduleSubModule: 'ProductionPlanning.Common',
					validationService: validationServiceFactory.getService(container.service)
				});
				return container.service;
			}

			function getService(serviceOptions) {
				var serviceKey = serviceOptions.serviceKey;
				if (!serviceCache[serviceKey]) {
					serviceCache[serviceKey] = createNewComplete(serviceOptions);
				}
				return serviceCache[serviceKey];
			}

			return {
				getService: getService
			};
		}]);
})(angular);
