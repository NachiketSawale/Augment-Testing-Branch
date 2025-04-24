/**
 * Created by anl on 3/6/2018.
 */

(function () {
	/*globals angular*/
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName).factory('productionplanningReportTimeSheetValidationFactory', TimeSheetValidationFactory);

	TimeSheetValidationFactory.$inject = ['platformDataValidationService'];

	function TimeSheetValidationFactory(platformDataValidationService) {

		function createValidationService(dataService) {

			var service = {}, result;

			service.validateResourceFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateDate = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateStartTime = function (entity, value, model) {
				service.initValue(value, entity.EndTime, entity.Date);
				return service.validateTime(entity, value, model, value, entity.EndTime, 'EndTime');
			};

			service.validateEndTime = function (entity, value, model) {
				service.initValue(entity.StartTime, value, entity.Date);
				return service.validateTime(entity, value, model, entity.StartTime, value , 'StartTime');
			};

			service.validateTime = function (entity, value, model, startDate, endDate, relModel) {
				result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				return (result === true || result && result.valid) &&
					platformDataValidationService.validatePeriod(startDate, endDate, entity, model, service, dataService, relModel);
			};

			service.initValue = function (start, end, date){
				start.year(date.year());
				start.month(date.month());
				start.date(date.date());

				end.year(date.year());
				end.month(date.month());
				end.date(date.date());
			};

			return service;
		}

		return {
			createValidationService: createValidationService
		};
	}

})();