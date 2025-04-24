/**
 * Created by anl on 3/6/2018.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionpalnningMountingRequisitionValidationFactory', MntRequisitionValidationFactory);

	MntRequisitionValidationFactory.$inject = ['$http', 'platformDataValidationService','basicsCompanyNumberGenerationInfoService','ppsMountingConstantValues'];

	function MntRequisitionValidationFactory($http, platformDataValidationService,basicsCompanyNumberGenerationInfoService, ppsMountingConstantValues) {

		function createValidationService(dataService) {
			var service = {};
			var result;

			// service.validateCode = function (entity, value, model) {
			// 	return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			// };
			/*
			service.asyncValidateCode = function asyncValidateCode(entity, value, field) {

				//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
				//Now the data service knows there is an outstanding asynchronous request.

				var postData = {Id: entity.Id, Code: value, mainItemId: entity.ProjectFk};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/isuniquecode', postData).then(function (response) {
					//Interprete result.
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = '...';
						res.error$tr$ = 'productionplanning.mounting.errors.uniqCode';
					}

					//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

					//Provide result to grid / form container.
					return res;
				});

				return asyncMarker.myPromise;
			};
			*/
			service.validateClerkFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};
			service.validateProjectFk = function (entity, value, model) {
				if (entity.ProjectFk !== null && entity.ProjectFk !== 0  && value === null) {
					value = entity.ProjectFk;
				}
				return  platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateStartDate = function (entity, value, model) {
				// // in order to force user to input 'update comment', fail validation for updateComment
				//failValidation4UpdateComment(entity, service, dataService);
				return service.validateDate(entity, value, model, value, entity.EndDate, 'EndDate');
			};

			service.validateEndDate = function (entity, value, model) {
				return service.validateDate(entity, value, model, entity.StartDate, value, 'StartDate');
			};
			service.validatePpsHeaderFk = function (entity, value, model) {
				if (entity.PpsHeaderFk !== null && entity.PpsHeaderFk !== 0 && value === null) {
					value = entity.PpsHeaderFk;
				}
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};
			service.validateLgmJobFk = function (entity, value, model) {
				if (entity.LgmJobFk !== null && entity.LgmJobFk !== 0 && value === null) {
					value = entity.LgmJobFk;
				}
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};
			service.validateDate = function (entity, value, model, startDate, endDate, relModel) {
				result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				return (result === true || result && result.valid) &&
					platformDataValidationService.validatePeriod(startDate, endDate, entity, model, service, dataService, relModel);
			};

			return service;
		}

		return{
			createValidationService: createValidationService
		};
	}

})(angular);