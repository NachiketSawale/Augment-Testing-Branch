/**
 * Created by jpfriedel on 30/3/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbol2WorkTimeModelValidationService
	 * @description provides validation methods for timekeeping time symbol 2 work time model entities
	 */
	angular.module(moduleName).service('timekeepingTimeSymbol2WorkTimeModelValidationService', TimekeepingTimeSymbol2WorkTimeModelValidationService);

	TimekeepingTimeSymbol2WorkTimeModelValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingWorkTimeModelDayDataService'];

	function TimekeepingTimeSymbol2WorkTimeModelValidationService(platformValidationServiceFactory, timekeepingTimeSymbol2WorkTimeModelDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface({ typeName: 'TimeSymbol2WorkTimeModelDto', moduleSubModule: 'Timekeeping.WorkTimeModel'}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({ typeName: 'TimeSymbol2WorkTimeModelDto', moduleSubModule: 'Timekeeping.WorkTimeModel'})}, self, timekeepingTimeSymbol2WorkTimeModelDataService);
	}
})(angular);