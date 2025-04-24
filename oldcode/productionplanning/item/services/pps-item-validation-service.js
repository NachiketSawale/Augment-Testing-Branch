/**
 * Created by anl on 5/3/2017.
 */
/* global globals */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name ppsItemValidationService
	 * @description provides validation methods for PPSitem
	 */

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemValidationService', PPSItemValidationService);

	PPSItemValidationService.$inject = ['$http', '$injector', 'platformDataValidationService', 'productionplanningItemDataService',
		'$q', '$translate', 'ppsCommonCustomColumnsServiceFactory', 'platformRuntimeDataService'];

	function PPSItemValidationService($http, $injector, platformDataValidationService, itemDataService,
									  $q, $translate, customColumnsServiceFactory, platformRuntimeDataService) {
		var service = {};


		service.validateIsLive = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, itemDataService);
		};

		service.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, itemDataService);
		};

		service.asyncValidateCode = function (entity, value, field) {

			//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, itemDataService);
			//Now the data service knows there is an outstanding asynchronous request.

			var projectId = entity.ProjectFk; //itemDataService.getProjectID();
			if (!projectId) {
				asyncMarker.myPromise = $q.when({apply: true, valid: true, error: ''});
			} else {
				var postData = {Id: entity.Id, Code: value, ProjectId: projectId};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/item/isuniquecode',
				  postData).then(function (response) {
					//Interprete result.
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = 'The Code should be unique';
						res.error$tr$ = 'productionplanning.item.validation.errors.uniqCode';
					}

					//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, itemDataService);

					//Provide result to grid / form container.
					return res;
				});
			}

			return asyncMarker.myPromise;
		};

		service.validateClerkTecFk = function (entity, value, model) {
			return service.validateForeignKeyFieldMandatory(entity, value, model, service, itemDataService);
		};

		service.validateSiteFk = function (entity, value, model) {
			return service.validateForeignKeyFieldMandatory(entity, value, model, service, itemDataService);
		};

		service.validatePPSItemStatusFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, itemDataService);
		};

		service.validateMaterialGroupFk = function (entity, value, model) {
			return service.validateForeignKeyFieldMandatory(entity, value, model, service, itemDataService);
		};

		service.asyncValidateMaterialGroupFk = function (entity, value, model) {
			var defer = $q.defer();
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, itemDataService);

			asyncMarker.myPromise = defer.promise.then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, itemDataService);
			});

			if (value < 0) {
				defer.resolve({
					apply: true,
					valid: false,
					error: $translate.instant('basics.material.error.materialGroupSelectError')
				});
				return asyncMarker.myPromise;
			}

			defer.resolve({
				apply: true, valid: true
			});

			return asyncMarker.myPromise;
		};

		service.validateUomFk = function (entity, value, model) {
			if (value === 0) {
				return service.validateForeignKeyFieldMandatory(entity, 1, model, service, itemDataService);
			}
			return service.validateForeignKeyFieldMandatory(entity, value, model, service, itemDataService);
		};

		service.validateLgmJobFk = function (entity, value, model) {
			return service.validateForeignKeyFieldMandatory(entity, value, model, service, itemDataService);
		};

		service.validateForeignKeyFieldMandatory = function (entity, value, model, service, itemDataService, invalidValues) {
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
		};

		service.validateProductDescriptionCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, itemDataService);
		};

		service.asyncValidateProductDescriptionCode = function (entity, value, model) {
			const defer = $q.defer();
			let result = {apply: true, valid: true, error: ''};

			const productTemplate = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('PPSProductDescriptionTiny', entity.ProductDescriptionFk);

			if (productTemplate && productTemplate.EngDrawingFk) {
				const url = globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/isuniquecode?id=' +
				  productTemplate.Id + '&&parentid=' + productTemplate.EngDrawingFk + '&&code=' + value;
				$http.get(url).then(function (response) {
					if (!response.data) {
						result.valid = false;
						result.apply = true;
						result.error = '...';
						result.error$tr$ = 'productionplanning.producttemplate.errors.uniqProductDescriptionCode';
					}
					defer.resolve(result);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, itemDataService);
				});
			} else {
				defer.resolve(result);
			}
			return defer.promise;
		};

		service.asyncValidateNewProductTemplateCode = function (entity, value, model, productTemplate) {
			let result = {apply: true, valid: true, error: ''};
			const url = globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/isuniquecode?id=' +
			  productTemplate.Id + '&&parentid=' + productTemplate.EngDrawingFk + '&&code=' + value;
			$http.get(url).then(function (response) {
				if (!response.data) {
					result.valid = false;
					result.apply = true;
					result.error = '...';
					result.error$tr$ = 'productionplanning.producttemplate.errors.uniqProductDescriptionCode';
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, itemDataService);
				itemDataService.markItemAsModified(entity);
				$injector.get('productionplanningItemSubItemDataService').gridRefresh();
			});
		};

		// register to masterDataServiceaddValidations
		// var eventValidationService = $injector.get('productionplanningCommonEventValidationService').getValidationService(itemDataService, 'productionplanning.common');
		// var masterDataServiceConfig = ppsMasterDataConfigurations.get('Event', {
		// 	parentService: itemDataService,
		// 	validation: {
		// 		service: eventValidationService, //service,
		// 		properties: ['PlannedStart', 'PlannedFinish']
		// 	},
		// 	matchConfig: {
		// 		'Id': 'PpsEventFk'
		// 	}
		// });

		var eventServiceConfig = {
			filterKey: 'ItemFk',
			eventProperty: 'EventTypeFk',
			dateshiftId: 'itemContainer',
			virtualDataServiceConfig: {} //masterDataServiceConfig
		};
		var customColumnsService = customColumnsServiceFactory.getService(moduleName);
		customColumnsService.addValidations(service, itemDataService, 'productionplanning.common.item.event', 'productionplanning/item/geteventslotvalue', eventServiceConfig);
		customColumnsService.addValidations(service, $injector.get('productionplanningItemSubItemDataService'), 'productionplanning.common.item.event', 'productionplanning/item/geteventslotvalue', eventServiceConfig);

		customColumnsService.addValidationsOfClerkRoleSlotColumns(service, itemDataService); // for HP-ALM #128338  by zwz 2022/4/22

		return service;
	}

})(angular);
