(function (angular) {
	'use strict';
	/* global globals, _ */

	/**
	 * @ngdoc service
	 * @name transportplanningTransportValidationService
	 * @description provides validation methods for transport instances
	 */
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('transportplanningTransportValidationService', ValidationService);

	ValidationService.$inject = ['$http',
		'$injector',
		'moment',
		'platformDataValidationService',
		'platformRuntimeDataService',
		'productionplanningCommonEventValidationServiceExtension',
		'$translate',
		'basicsLookupdataLookupDescriptorService',
		'ppsEntityConstant',
		'transportplanningTransportMainService'];

	function ValidationService($http, $injector, moment, platformDataValidationService,
							   platformRuntimeDataService,
							   eventValidationServiceExtension,
							   $translate,
							   basicsLookupdataLookupDescriptorService,
							   ppsEntityConstant,
							   dataService) {
		var service = {};

		//function: validate mandatory for Code
		service.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
			//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
			//Now the data service knows there is an outstanding asynchronous request.

			var postData = {Id: entity.Id, Code: value};

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/isuniquecode', postData).then(function (response) {
				//Interprete result.
				var result = {};
				if (response.data) {
					result = {apply: true, valid: true, error: ''};
				}
				else {
					result.valid = false;
					result.apply = true;
					result.error = '...';
					result.error$tr$ = 'transportplanning.transport.errors.uniqCode';
				}

				//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
				platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, dataService);

				//Provide result to grid / form container.
				return result;
			});

			return asyncMarker.myPromise;
		};

		service.validateProjectFk = function (entity, value, model) {
			return validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
		};

		service.validateLgmJobFk = function (entity, value, model) {
			return validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
		};

		service.removeDeletedEntityFromErrorList = function (entity) {
			platformDataValidationService.removeDeletedEntityFromErrorList(entity, dataService);
		};

		eventValidationServiceExtension.addMethodsForEvent(service,dataService);
		eventValidationServiceExtension.addMethodsForDerivedEvent(service);

		service.asyncValidateEventTypeFk = function asyncEventTypeFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			asyncMarker.myPromise = basicsLookupdataLookupDescriptorService.loadItemByKey('EventType', value).then(function (eventType) {
				let result = (eventType.PpsEntityFk === ppsEntityConstant.TransportRoute)
					? {valid: true}
					: {valid: false, error: $translate.instant('transportplanning.transport.errors.ppsEntityFkOfEventTypeIsNotForRouteErrorMessage')};
				return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
			});
			return asyncMarker.myPromise;
		};
		// remark: before calling asyncValidateEventTypeFk method, validateEventTypeFk method will be called for mandatory validation

		function validateForeignKeyFieldMandatory (entity, value, model, service, itemDataService, invalidValues) {
			//check if value is invalid
			var invalidValueArray = [0];//generally, we set value 0 as the invalid value for foreign key field
			if (invalidValues) {
				invalidValueArray = invalidValues;
			}
			if (invalidValueArray.indexOf(value) > -1) {
				value = null;
			}
			//validate mandatory of value
			return platformDataValidationService.validateMandatory(entity, value, model, service, itemDataService);
		}

		//update the UI firstly
		service.validateBusinessPartnerFk = function validateBusinessPartnerFk(entity, value) {
			platformRuntimeDataService.readonly(entity, [
				{
					field: 'DeliveryAddressContactFk',
					readonly: _.isNil(value)
				}]);
			return true;
		};

		service.asyncValidateBusinessPartnerFk = function asyncValidateBusinessPartnerFk(entity, value, model) {
			if (entity.JobDefFk === null) {
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
			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobid=' + entity.JobDefFk)
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

		service.validatePlannedDelivery = function (entity, value, model) {
			if(entity.HasDefaultDstWaypoint === false){
				platformDataValidationService.removeFromErrorList(entity, model, service, dataService);
				syncPlannedDelivery(entity, value);// sync PlannedDeliveryTime, PlannedDeliveryDate and PlannedDeliveryDay with new value of PlannedDelivery if validation pass.
				return true;
			}
			else {
				if(value!== null && value !== undefined){
					platformDataValidationService.removeFromErrorList(entity, model, service, dataService);
					syncPlannedDelivery(entity, value);// sync PlannedDeliveryTime, PlannedDeliveryDate and PlannedDeliveryDay with new value of PlannedDelivery if validation pass.
					return true;
				}
				else {
					var res = {
						valid : false,
						apply : true,
						error : '...',
						error$tr$ : 'transportplanning.transport.errors.plannedDeliveryNullValueErrorMessage'
					};
					return platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
				}
			}
		};

		service.validatePlannedDeliveryDate = function (entity, value, model) {
			let result = true; // at the moment, we don't really do validation for field PlannedDeliveryDate, so the validation result is always true.

			// sync PlannedDelivery with new value of PlannedDeliveryDate if validation pass.
			if(result === true){
				updatePlannedDelivery(entity,value);
			}

			return result;
		};
		// remark: validatePlannedDeliveryDate method may be called by bulk-editor.

		// sync PlannedDelivery and PlannedDeliveryDay by new value of PlannedDeliveryDate
		function updatePlannedDelivery(entity, value){
			if (_.isNil(entity.PlannedDelivery)){
				entity.PlannedDelivery = moment(value);
			} else {
				entity.PlannedDelivery.set({
					year: value.year(),
					month: value.month(),
					date: value.date()
				});
			}
			entity.PlannedDeliveryDay = entity.PlannedDelivery;
		}

		// sync PlannedDeliveryTime, PlannedDeliveryDate and PlannedDeliveryDay with new value
		function syncPlannedDelivery(entity, value){
			entity.PlannedDeliveryTime = moment(value);
			entity.PlannedDeliveryDate = moment(value);
			entity.PlannedDeliveryDay = moment(value);
		}

		return service;
	}
})(angular);
