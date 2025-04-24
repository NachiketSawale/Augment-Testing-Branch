(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningCommonProductValidationFactory
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('productionplanningCommonProductValidationFactory', productionplanningCommonProductValidationFactory);

	productionplanningCommonProductValidationFactory.$inject = ['$http', '$q', 'platformDataValidationService',
		'basicMandatoryValidator', 'basicsCommonMandatoryProcessor', 'ppsCommonCustomColumnsServiceFactory',
		'ppsCommonTransportInfoHelperService'];

	function productionplanningCommonProductValidationFactory($http, $q, platformDataValidationService,
	                                                          basicMandatoryValidator, basicsCommonMandatoryProcessor, customColumnsServiceFactory,
															  ppsCommonTransportInfoHelperService) {
		var mainService = {};

		function init(dataService, eventModuleName) {
			var validationSrv = createValidationService(dataService, eventModuleName);
			var newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ProductDto',
				moduleSubModule: 'ProductionPlanning.Common',
				validationService: validationSrv
			});
			mainService[dataService.getServiceName()] = {
				validationService: validationSrv,
				newEntityValidator: newEntityValidator
			};
		}

		function createValidationService(dataService, eventModuleName) {
			var service = {};

			service.eventModuleName = eventModuleName;

			basicMandatoryValidator.init({
				typeName: 'ProductDto',
				moduleSubModule: 'ProductionPlanning.Common',
				validationService: service,
				validator: function (entity, value, model) {
					var ignoreFields = ['Length', 'Width', 'Height', 'Weight', 'Weight2', 'Weight3', 'ActualWeight', 'Area', 'Area2', 'Area3', 'Volume', 'Volume2', 'Volume3',
						'BasUomLengthFk', 'BasUomWidthFk', 'BasUomHeightFk', 'BasUomWeightFk', 'BasUomAreaFk', 'BasUomFk', 'BasUomBillFk', 'BasUomVolumeFk',
						'UnitPrice', 'BillQuantity', 'PlanQuantity', 'BasUomPlanFk'];
					if (ignoreFields.indexOf(model) > -1) {
						return true;
					}
					// remark: Here we don't really validate mandatory fields Length,Width,Height,Weight,Weight2,Weight3,Area,Area2,Area3,BasUomLengthFk,BasUomWidthFk,BasUomHeightFk,BasUomWeightFk,BasUomAreaFk,BasUomFk,BasUomBillFk,UnitPrice,BillQuantity,PlanQuantity,BasUomPlanFk.
					// Because value 0 is a valid value for these fields, and them won't be null in server side(the type is int/decimal, unnullable, the default value is 0).

					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				}
			});

			service.asyncValidateCode = function asyncValidateCode(entity, value, field) {

				//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
				//Now the data service knows there is an outstanding asynchronous request.

				var postData = { Id: entity.Id, Code: value, ProductDescriptionFk: entity.ProductDescriptionFk };

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/isuniquecode', postData).then(function (response) {
					//Interprete result.
					var res = {};
					if (response.data) {
						res = { apply: true, valid: true, error: '' };
					} else {
						res.valid = false;
						res.apply = true;
						res.error = '...';
						res.error$tr$ = 'productionplanning.common.errors.uniqCode';
					}

					//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

					//Provide result to grid / form container.
					return res;
				});

				return asyncMarker.myPromise;
			};

			service.validateProductDescriptionFk = function (entity, value, model) {
				return service.validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			};

			service.validateProdPlaceFk = function (entity, value, model) {
				value = checkValue(value);

				let res = platformDataValidationService.createSuccessObject();
				if (platformDataValidationService.isEmptyProp(value)) {
					res = platformDataValidationService.createErrorObject(moduleName + '.product.requireProdPlaces', {object: model.toLowerCase()});
				}

				return platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
			};

			service.validateLgmJobFk = function (entity, value, model) {
				return service.validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			};

			service.validateItemFk = function (entity, value, model) {
				return service.validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			};

			/*
			 service.validateNumber = function (entity, value, model) {
			 return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			 };
			 */

			service.validateForeignKeyFieldMandatory = function (entity, value, model, service, dataService, invalidValues) {
				value = checkValue(value, invalidValues);
				//validate mandatory of value
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateInstallSequence = function (entity, value, model){
				let res = {apply: true, valid: true, error: ''};
				if(value === 0){
					entity.InstallSequence = value = null;
					res.apply = false;
				}
				return platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
			}

			function checkValue(value, invalidValues) {
				// check if value is invalid
				var invalidValueArray = [0]; // generally, we set value 0 as the invalid value for foreign key field
				if (invalidValues) {
					invalidValueArray = invalidValues;
				}
				if (invalidValueArray.indexOf(value) > -1) {
					value = null;
				}
				return value;
			}

			const productEventServiceConfig = {
				filterKey: 'ItemFk',
				eventProperty: 'EventTypeFk',
				dateshiftId: 'productContainer',
				virtualDataServiceConfig: {}
			};

			var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
			customColumnsService.addValidations(service, dataService, eventModuleName, 'productionplanning/common/product/geteventslotvalue', productEventServiceConfig);

			ppsCommonTransportInfoHelperService.addValidations(dataService, service);

			return service;
		}

		mainService.getNewEntityValidator = function (dataService, eventModuleName) {
			var validator = mainService[dataService.getServiceName()];
			if (!validator) {
				init(dataService, eventModuleName);
			}
			return mainService[dataService.getServiceName()].newEntityValidator;
		};

		mainService.getValidationService = function (dataService, eventModuleName) {
			var validator = mainService[dataService.getServiceName()];
			if (!validator) {
				init(dataService, eventModuleName);
			}
			if (validator && validator.eventModuleName !== eventModuleName) {
				init(dataService, eventModuleName);
			}
			return mainService[dataService.getServiceName()].validationService;
		};

		return mainService;
	}
})(angular);
