/**
 * Created by lnb on 1/28/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for prcItem
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonPrcBoqValidationService',
		['$q', '$http', 'platformRuntimeDataService', '$translate', 'platformDataValidationService', 'procurementContextService', function ($q, $http, platformRuntimeDataService, $translate, platformDataValidationService, moduleContext) {
			return function (dataService) {
				var service = {};
				var isPackage;

				var isAsyncUnique = function isAsyncUnique(entity, value) {
					var defer = $q.defer();
					if(value){
						var httpRoute = globals.webApiBaseUrl + 'procurement/common/boq/isunique';

						var id = entity.Id || 0;
						$http.get(httpRoute + '?id=' + id +'&&prcHeaderFk='+entity.PrcBoq.PrcHeaderFk+'&&reference=' + value + '&&isPackage='+ isPackage + '&&packageFk='+entity.PrcBoq.PackageFk).then(function (result) {
							if (!result.data) {
								defer.resolve( platformDataValidationService.createErrorObject('procurement.common.boq.PrcBoqReferenceUniqueError'));
							} else {
								defer.resolve(true);
							}
						});
					}else{
						defer.resolve( platformDataValidationService.createErrorObject('procurement.common.boq.PrcBoqReferenceUniqueError'));
					}
					return defer.promise;
				};

				isPackage = moduleContext.getMainService().name === 'procurement.package';

				service.validatePackage2HeaderFk = function validatePackage2HeaderFk(entity, value){
					var result = !!value || isPackage;
					if(!result) {
						result = platformDataValidationService.createErrorObject('procurement.common.noPackage2HeaderSelectedInfo');
					}
					platformRuntimeDataService.applyValidationResult(result, entity, 'Package2HeaderFk');
					return result;
				};

				service.validatePrcBoq$PackageFk = function validatePackageFk(entity, value) {
					if (!value && !isPackage) {
						if(Object.prototype.hasOwnProperty.call(entity,'PrcHeaderFkOriginal')){
							entity.PrcHeaderFkOriginal = 0;
						}
						return {valid: false, error: 'required'};
					}
					return true;
				};



				service.asyncValidateBoqRootItem$Reference = function asyncValidateBoqRootItem$Reference(entity, value){
					// if don't select a sub package, it don't need validate
					if(!isPackage && entity.PrcHeaderFkOriginal === 0){
						var defer = $q.defer();
						defer.resolve(true);
						return defer.promise;
					}
					var result = isAsyncUnique(entity, value);
					dataService.fireItemModified(entity);
					return result;
				};

				service.asyncValidatePrcBoq$MdcControllingunitFk = function (entity, value, model) {

					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (_.isNil(value)) {
						defer.resolve(true);
					}
					else {
						if (dataService.parentDataService.getModule().name === 'procurement.pes' || dataService.parentDataService.getModule().name === 'procurement.invoice') {
							var ProjectFk = entity.ProjectFk;
							$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
								if (response.data) {
									result = {
										apply: true,
										valid: false,
										error: $translate.instant('basics.common.error.controllingUnitError')
									};
									platformRuntimeDataService.applyValidationResult(result, entity, model);
									defer.resolve(result);
								}
								else {
									defer.resolve(true);
								}
							});
						}
						else {
							defer.resolve(true);
						}
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				// TODO The new created item validation should placed in base services
				var updateValidation = function (data,newItem) {
					var selected = newItem || dataService.getSelected();
					if(!selected){
						return;
					}
					var result = service.validatePrcBoq$PackageFk.call(service, selected, selected.PrcBoq&&selected.PrcBoq.PackageFk);
					platformRuntimeDataService.applyValidationResult(result, selected, 'PrcBoq.PackageFk');
					dataService.gridRefresh();
				};

				dataService.registerEntityCreated(updateValidation);

				return service;
			};
		}]);
})(angular);