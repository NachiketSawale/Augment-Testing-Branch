/**
 * Created by anl on 11/19/2018.
 */


(function (angular) {
	/*global moment*/
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionSynchronizeWizardService', SynchronizeWizardService);
	SynchronizeWizardService.$inject = ['$q', '$http', 'platformModalService', '$translate',
		'ItemTypes',
		'platformGridAPI',
		'PlatformMessenger',
		'platformTranslateService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService'];

	function SynchronizeWizardService($q, $http, platformModalService, $translate,
									  ItemTypes,
									  platformGridAPI,
									  PlatformMessenger,
									  platformTranslateService,
									  platformRuntimeDataService,
									  basicsLookupdataLookupDescriptorService) {

		var sourceList = [];
		var synList = [];
		var service = {};
		var requisition;

		service.onPackageChanged = new PlatformMessenger();

		service.onPackageChanged.register(function (selected, grid) {
			if (selected) {
				synList.push(selected);
			}
			if (grid) {
				platformGridAPI.grids.refresh(grid.id, true);
			}
		});

		service.getSynList = function () {
			return synList;
		};

		service.getRequisition = function () {
			return requisition;
		};

		var modalConfig = {
			templateUrl: 'transportplanning.requisition/templates/transport-requisition-synchronize-template.html',
			controller: 'transportplanningRequisitionSynchronizeWizardController',
			resizeable: true,
			width: '900px'
		};

		service.createSynchronizeWizardDialog = function (trsRequisition) {
			synList = [];
			initData(trsRequisition).then(function () {
				var result = _.find(sourceList, {ItemType: ItemTypes.Route});
				if (sourceList.length > 0 && result) {
					platformModalService.showDialog(modalConfig);
				}
				else {
					platformModalService.showDialog({
						headerTextKey: $translate.instant('transportplanning.requisition.synchronizeDialog.dialogTitle'),
						bodyTextKey: 'transportplanning.requisition.synchronizeDialog.noRouteError',
						iconClass: 'ico-error'
					});
				}
			});
		};

		function initData(trsRequisition) {
			sourceList = [];
			var url = globals.webApiBaseUrl + 'transportplanning/requisition/wizard/synlist/?reqId=' + trsRequisition.Id;
			return $http.get(url).then(function (response) {
				sourceList = response.data.SynList;
				requisition = response.data.Requisition;
			});
		}

		service.initDialog = function ($scope) {

			var requisitionColumns = [
				{
					editor: null,
					field: 'ReqItemCode',
					formatter: 'code',
					id: 'reqItemCode',
					name: 'Code',
					name$tr$: 'cloud.common.code',
					searchable: true,
					sortable: true,
					width: 90
				}, {
					editor: null,
					field: 'ReqItemDescription',
					formatter: 'description',
					id: 'reqItemDescription',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					sortable: true,
					width: 150
				}];

			var dynamicEntityColumn = [
				{
					editor: 'decimal',
					field: 'ReqItemQuantity',
					formatter: 'decimal',
					id: 'reqItemQuantity',
					name: 'Quantity',
					name$tr$: 'basics.common.Quantity',
					sortable: true,
					width: 65
				}, {
					field: 'ReqItemEntityId',
					id: 'reqItemEntityId',
					name: 'Entity',
					name$tr$: 'transportplanning.requisition.wizard.reqSubItemEntity',
					sortable: true,
					width: 100,
					formatter: 'dynamic',
					editor: 'dynamic',
					domain: function (item, column) {
						var domain = 'description';
						if (item.ItemType === ItemTypes.Resource || item.ItemType === ItemTypes.MaterialRequisition) {
							var prop = ItemTypes.properties[item.ItemType];
							if (prop) {
								domain = 'lookup';
								column.editorOptions = {
									directive: prop.directive,
									lookupOptions: {
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													args.entity.selectedEntity = args.selectedItem;
												}
											}
										]
									}
								};
								column.formatterOptions = {
									lookupType: prop.lookupType,
									displayMember: prop.displayMember
								};
								if (prop.version) {
									column.formatterOptions.version = prop.version;//for new lookup master api, the value of version should be greater than 2
								}
							}
							else {
								column.editorOptions = {readonly: true};
								column.formatterOptions = null;
							}
						}
						return domain;
					}
				},
				{
					id: 'reqItemEntityDesc',
					field: 'ReqItemEntityDesc',
					name: '*Entity-Description',
					name$tr$: 'transportplanning.requisition.wizard.reqItemEntityDesc',
					formatter: 'text',
					editor: null,
					width: 150
				}];

			var synchronizeColumn = [
				{
					editor: 'boolean',
					field: 'Synchronize',
					formatter: 'boolean',
					id: 'synchronize',
					name: 'Synchronize',
					name$tr$: 'transportplanning.requisition.wizard.synchronize',
					width: 70
				}];

			var packageColumns = [
				{
					editor: null,
					field: 'TargetCode',
					formatter: 'code',
					id: 'pkgCode',
					name: 'Package-Code',
					name$tr$: 'transportplanning.requisition.wizard.pkgCode',
					searchable: true,
					sortable: true,
					width: 90
				},
				{
					editor: null,
					field: 'TargetDescription',
					formatter: 'description',
					id: 'pkgDescription',
					name: 'Package-Description',
					name$tr$: 'transportplanning.requisition.wizard.pkgDesc',
					sortable: true,
					width: 150
				}, {
					editor: null,
					field: 'TargetQuantity',
					formatter: 'decimal',
					id: 'pkgQuantity',
					name: 'Package-Quantity',
					name$tr$: 'transportplanning.requisition.wizard.pkgQuantity',
					sortable: true,
					width: 100
				}
			];

			var routeColumns = [
				{
					editor: null,
					field: 'TargetCode',
					formatter: 'code',
					id: 'rteCode',
					name: 'Route-Code',
					name$tr$: 'transportplanning.requisition.wizard.routeCode',
					searchable: true,
					sortable: true,
					width: 90
				}, {
					editor: null,
					field: 'TargetDescription',
					formatter: 'description',
					id: 'rteDescription',
					name: 'Route-Description',
					name$tr$: 'transportplanning.requisition.wizard.routeDescription',
					sortable: true,
					width: 200
				}, {
					editor: null,
					field: 'PlannedStart',
					formatter: 'datetimeutc',
					id: 'date',
					name: 'Date',
					name$tr$: 'productionplanning.common.event.plannedStart',
					sortable: true,
					width: 200
				}];

			var simpleGridColumns = _.union(requisitionColumns, synchronizeColumn, packageColumns);
			var entityGridColumns = _.union(requisitionColumns, dynamicEntityColumn, synchronizeColumn, packageColumns);
			var routeGridColumns = _.union(synchronizeColumn, routeColumns);

			var preTab;

			$scope.onTabSelect = function (tab) {
				tab.initialized = true;
				preTab = tab;
			};

			$scope.isOKDisabled = function () {
				if (synList.length > 0) {
					return false;
				}
				return true;
			};

			$scope.title = $translate.instant('transportplanning.requisition.synchronizeDialog.dialogTitle');
			$scope.tabs = [
				{
					itemType: ItemTypes.Route,
					titleStr: 'transportplanning.transport.entityRoute',
					gridId: '6bba38d9efdb497f98ea5ec5629ad143'
				},
				{
					itemType: ItemTypes.MaterialRequisition,
					titleStr: 'transportplanning.transport.wizard.materials',
					gridId: 'e683d88dfb9347a1a1fe79e7084c1d16'
				},
				{
					itemType: ItemTypes.Resource,
					titleStr: 'resource.master.listMasterTitle',
					gridId: '518909660810400181140698da40585b'
				},
				{
					itemType: ItemTypes.Bundle,
					titleStr: 'transportplanning.transport.wizard.bundles',
					gridId: '2cf9b5d119ee424b9844be486d2ac7ba'
				},
				{
					itemType: ItemTypes.Product,
					titleStr: 'productionplanning.common.product.entity',
					gridId: '90f51b4831c5491785aff922a8217840'
				},
				{
					itemType: ItemTypes.Plant,
					titleStr: 'resource.equipment.plantListTitle',
					gridId: '12341b4831c5491785aff922a8217840'
				}
			];

			$scope.tabs[0].initialized = true;

			initForm($scope);

			_.forEach($scope.tabs, function (tab) {
				if (tab.itemType === ItemTypes.Bundle || tab.itemType === ItemTypes.Product || tab.itemType === ItemTypes.Plant) {
					initTab(tab, simpleGridColumns);
				}
				else if (tab.itemType === ItemTypes.MaterialRequisition || tab.itemType === ItemTypes.Resource) {
					initTab(tab, entityGridColumns);
				}
				else if (tab.itemType === ItemTypes.Route) {
					initTab(tab, routeGridColumns);
				}
			});

			service.destroyTabs = function () {
				_.forEach($scope.tabs, function (tab) {
					tab.destroy();
				});
			};

		};

		function initForm($scope) {
			var formConfig = {
				fid: 'transportplanning.requisition.synchronizeDialog.requisitionForm',
				showGrouping: false,
				addValidationAutomatically: true,
				skipPermissionCheck: true,
				groups: [
					{
						gid: 'baseGroup',
						header: 'transportplanning.requisition.entityRequisition',
						isOpen: true,
						attributes: ['Code', 'DescriptionInfo', 'PlannedStart']
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'code',
						label: 'Code',
						label$tr$: 'cloud.common.entityCode',
						model: 'Code',
						sortOrder: 1,
						readonly: true,
						type: 'code',
						width: 300
					},
					{
						gid: 'baseGroup',
						rid: 'descriptioninfo',
						label: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						model: 'DescriptionInfo',
						sortOrder: 2,
						readonly: true,
						type: 'translation',
						width: 300
					},
					{
						gid: 'baseGroup',
						rid: 'plannedstart',
						label: 'PlannedStart',
						label$tr$: 'cloud.common.entityDate',
						model: 'PlannedStart',
						sortOrder: 3,
						readonly: false,
						type: 'datetimeutc',
						width: 300,
						validator: function (entity, value, model) {
							var duration = moment.duration(moment.utc(requisition.PlannedStart).diff(value));
							if (duration._milliseconds !== 0) {
								platformRuntimeDataService.colorInfo(entity, model, 'bg-orange-4');
							}
							else {
								platformRuntimeDataService.colorInfo(entity, model, null);
							}
						}
					}
				]
			};
			$scope.formOptions = {
				entity: {
					Id: requisition.Id,
					Code: requisition.Code,
					DescriptionInfo: requisition.DescriptionInfo,
					PlannedStart: moment.utc(requisition.PlannedStart)
				},
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
		}

		function initTab(tab, gridColumns) {

			tab.modalOptions = {};

			var tabData = _.filter(sourceList, function (item) {
				return item.ItemType === tab.itemType;
			});

			tab.title = $translate.instant(tab.titleStr) + ' (' + tabData.length + ')';

			tab.grid = {
				columns: gridColumns,
				data: tabData,
				id: tab.gridId,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					iconClass: '',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: tab.gridId
			};

			if (tab.itemType !== ItemTypes.Route) {
				tab.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'd0',
							type: 'divider'
						},
						// {
						// 	id: 't1',
						// 	caption: 'cloud.common.taskBarNewRecord',
						// 	type: 'item',
						// 	iconClass: 'tlb-icons ico-rec-new',
						// 	fn: function () {
						// 		createItem(tab.selectedItem, tab.grid);
						// 	},
						// 	disabled: function () {
						// 		return !canCreate(tab.selectedItem);
						// 	}
						// },
						{
							id: 't2',
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function () {
								deleteItem(tab.selectedItem, tab.grid);
							},
							disabled: function () {
								return !canDelete(tab.selectedItem);
							}
						}
					]
				};
			}

			//set entity-description
			if (tab.itemType !== ItemTypes.ResourceReservation || tab.itemType !== ItemTypes.MaterialRequisition) {
				setPkgEntityDesc(tabData);
			}

			var gridInfo = platformGridAPI.grids.element('id', tab.gridId);
			if (gridInfo) {
				tab.grid = gridInfo;
			} else {
				platformGridAPI.grids.config(tab.grid);
				tab.grid = platformGridAPI.grids.element('id', tab.gridId);
			}

			function onCellChange(e, args) {
				var col = args.grid.getColumns()[args.cell].field;
				var resource = basicsLookupdataLookupDescriptorService.getLookupItem('ResourceMasterResource', args.item.ReqItemEntityId);
				var material = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialCommodity', args.item.ReqItemEntityId);
				if (col === 'ReqItemQuantity' || col === 'ReqItemEntityId') {
					args.item.Synchronize = true;
					if (args.item.TargetId === 0) {
						args.item.CreateItem = true;
						args.item.DeleteItem = false;
					}
					args.item.ReqItemUpdate = true;
					if (args.item.ItemType === ItemTypes.Resource) {
						args.item.TargetDescription = args.item.ReqItemDescription = resource.DescriptionInfo.Translated;
					}
					if (args.item.ItemType === ItemTypes.MaterialRequisition) {
						args.item.TargetDescription =args.item.ReqItemDescription = material.DescriptionInfo.Translated;
					}
					if (col === 'ReqItemEntityId') {
						var options = ItemTypes.properties[args.item.ItemType];
						args.item.ReqItemEntityDesc = _.get(args.item.selectedEntity, options.descriptionPropertyName);
					}
					service.onPackageChanged.fire(args.item, args.grid);
				}
				if (col === 'Synchronize') {
					if (args.item.Synchronize) {
						// if (args.item.ItemType === 4 || args.item.ItemType === 6) {
						// 	args.item.TargetDescription = args.item.ReqItemDescription;
						// }
						if (args.item.ItemType === ItemTypes.Route) {
							args.item.TimsShift = true;
						}
						if (args.item.TargetId === 0) {
							args.item.CreateItem = true;
							args.item.DeleteItem = false;
						}
						service.onPackageChanged.fire(args.item, args.grid);
					}
				}
			}

			function selectedItemChanged() {
				var selected = platformGridAPI.rows.selection({
					gridId: tab.gridId
				});
				if (selected) {
					tab.selectedItem = selected;
				}
			}

			platformGridAPI.events.register(tab.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register(tab.gridId, 'onSelectedRowsChanged', selectedItemChanged);

			tab.destroy = function () {
				platformGridAPI.events.unregister(tab.gridId, 'onCellChange', onCellChange);
				platformGridAPI.events.unregister(tab.gridId, 'onSelectedRowsChanged', selectedItemChanged);
				platformGridAPI.grids.unregister(tab.gridId);
			};
		}

		// function createItem(selected, grid) {
		// 	if (selected && selected.ReqItemId) {
		// 		selected.CreateItem = true;
		// 		selected.TargetId = 100000;
		// 		selected.TargetCode = 'Pkg-###';
		// 		selected.TargetDescription = selected.ReqItemDescription;
		// 		selected.TargetQuantity = selected.ReqItemQuantity;
		// 		selected.DeleteItem = false;
		// 		service.onPackageChanged.fire(selected, grid);
		// 	}
		// }

		// function canCreate(selected) {
		// 	return selected && selected.ReqItemId && !selected.TargetId;
		// }

		function deleteItem(selected, grid) {
			if (selected && selected.TargetId) {
				selected.DeleteItem = true;
				selected.TargetCode = '';
				selected.TargetDescription = '';
				selected.TargetQuantity = null;
				selected.CreateItem = false;
				service.onPackageChanged.fire(selected, grid);
			}
		}

		function canDelete(selected) {
			return selected && selected.TargetId;
		}

		function setPkgEntityDesc(pkgItems, callback) {
			var promises = [];
			_.forEach(pkgItems, function (pkg) {
				var descriptionPropertyName = _.get(ItemTypes.properties[pkg.ItemType], 'descriptionPropertyName');
				if (descriptionPropertyName) {
					promises.push(getPkgEntityData(pkg.ReqItemEntityId, pkg.ItemType).then(function (data) {
						pkg.ReqItemEntityDesc = _.get(data, descriptionPropertyName);
					}));
				}
			});
			$q.all(promises).then(function () {
				if (callback) {
					callback.call(this);
				}
			});
		}

		function getPkgEntityData(pkgEntity, pkgEntityType) {
			var lookupType = _.get(ItemTypes.properties[pkgEntityType], 'lookupType');
			var version = _.get(ItemTypes.properties[pkgEntityType], 'version');
			if (!lookupType) {
				return $q.when(null);
			}

			// handle basicsLookupdataLookupDescriptorService not support version 3 issue
			if (version === 3 && !basicsLookupdataLookupDescriptorService.hasLookupItem(lookupType, pkgEntity)) {
				return basicsLookupdataLookupDescriptorService.loadData(lookupType).then(function (data) {
					return _.find(data, {Id: pkgEntity});
				});
			}
			return basicsLookupdataLookupDescriptorService.loadItemByKey(lookupType, pkgEntity);
		}

		return service;
	}
})(angular);