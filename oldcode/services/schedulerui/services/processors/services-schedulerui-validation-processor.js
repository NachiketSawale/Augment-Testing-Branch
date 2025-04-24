/**
 * Created by aljami on 25.03.2022.
 */
(function (angular) {
	'use strict';
	angular.module('services.schedulerui').factory('servicesSchedulerUIValidationProcessor', servicesSchedulerUIValidationProcessor);
	servicesSchedulerUIValidationProcessor.$inject = ['platformRuntimeDataService', '$injector'];
	function servicesSchedulerUIValidationProcessor(platformRuntimeDataService, $injector) {
		var service = {};
		service.validate = function validate(entity) {
			if (entity.Version === 0) {
				$injector.invoke(['servicesSchedulerUIValidationService', function (servicesSchedulerUIValidationService) {
					servicesSchedulerUIValidationService.validateName(entity, entity.Name, 'Name');
					servicesSchedulerUIValidationService.validateStartTime(entity, entity.StartTime, 'StartTime');
					servicesSchedulerUIValidationService.validateTaskType(entity, entity.TaskType, 'TaskType');
					servicesSchedulerUIValidationService.validateRepeatCount(entity, entity.RepeatCount, 'RepeatCount');
				}]);
			}
		};
		return service;
	}
})(angular);