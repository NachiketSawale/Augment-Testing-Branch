/**
 * Created by anl on 3/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName).factory('productionpalnningReportReportValidationFactory', ReportValidationFactory);

	ReportValidationFactory.$inject = ['$http', 'platformDataValidationService'];

	function ReportValidationFactory($http, platformDataValidationService) {
		
		function createService(dataService) {

			var service = {};

			function validateForeignKeyFieldMandatory(entity, value, model) {
				// check if value is invalid
				var invalidValueArray = [0]; // Generally, we set value 0 as the invalid value for foreign key field. At least, PRJ_PROJECT, BAS_CLERK, BAS_SITE and LGM_JOB don't have a record whose ID is 0.
				if (invalidValueArray.indexOf(value) > -1) {
					value = null;
				}
				//validate mandatory of value
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.asyncValidateCode = function (entity, value, field) {

				//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
				//Now the data service knows there is an outstanding asynchronous request.

				var activityId = dataService.getSelected().ActivityFk;

				var postData = {Id: entity.Id, Code: value, ActivityId: activityId};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/report/report/isuniquecode',
					postData).then(function (response) {
					//Interprete result.
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = 'The Code should be unique';
						res.error$tr$ = 'productionplanning.mounting.errors.uniqCode';
					}

					//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

					//Provide result to grid / form container.
					return res;
				});

				return asyncMarker.myPromise;
			};

			service.validateStartTime = function (entity, value, model) {
				var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				return result && platformDataValidationService.validatePeriod(value, entity.EndTime, entity, model, service, dataService, 'EndTime');
			};
			service.validateEndTime = function (entity, value, model) {
				var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				return result && platformDataValidationService.validatePeriod(entity.StartTime, value, entity, model, service, dataService, 'StartTime');
			};

			service.validateClerkFk = validateForeignKeyFieldMandatory;

			return service;
		}

		return {
			createValidationService: createService
		};
	}

})(angular);
