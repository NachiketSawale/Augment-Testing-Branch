(function (angular) {
	'use strict';
	/* globals globals */
	/**
     * @ngdoc service
     * @name transportplanningRequisitionValidationService
     * @function
     *
     * @description
     * RequisitionValidationService is the data service for all Requisition related functionality.
     * */

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionValidationService', RequisitionValidationService);

	RequisitionValidationService.$inject = ['$http', '$q', 'platformDataValidationService', 'transportplanningRequisitionMainService', 'platformRuntimeDataService', 'productionplanningCommonEventValidationServiceExtension'];

	function RequisitionValidationService($http, $q, platformDataValidationService, transportplanningRequisitionMainService, platformRuntimeDataService, eventValidationServiceExtension) {
		var service = {};

		function validateForeignKeyFieldMandatory (entity, value, model, service, dataService, invalidValues) {
			// check if value is invalid
			var invalidValueArray = [0];// generally, we set value 0 as the invalid value for foreign key field
			if (invalidValues) {
				invalidValueArray = invalidValues;
			}
			if (invalidValueArray.indexOf(value) > -1) {
				value = null;
			}
			// validate mandatory of value
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		service.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, transportplanningRequisitionMainService);
		};

		eventValidationServiceExtension.addMethodsForEvent(service,transportplanningRequisitionMainService, 'transportplanning.requisition', true);
		eventValidationServiceExtension.addMethodsForDerivedEvent(service);

		service.validateProjectFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, transportplanningRequisitionMainService);
		};
		service.validateLgmJobFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, transportplanningRequisitionMainService);
		};

		service.validateClerkFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, transportplanningRequisitionMainService);
		};

		// service.validateDate = function (entity, value, model) {
		//     return platformDataValidationService.validateMandatory(entity, value, model, service, transportplanningRequisitionMainService);
		// };

		service.validateEventTypeFk = function (entity, value, model) {
			return validateForeignKeyFieldMandatory(entity, value, model, service, transportplanningRequisitionMainService);
		};

		service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
		    //asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
		    //   var asyncMarker = platformDataValidationService.registerAsyncCall(entity,  field, value, productionplanningProductionsetMainService);
		    var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, transportplanningRequisitionMainService);
		    //Now the data service knows there is an outstanding asynchronous request.

		    var postData = {Id: entity.Id, Code: value};

		    asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'transportplanning/requisition/isuniquecode', postData).then(function (response) {
		        //Interprete result.
		        var result = {};
		        if (response.data) {
		            result = {apply: true, valid: true, error: ''};
		        }
		        else {
		            result.valid = false;
		            result.apply = true;
		            result.error = '...';
		            result.error$tr$ = 'transportplanning.requisition.errors.uniqCode';
		        }

		        //Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
		        platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, transportplanningRequisitionMainService);

		        //Provide result to grid / form container.
		        return result;
		    });

		    return asyncMarker.myPromise;
		};

		// update the UI firstly
		service.validateBusinessPartnerFk = function validateBusinessPartnerFk(entity, value) {
			platformRuntimeDataService.readonly(entity, [
				{
					field: 'ContactFk',
					readonly: _.isNil(value)
				}]);
			return true;
		};

		service.asyncValidateBusinessPartnerFk = function asyncValidateBusinessPartnerFk (entity, value, model) {
			if(entity.Version <= 0 && transportplanningRequisitionMainService.stopAsyncValidatePartnerOnCreation === true) {
				transportplanningRequisitionMainService.stopAsyncValidatePartnerOnCreation = false;
				return;
			}
			return applyAsyncFieldTest({ Field: 'BusinessPartnerFk', NewIntValue: value, RequisitionDto: entity }, value, model);
		};

		service.asyncValidateContactFk = function asyncValidateContactFk (entity, value, model) {
			if(entity.Version <= 0 && transportplanningRequisitionMainService.stopAsyncValidateContactOnCreation === true) {
				transportplanningRequisitionMainService.stopAsyncValidateContactOnCreation = false;
				return;
			}
			return applyAsyncFieldTest({ Field: 'ContactFk', NewIntValue: value, RequisitionDto: entity }, value, model);
		};

		function applyAsyncFieldTest(validationSpec, value, model, errorCode) {
			var entity = validationSpec.RequisitionDto;
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, transportplanningRequisitionMainService);

			asyncMarker.myPromise = transportplanningRequisitionMainService.awaitCreationSucceeded(entity.Id).then(function () {
				return $http.post(globals.webApiBaseUrl + 'transportplanning/requisition/validate', validationSpec).then(function (result) {
					if (!result.data.ValidationResult) {
						return platformDataValidationService.finishAsyncValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: errorCode,
							error$tr$param: {object: model.toLowerCase()}
						}, entity, value, model, asyncMarker, service, transportplanningRequisitionMainService);
					} else {
						transportplanningRequisitionMainService.takeOver(result.data.RequisitionDto, result.data.RequisitionDto.LgmJobFk);
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, transportplanningRequisitionMainService);
					}
				});
			});
			return asyncMarker.myPromise;
		}

		service.validateMaxWeight = function (entity, value, model) {
			if (angular.isNumber(value) && value <= 0) {
				let errObj = platformDataValidationService.createErrorObject('transportplanning.requisition.errors.errorMaxWeightInput', {}, true);
				return platformDataValidationService.finishWithError(errObj, entity, value, model, service, transportplanningRequisitionMainService);
			}
			else {
				platformDataValidationService.removeFromErrorList(entity, model, service, transportplanningRequisitionMainService);
				return true;
			}
		};

		service.hasErrors = function () {
			return platformDataValidationService.hasErrors(transportplanningRequisitionMainService);
		};

		return service;
	}
})(angular);
