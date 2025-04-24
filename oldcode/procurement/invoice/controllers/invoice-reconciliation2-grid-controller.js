/**
 * Created by wwa on 12/10/2015.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */

	var moduleName = 'procurement.invoice';

	angular.module(moduleName).factory('procurementInvoiceReconciliation2GridColumns',
		['$state', '$timeout', '$injector', 'cloudDesktopSidebarService', 'platformGridDomainService', 'platformModuleNavigationService', 'procurementInvoicePESDataService', 'procurementInvoiceContractDataService', 'cloudDesktopNavigationPermissionService',
			function ($state, $timeout, $injector, cloudDesktopSidebarService, platformGridDomainService, platformModuleNavigationService, procurementInvoicePESDataService, procurementInvoiceContractDataService, navigationPermissionService) {
				var service = {
					getStandardConfigForListView: getStandardConfigForListView
				};

				function goModule(moduleName) {
					/* var dataService = moduleName === 'procurementpes' ? $injector.get('procurementPesHeaderService') : $injector.get('procurementContractHeaderDataService'); */
					var items = moduleName === 'procurementpes' ? procurementInvoicePESDataService.getList() : procurementInvoiceContractDataService.getList();
					var ids = _.map(items, function (item) {
						return moduleName === 'procurementpes' ? item.PesHeaderFk : item.ConHeaderFk;
					});
					var defaultState = globals.defaultState;
					var url = defaultState + '.' + moduleName;
					$state.go(url).then(function () {
						$timeout(function () {
							cloudDesktopSidebarService.filterSearchFromPKeys(ids);
						}, 500);

					});
				}

				function getStandardConfigForListView() {
					return {
						columns: [
							{
								id: 'ReconName',
								field: 'Type',
								formatter: function (row, cell, value, columnDef, dataContext) {
									var formatterMarkup = value;
									var navigatorMarkup = '';
									var colDef = _.cloneDeep(columnDef);
									value = value.trim('').replace(' ', '').toLowerCase();
									if (value === 'frompes') {
										angular.extend(colDef, {
											navigator: {
												moduleName: 'procurement.pes',
												navFunc: function () {
													goModule('procurementpes');
												}
											}
										});
										navigatorMarkup = platformGridDomainService.getNavigator(colDef, dataContext);
										if (navigatorMarkup && !navigationPermissionService.hasPermissionForModule('procurement.pes')) {
											navigatorMarkup = angular.element(navigatorMarkup).attr('disabled', true).appendTo('<div></div>').parent().html();
										}
									} else if (value === 'fromcontract') {
										angular.extend(colDef, {
											navigator: {
												moduleName: 'procurement.contract',
												navFunc: function () {
													goModule('procurementcontract');
												}
											}
										});
										navigatorMarkup = platformGridDomainService.getNavigator(colDef, dataContext);
										if (navigatorMarkup && !navigationPermissionService.hasPermissionForModule('procurement.contract')) {
											navigatorMarkup = angular.element(navigatorMarkup).attr('disabled', true).appendTo('<div></div>').parent().html();
										}
									}
									return formatterMarkup + navigatorMarkup;
								},
								name: 'Type',
								name$tr$: 'procurement.invoice.reconciliation2.type',
								width: 120
							}, {
								id: 'ReconNet',
								field: 'Net',
								formatter: 'money',
								name: 'Net',
								name$tr$: 'procurement.invoice.entityNet',
								width: 120
							}, {
								id: 'ReconVat',
								field: 'Vat',
								formatter: 'money',
								name: 'Vat',
								name$tr$: 'procurement.invoice.entityVAT',
								width: 120
							}, {
								id: 'ReconGross',
								field: 'Gross',
								formatter: 'money',
								name: 'Gross',
								name$tr$: 'procurement.invoice.entityGross',
								width: 120
							}, {
								id: 'ReconNetOc',
								field: 'NetOc',
								formatter: 'money',
								name: 'Net(OC)',
								name$tr$: 'procurement.invoice.entityNetOc',
								width: 120
							}, {
								id: 'ReconVatOc',
								field: 'VatOc',
								formatter: 'money',
								name: 'Vat(OC)',
								name$tr$: 'procurement.invoice.entityVATOc',
								width: 120
							}, {
								id: 'ReconGrossOc',
								field: 'GrossOc',
								formatter: 'money',
								name: 'Gross(OC)',
								name$tr$: 'procurement.invoice.entityGrossOc',
								width: 120
							}
						]
					};
				}

				return service;
			}]);

	angular.module(moduleName).controller('procurementInvoiceReconciliation2GridController',
		['$scope', '$timeout', 'platformToolbarService', 'platformGridControllerService',
			'procurementInvoiceReconciliation2DataService', 'procurementInvoiceReconciliation2GridColumns', '$translate', 'procurementInvoiceHeaderDataService',
			function ($scope, $timeout, platformToolbarService, gridControllerService, dataService, uiConfigurationService, $translate, invoiceHeaderDataService) {
				var gridConfig = {
					columns: []
				};

				gridControllerService.initListController($scope, uiConfigurationService, dataService, null, gridConfig);

				var containerUUID = $scope.getContainerUUID();
				// remove unnecessary tools
				var toolItems = _.filter(platformToolbarService.getTools(containerUUID), function (item) {
					return item && item.id !== 'create' && item.id !== 'delete';
				});

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolItems
				});

				platformToolbarService.removeTools(containerUUID);

				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				invoiceHeaderDataService.registerSelectionChanged(updateTools);

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						var itemStatus = invoiceHeaderDataService.getItemStatus();
						if (itemStatus.IsReadOnly) {
							return true;
						} else {
							return dataService.getList().length === 0;
						}
					},
					fn: function updateCalculation() {
						invoiceHeaderDataService.updateReconciliation();
					}
				}, {
					id: 'd999',
					sort: 999,
					type: 'divider'
				}];

				gridControllerService.addTools(tools);

			}
		]);
})(angular);