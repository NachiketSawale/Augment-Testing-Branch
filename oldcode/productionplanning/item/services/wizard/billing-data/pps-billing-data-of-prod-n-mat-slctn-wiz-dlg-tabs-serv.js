/**
 * Created by zwz on 12/27/2024.
 */
// remark: implementation of ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabsService is based on copy from transportplanningTransportGoodsTabService
(function (angular) {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabsService', Service);

	Service.$inject = ['$injector',
		'platformGridAPI',
		'$translate',
		'basicsLookupdataConfigGenerator',
		'transportplanningPackageValidationServiceFactory',
		'platformDataValidationService',
		'transportplanningTransportCreateRouteDialogUIStandardService',
		'$http',
		'$q',
		'platformCreateUuid',
		'basicsCommonToolbarExtensionService'];

	function Service($injector,
		platformGridAPI,
		$translate,
		basicsLookupdataConfigGenerator,
		transportplanningPackageValidationServiceFactory,
		platformDataValidationService,
		UIStandardService,
		$http,
		$q,
		platformCreateUuid,
		basicsCommonToolbarExtensionService) {

		var service = {};
		var packageValidationService = transportplanningPackageValidationServiceFactory.createService(service);
		service.getModule = function () {
			return 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabService';
		};

		service.initialize = function (scope) {

			const materialAdditionalColumns = [
				{
					id: 'pquantity',
					field: 'PQuantity',
					disallowNegative: true,
					editor: 'quantity',
					formatter: 'quantity',
					name$tr$: 'transportplanning.transport.wizard.PredefinedQuantity',
					width: 120,
					pinned: true,
					fixed: true,
					sortable: true,
					validator: function (item, value, field) {
						return packageValidationService.validateQuantity(item, value, field);
					}
				},
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'basicsUnitLookupDataService'
				}, {
					id: 'puomfk',
					field: 'PUomFk',
					name$tr$: 'transportplanning.transport.wizard.PredefinedUom',
					width: 120,
					pinned: true,
					fixed: true,
					sortable: true
				})
			];
			_.each(materialAdditionalColumns, function (column) {
				if (column.id === 'puomfk') {
					column.editor = null;
				}
			});

			let preTab;

			scope.onTabSelect = function (tab) {
				if (preTab) {
					if (!service.endEdit(preTab)) {
						preTab.active = true;
						return;
					}
				}
				tab.initialized = true;
				preTab = tab;

				// if (platformGridAPI.grids.exist(tab.grid.state)) {
				// 	platformGridAPI.grids.resize(tab.grid.state);
				// 	console.log('resize grid' + tab.grid.state + ' on TabSelect');
				// }
			};

			scope.tabs = [
				{
					titleStr: 'productionplanning.common.product.products',
					service: 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabProductService',
					uiService: 'productionplanningCommonProductUIStandardService',
					grid: {state: '1fa2bbb32c83499f8f614a8c86f8d298'},
					updateItemList: function (rows, adds) {
						updateItemListFn(rows, adds, false);
					}
				}, {
					titleStr: 'productionplanning.common.product.materials',
					service: 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabMaterialService',
					uiService: 'basicsMaterialRecordUIConfigurationService',
					grid: {state: '25d25c016a58447aa19c553284e077af'},
					additionalColumns: materialAdditionalColumns,
				},
			];

			function updateItemListFn(rows, adds, forBundle) {
				if (scope.model === 'CreateNew') { // only active when in create transport wizard
					// use the latest add item(s) firstly, if not, use all item(s)
					var updatedRows = adds;
					if (!(updatedRows && updatedRows.length > 0)) {
						updatedRows = rows;
					}
					if (updatedRows && updatedRows.length > 0) {
						var promises = [];
						// update the default job if different and update entity after add bundle is true
						var selectedJobFk = updatedRows[0].LgmJobFk;
						if (scope.entity.JobDefFk !== selectedJobFk && scope.updateEntityAfterAddBundle) {
							scope.isBusy = true;
							promises.push($http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + selectedJobFk)
								.then(function (respond) {
									if (respond) {
										// only update the default job when current mode is the default mode.(by zwz 2024/2/6 for task DEV-7052)
										const isDefaultMode = scope.createWaypointForEachBundle === true;
										if (isDefaultMode) {
											scope.entity.ProjectDefFk = respond.data.ProjectFk;
											scope.entity.JobDefFk = selectedJobFk;
											UIStandardService.updatePlannedDelivery(scope.entity);
											UIStandardService.validateAll(scope.entity, ['JobDefFk']);
										}
									}
								}));
						}
						// update project&job if site not mapped
						if (forBundle === true) {
							var hasSiteItems = _.filter(updatedRows, function (item) {
								return !!item.SiteFk;
							});
							if (hasSiteItems.length > 0) {
								var existed = _.find(hasSiteItems, {SiteFk: scope.entity.SiteFk});
								if (!existed) {
									var siteId = hasSiteItems[0].SiteFk;
									scope.isBusy = true;
									promises.push($http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/getBySiteStock?siteId=' + siteId)
										.then(function (response) {
											if (response && response.data) {
												scope.entity.ProjectFk = response.data.ProjectFk;
												scope.entity.LgmJobFk = response.data.JobFk;
												UIStandardService.validateAll(scope.entity, ['JobDefFk']);
											}
										}));
								}
							}
						}
						$q.all(promises).then(function () {
							scope.isBusy = false;
						});
					}
				}
			}

			_.forEach(scope.tabs, function (tab) {
				var gridId = tab.grid.state;
				var dataService = getService(tab.service);
				dataService.initialize();
				tab.title = $translate.instant(tab.titleStr);
				tab.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'd0',
							type: 'divider'
						},
						{
							id: 't1',
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function () {
								dataService.createItem(scope.entity);
							},
							disabled: function () {
								return !dataService.canCreate();
							}
						},
						{
							id: 'd0',
							type: 'divider'
						},
						{
							id: 't2',
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: dataService.deleteItem,
							disabled: function () {
								return !dataService.canDelete();
							}
						},
						{
							id: 'd1',
							type: 'divider'
						},
						{
							id: 't16',
							sort: 10,
							caption: 'cloud.common.taskBarGrouping',
							type: 'check',
							iconClass: 'tlb-icons ico-group-columns',
							fn: function() {
								platformGridAPI.grouping.toggleGroupPanel(gridId, this.value);
							},
							value: platformGridAPI.grouping.toggleGroupPanel(gridId),
							disabled: false
						}
					]
				};
				tab.gridId = gridId;
				basicsCommonToolbarExtensionService.addBtn(tab, null, null, 'G');

				platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				function onSelectedRowsChanged() {
					var selected = platformGridAPI.rows.selection({
						gridId: gridId,
						wantsArray: true
					});
					dataService.setSelected(null, _.filter(selected, function (item) {
						return !!item;
					}));
				}

				function updateItemList(e, arg) {
					var grid = platformGridAPI.grids.element('id', gridId);
					if (!grid) {
						return;
					}
					var idProperty = tab.idProperty || 'Id';
					var addItems = _.filter(arg.addItems, function (item) {
						return !!item;
					});
					var deleteItems = _.filter(arg.deleteItems, function (item) {
						return !!item;
					});

					_.forEach(addItems, function (item) {
						if (tab.canCopy) {
							item[idProperty] = platformCreateUuid();
						}
						grid.dataView.insertItem(platformGridAPI.rows.getRows(gridId).length, item);
					});
					_.forEach(deleteItems, function (item) {
						grid.dataView.deleteItem(item[idProperty]);
					});
					var rows = platformGridAPI.rows.getRows(gridId);
					tab.title = $translate.instant(tab.titleStr) + (rows.length > 0 ? ' (' + rows.length + ')' : '');

					if (arg.selectedItem) {
						platformGridAPI.rows.selection({
							gridId: gridId,
							rows: [arg.selectedItem]
						});
						dataService.setSelected(null, [arg.selectedItem]);
						var rowIndex = _.findIndex(rows, function (item) {
							return item[idProperty] === arg.selectedItem[idProperty];
						});
						var columnIndex = _.findIndex(grid.instance.getColumns(), function (item) {
							return item.field === 'PQuantity';
						});
						grid.instance.setActiveCell(rowIndex, columnIndex);
						grid.instance.editActiveCell();
					} else {
						dataService.setSelected(null, null);
					}
					if (tab.updateItemList) {
						tab.updateItemList(rows, addItems);
					}
				}

				dataService.registerListLoaded(updateItemList);

				tab.destroy = function () {
					platformDataValidationService.removeDeletedEntitiesFromErrorList(dataService.getList(), service);
					dataService.unregisterListLoaded(updateItemList);
					platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				};
			});

			service.endEdit = function (target) {
				var result = true;
				var currentTab = target ? target : _.find(scope.tabs, function (tab) {
					return tab.active;
				});
				platformGridAPI.grids.commitEdit(currentTab.grid.state);
				if (!service.isValid()) {
					result = false;
					currentTab.active = true;
				}
				return result;
			};

			service.getResult = function () {
				const result = {};
				_.forEach(scope.tabs, function (tab) {
					const tabResult = getService(tab.service).getResult();
					Object.keys(tabResult).forEach(key => {
						if (Object.prototype.hasOwnProperty.call(result, key)) {
							result[key] = result[key].concat(tabResult[key]);
						} else {
							result[key] = tabResult[key];
						}
					});
				});
				return result;
			};

			service.destroy = function () {
				_.forEach(scope.tabs, function (tab) {
					tab.destroy();
				});
				platformDataValidationService.removeDeletedEntityFromErrorList(scope.entity, service);
			};

			service.isAnyProductOrMaterialSelected = function () {
				for (var i = 0; i < scope.tabs.length; i++) {
					if (getService(scope.tabs[i].service).getList().length > 0) {
						return true;
					}
				}
				return false;
			};
			service.isAnyProductSelected = function () {
				return getService(scope.tabs[0]?.service)?.getList()?.length > 0;
			};

			service.isValid = function () {
				return !platformDataValidationService.hasErrors(service);
			};

			service.clear = function () {
				_.forEach(scope.tabs, function (tab) {
					getService(tab.service).deleteAll();
				});
			};

			// temporary solution to fix issue that grid layout of tab product is not normal
			setTimeout(function() {
				//console.log('switch to tab material');
				scope.onTabSelect(scope.tabs[1]);
			}, 50);
			setTimeout(function() {
				//console.log('switch to tab product');
				scope.onTabSelect(scope.tabs[0]);
			}, 100);

		};

		function getService(service) {
			return _.isString(service) ? $injector.get(service) : service;
		}

		return service;
	}
})(angular);