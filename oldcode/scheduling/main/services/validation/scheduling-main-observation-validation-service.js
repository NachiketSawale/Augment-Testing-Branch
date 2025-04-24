/**
 * Created by baf on 17.01.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainObservationValidationService
	 * @description provides validation methods for scheduling main observation entities
	 */
	angular.module(moduleName).service('schedulingMainObservationValidationService', SchedulingMainObservationValidationService);

	SchedulingMainObservationValidationService.$inject = ['platformValidationServiceFactory', 'schedulingMainConstantValues', 'schedulingMainObservationDataService'];

	function SchedulingMainObservationValidationService(platformValidationServiceFactory, schedulingMainConstantValues, schedulingMainObservationDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(schedulingMainConstantValues.schemes.observation, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schedulingMainConstantValues.schemes.observation)
		},
		self,
		schedulingMainObservationDataService);
	}
})(angular);
