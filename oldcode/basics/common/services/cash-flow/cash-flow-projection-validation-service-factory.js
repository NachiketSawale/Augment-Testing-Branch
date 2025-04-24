/**
 * Created by lta on 12/14/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonCashFlowValidationServiceFactory', ['validationService',
		'$translate', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
		'platformDataValidationService', '_',
		function (validationService, $translate, platformRuntimeDataService, basicsLookupdataLookupDescriptorService,
			platformDataValidationService, _) {
			return {
				create: function (dataService) {
					return {
						'validateCumCost': validateCumCost,
						'validatePeriodCost': validatePeriodCost,
						'validateCumCash': validateCumCash,
						'validatePeriodCash': validatePeriodCash
					};

					function validateCumCost(entity, value, model) {
						let isAmong;
						const list = dataService.getList().sort(function (a, b) {
							return a.PercentOfTime - b.PercentOfTime;
						});
						const parentItem = dataService.parentService().getSelected();
						const currentCashProjection = basicsLookupdataLookupDescriptorService.getItemByIdSync(parentItem.CashProjectionFk, {lookupType: 'CashProjection'});
						const totalCost = currentCashProjection.TotalCost;

						if (value > totalCost) {
							return createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage', {}, true);
						}

						const index = list.indexOf(entity);
						if (index === 0) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, list[index + 1].CumCost);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							calculateNextRecords(list, entity, value);
						}
						if (index > 0 && index < list.length - 1) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, list[index - 1].CumCost, list[index + 1].CumCost);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							calculateNextRecords(list, entity, value);
						}
						if (index === list.length - 1) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, list[index - 1].CumCost, totalCost);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.CumCost = value;
							entity.PeriodCost = value - list[index - 1].CumCost;
						}

						dataService.gridRefresh();
						dataService.onDataRefresh.fire();

						return true;
					}

					function validatePeriodCost(entity, value, model) {
						let isAmong;
						const list = dataService.getList().sort(function (a, b) {
							return a.PercentOfTime - b.PercentOfTime;
						});
						const parentItem = dataService.parentService().getSelected();
						const currentCashProjection = basicsLookupdataLookupDescriptorService.getItemByIdSync(parentItem.CashProjectionFk, {lookupType: 'CashProjection'});
						const totalCost = currentCashProjection.TotalCost;

						if (value > totalCost) {
							return createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage', {}, true);
						}

						if (list.length === 1) {
							entity.CumCost = value;
							entity.PeriodCost = value;
							return true;
						}

						const index = list.indexOf(entity);
						if (index === 0) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, list[index + 1].CumCost);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.CumCost = value;
							entity.PeriodCost = value;
							list[0].CumCost = list[0].PeriodCost = value;
							for (let i = index + 1; i < list.length; i++) {
								list[i].PeriodCost = list[i].CumCost - list[i - 1].CumCost;
								dataService.markItemAsModified(list[i]);
							}
						}

						if (index > 0 && index < list.length - 1) {
							const maxValueOfPeriod = list[index + 1].CumCost - list[index - 1].CumCost;
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, maxValueOfPeriod);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.PeriodCost = value;
							entity.CumCost = list[index - 1].CumCost + value;
							for (let i = index; i < list.length; i++) {
								list[i].PeriodCost = list[i].CumCost - list[i - 1].CumCost;
								dataService.markItemAsModified(list[i]);
							}
						}

						if (index === list.length - 1) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, totalCost - list[index - 1].CumCost);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.PeriodCost = value;
							entity.CumCost = list[index - 1].CumCost + value;
						}
						dataService.gridRefresh();
						dataService.onDataRefresh.fire();
						return true;
					}

					function validateCumCash(entity, value, model) {
						let isAmong;
						const list = dataService.getList().sort(function (a, b) {
							return a.PercentOfTime - b.PercentOfTime;
						});
						const parentItem = dataService.parentService().getSelected();
						const currentCashProjection = basicsLookupdataLookupDescriptorService.getItemByIdSync(parentItem.CashProjectionFk, {lookupType: 'CashProjection'});
						const totalCost = currentCashProjection.TotalCost;

						if (value > totalCost) {
							return createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage', {}, true);
						}

						if (list.length === 1) {
							entity.CumCost = value;
							entity.PeriodCost = value;
							return true;
						}

						const index = list.indexOf(entity);
						if (index === 0) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, list[index + 1].CumCash);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.CumCash = value;
							entity.PeriodCash = value;
							for (let i = index + 1; i < list.length; i++) {
								list[i].PeriodCash = list[i].CumCash - list[i - 1].CumCash;
								dataService.markItemAsModified(list[i]);
							}
						}

						if (index > 0 && index < list.length - 1) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, list[index - 1].CumCash, list[index + 1].CumCash);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.CumCash = value;
							entity.PeriodCash = list[index].CumCash - list[index - 1].CumCash;
							for (let i = index + 1; i < list.length; i++) {
								list[i].PeriodCash = list[i].CumCash - list[i - 1].CumCash;
								dataService.markItemAsModified(list[i]);
							}
						}

						if (index === list.length - 1) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, list[index - 1].CumCost, totalCost);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.CumCash = value;
							entity.PeriodCash = list[index].CumCash - list[index - 1].CumCash;
							dataService.markItemAsModified(entity);
						}

						dataService.gridRefresh();
						dataService.onDataRefresh.fire();
						return true;
					}

					function validatePeriodCash(entity, value, model) {
						let isAmong;
						const list = dataService.getList().sort(function (a, b) {
							return a.PercentOfTime - b.PercentOfTime;
						});
						const parentItem = dataService.parentService().getSelected();
						const currentCashProjection = basicsLookupdataLookupDescriptorService.getItemByIdSync(parentItem.CashProjectionFk, {lookupType: 'CashProjection'});
						const totalCost = currentCashProjection.TotalCost;

						if (value > totalCost) {
							return createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage', {}, true);
						}

						if (list.length === 1) {
							entity.CumCash = value;
							entity.PeriodCash = value;
							return true;
						}

						const index = list.indexOf(entity);
						if (index === 0) {
							const firstCash = _.find(list, function (item) {
								return item.CumCash > 0;
							});
							const cashIndex = list.indexOf(firstCash);
							const nextCash = cashIndex === 0 ? list[cashIndex + 1] : firstCash;
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, nextCash.CumCash);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.CumCash = value;
							entity.PeriodCash = value;

							for (let i = index + 1; i < list.length; i++) {
								if (i < cashIndex) {
									list[i].PeriodCash = value;
									list[i].CumCash = value;
									dataService.markItemAsModified(list[i]);
									continue;
								}
								list[i].PeriodCash = list[i].CumCash - list[i - 1].CumCash;
								dataService.markItemAsModified(list[i]);
							}
						}

						if (index > 0 && index < list.length - 1) {
							const maxValueOfPeriod = list[index + 1].CumCash - list[index - 1].CumCash;
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, maxValueOfPeriod);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.PeriodCash = value;
							entity.CumCash = list[index - 1].CumCash + value;
							for (let i = index + 1; i < list.length; i++) {
								list[i].PeriodCash = list[i].CumCash - list[i - 1].CumCash;
								dataService.markItemAsModified(list[i]);
							}
						}

						if (index === list.length - 1) {
							isAmong = platformDataValidationService.isAmong(entity, value, model, 0, totalCost - list[index - 1].CumCash);
							if (angular.isObject(isAmong)) {
								return isAmong;
							}
							entity.PeriodCash = value;
							entity.CumCash = list[index - 1].CumCash + value;
						}
						dataService.gridRefresh();
						dataService.onDataRefresh.fire();
						return true;
					}

					function calculateNextRecords(dataList, entity, currentCumCost) {
						const index = dataList.indexOf(entity);

						if (dataList.length === 1) {
							entity.CumCost = currentCumCost;
							entity.PeriodCost = currentCumCost;
							return true;
						}
						if (index === 0) {
							dataList[0].CumCost = dataList[0].PeriodCost = currentCumCost;
							for (let i = index + 1; i < dataList.length; i++) {
								dataList[i].PeriodCost = dataList[i].CumCost - dataList[i - 1].CumCost;
							}
						}

						if (index > 0 && index < dataList.length - 1) {
							dataList[index].CumCost = currentCumCost;
							for (let i = index; i < dataList.length; i++) {
								dataList[i].PeriodCost = dataList[i].CumCost - dataList[i - 1].CumCost;
								dataService.markItemAsModified(dataList[i]);
							}
						}
					}

					function createErrorObject(transMsg, errorParam) {
						return {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: transMsg,
							error$tr$param$: errorParam
						};
					}
				}
			};
		}
	]);

})(angular);