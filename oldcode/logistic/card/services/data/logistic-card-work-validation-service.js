/**
 * Created by shen on 6/23/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardWorkValidationService
	 * @description provides validation methods for logistic card work entities
	 */
	angular.module(moduleName).service('logisticCardWorkValidationService', logisticCardWorkValidationService);

	logisticCardWorkValidationService.$inject = ['platformRuntimeDataService', 'platformDataValidationService', '$injector', 'calendarUtilitiesService', 'logisticCardWorkDataService'];

	function logisticCardWorkValidationService(platformRuntimeDataService, platformDataValidationService, $injector, calendarUtilitiesService, logisticCardWorkDataService) {
		var service = {};

		service.validateWorkStart = function (entity, value, model) {
			calendarUtilitiesService.assertSameDate(value, entity.WorkEnd);

			return platformDataValidationService.validatePeriod(value, entity.WorkEnd, entity, model, service, logisticCardWorkDataService, 'WorkEnd');
		};

		service.validateWorkEnd = function (entity, value, model) {
			calendarUtilitiesService.assertSameDate(value, entity.WorkStart);

			return platformDataValidationService.validatePeriod(entity.WorkStart, value, entity, model, service, logisticCardWorkDataService, 'WorkStart');
		};
	}
})(angular);
