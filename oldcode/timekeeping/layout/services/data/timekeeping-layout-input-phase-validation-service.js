/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutInputPhaseValidationService
	 * @description provides validation methods for timekeeping layout inputPhase entities
	 */
	angular.module(moduleName).service('timekeepingLayoutInputPhaseValidationService', TimekeepingLayoutInputPhaseValidationService);

	TimekeepingLayoutInputPhaseValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingLayoutConstantValues', 'timekeepingLayoutInputPhaseDataService'];

	function TimekeepingLayoutInputPhaseValidationService(platformValidationServiceFactory, timekeepingLayoutConstantValues, timekeepingLayoutInputPhaseDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingLayoutConstantValues.schemes.inputPhase, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingLayoutConstantValues.schemes.inputPhase)
		},
		self,
		timekeepingLayoutInputPhaseDataService);
	}
})(angular);
