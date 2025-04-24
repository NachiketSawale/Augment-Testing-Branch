/**
 * Created by shen on 6/16/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelDerivationValidationService
	 * @description provides validation methods for timekeeping work timeModelDerivation entities
	 */
	angular.module(moduleName).service('timekeepingWorkTimeModelDerivationValidationService', TimekeepingWorkTimeModelDerivationValidationService);

	TimekeepingWorkTimeModelDerivationValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingWorkTimeDerivationDataService'];

	function TimekeepingWorkTimeModelDerivationValidationService(platformValidationServiceFactory, timekeepingWorkTimeDerivationDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface({ typeName: 'WorkTimeDerivationDto', moduleSubModule: 'Timekeeping.WorkTimeModel'}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({ typeName: 'WorkTimeDerivationDto', moduleSubModule: 'Timekeeping.WorkTimeModel'})
		},
		self,
		timekeepingWorkTimeDerivationDataService);
	}
})(angular);
