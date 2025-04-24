(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonItemPriceService', [
		'globals',
		'$http',
		'$injector',
		'$translate',
		'platformGridAPI',
		'platformModalService',
		'platformLanguageService',
		'platformDataServiceFactory',
		'platformRuntimeDataService',
		'accounting',
		'basicsLookupdataLookupDescriptorService',
		'procurementCommonPrcItemDataService',
		'procurementCommonPriceConditionService',
		'procurementCommonTotalDataService',
		'procurementCommonUpdateItemPriceService',
		function (globals,
			$http,
			$injector,
			$translate,
			platformGridAPI,
			platformModalService,
			platformLanguageService,
			platformDataServiceFactory,
			platformRuntimeDataService,
			accounting,
			basicsLookupdataLookupDescriptorService,
			procurementCommonPrcItemDataService,
			procurementCommonPriceConditionService,
			procurementCommonTotalDataService,
			commonUpdateItemPriceService) {

			function getService(parentService, opts) {
				var container = null;
				var srvOption = {
					hierarchicalNodeItem: {
						module: moduleName,
						serviceName: 'procurementCommonItemPriceService',
						// httpRead: {
						// 	route: globals.webApiBaseUrl + 'basics/common/historicalprice/',
						// 	endRead: 'prcitem',
						// 	usePostForRead: true
						// },
						presenter: {
							tree: {
								parentProp: '',
								childProp: 'Children',
								incorporateDataRead: function (readData, data) {
									if (!readData || readData.length < 1) {
										return container.data.handleReadSucceeded([], data, true);
									}
									basicsLookupdataLookupDescriptorService.attachData(readData || {});
									return container.data.handleReadSucceeded(readData.Main, data, true);
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'commonItemPrice',
								parentService: parentService
							}
						}
					}
				};
				container = platformDataServiceFactory.createNewComplete(srvOption);
				var service = container.service;
				container.data = angular.extend(container.data, opts);
				service.guid = '1499239c009b4f33b7821484657c02d1';
				service.allPriceData = [];
				// service.catalogIds = [];
				// service.materialIds = [];
				// service.queryNeutralMaterial = true;

				service.getUpdateItemUrl = function (matchItems) {
					return $http.post(globals.webApiBaseUrl + 'basics/common/historicalprice/prcitem', matchItems);
				};

				service.goUpdateItemUrl = function (gridData) {
					return $http.post(globals.webApiBaseUrl + 'procurement/common/UpdateItemPrice/updatePrcItemPrice', gridData);
				};

				service.checkPrcItemUomUrl = function (gridData) {
					return $http.post(globals.webApiBaseUrl + 'procurement/common/UpdateItemPrice/checkPrcItemUom', gridData);
				};

				service.refreshData = function (data) {
					platformGridAPI.items.data(service.guid, []);
					service.allPriceData = data;
					_.forEach(data, function (item) {
						item.Children = item.Children.filter((value, index, self) =>
								index === self.findIndex((t) => (
									t.Index === value.Index
								))
						);
					});
					platformGridAPI.items.data(service.guid, data);
					container.data.listLoaded.fire();
				};

				service.clearContent = function () {
					service.allPriceData = [];
					container.data.clearContent(container.data);
				};

				var lang = platformLanguageService.getLanguageInfo();
				var options = {
					'thousand': lang.numeric.thousand,
					'decimal': lang.numeric.decimal,
					'precision': 2
				};
				service.setGridDataForItems = function (parent, selectPrcItemIds, currentItem, materialId, headerParentItem) {
					var param = {
						prcItemIds: _.filter(selectPrcItemIds, item => !!item),
						materialId: materialId,
						startDate: currentItem.startDate,
						endDate: currentItem.endDate,
						queryFromQuotation: currentItem.queryFromQuotation,
						queryFromContract: currentItem.queryFromContract,
						queryFromMaterialCatalog: currentItem.queryFromMaterialCatalog,
						queryNeutralMaterial: currentItem.queryNeutralMaterial,
						matPriceListId: currentItem.pricecondition,
						materialType: currentItem.pricecondition > 0 ? -2 : currentItem.pricecondition,
						projectId: parent ? parent.ProjectFk : null,
						itemDate: parent ? (parent.DateQuoted || parent.DateOrdered || parent.DateReceived) : null,
						businessPartnerId: parent ? parent.BusinessPartnerFk : null,
						headerCurrencyId: headerParentItem ? (headerParentItem.CurrencyFk || headerParentItem.BasCurrencyFk) : null,
						headerProjectId: headerParentItem ? headerParentItem.ProjectFk : null,
						HeaderExchangeRate: headerParentItem ? headerParentItem.ExchangeRate : null,
					};
					service.materialIds = selectPrcItemIds;
					service.getUpdateItemUrl(param).then(function (response) {
						var data = response.data;
						if (data) {
							_.forEach(data, function (item) {
								item.Cost = accounting.formatNumber(item.Cost, options.precision, options.thousand, options.decimal);
								readonly(item);
								item.nodeInfo = {
									collapsed: false,
									lastElement: false,
									level: 0
								};
							});
							if (!data[0] || !data[0].Children || data[0].Children.length <= 0) {
								service.refreshData([]);
								return;
							}
							if (data[0] && data[0].Children) {
								var minData = _.minBy(data[0].Children, 'UnitRate');
								var minUnitRate = commonUpdateItemPriceService.formatterMoneyType(minData, 'UnitRate');
								var maxData = _.maxBy(data[0].Children, 'UnitRate');
								var maxUnitRate = commonUpdateItemPriceService.formatterMoneyType(maxData, 'UnitRate');
								currentItem.priceRange = minUnitRate + ' ~ ' + maxUnitRate;
							}
							service.catalogIds = _.map(data, 'CatalogId');
							service.refreshData(data);
						}
					});
				};

				service.getList = function () {
					var list = [];
					_.forEach(service.allPriceData, function (item) {
						list.push(item);
						if (!!item.Children && item.Children.length > 0) {
							list = list.concat(item.Children);
						}
					});
					return list;
				};

				service.getTree = function () {
					return service.allPriceData;
				};

				service.goUpdateItem = function (serviceName, selectGridData, parent, module) {
					var param = {
						childItems: selectGridData,
						module: module,
						parentId: parent.Id,
						ExchangeRate: parent.ExchangeRate,
						ParentTaxCodeFk: parent.TaxCodeFk ? parent.TaxCodeFk : -1,
						ParentVatGroupFk: parent.BpdVatGroupFk
					};
					if (selectGridData.length === 0) {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateItemPrice.noItemSelected'), '', 'ico-info'); // jshint ignore:line
						return;
					}
					service.checkPrcItemUomUrl(param).then(function (response) {
						if (response && response.data.length > 0) {
							var codeList = _.map(response.data, 'SourceCodeAndDesc');
							var translateDes = $translate.instant('procurement.common.wizard.updateItemPrice.cannotConvert', {p_0: response.data.length}) + codeList.join(', ');// jshint ignore:line
							platformModalService.showMsgBox(translateDes, '', 'ico-info'); // jshint ignore:line
							return;
						}
						service.goUpdateItemUrl(param).then(function () {
							var commonPrcItemService = procurementCommonPrcItemDataService.getService();
							platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateItemPrice.updateSuccess'), 'Info', 'ico-info');
							commonPrcItemService.loadSubItemsList().then(function () {
								commonPrcItemService.goToFirst();
								var selectEntity = commonPrcItemService.getSelected();
								if (selectEntity) {
									var priceConditionService = procurementCommonPriceConditionService.getService();
									priceConditionService.clearCache();
									$http.get(globals.webApiBaseUrl + 'procurement/common/pricecondition/list?mainItemId=' + selectEntity.Id).then(function (result) {
										var resData = result.data;
										priceConditionService.handleReloadSucceeded(selectEntity, resData.Main);
									});
									if (serviceName.indexOf('Quote') !== -1) {
										var quoteTotalDataService = $injector.get('procurementQuoteTotalDataService');
										quoteTotalDataService.onRefresh();
									} else {
										var totalService = procurementCommonTotalDataService.getService();
										totalService.loadSubItemList();
									}
								}
							});
							parentService.refresh();
						});
					});
				};

				function readonly(item) {
					platformRuntimeDataService.readonly(item,
						[{
							field: 'Selected',
							readonly: (!!item.Children && item.Children.length > 0)
						},
						{
							field: 'Weighting',
							readonly: (!!item.Children && item.Children.length > 0)
						},
						{
							field: 'MaterialPriceListId',
							readonly: item.SourceType !== 'Catalog'
						}]);

					_.forEach(item.Children, function (child) {
						platformRuntimeDataService.readonly(child, [
							{
								field: 'MaterialPriceListId',
								readonly: child.SourceType !== 'Catalog'
							}]);
						child.image = 'tlb-icons ico-preview-form';

					});
				}

				return service;
			}

			return {
				getService: getService
			};

		}]);

})(angular);