/**
 * Created by leo on 16.09.2014.
 */

(function (angular) {
	/* global Platform */
	'use strict';
	var moduleName = 'scheduling.calendar';
	/**
	 * @ngdoc service
	 * @name schedulingCalendarValidationService
	 * @description provides validation methods for calendar instances
	 */

	angular.module(moduleName).service('schedulingCalendarValidationService', SchedulingCalendarValidationService);

	SchedulingCalendarValidationService.$inject = ['platformValidationServiceFactory', 'platformDataValidationService', 'schedulingCalendarMainService', 'schedulingCalendarConstantValues'];

	function SchedulingCalendarValidationService(platformValidationServiceFactory, platformDataValidationService, schedulingCalendarMainService, schedulingCalendarConstantValues) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(schedulingCalendarConstantValues.schemes.calendar, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schedulingCalendarConstantValues.schemes.calendar),
			uniques: ['Code'],
			ranges: [{
				name: 'WorkHoursPerDay',
				from: 0,
				to: 24
			},
			{
				name: 'WorkHoursPerWeek',
				from: 0,
				to: 168
			},
			{
				name: 'WorkHoursPerMonth',
				from: 0,
				to: 744
			},
			{
				name: 'WorkHoursPerYear',
				from: 0,
				to: 8784
			}

			]
		},
		self,
		schedulingCalendarMainService);

		this.changedWorkhourDefinesWorkday = new Platform.Messenger();

		this.validateIsDefault = function validateIsDefault(entity, value, model) {
			if (value) {
				var items = schedulingCalendarMainService.getList();
				return platformDataValidationService.isUnique(items, model, value, entity.Id, false);
			} else {
				return {valid: true, apply: true};
			}
		};

		this.validateWorkHourDefinesWorkDay = function validateWorkhourDefinesWorkday(entity, value) {
			var result = true;
			if (value !== entity.WorkHourDefinesWorkDay) {
				self.changedWorkhourDefinesWorkday.fire(value);
			}
			return result;
		};
	}

})(angular);
