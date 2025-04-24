/**
 * Created by leo on 25.02.2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.period';

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodValidationValidationService
	 * @description provides validation methods for timekeeping period validation entities
	 */
	angular.module(moduleName).service('timekeepingPeriodValidationValidationService', TimekeepingPeriodValidationValidationService);

	TimekeepingPeriodValidationValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingPeriodValidationDataService', 'timekeepingPeriodConstantValues'];

	function TimekeepingPeriodValidationValidationService(platformValidationServiceFactory, timekeepingPeriodValidationDataService, timekeepingPeriodConstantValues) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingPeriodConstantValues.schemes.validation, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingPeriodConstantValues.schemes.validation)
		},
		self,
		timekeepingPeriodValidationDataService);
	}

})(angular);
