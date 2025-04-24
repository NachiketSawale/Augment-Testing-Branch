/**
 * Created by aljami on 25.03.2022.
 */
(function (angular) {
	'use strict';

	var moduleName = 'services.schedulerui';

	/**
	 * @ngdoc service
	 * @name servicesSchedulerUIValidationService
	 * @description provides validation methods for job entities
	 */
	angular.module(moduleName).factory('servicesSchedulerUIValidationService', servicesSchedulerUIValidationService);

	servicesSchedulerUIValidationService.$inject = ['servicesSchedulerUIJobDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function servicesSchedulerUIValidationService(dataService, platformDataValidationService, platformRuntimeDataService) {
		var service = {};

		service.validateName = function validateName(entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, 'Name', service, dataService);
			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			return result;
		};

		service.validateJobState = function validateJobState(entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, 'JobState', service, dataService);
			entity.RepeatUnit = value === 5 ? 1 : 0;
			platformRuntimeDataService.readonly(entity, [{
				field: 'RepeatUnit',
				readonly: value !== 5
			}, {
				field: 'RepeatCount',
				readonly: value !== 5
			}]);

			platformRuntimeDataService.readonly(entity, [{
				field: 'KeepDuration',
				readonly: (value !== 5 && value !== 0) || entity.Version === 0
			}, {
				field: 'KeepCount',
				readonly: (value !== 5 && value !== 0) || entity.Version === 0
			}]);


			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			return result;
		};

		service.validateStartTime = function validateStartTime(entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, 'StartTime', service, dataService);
			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			return result;
		};

		service.validateTaskType = function validateTaskType(entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, 'TaskType', service, dataService);
			let task = dataService.getTask(value);
			if (task) {
				platformRuntimeDataService.readonly(entity, [{
					field: 'RunInUserContext',
					readonly: !task.AllowChangeContext
				}]);
				entity.RunInUserContext = task.RunInUserContext;
			} else {
				platformRuntimeDataService.readonly(entity, [{
					field: 'RunInUserContext',
					readonly: true
				}]);
				entity.RunInUserContext = false;
			}

			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			return result;
		};

		service.validateRepeatUnit = function validateRepeatUnit(entity, value, model) {
			var result = true;
			if (entity.JobState === 5 && value === 0) {
				result = {
					apply: true,
					valid: false,
					error$tr$: 'services.schedulerui.errorMessage.repetitiveError'
				};
			}


			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

			return result;
		};

		service.validateRepeatCount = function validateRepeatCount(entity, value, model) {
			var result = true;
			if (entity.RepeatUnit !== 0 && value <= 0) {
				result = {
					apply: true,
					valid: false,
					error$tr$: 'services.schedulerui.errorMessage.greaterZero'
				};
			}


			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

			return result;
		};

		return service;
	}
})(angular);