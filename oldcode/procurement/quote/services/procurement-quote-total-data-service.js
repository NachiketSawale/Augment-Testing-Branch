(function (angular) {
	'use strict';

	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementQuoteTotalDataService
	 * @function
	 * @requires platformDataServiceFactory,basicsLookupdataLookupDescriptorService,procurementQuoteHeaderDataService
	 *
	 * description data service of quote total container
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementQuoteTotalDataService', [
		'$q', '$injector', 'globals', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementQuoteHeaderDataService',
		'procurementCommonDataEnhanceProcessor', 'basicsCommonReadDataInterceptor', 'basicsProcurementConfigurationTotalKinds', '$http', '_', 'prcCommonCalculationHelper', 'prcCommonGetVatPercent',
		function ($q, $injector, globals, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, parentService,
			procurementCommonDataEnhanceProcessor, basicsCommonReadDataInterceptor, basicsProcurementConfigurationTotalKinds, $http, _, prcCommonCalculationHelper, prcCommonGetVatPercent) {

			var showAll = true;
			var serviceOptions = {
				module: angular.module(moduleName),
				serviceName: 'procurementQuoteTotalDataService',
				entityRole: {leaf: {itemName: 'QtnTotal', parentService: parentService}},
				entitySelection: {},
				modification: {multi: {}},
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/quote/total/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						readData.filter = '?mainItemId=' + parentService.getIfSelectedIdElse(-1) + '&showAll=' + showAll;
					}
				},
				presenter: {list: {incorporateDataRead: incorporateDataRead}},
				dataProcessor: [dataProcessItem()]
			};
			var readonlyProperties = ['ValueNet', 'ValueNetOc', 'ValueTax', 'ValueTaxOc', 'Gross', 'GrossOc'];

			var containerService = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = containerService.service;

			/**
			 * reload data by toolbar filter
			 */
			service.reloadByFilter = function () {
				showAll = !showAll;
				service.load();
			};
			service.getShowAllStatus = function () {
				return showAll;
			};

			service.isTotalDirtyImport = false;
			service.isTotalDirtyChange = function totalDirtyChange() {
				changeTotalDirty(true);
			};
			service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(serviceGetTaxCode) {
				var defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getreqheader?id=' + serviceGetTaxCode.getList()[0].ReqHeaderFk).then(function (response) {
					var reqHeader = response.data;
					var selectedItem = parentService.getSelected();
					var taxCodeFk = reqHeader.TaxCodeFk;
					var vatGroupFk = selectedItem.BpdVatGroupFk;
					var vatPercent = prcCommonGetVatPercent.getVatPercent(taxCodeFk, vatGroupFk);
					defer.resolve(vatPercent);
				});
				return defer.promise;
			};

			service.getNetTotalNoDiscountSplitItem = function getNetTotalItem() {
				var result = _.find(service.getList(), function (item) {
					var totalType = getTotalType(item);
					if (_.isEmpty(totalType)) {
						return false;
					}
					if (totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.netTotalNoDiscountSplit) {
						return true;
					}
				});
				if (!result) {
					var netAndNetOc = parentService.getTotalNoDiscountSplitOfHeader();
					result = {
						ValueNet: netAndNetOc.ValueNet,
						ValueNetOc: netAndNetOc.ValueNetOc,
						Gross: netAndNetOc.Gross,
						GrossOc: netAndNetOc.GrossOc
					};
				}
				return result;
			};

			basicsCommonReadDataInterceptor.init(service, containerService.data);
			parentService.refreshTotal.register(onRefresh);
			parentService.registerCompleteItemCreated(onQuoteHeaderCreated);
			if (parentService.exchangeRateChanged) {
				parentService.exchangeRateChanged.register(service.calculateTotalOnExchangeRateChange);
			}

			function loadList() {
				var list = service.getList();
				if (list?.length) {
					service.load();
				}
			}

			if (parentService.onRecalculationItemsAndBoQ) {
				parentService.onRecalculationItemsAndBoQ.register(loadList);
			}

			return angular.extend(service, {
				recalculateDisable: recalculateDisable,
				updateCalculation: updateCalculation
			});

			function incorporateDataRead(responseData, data) {
				basicsLookupdataLookupDescriptorService.attachData(responseData || {});
				parentService.update().then(function () {
					changeTotalDirty(false);
				});
				var result = data.handleReadSucceeded(responseData.Main, data, true);
				service.goToFirst(data);
				return result;
			}

			function dataProcessItem() {
				function isReadonly(item, model) {
					return _.includes(readonlyProperties, model) ? !getCellEditable(item, model) : true;
				}

				function getCellEditable(item, model) { /* jshint -W074 */
					var editable = true;
					var configurationFk = getConfigurationFk();
					if (item?.TotalTypeFk && configurationFk) {
						var configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: configurationFk});
						var totalType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
							Id: item.TotalTypeFk,
							PrcConfigHeaderFk: configuration.PrcConfigHeaderFk
						});

						if (totalType) {
							if ((totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.fromPackage) ||
								totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.netTotal ||
								totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.costPlanningNet ||
								totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.budgetNet ||
								totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.formula) {
								return false;
							}
							if (model === 'ValueNet' || model === 'ValueNetOc') {
								editable = totalType.IsEditableNet;
							}
							if (model === 'ValueTax' || model === 'ValueTaxOc') {
								editable = totalType.IsEditableTax;
							}
							if (model === 'Gross' || model === 'GrossOc') {
								editable = totalType.IsEditableGross;
							}
						} else {
							editable = false;
						}
					} else {
						editable = false;
					}

					return editable;
				}

				var dataProcessService = function () {
					return {dataService: service, validationService: {}};
				};
				return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementQuoteTotalUIConfigurationService', isReadonly);
			}

			function recalculateDisable() {
				const selectedQuoteStatus = parentService.getSelectedQuoteStatus();
				if (selectedQuoteStatus) {
					return  selectedQuoteStatus.IsReadonly;
				}
				return true;
			}

			function updateCalculation() {
				if (service.isTotalDirtyImport) {
					var url = globals.webApiBaseUrl + 'procurement/quote/total/updateTotals?mainItemId=' + parentService.getIfSelectedIdElse(-1);

					$http.get(url).then(function () {
						service.load();
						changeTotalDirty(false);
					});
				} else {
					parentService.update().then(function () {
						changeTotalDirty(false);
					});
				}

			}

			function changeTotalDirty(flag) {
				angular.forEach(parentService.getChildServices(), function (childService) {
					childService.isTotalDirty = flag;
				});
				service.isTotalDirtyImport = flag;
			}

			function onQuoteHeaderCreated(e, args) {
				// only show the totals which 'NetValueOc !== 0' at first (see defect: 72723)
				service.setCreatedItems(_.filter(args.totalItems, function (item) {
					return item.ValueNetOc !== 0;
				}));
			}

			function onRefresh() {
				var parentItem = parentService.getSelected();
				if (parentItem) {
					service.setFilter('mainItemId=' + parentItem.Id + '&showAll=' + showAll);
					service.load();
				}
			}

			function getConfigurationFk() {
				var parentItem = service.parentService().getSelected();
				if (parentItem) {
					return parentItem.ConfigurationFk;
				}

				return null;
			}

			function getTotalType(item) {
				var configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: getConfigurationFk()});
				if (!configuration) {
					return null;
				}
				return _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
					Id: item.TotalTypeFk,
					PrcConfigHeaderFk: configuration.PrcConfigHeaderFk
				});
			}
		}
	]);
})(angular);
