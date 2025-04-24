/**
 * Created by leo on 18.09.2014.
 */

(function (angular) {
	/* global globals, moment, Platform */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCalendarValidationService
	 * @description provides validation methods for exceptionDay instances
	 */
	angular.module('project.calendar').service('projectCalendarValidationServiceFactory', ProjectCalendarValidationService);
	ProjectCalendarValidationService.$inject = ['_', 'platformValidationServiceFactory', 'platformDataValidationService', 'schedulingCalendarConstantValues', 'platformRuntimeDataService'];

	function ProjectCalendarValidationService(_, platformValidationServiceFactory, platformDataValidationService, schedulingCalendarConstantValues, platformRuntimeDataService) {

		var self = this;
		var instances = {};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto.replace('Dto', '');
		};

		this.getValidationServiceName = function getDataServiceName(templInfo) {
			return 'projectCalendar' + self.getNameInfix(templInfo) + 'ValidationService';
		};

		this.createValidationService = function createValidationService(templInfo, dsName) {
			var vsName = self.getValidationServiceName(templInfo);
			var srv = instances[vsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateValidationService(vsName, dsName);
				instances[vsName] = srv;
			}

			return srv;
		};

		this.doCreateValidationService = function doCreateDataService(vsName, dsName) {
			var service = {};
			service.dataService = dsName;
			platformValidationServiceFactory.addValidationServiceInterface(schedulingCalendarConstantValues.schemes.calendar, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(schedulingCalendarConstantValues.schemes.calendar),
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
				}]
			},
			service,
			service.dataService);

			service.changedWorkhourDefinesWorkday = new Platform.Messenger();

			service.asyncValidateCode = function (entity, value, model) {
				return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'scheduling/calendar/isunique', entity, value, model).then(function (response) {
					if (!entity[model] && angular.isObject(response)) {
						response.apply = true;
					}
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, service, service.dataService);
				});
			};

			service.validateDefault = function validateDefault(entity, value, model) {
				if (value) {
					var items = service.dataService.getList();
					return platformDataValidationService.isUnique(items, model, value, entity.Id, false);
				} else {
					return {valid: true, apply: true};
				}
			};

			service.validateWorkHourDefinesWorkDay = function validateWorkhourDefinesWorkday(entity, value) {
				var result = true;
				if (value !== entity.WorkHourDefinesWorkDay) {
					service.changedWorkhourDefinesWorkday.fire(value);
				}
				return result;
			};

			function createWorkTimeToHour(time) {
				var worktime = moment().hour(time);
				worktime.minute(0);
				worktime.seconds(0);
				worktime.millisecond(0);

				return worktime;
			}

			function assertSameDate(setTo, getFrom) {
				if (getFrom && setTo) {
					setTo.year(getFrom.year());
					setTo.month(getFrom.month());
					setTo.date(getFrom.date());
				}
			}

			service.validateWorkStart = function (entity, value, model) {
				assertSameDate(value, entity.WorkEnd);

				return platformDataValidationService.validatePeriod(value, entity.WorkEnd, entity, model, service, service.dataService, 'WorkEnd');
			};

			service.validateWorkEnd = function (entity, value, model) {
				assertSameDate(value, entity.WorkStart);

				return platformDataValidationService.validatePeriod(entity.WorkStart, value, entity, model, service, service.dataService, 'WorkStart');
			};

			service.validateIsWorkday = function (entity, value) {
				var fields = null;
				if (value === false) {
					fields = [
						{
							field: 'WorkStart',
							readonly: true
						},
						{
							field: 'WorkEnd',
							readonly: true
						}
					];
					platformRuntimeDataService.readonly(entity, fields);

				} else {
					if (!entity.WorkStart && !entity.WorkEnd) {
						entity.WorkStart = createWorkTimeToHour(8);
						entity.WorkEnd = createWorkTimeToHour(17);
					}
					fields = [
						{
							field: 'WorkStart',
							readonly: false
						},
						{
							field: 'WorkEnd',
							readonly: false
						}
					];
					platformRuntimeDataService.readonly(entity, fields);
				}
			};

			service.validateExceptDate = function (entity, value, model) {
				var items = service.dataService.getList();
				var result = true;
				angular.forEach(items, function (exception) {
					if (moment(exception.ExceptDate).isSame(value) && exception.Id !== entity.Id) {
						result = false;
					}
				});

				if (result) {
					entity.Year = moment(value).year();
					entity.Month = moment(value).month() + 1;
				}

				return platformDataValidationService.finishValidation(result, entity, value, model, service, service.dataService);
			};
			return service;
		};
	}
})(angular);
