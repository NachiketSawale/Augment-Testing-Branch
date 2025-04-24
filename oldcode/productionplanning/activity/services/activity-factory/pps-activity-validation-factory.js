/**
 * Created by anl on 3/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).factory('productionpalnningActivityActivityValidationFactory', ActivityValidationFactory);

	ActivityValidationFactory.$inject = ['$http', 'platformDataValidationService', 'productionplanningCommonEventValidationServiceExtension'];

	function ActivityValidationFactory($http, platformDataValidationService, eventValidationServiceExtension) {

		function createActivityValidationService(activityDataService) {
			var service = {};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, activityDataService);
			};

			service.asyncValidateCode = function (entity, value, field) {

				//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, activityDataService);
				//Now the data service knows there is an outstanding asynchronous request.

				var postData = {Id: entity.Id, Code: value, RequisitionId: entity.MntRequisitionFk};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/activity/activity/isuniquecode',
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
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, activityDataService);

					//Provide result to grid / form container.
					return res;
				});

				return asyncMarker.myPromise;
			};

			service.validateMntRequisitionFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, activityDataService);
			};

			eventValidationServiceExtension.addMethodsForEvent(service,activityDataService, moduleName, true);
			eventValidationServiceExtension.addMethodsForDerivedEvent(service);

			return service;
		}

		return {
			createActivityValidationService: createActivityValidationService
		};
	}

})(angular);
