(function (angular) {
	'use strict';
	/* global globals, angular */
	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningPackageValidationServiceFactory', service);
	service.$inject = ['$http', '$q', 'platformDataValidationService', 'packageTypes'];

	function service($http, $q, platformDataValidationService, packageTypes) {

		function createService(dataService) {
			var service = {};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateQuantity = function (entity, value, model) {
				if (value === null || value === undefined) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				}
				else {
					var remainQty = 999999;
					if (value <= 0 || value > remainQty) {
						var errObj = platformDataValidationService.createErrorObject('transportplanning.package.errors.errorQtyInput', {}, true);
						return platformDataValidationService.finishWithError(errObj, entity, value, model, service, dataService);
					}
					else {
						platformDataValidationService.removeFromErrorList(entity, model, service, dataService);
						return true;
					}
				}
			};

			//Because TransportPackageFk field is disabled , the below code is not be used
			// service.asyncValidateTransportPackageFk = function asyncValidateTransportPackageFk(entity, value, field){
			//
			//     var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, value, dataService);
			//
			//
			//     var postDate = {Id: entity.Id, ParentId: value};
			//
			//     asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'transportplanning/package/iscyclic', postDate).then(function (response){
			//         var result = {};
			//
			//         if(!response.data) //no cyclic
			//         {
			//             result = {apply: true, valid: true, error: ''};
			//         }
			//         else{
			//             result.valid = false;
			//             result.apply = true;
			//             result.error = 'there is a cyclic dependence on package';
			//             result.error$tr$ = 'transportplanning.package.errors.cyclic';
			//         }
			//
			//         platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, dataService);
			//
			//         return result;
			//     });
			//
			//     return asyncMarker.myPromise;
			// };

			service.validateTrsPkgTypeFk = function (entity, value, model) {
				return validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			};


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

			service.asyncValidateGood = function asyncValidateGood(entity, value, field){
				var defer = $q.defer();
			    var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, value, dataService);
				asyncMarker.myPromise = defer.promise;
				var result = null;
				if(entity.TrsPkgTypeFk !== packageTypes.Material)
				{
					result = {
						apply: true,
						valid: true
					};
					defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, dataService));
					return defer.promise;
				}

				$http.get(globals.webApiBaseUrl + 'basics/material/material?id=' + value).then(function (response) {
					if(response && response.data)
					{
						var material = response.data;
						entity.DangerClassFk = material.DangerClassFk;
						entity.DangerQuantity = material.Volume;
						entity.PackageTypeFk = material.PackageTypeFk;
						entity.UomDGFk = material.UomVolumeFk;
						dataService.markItemAsModified(entity);
					}
					result = {
						apply: true,
						valid: true
					};
					defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, service, dataService));
				});

			    return defer.promise;
			};

			return service;
		}

		return {
			createService:createService
		};
	}
})(angular);