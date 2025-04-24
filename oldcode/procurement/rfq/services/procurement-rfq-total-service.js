(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/**
	 * @ngdoc service
	 * @name procurementRfqTotalService
	 * @function
	 * @requires platformDataServiceFactory
	 * @description
	 * #
	 * data service of rfq total container
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRfqTotalService', [
		'platformDataServiceFactory', 'procurementRfqMainService', 'basicsLookupdataLookupDescriptorService',
		'procurementCommonDataEnhanceProcessor', 'basicsProcurementConfigurationTotalKinds', '_',
		function (platformDataServiceFactory, parentService, lookupDescriptorService,
			procurementCommonDataEnhanceProcessor, basicsProcurementConfigurationTotalKinds, _) {

			var showAll = false;
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementRfqTotalService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/rfq/total/',
					endRead: 'list',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						readData.filter = '?mainItemId=' + parentService.getIfSelectedIdElse(-1) + '&showAll=' + showAll;
					}
				},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {leaf: {itemName: 'RfqTotal', parentService: parentService}},
				entitySelection: {},
				modification: {multi: {}},
				dataProcessor: [dataProcessItem()]
			};

			var readOnlyFields = ['ValueNet', 'ValueNetOc', 'ValueTax', 'ValueTaxOc', 'Gross', 'GrossOc'];
			var service = platformDataServiceFactory.createNewComplete(serviceOption).service;

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

			parentService.refreshTotal.register(service.load);
			if (parentService.exchangeRateChanged) {
				// parentService.exchangeRateChanged.register(calculateFreeTotalOnExchangeRateChange);
				parentService.exchangeRateChanged.register(calculateTotalOnExchangeRateChange);
			}

			// //////////////////////////////
			function incorporateDataRead(readData, data) {
				lookupDescriptorService.attachData(readData || {});
				var dataRead = data.handleReadSucceeded(readData.Main, data, true);
				service.goToFirst(data);

				return dataRead;
			}

			function dataProcessItem() {
				function isReadonly(item, model) {
					return _.includes(readOnlyFields, model) ? !getCellEditable(item, model) : true;
				}

				function getCellEditable(item, model) { /* jshint -W074 */
					var editable = true;
					if (item && item.TotalTypeFk) {
						var configuration = _.find(lookupDescriptorService.getData('PrcConfiguration'), {Id: getConfigurationFk()});
						var totalType = _.find(lookupDescriptorService.getData('PrcTotalType'), {
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
					return {dataService: service, validationService: null};
				};
				return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementRfqTotalUIStandardService', isReadonly);
			}

			function getConfigurationFk() {
				if (parentService.getSelected()) {
					return parentService.getSelected().PrcConfigurationFk;
				}
			}

			// function calculateFreeTotalOnExchangeRateChange() {
			function calculateTotalOnExchangeRateChange() {
				var isChanged = false;
				angular.forEach(service.getList(), function (item) {
					var entity = parentService.getSelected();
					var totalType = getTotalType(item);
					if (!_.isEmpty(totalType)) {
						// if ((totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.freeTotal || totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.calculatedCost) && entity.ExchangeRate !== 0) {
						if (totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.freeTotal && entity.ExchangeRate !== 0) {
							// mainDataServcie.isTotalDirty = true;
							item.ValueNet = item.ValueNetOc / parseFloat(entity.ExchangeRate);
							item.GrossOc = item.ValueNetOc + parseFloat(item.ValueTaxOc);
							item.ValueTax = item.ValueTaxOc / parseFloat(entity.ExchangeRate);
							item.Gross = item.ValueNet + parseFloat(item.ValueTax);
							service.markItemAsModified(item);
							isChanged = true;
						}
						if (totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.calculatedCost ||
							totalType.PrcTotalKindFk === basicsProcurementConfigurationTotalKinds.estimateTotal) {
							item.ValueNetOc = item.ValueNet * parseFloat(entity.ExchangeRate);
							item.ValueTaxOc = item.ValueTax * parseFloat(entity.ExchangeRate);
							item.GrossOc = item.ValueNetOc + parseFloat(item.ValueTaxOc);
							item.Gross = item.ValueNet + parseFloat(item.ValueTax);
							service.markItemAsModified(item);
							isChanged = true;
						}
					}
				});

				if (isChanged) {
					service.gridRefresh();
				}
			}

			function getTotalType(item) {
				var configuration = _.find(lookupDescriptorService.getData('PrcConfiguration'), {Id: getConfigurationFk()});
				if (!configuration) {
					return null;
				}
				return _.find(lookupDescriptorService.getData('PrcTotalType'), {
					Id: item.TotalTypeFk,
					PrcConfigHeaderFk: configuration.PrcConfigHeaderFk
				});
			}

			return service;
		}
	]);
})(angular);
