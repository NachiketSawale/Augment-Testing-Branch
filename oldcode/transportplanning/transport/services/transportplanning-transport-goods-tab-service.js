/**
 * Created by lav on 10/29/2018.
 */
(function (angular) {
	'use strict';
	/* global _, globals */

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportGoodsTabService', Service);

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
			return 'transportplanningTransportGoodsTabService';
		};

		service.initialize = function (scope) {

			var additionColumns = [
				{
					id: 'pquantity',
					field: 'PQuantity',
					disallowNegative: true,
					editor: 'quantity',
					formatter: 'quantity',
					name$tr$: 'transportplanning.transport.wizard.PredefinedQuantity',
					width: 120,
					pinned: true,
					sortable: true,
					validator: function (item, value, field) {
						return packageValidationService.validateQuantity(item, value, field);
					}
				},
				{
					id: 'freedescription',
					field: 'freeDescription',
					editor: 'description',
					formatter: 'description',
					name$tr$: 'transportplanning.transport.wizard.freeDesc',
					width: 120,
					pinned: true,
					sortable: true
				},
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'basicsUnitLookupDataService'
				}, {
					id: 'puomfk',
					field: 'PUomFk',
					name$tr$: 'transportplanning.transport.wizard.PredefinedUom',
					width: 120,
					pinned: true,
					sortable: true
				})
			];

			_.each(additionColumns, function (column) {
				if (column.id === 'puomfk') {
					column.editor = null;
				}
			});

			_.times(5, function (index) {
				var add = ++index;
				additionColumns.push({
					id: 'prefilluserdefined' + add,
					field: 'PrefillUserdefined' + add,
					editor: 'description',
					formatter: 'description',
					name$tr$: 'transportplanning.transport.wizard.prefillEntityUserDefText',
					name$tr$param$: {p_0: add}, // jshint ignore: line
					maxLength: 252,
					sortable: true
				});
			});

			var preTab;

			scope.onTabSelect = function (tab) {
				if (preTab) {
					if (!service.endEdit(preTab)) {
						preTab.active = true;
						return;
					}
				}
				tab.initialized = true;
				preTab = tab;
			};

			scope.tabs = [
				{
					titleStr: 'transportplanning.transport.wizard.bundles',
					service: 'transportplanningTransportCreateTransportRouteDialogBundleService',
					uiService: 'transportplanningBundleUIStandardService',
					grid: {state: '2ce23bdf556541fb9d4d7bc146d78eb3'},
					active: true,
					initialized: true,
					updateItemList: function (rows, adds) {
						updateItemListFn(rows, adds, true);
					}
				}, {
					titleStr: 'productionplanning.common.product.products',
					service: 'transportplanningTransportCreateTransportRouteDialogProductService',
					uiService: 'productionplanningCommonProductUIStandardService',
					grid: {state: '190e38f8c2ef44159ad2980520a17077'},
					updateItemList: function (rows, adds) {
						updateItemListFn(rows, adds, false);
					}
				}, {
					titleStr: 'transportplanning.transport.wizard.materials',
					service: 'transportplanningTransportCreateTransportRouteDialogMaterialService',
					uiService: 'basicsMaterialRecordUIConfigurationService',
					grid: {state: '3ce23bdf556541fb9d4d7bc146d78eb3'},
					additionalColumns: additionColumns,
					canCopy: true,
					idProperty: 'Uuid'
				},
				{
					titleStr: 'transportplanning.transport.wizard.resources',
					service: 'transportplanningTransportCreateTransportRouteDialogResourceService',
					uiService: 'resourceMasterUIStandardService',
					grid: {state: '4ce23bdf556541fb9d4d7bc146d78eb4'},
					additionalColumns: additionColumns,
					canCopy: true,
					idProperty: 'Uuid'
				}, {
					titleStr: 'resource.equipment.plantListTitle',
					service: 'trsCreateRouteDialogPlantService',
					uiService: 'resourceEquipmentPlantLayoutService',
					grid: {state: '1d8863a23fe442269f98cf1235cbc00a'},
					additionalColumns: additionColumns,
					canCopy: true,
					idProperty: 'Uuid'
				}, {
					titleStr: 'transportplanning.transport.wizard.upstreamItem',
					service: 'trsCreateRouteDialogUpstreamItemService',
					uiService: getPpsItemUpstreamItemUIService(),
					grid: {state: '15d6d1611bcc4a478b25ef1fb59916a8'},
					additionalColumns: additionColumns,
					// canCopy: true,
					// idProperty: 'Uuid'
				},
				/* {
				 titleStr: 'transportplanning.transport.resReservationListTitle',
				 service: 'transportplanningTransportCreateTransportRouteDialogResReservationService',
				 uiService: 'resourceReservationUIStandardService',
				 grid: {state: '5ce23bdf556541fb9d4d7bc146d78eb5'},
				 additionalColumns: additionColumns
				 } */
			];

			function getPpsItemUpstreamItemUIService() {
				const dataService = $injector.get('ppsUpstreamItemDataService').getService();
				return $injector.get('ppsUpstreamItemUIStandardService').getService(dataService);
			}

			function updateItemListFn(rows, adds, forBundle)
			{
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
										if(isDefaultMode){
											scope.entity.ProjectDefFk = respond.data.ProjectFk;
											scope.entity.JobDefFk = selectedJobFk;
											UIStandardService.updatePlannedDelivery(scope.entity);
											UIStandardService.validateAll(scope.entity, ['JobDefFk']);
										}
									}
								}));
						}
						// update project&job if site not mapped
						if(forBundle === true){
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
						}
					]
				};
				tab.gridId = gridId;
				basicsCommonToolbarExtensionService.addBtn(tab, null, null, 'G');

				if (tab.canCopy) {
					var copyToolItem = {
						id: 't-1',
						caption: 'cloud.common.taskBarDeepCopyRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-copy-paste-deep',
						fn: function () {
							dataService.copyItem();
						},
						disabled: function () {
							return !dataService.canCopy();
						}
					};
					tab.tools.items.splice(2, 0, copyToolItem);
				}

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

			service.isAnyGoodsSelected = function () {
				for (var i = 0; i < scope.tabs.length; i++) {
					if (getService(scope.tabs[i].service).getList().length > 0) {
						return true;
					}
				}
				return false;
			};

			service.isValid = function () {
				return !platformDataValidationService.hasErrors(service);
			};

			service.clear = function () {
				_.forEach(scope.tabs, function (tab) {
					getService(tab.service).deleteAll();
				});
			};
		};

		function getService(service) {
			return _.isString(service) ? $injector.get(service) : service;
		}

		return service;
	}
})(angular);