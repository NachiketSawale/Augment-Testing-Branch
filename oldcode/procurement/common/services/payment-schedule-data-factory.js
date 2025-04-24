(function () {
	'use strict';

	/* global globals,_, math */
	angular.module('procurement.common').factory('paymentScheduleDataFactory', [
		'procurementCommonDataServiceFactory',
		'basicsLookupdataLookupFilterService',
		'prcCommonCalculationHelper',
		'prcCommonGetVatPercent',
		'PlatformMessenger',
		'basicsCommonMandatoryProcessor',
		'procurementCommonPaymentScheduleValidationService',
		'platformModalService',
		'platformDataServiceFactory',
		'prcGetIsCalculateOverGrossService',
		function (
			dataServiceFactory,
			LookupFilterService,
			prcCommonCalculationHelper,
			prcCommonGetVatPercent,
			platformMessenger,
			basicsCommonMandatoryProcessor,
			procurementCommonPaymentScheduleValidationService,
			platformModalService,
			platformDataServiceFactory,
			prcGetIsCalculateOverGrossService
		) {
			function constructorFn(parentService, serviceInfo, serviceFilters) {

				var moduleName = parentService.getModule().name;
				var area = 'procurement';
				if (moduleName.match('sales')) {
					area = 'sales';
				}

				// service configuration
				var serviceContainer, service, tmpServiceInfo;
				tmpServiceInfo = serviceInfo;

				serviceContainer = area === 'sales' ? platformDataServiceFactory.createNewComplete(tmpServiceInfo) : dataServiceFactory.createNewComplete(tmpServiceInfo, {});
				service = serviceContainer.service;
				var data = serviceContainer.data;
				prcGetIsCalculateOverGrossService.init();

				service.onRecalculated = new platformMessenger();

				service.getServiceContainerData = function getServiceContainerData() {
					return serviceContainer.data;
				};

				service.getPrcHeaderItem = function getPrcHeaderItem() {
					var item;
					if (parentService.name === 'procurement.package') {
						var grandParentService = parentService.parentService();
						item = grandParentService.getSelected();
					} else {
						item = parentService.getSelected();
					}
					return item;
				};

				service.isPackage = function isPackage() {
					return parentService.name === 'procurement.package';
				};

				service.updateScheduleOnProjectChange = function () {
					var list = service.getList();
					angular.forEach(list, function (item) {
						var isSumLine = service.isSumLine(item);
						if (!isSumLine) {
							item.PsdScheduleFk = null;
							item.PsdActivityFk = null;
							item.MeasuredPerformance = 0;
							service.markItemAsModified(item);
							service.updateReadOnly(item);
						}
					});
					service.gridRefresh();
				};

				service.getTotalPercent = function getTotalPercent() {
					var list = service.getList();
					return _.sumBy(list, function (item) {
						return item.PercentOfContract;
					});
				};

				service.isStructureChild = function isStructureChild(entity) {
					return (entity && entity.IsStructure && entity.PaymentScheduleFk);
				};

				service.getNetTotalItem = function getNetTotalItem(entity) {
					var headerItem = service.getPrcHeaderItem();
					var exchangeRate = headerItem ? headerItem.ExchangeRate : 0;
					var valueNetOc, grossOc, valueTaxOc, valueNet, gross;
					if (service.isStructureChild(entity)) {
						var parent = _.find(service.getList(), {Id: entity.PaymentScheduleFk});
						valueNetOc = parent.AmountNetOc;
						grossOc = parent.AmountGrossOc;
						valueTaxOc = math.bignumber(grossOc).sub(valueNetOc).toNumber();
						valueNet = parent.AmountNet;
						gross = parent.AmountGross;
					}
					else {
						valueNetOc = service.getPaymentScheduleNetOc();
						grossOc = service.getPaymentScheduleGrossOc();
						valueTaxOc = math.bignumber(grossOc).sub(valueNetOc).toNumber();
						valueNet = exchangeRate === 0 ? 0 : round(math.bignumber(valueNetOc).div(exchangeRate));
						gross = exchangeRate === 0 ? 0 : round(math.bignumber(grossOc).div(exchangeRate));
					}
					return {
						ValueNetOc: valueNetOc,
						ValueNet: valueNet,
						ValueTaxOc: valueTaxOc,
						ValueGrossOc: grossOc,
						ValueGross: gross
					};
				};

				service.updateCalculationOnRateChange = function updateCalculationOnRateChange(entity, param) {
					var headerItem = service.getPrcHeaderItem();
					var exchangeRate = (param && _.has(param, 'ExchangeRate')) ? param.ExchangeRate : (headerItem ? headerItem.ExchangeRate : 0);

					var list = service.getList();
					angular.forEach(list, function (item) {
						var isSumLine = service.isSumLine(item);
						if (!isSumLine) {
							item.AmountNet = exchangeRate === 0 ? 0 : round(math.bignumber(item.AmountNetOc).div(exchangeRate));
							item.AmountGross = exchangeRate === 0 ? 0 : round(math.bignumber(item.AmountGrossOc).div(exchangeRate));
							service.markItemAsModified(item);
						}
					});

					service.calculateRemaining();

					service.gridRefresh();
				};


				service.calculateByPercentOfContract = function calculateByPercentOfContract(entity, percent, model) {
					var isSumLine = service.isSumLine(entity);
					if (isSumLine) {
						return true;
					}
					var headerItem = service.getPrcHeaderItem();
					var exchangeRate = headerItem ? headerItem.ExchangeRate : 0;

					var rate = exchangeRate ? parseFloat(exchangeRate) : 0;
					entity[model] = percent;

					if (service.isStructureChild(entity)) {
						var parent = _.find(service.getList(), {Id: entity.PaymentScheduleFk});
						entity.AmountNetOc = round(math.bignumber(parent.AmountNetOc).mul(percent).div(100));
						entity.AmountNet = round(math.bignumber(parent.AmountNet).mul(percent).div(100));
						entity.AmountGrossOc = round(math.bignumber(parent.AmountGrossOc).mul(percent).div(100));
						entity.AmountGross = round(math.bignumber(parent.AmountGross).mul(percent).div(100));
					}
					else {
						var valueNetOc = service.getPaymentScheduleNetOc();
						var grossOc = service.getPaymentScheduleGrossOc();
						entity.AmountNetOc = round(math.bignumber(valueNetOc).mul(percent).div(100));
						entity.AmountNet = rate === 0 ? 0 : round(math.bignumber(entity.AmountNetOc).div(rate));
						entity.AmountGrossOc = round(math.bignumber(grossOc).mul(percent).div(100));
						entity.AmountGross = rate === 0 ? 0 : round(math.bignumber(entity.AmountGrossOc).div(rate));
					}
					if (_.isFunction(service.calculatePaymentDifferenceGross)) {
						service.calculatePaymentDifferenceGross(entity);
					}

					service.markItemAsModified(entity);
					service.gridRefresh();
				};

				service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					var prcHeaderItem = service.getPrcHeaderItem();
					taxCodeFk = (taxCodeFk === undefined && prcHeaderItem) ? prcHeaderItem.TaxCodeFk : taxCodeFk;
					vatGroupFk = (vatGroupFk === undefined && prcHeaderItem) ? prcHeaderItem.BpdVatGroupFk : vatGroupFk;
					return prcCommonGetVatPercent.getVatPercent(taxCodeFk, vatGroupFk);
				};

				var filters = [
					{
						key: 'procurement-payment-schedule-activity-filter',
						serverSide: true,
						fn: function (item) {
							return 'ScheduleFk =' + item.PsdScheduleFk;
						}
					}
				];
				if (serviceFilters) {
					filters = filters.concat(serviceFilters);
				}

				// register filter by hand
				service.registerFilters = function registerFilters() {
					LookupFilterService.registerFilter(filters);
				};

				// unload filters
				service.unregisterFilters = function () {
					LookupFilterService.unregisterFilter(filters);
				};

				if (parentService.exchangeRateChanged) {
					parentService.exchangeRateChanged.register(service.updateCalculationOnRateChange);
				}

				if (parentService.projectFkChanged) {
					parentService.projectFkChanged.register(service.updateScheduleOnProjectChange);
				}

				if (parentService.onParentUpdated && (parentService.name !== 'procurement.package')) {
					parentService.onParentUpdated.register(service.loadSubItemListIncludeUnSavedEntities);
				} else if (parentService.name === 'procurement.package') {
					var grandParentService = parentService.parentService();
					grandParentService.onParentUpdated.register(service.loadSubItemListIncludeUnSavedEntities);
				}

				function calculateListRemaining(list, remainingOc, exchangeRate) {
					_.forEach(list, function (item) {
						item.RemainingOc = math.bignumber(parseFloat(remainingOc).toFixed(2)).sub(parseFloat(item.AmountNetOc).toFixed(2)).toNumber();
						remainingOc = item.RemainingOc;
						item.Remaining = math.bignumber(item.RemainingOc).div(exchangeRate).toNumber();
						if (round(item.RemainingOc) === 0 && 1 / round(item.RemainingOc) === -Infinity) {
							item.RemainingOc = 0;
						}
						if (round(item.Remaining) === 0 && 1 / round(item.Remaining) === -Infinity) {
							item.Remaining = 0;
						}
					});
				}

				service.calculateRemaining = function calculateRemaining(dontRefreshGrid) {
					var remainingOc = 0;
					var allList = service.getListNoSumLine();
					var headerItem = service.getPrcHeaderItem();
					var exchangeRate = headerItem ? headerItem.ExchangeRate : 1;
					var parents = (allList && allList.length) ? _.filter(allList, function (i) {return !i.PaymentScheduleFk;}) : null;
					if (parents && parents.length) {
						var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						var sumLine = service.getSumLine();
						remainingOc = (isOverGross && sumLine) ? sumLine.AmountNetOc : service.getPaymentScheduleNetOc();
						calculateListRemaining(parents, remainingOc, exchangeRate);
					}
					var children = (allList && allList.length) ? _.filter(allList, function (i) {return i.PaymentScheduleFk;}) : null;
					if (children && children.length) {
						var childrenGroup = _.groupBy(children, 'PaymentScheduleFk');
						_.forEach(childrenGroup, function(c, k) {
							var kId = k ? parseInt(k) : 0;
							var parent = _.find(parents, {Id: kId});
							if (parent) {
								remainingOc = parent.AmountNetOc;
								calculateListRemaining(c, remainingOc, exchangeRate);
							}
						});
					}
					if (dontRefreshGrid !== true) {
						service.gridRefresh();
					}
				};

				service.getPaymentScheduleNetOc = function getPaymentScheduleNetOc() {
					return data.totalSetting.paymentScheduleNetOc || 0;
				};

				service.getPaymentScheduleGrossOc = function getPaymentScheduleGrossOc() {
					return data.totalSetting.paymentScheduleGrossOc || 0;
				};

				service.setPaymentScheduleTotalSetting = function setPaymentScheduleTotalSetting(newSetting) {
					if (newSetting) {
						var setting = _.assign(data.totalSetting, newSetting);
						setting.Init = false;
						data.totalSetting.VarianceNet = math.bignumber(data.totalSetting.TotalNetOc).sub(data.totalSetting.paymentScheduleNetOc).toNumber();
						data.totalSetting.VarianceGross = math.bignumber(data.totalSetting.TotalGrossOc).sub(data.totalSetting.paymentScheduleGrossOc).toNumber();
						data.totalSetting = setting;
					} else {
						data.totalSetting = {
							Code: '',
							PsTotalId: null,
							TotalNetOc: 0,
							TotalGrossOc: 0,
							VarianceNet: 0,
							VarianceGross: 0,
							disabled: function () {
								return service.readonlyNoConsiderTotalSetting();
							},
							btnDisabled: function () {
								var readonlyNoConsiderTotalSetting = service.readonlyNoConsiderTotalSetting();
								return readonlyNoConsiderTotalSetting || this.TotalNetOc === 0 || this.TotalGrossOc === 0;
							},
							totalInputDisabled: function () {
								return service.readonlyNoConsiderTotalSetting();
							},
							hasTotalSetting: false,
							paymentScheduleNetOc: 0,
							paymentScheduleGrossOc: 0,
							Init: true
						};
					}
				};

				service.getPaymentScheduleTotalSetting = function getPaymentScheduleTotalSetting() {
					return data.totalSetting;
				};
				service.setPaymentScheduleTotalSetting();

				service.readonlyNoConsiderTotalSetting = function readonlyNoConsiderTotalSetting() {
					var parentItem = parentService.getSelected();
					if (moduleName === 'procurement.package') {
						parentItem = parentService.parentService().getSelected();
					}
					return !parentItem || !parentItem.Id || !parentItem.Version;
				};

				service.getTotalSetting = function getTotalSetting() {
					return data.totalSetting;
				};

				var baseCreateItem = service.createItem;
				service.createItem = function createItem() {
					if (data.totalSetting.hasTotalSetting) {
						baseCreateItem();
					} else {
						var createTotalLineDialogOptions = {
							headerTextKey: 'procurement.common.createFirstPaymentScheduleLine',
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/create-payment-schedule-total-line.html',
							parentService: parentService,
							service: service,
							area: area,
							createItem: baseCreateItem
						};
						platformModalService.showDialog(createTotalLineDialogOptions);
					}
				};

				service.checkCreateParent = function checkCreateParent(createParentFun) {
					if (data.totalSetting.hasTotalSetting) {
						createParentFun();
					} else {
						var createTotalLineDialogOptions = {
							headerTextKey: 'procurement.common.createFirstPaymentScheduleLine',
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/create-payment-schedule-total-line.html',
							parentService: parentService,
							service: service,
							area: area,
							createItem: createParentFun
						};
						platformModalService.showDialog(createTotalLineDialogOptions);
					}
				};

				service.setNewEntityValidator = function setNewEntityValidator(typeName, moduleSubModule, mustValidateFields) {
					data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: typeName,
						moduleSubModule: moduleSubModule,
						validationService: procurementCommonPaymentScheduleValidationService.getService(service),
						mustValidateFields: mustValidateFields
					});
				};

				service.getListNoSumLine = function getListNoSumLine() {
					var list = service.getList();
					return list.filter(function(i) {
						return !service.isSumLine(i);
					});
				};

				var sumFields = ['PercentOfContract', 'AmountNet', 'AmountNetOc', 'AmountGross', 'AmountGrossOc'];

				service.setSumField = function setSumField(customizeSumFields) {
					if (_.isArray(customizeSumFields)) {
						sumFields = customizeSumFields;
					}
				};

				service.baseEmptySumLine = {
					Id: -1,
					Code: '∑',
					Sorting: 0,
					DateRequest: {isValid: function(){return true;}, format: function(){return ' ';} }
				};
				service.createEmptySumLine = function createEmptySumLine() {
					return service.baseEmptySumLine;
				}
				service.addSumLine = function addSumLine(paymentSchedules, isTree) {
					if (!paymentSchedules || !_.isArray(paymentSchedules) ) {
						return [];
					}
					var haveSumLine = _.find(paymentSchedules, {Code: '∑', Id: -1});
					if (haveSumLine) {
						return paymentSchedules;
					}
					var isStructure = _.find(paymentSchedules, {IsStructure: true});
					var sumLine = service.createEmptySumLine();
					if (paymentSchedules && paymentSchedules.length) {
						_.forEach(sumFields, function(f) {
							if (isStructure && f === 'PercentOfContract') {
								f = 'TotalPercent';
							}
							if (_.has(paymentSchedules[0], f)) {
								sumLine[f] = 0;
								_.forEach(paymentSchedules, function(ps) {
									sumLine[f] += round(ps[f]);
								});
							}
						});
					}
					else {
						_.forEach(sumFields, function(f) {
							sumLine[f] = 0;
						});
					}
					sumLine.TotalPercent = isStructure ? sumLine.TotalPercent : 0;
					sumLine.PercentOfContract = isStructure ? null : sumLine.PercentOfContract;
					if (isTree) {
						sumLine.ChildItems = _.filter(paymentSchedules, function(i) {
							return !i.PaymentScheduleFk;
						});
						return [sumLine];
					}
					paymentSchedules.unshift(sumLine);
					return paymentSchedules;
				};

				service.isSumLine = function isSumLine(item) {
					return (item.Id === -1);
				};

				service.getSumLine = function getSumLine(items) {
					if (!items) {
						items = service.getList();
					}
					return _.find(items, {Id: -1});
				};

				service.resetSumLine = function resetSumLine(dontRefreshGrid, parentId, balanceToEntity) {
					var list = service.getListNoSumLine();
					var paymentSchedules = _.filter(list, function (i) {
						return !i.PaymentScheduleFk;
					});
					var isStructure = _.find(paymentSchedules, {IsStructure: true});
					var sumLine = service.getSumLine();
					_.forEach(sumFields, function(f) {
						if (isStructure && f === 'PercentOfContract') {
							f = 'TotalPercent';
						}
						sumLine[f] = 0;
						if (_.has(paymentSchedules[0], f)) {
							_.forEach(paymentSchedules, function(ps) {
								sumLine[f] += round(ps[f]);
							});
						}
					});
					sumLine.TotalPercent = isStructure ? sumLine.TotalPercent : 0;
					if (sumLine.TotalPercent === 100 && balanceToEntity) {
						var totalGrossOc = service.getPaymentScheduleGrossOc();
						var totalNetOc = service.getPaymentScheduleNetOc();
						balanceToAEntity(sumLine, balanceToEntity, totalGrossOc, totalNetOc);
					}
					sumLine.PercentOfContract = isStructure ? null : sumLine.PercentOfContract;

					if (parentId) {
						var parent = _.find(list, {Id: parentId});
						if (parent) {
							var children = _.filter(list, function(i) {
								return i.PaymentScheduleFk === parentId;
							});
							parent.PercentOfContract = 0;
							if (children && children.length) {
								_.forEach(children, function(c) {
									parent.PercentOfContract += round(c.PercentOfContract);
								});
							}
						}
					}

					if (dontRefreshGrid !== true) {
						service.gridRefresh();
					}
				};

				service.pushSumLineFirst = function pushSumLineFirst() {
					var list = service.getList();
					if (list && list.length) {
						var sumLine = service.getSumLine(list);
						if (sumLine) {
							var index = _.findIndex(list, {Id: -1});
							if (index > 0) {
								_.remove(list, function (p) {
									return p.Id === -1;
								});
								list.unshift(sumLine);
								return list;
							}
						}
					}
					return null;
				};

				service.setParentTotalPercent = function setParentTotalPercent(list) {
					if (list && list.length) {
						_.forEach(list, function (i) {
							if (!i.PaymentScheduleFk && i.IsStructure) {
								i.TotalPercent = i.PercentOfContract;
								i.PercentOfContract = 0;
								if (i.ChildItems && i.ChildItems.length) {
									i.PercentOfContract = _.sumBy(i.ChildItems, 'PercentOfContract');
								}
							}
						});
					}
					return list;
				};

				function balanceToAEntity(sumLine, balanceEntity, totalGrossOc, totalNetOc) {
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (balanceEntity) {
						var headerItem = service.parentService().getSelected();
						var rate = headerItem ? headerItem.ExchangeRate : 0;
						if (isOverGross) {
							if (sumLine.AmountGrossOc !== totalGrossOc) {
								balanceEntity.AmountGrossOc = round(math.bignumber(balanceEntity.AmountGrossOc).sub(sumLine.AmountGrossOc).add(totalGrossOc));
								balanceEntity.AmountGross = rate === 0 ? 0 : round(math.bignumber(balanceEntity.AmountGrossOc).div(rate));
								balanceEntity.AmountNetOc = round(math.bignumber(balanceEntity.AmountNetOc).sub(sumLine.AmountNetOc).add(totalNetOc));
								balanceEntity.AmountNet = rate === 0 ? 0 : round(math.bignumber(balanceEntity.AmountNetOc).div(rate));
								sumLine.AmountGrossOc = totalGrossOc;
							}
						}
						else {
							if (sumLine.AmountNetOc !== totalNetOc) {
								balanceEntity.AmountNetOc = round(math.bignumber(balanceEntity.AmountNetOc).sub(sumLine.AmountNetOc).add(totalNetOc));
								balanceEntity.AmountNet = rate === 0 ? 0 : round(math.bignumber(balanceEntity.AmountNetOc).div(rate));
								balanceEntity.AmountGrossOc = round(math.bignumber(balanceEntity.AmountGrossOc).sub(sumLine.AmountGrossOc).add(totalGrossOc));
								balanceEntity.AmountGross = rate === 0 ? 0 : round(math.bignumber(balanceEntity.AmountGrossOc).div(rate));
								sumLine.AmountNetOc = totalNetOc;
							}
						}
					}
				}

				function round(value) {
					return _.isNaN(value) ? 0 : prcCommonCalculationHelper.round(value);
				}

				return service;
			}

			return dataServiceFactory.createService(constructorFn, 'procurementCommonPaymentScheduleDataService');
		}]);

})();