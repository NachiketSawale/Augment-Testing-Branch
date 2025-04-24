/* global _ */
/**
 * Created by nitsche on 20.06.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainHammockValidationService
	 * @description provides validation methods for scheduling main hammock entities
	 */
	angular.module(moduleName).service('schedulingMainHammockValidationService', SchedulingMainHammockValidationService);

	SchedulingMainHammockValidationService.$inject = [
		'platformDataValidationService',
		'schedulingMainHammockDataService',
		'schedulingMainService', 'schedulingMainHammockAllService'];

	function SchedulingMainHammockValidationService(platformDataValidationService, schedulingMainHammockDataService, schedulingMainService, schedulingMainHammockAllService) {

		var self = this;
		self.validateActivityMemberFk = function validateActivityMemberFk(entity, value, model) {
			if (value === 0) {
				value = null;
			}
			else {
				var activity = schedulingMainService.getItemById(value);
				var activities = [activity];
				if (activity !== undefined)
				{
					if (Object.prototype.hasOwnProperty.call(activity, 'IsAssignedToHammock')) {
						activity.IsAssignedToHammock = true;
					}
					schedulingMainService.takeOverActivities(activities);
				}
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, schedulingMainHammockDataService);
		};
		self.asyncValidateActivityMemberFk = function asyncValidateActivityMemberFk(entity, value, model) {
			var hammockActivity = schedulingMainService.getItemById(entity.ActivityFk);
			var newEntity = _.clone(entity, true);
			newEntity[model] = value;

			return schedulingMainService.refreshHammockDateFields(hammockActivity, [newEntity]).then(function () {

				// Set flag for IsAssignedToHammock
				if (schedulingMainHammockAllService.checkIfActivityIsStillAssigned(entity)) {
					return true;
				}
				else {
					return schedulingMainHammockAllService.asyncCheckIfActivityIsStillAssigned(entity).then(function () {
						return true;
					});
				}
			});
		};
	}
})(angular);
