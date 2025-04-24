(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningCommonEventValidationService
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('productionplanningCommonEventValidationService', ProductionplanningCommonEventValidationService);

	ProductionplanningCommonEventValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'productionplanningCommonEventValidationServiceExtension', 'ppsCommonLoggingHelper',
		'productionplanningCommonEventUIStandardServiceFactory', 'platformLayoutByDataService', 'platformValidationByDataService'];

	function ProductionplanningCommonEventValidationService(
		$http, $q, platformDataValidationService, eventValidationServiceExtension, ppsCommonLoggingHelper,
		productionplanningCommonEventUIStandardServiceFactory, platformLayoutByDataService, platformValidationByDataService) {
		var mainService = {};
		var serviceCache = {};
		mainService.EditValidation = (dataService, dateShiftConfig) => {
			var service = {};

			service.validateCalCalendarFk = (entity, value, model) => {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			let dateshiftId = !_.isNil(dateShiftConfig)? dateShiftConfig.dateshiftId : 'default';
			eventValidationServiceExtension.addMethodsForEvent(service, dataService, dateshiftId, true, dateshiftId);

			// extend validation for logging
			if (_.isFunction(dataService.getContainerData)) {
				var uiStandardService = productionplanningCommonEventUIStandardServiceFactory.getService('ItemFk');
				ppsCommonLoggingHelper.extendValidationIfNeeded(
					dataService,
					service,
					{
						typeName: 'EventDto',
						moduleSubModule: 'ProductionPlanning.Common'
					}
				);
				platformLayoutByDataService.registerLayout(uiStandardService, dataService);
				platformValidationByDataService.registerValidationService(service, dataService);
			}

			return service;
		};

		mainService.getValidationService = function getValidationService(dataService, moduleId, dateShiftConfig) {
			if (!serviceCache[moduleId]) {
				serviceCache[moduleId] = mainService.EditValidation(dataService, dateShiftConfig);
			}
			return serviceCache[moduleId];
		};
		return mainService;

	}
})(angular);

