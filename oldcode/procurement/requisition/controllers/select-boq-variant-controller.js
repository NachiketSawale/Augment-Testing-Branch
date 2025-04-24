(function (angular) {

	'use strict';
	let moduleName = 'procurement.requisition';
	angular.module(moduleName).controller('procurementRequisitionSelectBoqVariantController', procurementRequisitionSelectBoqVariantController);

	procurementRequisitionSelectBoqVariantController.$inject = ['_', '$scope', 'cloudCommonGridService', 'basicsLookupdataLookupFilterService',
		'procurementCommonPrcBoqUIStandardService', 'procurementCommonPrcBoqService', '$translate', 'WizardHandler', 'platformGridAPI',
		'platformTranslateService', 'procurementCommonPrcBoqMainUIStandardService', 'boqMainImageProcessor',
		'procurementRequisitionBoqVariantService', 'basicsLookupdataLookupControllerFactory'];

	function procurementRequisitionSelectBoqVariantController(_, $scope, cloudCommonGridService, basicsLookupdataLookupFilterService,
	                                                          procurementCommonPrcBoqUIStandardService, procurementCommonPrcBoqService,
	                                                          $translate, WizardHandler, platformGridAPI, platformTranslateService,
	                                                          procurementCommonPrcBoqMainUIStandardService, boqMainImageProcessor,
	                                                          procurementRequisitionBoqVariantService, basicsLookupdataLookupControllerFactory) {
		$scope.currentBoqItemGridId = 'C10DDE19ED424A19AF345ABCD5782456';
		$scope.boqItemGridData = {
			state: $scope.currentBoqItemGridId
		};
		let variantId = $scope.$parent.modalOptions.value.variantId;
		let lookupControllerFactory;
		loadBoqHeader();

		function loadBoqHeader() {
			let data = procurementCommonPrcBoqService.getService().getList();
			if (data.length > 0) {
				$scope.entity = data[0];
				loadBoqGrid();
			}
		}

		$scope.boqHeaderLookupOptions = {
			lookupDirective: 'prc-common-boq-header-lookup',
			descriptionMember: 'BoqRootItem.BriefInfo.Translated',
			lookupOptions: {
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedMMCChanged(e, args) {
						if (args.selectedItem) {
							$scope.entity = args.selectedItem;
							loadBoqItems();
						}
					}
				}]
			}
		};

		function insertImagesAndChecked(boqItem, boqItemInVariantList) {
			if (!boqItem || !angular.isObject(boqItem)) {
				return;
			}
			boqMainImageProcessor.processItem(boqItem);
			let hasItemVariant = _.find(boqItemInVariantList, function (boqItemInVariant) {
				return boqItem.Id === boqItemInVariant.Id;
			});
			if (hasItemVariant) {
				boqItem.IsChecked = true;
			}
			if (angular.isDefined(boqItem.BoqItems) && boqItem.BoqItems !== null) {
				_.forEach(boqItem.BoqItems, function (item){
					insertImagesAndChecked(item, boqItemInVariantList);
				});
			}
		}

		$scope.okClicked = function () {
			let boqHeaderId = $scope.entity.BoqHeader.Id;
			let grid = platformGridAPI.grids.element('id', $scope.currentBoqItemGridId);
			let gridDatas = grid.dataView.getRows();
			let selectedData = _.filter(gridDatas, function (item) {
				return item.IsChecked;
			});
			let items = [];
			_.forEach(selectedData, function (item) {
				items.push({
					ReqVariantFk: variantId,
					BoqHeaderFk: item.BoqHeaderFk,
					BoqItemFk: item.Id
				});
			});
			procurementRequisitionBoqVariantService.saveBoqVariant({
				BoqHeaderfk: boqHeaderId,
				ReqVariantFk: variantId,
				BoqVariantDtoList: items
			}).then(function () {
				$scope.$parent.$close(true);
				procurementRequisitionBoqVariantService.load();
			});
		};

		function onCellModified(e, arg) {
			let selected = platformGridAPI.rows.selection({
				gridId: $scope.currentBoqItemGridId
			});
			if (selected) {
				let col = arg.grid.getColumns()[arg.cell].field;
				let grid = platformGridAPI.grids.element('id', $scope.currentBoqItemGridId);
				let gridDatas = grid.dataView.getRows();
				if (col === 'IsChecked') {
					checkChildren(selected, selected.IsChecked);
					checkParent(gridDatas, selected, selected.IsChecked);
				}
				platformGridAPI.grids.refresh($scope.currentBoqItemGridId);
			}
		}

		function checkParent(allitems, entity, flg) {
			if (entity.BoqItemFk > 0) {
				let parentId = entity.BoqItemFk;
				let parent = _.find(allitems, function (item) {
					return item.Id === parentId;
				});
				if (parent) {
					if (flg) {
						parent.IsChecked = flg;
						checkParent(allitems, parent, flg);
					} else {
						let brothers = _.filter(allitems, function (item) {
							return item.BoqItemFk === parentId && item.Id !== entity.Id;
						});
						let brothersChecked = _.filter(brothers, function (item) {
							return item.IsChecked;
						});
						if (brothersChecked && brothersChecked.length > 0) {
							return;
						} else {
							parent.IsChecked = flg;
							checkParent(allitems, parent, flg);
						}
					}
				}

			}
		}

		function checkChildren(item, flg) {
			if (item.BoqItems !== null && item.BoqItems.length > 0) {
				_.forEach(item.BoqItems, function (boqItems){
					checkChildren(boqItems, flg);
				});
			}
			item.IsChecked = flg;
		}

		function setTools() {
			let toolBarItems = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'Dv0',
						type: 'divider'
					},
					{
						id: 'collapse',
						type: 'item',
						caption: 'cloud.common.toolbarCollapse',
						iconClass: 'tlb-icons ico-tree-collapse',
						fn: function () {
							let selected = platformGridAPI.rows.selection({gridId: $scope.currentBoqItemGridId});
							platformGridAPI.rows.collapseAllSubNodes($scope.currentBoqItemGridId, selected);

						}
					},
					{
						id: 'expand',
						type: 'item',
						caption: 'cloud.common.toolbarExpand',
						iconClass: 'tlb-icons ico-tree-expand',
						fn: function () {
							let selected = platformGridAPI.rows.selection({gridId: $scope.currentBoqItemGridId});
							platformGridAPI.rows.expandAllSubNodes($scope.currentBoqItemGridId, selected);

						}
					},
					{
						id: 'collapse-all',
						type: 'item',
						caption: 'cloud.common.toolbarCollapseAll',
						iconClass: 'tlb-icons ico-tree-collapse-all',
						fn: function () {
							platformGridAPI.rows.collapseAllNodes($scope.currentBoqItemGridId);
						}
					},
					{
						id: 'expand-all',
						type: 'item',
						caption: 'cloud.common.toolbarExpandAll',
						iconClass: 'tlb-icons ico-tree-expand-all',
						fn: function () {
							platformGridAPI.rows.expandAllNodes($scope.currentBoqItemGridId);
						}
					}
				]
			};

			_.forEach(toolBarItems.items, function(toolBar){
				$scope.tools.items.unshift(toolBar);
			});
		}

		function loadBoqGrid() {
			let columns = procurementCommonPrcBoqMainUIStandardService.getStandardConfigForListView().columns;
			if (platformGridAPI.grids.exist($scope.currentBoqItemGridId)) {
				platformGridAPI.grids.unregister($scope.currentBoqItemGridId);
			}
			if (!platformGridAPI.grids.exist($scope.currentBoqItemGridId)) {
				let tempColumns = angular.copy(columns);
				_.forEach(tempColumns, function (item) {
					item.readonly = true;
					item.editor = null;
					item.navigator = null;
				});
				let colDef = {
					id: 'IsChecked',
					field: 'IsChecked',
					name$tr$: 'procurement.requisition.variant.check',
					formatter: 'boolean',
					editor: 'boolean',
					width: 50,
					sortable: true
				};
				tempColumns.unshift(colDef);
				let grid = {
					data: [],
					columns: angular.copy(tempColumns),
					id: $scope.currentBoqItemGridId,
					gridId: $scope.currentBoqItemGridId,
					options: {
						tree: true,
						indicator: true,
						iconClass: '',
						enableDraggableGroupBy: false,
						enableConfigSave: true
					},
					treeOptions:{
						tree: true,
						idProperty: 'Id',
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems',
						showFilterRow: false,
						showHeaderRow: false,
						initialState: 'expanded',
					},
					lazyInit: true,
					enableConfigSave: false
				};

				platformTranslateService.translateGridConfig(grid.columns);
				platformGridAPI.events.register($scope.currentBoqItemGridId, 'onCellChange', onCellModified);
				if (!$scope.tools) {
					lookupControllerFactory = basicsLookupdataLookupControllerFactory.create({
						grid: true,
						dialog: true,
						search: false
					}, $scope, grid);
				}
				setTools();
			}
			loadBoqItems();
		}

		function loadBoqItems() {
			if ($scope.entity.BoqHeader) {
				let boqHeaderId = $scope.entity.BoqHeader.Id;
				procurementRequisitionBoqVariantService.loadBoqVariant(variantId).then(function (res) {
					let boqItemInVariantList = res.data;
					let reqHeader = $scope.$parent.modalOptions.value.reqHeader;
					procurementRequisitionBoqVariantService.loadBoqStructure(boqHeaderId, reqHeader).then(function (res1) {
						let boqItems = res1.data.dtos;
						_.forEach(boqItems, function (item) {
							insertImagesAndChecked(item, boqItemInVariantList);
						});
						if (lookupControllerFactory){
							lookupControllerFactory.updateData(boqItems);
						}
					});
				});
			}
		}

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.currentBoqItemGridId)) {
				platformGridAPI.grids.unregister($scope.currentBoqItemGridId);
			}
		});

	}

})(angular);