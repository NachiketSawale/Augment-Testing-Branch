/**
 * Created by shen on 6/15/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelValidationService
	 * @description provides validation methods for timekeeping work time model entities
	 */
	angular.module(moduleName).service('timekeepingWorkTimeModelValidationService', TimekeepingWorkTimeModelValidationService);

	TimekeepingWorkTimeModelValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingWorkTimeModelDataService','platformRuntimeDataService'];

	function TimekeepingWorkTimeModelValidationService(platformValidationServiceFactory, timekeepingWorkTimeModelDataService,platformRuntimeDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface({ typeName: 'WorkTimeModelDto', moduleSubModule: 'Timekeeping.WorkTimeModel'}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({ typeName: 'WorkTimeModelDto', moduleSubModule: 'Timekeeping.WorkTimeModel'})
		},
		self,
		timekeepingWorkTimeModelDataService);

		self.validateIsFallback = function (entity,value){
			if (value === true ){
				entity.WorkingTimeModelFbFk = null;
			}
			platformRuntimeDataService.readonly(entity, [
				{field: 'WorkingTimeModelFbFk', readonly: value}
			]);
		};
	}
})(angular);
