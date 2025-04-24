(function (angular) {
	'use strict';
	/* globals angular */
	/**
     * @ngdoc service
     * @name transportplanningTransportWaypointValidationService
     * @description provides validation methods for Waypoint instances
     */
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('transportplanningTransportWaypointValidationService', transportplanningTransportWaypointValidationService);

	transportplanningTransportWaypointValidationService.$inject = ['platformDataValidationService', 'transportplanningTransportWaypointDataService', '$http', 'platformRuntimeDataService'];

	function transportplanningTransportWaypointValidationService(platformDataValidationService, dataService, $http, platformRuntimeDataService) {
		var service = {};
		// function: validate mandatory for Code
		service.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validatePlannedTime = function (entity, value, model) {
			if(entity.IsDefaultDst) {
				var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				if (result === true || (result && result.valid)) {
					result = platformDataValidationService.validatePeriod(value, entity.PlannedFinish, entity, model, service, dataService, 'PlannedFinish');
				}
				return result;
			}
		};

		service.validatePlannedFinish = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.PlannedTime, value, entity, model, service, dataService, 'PlannedTime');
		};

		service.validateEarliestStart = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.EarliestFinish, entity, model, service, dataService, 'EarliestFinish');
		};

		service.validateEarliestFinish = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.EarliestStart, value, entity, model, service, dataService, 'EarliestStart');
		};

		service.validateLatestStart = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.LatestFinish, entity, model, service, dataService, 'LatestFinish');
		};

		service.validateLatestFinish = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.LatestStart, value, entity, model, service, dataService, 'LatestStart');
		};

		service.validateActualTime = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ActualEnd, entity, model, service, dataService, 'ActualEnd');
		};

		service.validateActualEnd = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ActualTime, value, entity, model, service, dataService, 'ActualTime');
		};

		service.validateDistance = function (entity, value) {
			service.doValidateUomFk(entity, entity.UomFk, 'UomFk', value);
			return true;
		};

		service.validateUomFk = function (entity, value, model) {
			dataService.changeDistance(entity, value);
			return service.doValidateUomFk(entity, value, model, entity.Distance);
		};

		service.doValidateUomFk = function (entity, value, model, distance) {
			if (distance !== undefined && distance !== null && distance > 0) {
				var res = platformDataValidationService.isMandatory(value, model, {object: model.toLowerCase()});
				if (res.apply === true && res.valid === false) {
					res.error$tr$ = 'transportplanning.transport.errors.uomNullValueErrorMessage';
				}
				return platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
			}
			else {
				platformDataValidationService.removeFromErrorList(entity, 'UomFk', service, dataService);
			}
			return true;
		};

		service.validateLgmJobFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		// update the UI firstly
		service.validateBusinessPartnerFk = function validateBusinessPartnerFk(entity, value) {
			platformRuntimeDataService.readonly(entity, [
				{
					field: 'DeliveryAddressContactFk',
					readonly: _.isNil(value)
				}]);
			return true;
		};

		service.asyncValidateBusinessPartnerFk = function asyncValidateBusinessPartnerFk(entity, value, model) {
			if (entity.LgmJobFk === null) {
				return true;
			}

			return applyAsyncFieldTest({
				Field2Validate: 1,
				NewIntValue: value,
				Job: {},
				Model: model
			}, entity);
		};

		function applyAsyncFieldTest(validationSpec, entity) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, validationSpec.NewIntValue, validationSpec.Model, dataService);
			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobid=' + entity.LgmJobFk)
				.then(function(response) {
					var tmpJobEntity=response.data;
					var relatedProperties = ['BusinessPartnerFk', 'DeliveryAddressContactFk', 'SubsidiaryFk', 'CustomerFk'];
					relatedProperties.forEach(function (item) {
						tmpJobEntity[item] = entity[item];
					});
					validationSpec.Job = tmpJobEntity;

					$http.post(globals.webApiBaseUrl + 'logistic/job/validate', validationSpec).then(function (result) {
						if (!result.data.ValidationResult) {
							return platformDataValidationService.finishAsyncValidation({
								valid: false,
								apply: true,
								error: '...',
								error$tr$: 'project.main.errors.thisIsAnUnknwonBusinessPartner',
								error$tr$param: {}
							}, entity, validationSpec.NewIntValue, validationSpec.Model, asyncMarker, service, dataService);
						} else {
							dataService.updateJobRelatedProperties(entity, result.data.Job);
							return platformDataValidationService.finishAsyncValidation(true, entity, validationSpec.NewIntValue, validationSpec.Model, asyncMarker, service, dataService);
						}
					});
				});

			return asyncMarker.myPromise;
		}

		return service;
	}
})(angular);
