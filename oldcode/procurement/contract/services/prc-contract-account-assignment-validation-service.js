/**
 * Created by jhe on 8/8/2018.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.contract';
	/**
	 * @ngdoc service
	 * @name procurementContractMandatoryDeadlineValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('procurementContractAccountAssignmentValidationService', ProcurementContractAccountAssignmentValidationService);

	ProcurementContractAccountAssignmentValidationService.$inject = ['platformDataValidationService', 'platformRuntimeDataService', '$translate', '$q', 'math', 'basicsLookupdataLookupDescriptorService'];

	function ProcurementContractAccountAssignmentValidationService(platformDataValidationService, platformRuntimeDataService, $translate, $q, math, basicsLookupdataLookupDescriptorService) {
		return function (dataService) {
			var service = {};

			service.validatePsdScheduleFk = function (entity, value/* , model */) {
				// if click clear button ,then should reset Activity to null
				// if selected another Schedule then should be reset Activity to null
				if (!value || entity.PsdScheduleFk !== value) {
					entity.PsdActivityFk = null;
					entity.PsdScheduleFk = value;
				}
				dataService.updateFieldsReadOnly(entity, 'PsdActivityFk');
				dataService.fireItemModified(entity);
				return {apply: true, valid: true};
			};

			service.validatePsdActivityFk = function (entity, value, model) {
				var result = platformDataValidationService.validateIsUnique(entity, value, model, dataService.getList(), service, dataService);
				if (!result.valid) {
					result.error$tr$param$ = {object: $translate.instant('procurement.contract.EntityPsdActivityFk')};
				}
				return result;
			};

			service.validateBasAccAssignAccTypeFk = function validateBasAccAssignAccTypeFk(entity, value) {
				var basAccassignAccTypeEntity = _.find(basicsLookupdataLookupDescriptorService.getData('BasAccassignAccType'), {Id: value});
				if (basAccassignAccTypeEntity) {
					var is2Fields = basAccassignAccTypeEntity.Is2Fields;
					platformRuntimeDataService.readonly(entity, [{field: 'AccountAssignment01', readonly: is2Fields}]);
					platformRuntimeDataService.readonly(entity, [{field: 'AccountAssignment02', readonly: !is2Fields}]);
					platformRuntimeDataService.readonly(entity, [{field: 'AccountAssignment03', readonly: !is2Fields}]);
				} else {
					platformRuntimeDataService.readonly(entity, [{field: 'AccountAssignment01', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'AccountAssignment02', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'AccountAssignment03', readonly: true}]);
				}
				return true;
			};

			service.validateBreakdownPercent = function (entity, value/* , model */) {
				var isValueChange;
				isValueChange = entity.BreakdownPercent !== value;

				if (isValueChange) {
					entity.BreakdownPercent = value;
					entity.BreakdownAmount = math.round(dataService.contractData.currentContractTotalNet / 100 * value, 2);
					entity.BreakdownAmountOc = math.round(dataService.contractData.currentContractTotalNetOc / 100 * value, 2);
				}

				var allItems = dataService.getList();
				var totalPercent = _.sumBy(allItems, function (item) {
					return item.BreakdownPercent;
				});
				var totalAmount = _.sumBy(allItems, function (item) {
					return item.BreakdownAmount;
				});
				var totalAmountOc = _.sumBy(allItems, function (item) {
					return item.BreakdownAmountOc;
				});

				dataService.fireBreakdownPercentOrBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.fireItemModified(entity);

				var result = {apply: true, valid: true};
				if (totalPercent === 100) {
					service.allValidateBreakdownPercent(true);
				} else {
					service.allValidateBreakdownPercent(false);
					result = {
						apply: true,
						error: $translate.instant('procurement.contract.AccountAssignmentBreakdownPercentError'),
						valid: false
					};
				}

				// platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.gridRefresh();

				return result;
			};

			service.validateBreakdownAmount = function (entity, value, model) {
				if (dataService.contractData.currentContractTotalNet === 0) {
					entity.BreakdownPercent = 0;
					entity.BreakdownAmount = value;
				} else {
					entity.BreakdownPercent = math.round(value / dataService.contractData.currentContractTotalNet * 100, 2);
					entity.BreakdownAmount = value;
					entity.BreakdownAmountOc = math.round(dataService.contractData.currentContractTotalNetOc * entity.BreakdownPercent / 100, 2);
				}

				var allItems = dataService.getList();
				var totalPercent = _.sumBy(allItems, function (item) {
					return item.BreakdownPercent;
				});
				var totalAmount = _.sumBy(allItems, function (item) {
					return item.BreakdownAmount;
				});
				var totalAmountOc = _.sumBy(allItems, function (item) {
					return item.BreakdownAmountOc;
				});

				dataService.fireBreakdownPercentOrBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.fireItemModified(entity);

				var result = {apply: true, valid: true};
				if (totalPercent === 100) {
					service.allValidateBreakdownPercent(true);
				} else {
					service.allValidateBreakdownPercent(false);
				}

				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.gridRefresh();

				return result;
			};

			service.validateBreakdownAmountOc = function (entity, value, model) {
				if (dataService.contractData.currentContractTotalNetOc === 0) {
					entity.BreakdownPercent = 0;
					entity.BreakdownAmountOc = value;
				} else {
					entity.BreakdownPercent = math.round(value / dataService.contractData.currentContractTotalNetOc * 100, 2);
					entity.BreakdownAmountOc = value;
					entity.BreakdownAmount = math.round(dataService.contractData.currentContractTotalNet * entity.BreakdownPercent / 100, 2);
				}

				var allItems = dataService.getList();
				var totalPercent = _.sumBy(allItems, function (item) {
					return item.BreakdownPercent;
				});
				var totalAmount = _.sumBy(allItems, function (item) {
					return item.BreakdownAmount;
				});
				var totalAmountOc = _.sumBy(allItems, function (item) {
					return item.BreakdownAmountOc;
				});

				dataService.fireBreakdownPercentOrBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.fireItemModified(entity);

				var result = {apply: true, valid: true};
				if (totalPercent === 100) {
					service.allValidateBreakdownPercent(true);
				} else {
					service.allValidateBreakdownPercent(false);
				}

				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.gridRefresh();

				return result;
			};

			var sortId;
			service.validateItemNO = function (entity, value, model) {
				var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, dataService.getList(), service, dataService);
				if (result && result.valid === true) {
					entity.ItemNO = value;
					var list = dataService.getList();
					if (list && list.length > 0) {
						list.sort(sortId);
						dataService.gridRefresh();
					}
				}
				return result;
			};

			service.allValidateBreakdownPercent = function allValidateBreakdownPercent(apply) {
				var result = {apply: true, valid: true};
				if (!apply) {
					result = {
						apply: true,
						error: $translate.instant('procurement.contract.AccountAssignmentBreakdownPercentError'),
						valid: false
					};
				}
				_.each(dataService.getList(), function (item) {
					platformRuntimeDataService.applyValidationResult(result, item, 'BreakdownPercent');
					// platformDataValidationService.finishValidation(result, item, item.BreakdownPercent, 'BreakdownPercent', service, dataService);
				});
			};

			sortId = function (a, b) {
				return a.ItemNO - b.ItemNO;
			};

			service.asyncValidateMdcControllingUnitFk = function (entity, value, model) {

				var defer = $q.defer();
				/* var result = {
                    apply: true,
                    valid: true
                }; */
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				if (null === value) {
					defer.resolve(true);
				} else {
					/* var ProjectFk = entity.ProjectFk;
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
                    }); */
					defer.resolve(true);
					asyncMarker.myPromise = defer.promise;
				}
				asyncMarker.myPromise = defer.promise.then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
				});
				return asyncMarker.myPromise;
			};

			return service;
		};
	}

})(angular);