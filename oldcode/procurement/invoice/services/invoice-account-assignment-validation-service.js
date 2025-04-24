/**
 * Created by jhe on 8/29/2018.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.invoice';
	angular.module(moduleName).service('procurementInvoiceAccountAssignmentValidationService', ProcurementInvoiceAccountAssignmentValidationService);

	ProcurementInvoiceAccountAssignmentValidationService.$inject = ['platformDataValidationService', 'platformRuntimeDataService', '$translate', '$q', '$http', 'math', 'basicsLookupdataLookupDescriptorService'];

	function ProcurementInvoiceAccountAssignmentValidationService(platformDataValidationService, platformRuntimeDataService, $translate, $q, $http, math, basicsLookupdataLookupDescriptorService) {
		return function (dataService) {
			var service = {};

			service.validateInvBreakdownPercent = function (entity, value/* , model */) {
				var isValueChange;
				isValueChange = entity.InvBreakdownPercent !== value;

				if (isValueChange) {
					entity.InvBreakdownPercent = value;
					entity.InvBreakdownAmount = math.round(dataService.contractData.invoiceTotalNet / 100 * value, 2);
					entity.InvBreakdownAmountOc = math.round(dataService.contractData.invoiceTotalNetOc / 100 * value, 2);
				}

				var allItems = dataService.getList();
				var totalPercent = _.sumBy(allItems, function (item) {
					return item.InvBreakdownPercent;
				});
				var totalAmount = _.sumBy(allItems, function (item) {
					return item.InvBreakdownAmount;
				});
				var totalAmountOc = _.sumBy(allItems, function (item) {
					return item.InvBreakdownAmountOc;
				});

				dataService.fireInvoiceBreakdownPercentOrInvoiceBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.fireItemModified(entity);

				var result = {apply: true, valid: true};
				if (totalPercent === 100) {
					service.allValidateInvoiceBreakdownPercent(true);
				} else {
					service.allValidateInvoiceBreakdownPercent(false);
					result = {
						apply: true,
						error: $translate.instant('procurement.invoice.AccountAssignmentInvoiceBreakdownPercentError'),
						valid: false
					};
				}

				// platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.gridRefresh();

				return result;
			};

			service.validateInvBreakdownAmount = function (entity, value, model) {
				if (dataService.contractData.invoiceTotalNet === 0) {
					entity.InvBreakdownPercent = 0;
					entity.InvBreakdownAmount = value;
				} else {
					entity.InvBreakdownPercent = math.round(value / dataService.contractData.invoiceTotalNet * 100, 2);
					entity.InvBreakdownAmount = value;
					entity.InvBreakdownAmountOc = math.round(dataService.contractData.invoiceTotalNetOc * entity.InvBreakdownPercent / 100, 2);
				}

				var allItems = dataService.getList();
				var totalPercent = _.sumBy(allItems, function (item) {
					return item.InvBreakdownPercent;
				});
				var totalAmount = _.sumBy(allItems, function (item) {
					return item.InvBreakdownAmount;
				});
				var totalAmountOc = _.sumBy(allItems, function (item) {
					return item.InvBreakdownAmountOc;
				});

				dataService.fireInvoiceBreakdownPercentOrInvoiceBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.fireItemModified(entity);

				var result = {apply: true, valid: true};
				if (totalPercent === 100) {
					service.allValidateInvoiceBreakdownPercent(true);
				} else {
					service.allValidateInvoiceBreakdownPercent(false);
				}

				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.gridRefresh();

				return result;
			};

			service.validateInvBreakdownAmountOc = function (entity, value, model) {
				if (dataService.contractData.invoiceTotalNetOc === 0) {
					entity.InvBreakdownPercent = 0;
					entity.InvBreakdownAmountOc = value;
				} else {
					entity.InvBreakdownPercent = math.round(value / dataService.contractData.invoiceTotalNetOc * 100, 2);
					entity.InvBreakdownAmountOc = value;
					entity.InvBreakdownAmount = math.round(dataService.contractData.invoiceTotalNet * entity.InvBreakdownPercent / 100, 2);
				}

				var allItems = dataService.getList();
				var totalPercent = _.sumBy(allItems, function (item) {
					return item.InvBreakdownPercent;
				});
				var totalAmount = _.sumBy(allItems, function (item) {
					return item.InvBreakdownAmount;
				});
				var totalAmountOc = _.sumBy(allItems, function (item) {
					return item.InvBreakdownAmountOc;
				});

				dataService.fireInvoiceBreakdownPercentOrInvoiceBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.fireItemModified(entity);

				var result = {apply: true, valid: true};
				if (totalPercent === 100) {
					service.allValidateInvoiceBreakdownPercent(true);
				} else {
					service.allValidateInvoiceBreakdownPercent(false);
				}

				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.gridRefresh();

				return result;
			};

			service.validateBreakdownPercent = function (entity, value/* , model */) {
				var isValueChange;
				isValueChange = entity.BreakdownPercent !== value;

				if (isValueChange) {
					entity.BreakdownPercent = value;
					entity.BreakdownAmount = math.round(dataService.contractData.conTotalNet / 100 * value, 2);
					entity.BreakdownAmountOc = math.round(dataService.contractData.conTotalNetOc / 100 * value, 2);
					entity.PreviousInvoiceAmount = math.round(dataService.contractData.previousInvoiceNet / 100 * value, 2);
					entity.PreviousInvoiceAmountOc = math.round(dataService.contractData.previousInvoiceNetOc / 100 * value, 2);
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
				var totalPreviousInvoiceAmount = _.sumBy(allItems, function (item) {
					return item.PreviousInvoiceAmount;
				});
				var totalPreviousInvoiceAmountOc = _.sumBy(allItems, function (item) {
					return item.PreviousInvoiceAmountOc;
				});

				dataService.fireBreakdownPercentOrBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.firePreviousInvoiceBreakdownPercentOrPreviousInvoiceBreakdownAmountChange(totalPreviousInvoiceAmount, totalPreviousInvoiceAmountOc);
				dataService.fireItemModified(entity);

				var result = {apply: true, valid: true};
				if (totalPercent === 100) {
					service.allValidateBreakdownPercent(true);
				} else {
					service.allValidateBreakdownPercent(false);
					result = {
						apply: true,
						error: $translate.instant('procurement.invoice.AccountAssignmentBreakdownPercentError'),
						valid: false
					};
				}

				// platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.gridRefresh();

				return result;
			};

			service.validateBreakdownAmount = function (entity, value, model) {
				if (dataService.contractData.conTotalNet === 0) {
					entity.BreakdownPercent = 0;
					entity.BreakdownAmount = value;
				} else {
					entity.BreakdownPercent = math.round(value / dataService.contractData.conTotalNet * 100, 2);
					entity.BreakdownAmount = value;
					entity.BreakdownAmountOc = math.round(dataService.contractData.conTotalNetOc * entity.BreakdownPercent / 100, 2);
				}

				entity.PreviousInvoiceAmount = math.round(dataService.contractData.previousInvoiceNet / 100 * entity.BreakdownPercent, 2);
				entity.PreviousInvoiceAmountOc = math.round(dataService.contractData.previousInvoiceNetOc / 100 * entity.BreakdownPercent, 2);

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
				var totalPreviousInvoiceAmount = _.sumBy(allItems, function (item) {
					return item.PreviousInvoiceAmount;
				});
				var totalPreviousInvoiceAmountOc = _.sumBy(allItems, function (item) {
					return item.PreviousInvoiceAmountOc;
				});

				dataService.fireBreakdownPercentOrBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.firePreviousInvoiceBreakdownPercentOrPreviousInvoiceBreakdownAmountChange(totalPreviousInvoiceAmount, totalPreviousInvoiceAmountOc);
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
				if (dataService.contractData.conTotalNetOc === 0) {
					entity.BreakdownPercent = 0;
					entity.BreakdownAmountOc = value;
				} else {
					entity.BreakdownPercent = math.round(value / dataService.contractData.conTotalNetOc * 100, 2);
					entity.BreakdownAmountOc = value;
					entity.BreakdownAmount = math.round(dataService.contractData.conTotalNet * entity.BreakdownPercent / 100, 2);
				}

				entity.PreviousInvoiceAmount = math.round(dataService.contractData.previousInvoiceNet / 100 * entity.BreakdownPercent, 2);
				entity.PreviousInvoiceAmountOc = math.round(dataService.contractData.previousInvoiceNetOc / 100 * entity.BreakdownPercent, 2);

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
				var totalPreviousInvoiceAmount = _.sumBy(allItems, function (item) {
					return item.PreviousInvoiceAmount;
				});
				var totalPreviousInvoiceAmountOc = _.sumBy(allItems, function (item) {
					return item.PreviousInvoiceAmountOc;
				});

				dataService.fireBreakdownPercentOrBreakdownAmountChange(totalPercent, totalAmount, totalAmountOc);
				dataService.firePreviousInvoiceBreakdownPercentOrPreviousInvoiceBreakdownAmountChange(totalPreviousInvoiceAmount, totalPreviousInvoiceAmountOc);
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
				var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, dataService.getList(), service, dataService, 'ItemNO');
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
						error: $translate.instant('procurement.invoice.AccountAssignmentBreakdownPercentError'),
						valid: false
					};
				}
				_.each(dataService.getList(), function (item) {
					platformRuntimeDataService.applyValidationResult(result, item, 'BreakdownPercent');
					// platformDataValidationService.finishValidation(result, item, item.BreakdownPercent, 'BreakdownPercent', service, dataService);
				});
			};

			service.allValidateInvoiceBreakdownPercent = function allValidateInvoiceBreakdownPercent(apply) {
				var result = {apply: true, valid: true};
				if (!apply) {
					result = {
						apply: true,
						error: $translate.instant('procurement.invoice.AccountAssignmentInvoiceBreakdownPercentError'),
						valid: false
					};
				}
				_.each(dataService.getList(), function (item) {
					platformRuntimeDataService.applyValidationResult(result, item, 'InvBreakdownPercent');
					// platformDataValidationService.finishValidation(result, item, item.InvBreakdownPercent, 'InvBreakdownPercent', service, dataService);
				});
			};

			sortId = function (a, b) {
				return a.ItemNO - b.ItemNO;
			};

			service.asyncValidateMdcControllingUnitFk = function (entity, value, model) {

				var defer = $q.defer();
				var result = {
					apply: true,
					valid: true
				};
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				if (null === value) {
					defer.resolve(true);
				} else {
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
						} else {
							defer.resolve(true);
						}
					});
					asyncMarker.myPromise = defer.promise;
				}
				asyncMarker.myPromise = defer.promise.then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
				});
				return asyncMarker.myPromise;
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
			return service;
		};
	}

})(angular);