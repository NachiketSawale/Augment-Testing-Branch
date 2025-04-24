(function (angular) {
	'use strict';
	/* global _,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonGeneralsValidationService',
		['$http', 'platformDataValidationService', '$translate', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', 'procurementContextService', 'platformRuntimeDataService','$q',
			function ($http, platformDataValidationService, $translate, lookupService, basicsLookupdataLookupDescriptorService, moduleContext, platformRuntimeDataService,$q) {

				return function (dataService) {
					var service = {};

					// load lookup items, and cache in front end.
					basicsLookupdataLookupDescriptorService.loadData(['PrcGeneralsType']);
					// validators
					service.validatePrcGeneralstypeFk = function validatePrcGeneralstypeFk(entity, value, model) {
						var isValid = platformDataValidationService.isUnique(dataService.getList(), 'PrcGeneralstypeFk', value, entity.Id);
						if (isValid.valid) {
							var PrcHeader = dataService.parentService().getSelected();
							var data = _.find(basicsLookupdataLookupDescriptorService.getData('PrcGeneralsType'), {Id: value});
							if (angular.isObject(data)) {
								entity.IsCost = data.IsCost;
								entity.ValueType = data.IsPercent ? 1: 0;
								if (!data.IsCost) {
									entity.ControllingUnitFk = null;
									entity.TaxCodeFk = null;
								}
							}
							if(PrcHeader !== undefined && PrcHeader !== null){
								var url = globals.webApiBaseUrl + 'procurement/common/prcgenerals/prjgeneralvalue';
								var projectFk = PrcHeader.ProjectFk || moduleContext.loginProject;
								if(projectFk) {
									url += '?GeneralsTypeFk=' + value + '&ProjectFk=' + projectFk;
									$http.get(url).then(
										function (response) {
											var value = response.data;
											if (angular.isNumber(value) && value > 0) {
												entity.Value = value;
												dataService.fireItemModified(entity);
											}
										}
									);
								}
							}

							if (angular.isFunction(dataService.updateReadOnly)) {
								dataService.updateReadOnly(entity, 'ControllingUnitFk', entity.IsCost);
								dataService.updateReadOnly(entity, 'TaxCodeFk', entity.IsCost);
								dataService.updateReadOnly(entity, 'Value', value);
							}
							dataService.fireItemModified(entity);
						}
						if (!isValid.valid){// TODO, platformDataValidationService.isUnique have some issue
							isValid.error$tr$param$ = { object: 'generals type'};
						}

						platformRuntimeDataService.applyValidationResult(isValid, entity, model);
						platformDataValidationService.finishValidation(isValid, entity, value, model, service, dataService);
						return isValid;
					};

					service.validateEntity = function (entity) {
						service.validatePrcGeneralstypeFk(entity, entity.PrcGeneralstypeFk, 'PrcGeneralstypeFk');
					};

					service.asyncValidateControllingUnitFk = function (entity, value, model) {

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
							if (dataService.getModule().name === 'procurement.pes' || dataService.getModule().name === 'procurement.invoice') {
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
					// noinspection JSUnusedLocalSymbols
					function onEntityCreated(e, item) {
						service.validateEntity(item);
					}

					dataService.registerEntityCreated(onEntityCreated);

					return service;
				};
			}
		]);
})(angular);