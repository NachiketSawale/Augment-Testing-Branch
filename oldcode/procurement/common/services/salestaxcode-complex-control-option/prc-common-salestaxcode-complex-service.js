/**
 * Created by lcn on 03/04/2022.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */

	let moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonSalesTaxCodeComplexService',
		['_', '$http', 'globals', '$timeout', '$injector', 'basicsLookupdataPopupService', 'platformGridAPI', 'basicsLookupdataLookupDescriptorService', 'procurementContextService',
			function (_, $http, globals, $timeout, $injector, basicsLookupdataPopupService, platformGridAPI, LookupDescriptorService, procurementContextService) {
				// eslint-disable-next-line no-unused-vars
				let service = {}, itemService, clickFromDetailForm;

				let popupToggle = basicsLookupdataPopupService.getToggleHelper();

				let initController = function initController(scope, lookupControllerFactory, entityEx, popupInstance) {
					let tempHidePopup = basicsLookupdataPopupService.hidePopup;
					basicsLookupdataPopupService.hidePopup = function temp() {
					};

					let gridId = '0a9466de7e904e24b0305bb4bda5d777';
					let self = lookupControllerFactory.create({grid: true}, scope, {
						gridId: gridId,
						columns: service.getColumns(true),
						idProperty: 'Id',
						lazyInit: true,
						grouping: true,
						enableDraggableGroupBy: true
					});

					scope.service = self;
					scope.EntityEx = entityEx;
					scope.MdcSalesTaxCodesEx = scope.EntityEx.MdcSalesTaxCodes;
					scope.SalesTaxCodesEx = LookupDescriptorService.getData('salestaxcodes');
					scope.SalesTaxMatrixsEx = LookupDescriptorService.getData('salestaxmatrixs');

					updateTools();
					updateData();
					service.setItemService(scope.$root.currentModule);

					popupInstance.onResizeStop.register(function () {
						$injector.get('platformGridAPI').grids.resize(scope.grid.state);
					});

					scope.getTitle = function () {
						return 'Sales tax Code';
					};

					scope.deleteItem = function () {
						let deleteItems = self.getSelectedItems();
						let deleteIds = _.map(deleteItems, 'Id');
						_.remove(scope.MdcSalesTaxCodesEx, function (item) {
							return _.includes(deleteIds, item.Id);
						});
						updateData();

						itemService.markEntitiesAsModified(itemService.getList());
						updateTools();
					};

					scope.toggleFilter = function (active, clearFilter) {
						platformGridAPI.filters.showSearch(gridId, active, clearFilter);
					};

					scope.toggleColumnFilter = function (active, clearFilter) {
						platformGridAPI.filters.showColumnSearch(gridId, active, clearFilter);
					};

					let searchAllToggle = {
						id: 'gridSearchAll',
						sort: 150,
						caption: 'cloud.common.taskBarSearch',
						type: 'check',
						iconClass: 'tlb-icons ico-search-all',
						fn: function () {
							scope.toggleFilter(this.value);

							if (this.value) {
								searchColumnToggle.value = false;
								scope.toggleColumnFilter(false, true);
							}
						},
						disabled: function () {
							return scope.showInfoOverlay;
						}
					};

					let searchColumnToggle = {
						id: 'gridSearchColumn',
						sort: 160,
						caption: 'cloud.common.taskBarColumnFilter',
						type: 'check',
						iconClass: 'tlb-icons ico-search-column',
						fn: function () {
							scope.toggleColumnFilter(this.value);

							if (this.value) {
								searchAllToggle.value = false;
								scope.toggleFilter(false, true);
							}
						},
						disabled: function () {
							return scope.showInfoOverlay;
						}
					};

					scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						version: Math.random(),
						update: function () {
							scope.tools.version += 1;
						},
						items: [
							{
								id: 't3',
								sort: 31,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								fn: scope.deleteItem,
								disabled: true
							},
							searchAllToggle,
							searchColumnToggle,
							{
								id: 't4',
								sort: 110,
								caption: 'cloud.common.print',
								iconClass: 'tlb-icons ico-print-preview',
								type: 'item',
								fn: function () {
									$injector.get('reportingPrintService').printGrid(gridId);
								}
							},
							{
								id: 't6',
								sort: 120,
								caption: 'cloud.common.taskBarGrouping',
								type: 'check',
								iconClass: 'tlb-icons ico-group-columns',
								fn: function () {
									platformGridAPI.grouping.toggleGroupPanel(gridId, this.value);
								},
								value: platformGridAPI.grouping.toggleGroupPanel(gridId),
								disabled: false
							}
						]
					};

					function onSelectedRowsChanged() {
						updateTools();
					}

					function updateTools() {
						if (scope.service.getGrid()) {
							var selected = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
							angular.forEach(scope.tools.items, function (item) {
								if (item.id === 't3') {
									item.disabled = !(angular.isDefined(selected) && selected.length > 0);
								}
							});
						}
						$timeout(function () {
							scope.tools.update();
						});
					}

					function updateData() {
						var SalesTaxCodesEx = angular.copy(scope.MdcSalesTaxCodesEx);
						_.forEach(SalesTaxCodesEx, function (watchField) {
							var _taxCode = _.find(scope.SalesTaxCodesEx, function (ex) {
								return ex.MdcSalesTaxCodeFk === watchField.Id && ex.SalesTaxFk === scope.EntityEx.Id;
							});
							if (_taxCode) {
								watchField.AmountNet = _taxCode.AmountNet;
								watchField.AmountNetOc = _taxCode.AmountNetOc;
								watchField.AmountTax = _taxCode.AmountTax;
								watchField.AmountTaxOc = _taxCode.AmountTaxOc;
								watchField.TaxPercentCalculation = _taxCode.TaxPercent;
							}

							var _taxMatrix = _.find(scope.SalesTaxMatrixsEx, function (ex) {
								return ex.SalesTaxCodeFk === watchField.Id && ex.SalesTaxGroupFk === scope.EntityEx.MdcSalesTaxGroupFk;
							});
							if (_taxMatrix) {
								watchField.TaxPercent = _taxMatrix.TaxPercent;
							}
						});
						SalesTaxCodesEx = _.sortBy(SalesTaxCodesEx, 'CalculationOrder');
						self.updateData(SalesTaxCodesEx);

						if (SalesTaxCodesEx && SalesTaxCodesEx[0]) {
							self.selectRowById(SalesTaxCodesEx[0].Id);
						}
					}

					platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

					scope.$on('$destroy', function () {
						platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
						basicsLookupdataPopupService.hidePopup = tempHidePopup;
					});
				};

				// MdcSalesTaxCodes lose data when adding and deleting, so salesTaxCodes are used for intermediate storage
				service.displayFormatter = function displayFormatter(row, cell, value, columnDef, entity) {
					if (!entity) {
						return;
					}

					if (!_.isArray(entity.MdcSalesTaxCodes)) {
						entity.MdcSalesTaxCodes = entity.TempSalesTaxCodes || [];
					}
					return _.map(entity.MdcSalesTaxCodes, 'Code').join(', ');
				};

				service.clear = function clear(arg, scope) {
					let entity = scope.$parent.entity || arg.entity;
					entity.MdcSalesTaxCodes = [];
					entity.TempSalesTaxCodes = [];

					service.setItemService(scope.$root.currentModule);
					itemService.markEntitiesAsModified(itemService.getList());
				};

				service.onSelectedItemChanged = function onSelectedItemChanged(arg, scope) {
					let entity = scope.$parent.entity || arg.entity;
					entity.TempSalesTaxCodes = entity.MdcSalesTaxCodes;

					service.setItemService(scope.$root.currentModule);
					itemService.markEntitiesAsModified(itemService.getList());
				};

				service.onSelectedItemsChanged = function onSelectedItemsChanged(arg, scope) {
					let entity = scope.$parent.entity || arg.entity;
					if (!_.isArray(entity.MdcSalesTaxCodes)) {
						entity.MdcSalesTaxCodes = [];
					}
					_.forEach(arg.selectedItems, function (selectedItem) {
						entity.MdcSalesTaxCodes.push(selectedItem);
					});
				};

				service.getColumns = function getColumns(isAll) {
					let columns = [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							width: 100,
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'descriptioninfo',
							field: 'DescriptionInfo.Description',
							name: 'Description',
							width: 300,
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'TaxPercent',
							field: 'TaxPercent',
							name: 'Original Percentage',
							formatter: 'percent',
							width: 100,
							name$tr$: 'cloud.common.entityTaxPercent'
						},
						{
							id: 'CalculationOrder',
							field: 'CalculationOrder',
							name: 'Calculation Order',
							formatter: 'integer',
							width: 100,
							name$tr$: 'cloud.common.entityCalculationOrder'
						}
					];
					if (isAll) {
						let otherColumns = [
							{
								id: 'AmountNet',
								field: 'AmountNet',
								name: 'Net Amount',
								formatter: 'money',
								width: 100,
								name$tr$: 'procurement.common.paymentAmountNet',
							},
							{
								id: 'AmountNetOc',
								field: 'AmountNetOc',
								name: 'Net Amount Oc',
								formatter: 'money',
								width: 100,
								name$tr$: 'procurement.common.paymentAmountNetOc',
							},
							{
								id: 'AmountTax',
								field: 'AmountTax',
								name: 'Amount Tax',
								formatter: 'money',
								width: 100,
								name$tr$: 'procurement.common.paymentAmountTax',
							},
							{
								id: 'AmountTaxOc',
								field: 'AmountTaxOc',
								name: 'Amount Tax Oc',
								formatter: 'money',
								width: 100,
								name$tr$: 'procurement.common.paymentAmountTaxOc',
							},
							{
								id: 'TaxPercentCalculation',
								field: 'TaxPercentCalculation',
								name: 'Tax Percent',
								formatter: 'percent',
								width: 100,
								name$tr$: 'cloud.common.entityTaxPercent',
							}
						];
						return columns.concat(otherColumns);
					}
					return columns;
				};

				service.openPopup = function openPopup(e, scope, fromDetailForm) {
					clickFromDetailForm = fromDetailForm;
					let popupOptions = {
						templateUrl: globals.appBaseUrl + '/procurement.common/templates/prc-common-salestaxcode-complex-lookup.html',
						title: 'procurement.common.saleTaxCode.SalesTaxCodeGridTitle',
						showLastSize: true,
						controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
						width: 700,
						height: 300,
						focusedElement: angular.element(e.target.parentElement),
						relatedTarget: angular.element(e.target),
						scope: scope.$new(),
						formatter: service.displayFormatter // return custom input content
					};
					// toggle popup
					popupToggle.toggle(popupOptions);

					function controller($scope, lookupControllerFactory, $popupInstance) {
						let entity = scope.$parent.$parent.entity;
						initController($scope, lookupControllerFactory, entity, $popupInstance);
						$scope.$on('$destroy', function () {
							if ($scope.$close) {
								$scope.$close();
							}
						});
					}
				};

				service.setItemService = function setItemService(currentModule) {
					if (_.isObject(itemService)) {
						return;
					}

					switch (currentModule) {
						case 'procurement.invoice':
							itemService = $injector.get('procurementInvSalesTaxDataService');
							break;
						default:
							break;
					}
				};

				service.getSearchList = function getSearchList(config, scope, value) {
					var entity = scope.$parent.$parent.entity;
					var ledgerContextFk = procurementContextService.companyLedgerContextFk;
					var salesTaxMatrixsEx = LookupDescriptorService.getData('salestaxmatrixs');
					var url = _.isUndefined(value) ? 'basics/lookupdata/master/getlist?lookup=salestaxcode' : 'basics/lookupdata/master/getsearchlist?lookup=salestaxcode&filtervalue=' + value;
					return $http.get(globals.webApiBaseUrl + url).then(function (response) {

						var salesTaxCodesEx = _.filter(response.data, function (column) {
							return column.LedgerContextFk === ledgerContextFk && column.IsLive;
						});

						// fiter  key: 'procurement-common-sales-tax-code-complex-filter'
						let deleteIds = _.map(entity.MdcSalesTaxCodes, 'Id');
						_.remove(salesTaxCodesEx, function (item) {
							return _.includes(deleteIds, item.Id);
						});

						_.forEach(salesTaxCodesEx, function (watchField) {
							var _taxMatrix = _.find(salesTaxMatrixsEx, function (ex) {
								return ex.SalesTaxCodeFk === watchField.Id && ex.SalesTaxGroupFk === entity.MdcSalesTaxGroupFk;
							});
							if (_taxMatrix) {
								watchField.TaxPercent = _taxMatrix.TaxPercent;
							}
						});

						return salesTaxCodesEx;
					});
				};

				return service;
			}
		]);
})(angular);