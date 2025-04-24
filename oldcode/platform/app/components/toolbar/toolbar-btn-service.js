(function () {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name toolbarBtnService
	 * @function
	 *
	 * @description
	 * Serves toolbar button defintions
	 **/

	toolbarBtnService.$inject = ['_',
		'globals',
		'$translate',
		'reportingPrintService',
		'platformGridAPI',
		'basicsLookupdataPopupService',
		'platformContextMenuTypes'];

	function toolbarBtnService(_,
		globals,
		$translate,
		reportingPrintService,
		platformGridAPI,
		basicsLookupdataPopupService,
		platformContextMenuTypes) {

		var service = {};

		service.addPrintBtn = function addPrintBtn2Toolbar(scope, toolbarItems) {

			toolbarItems.push({
				id: 't109',
				sort: 108,
				caption: 'cloud.common.print',
				iconClass: 'tlb-icons ico-print-preview',
				type: 'item',
				fn: function () {
					reportingPrintService.printGrid(scope.gridId);
				},
				disabled: function () {
					return scope.showInfoOverlay;
				}
			});
		};

		service.addLayoutBtn = function addLayoutBtn(scope, toolbarItems) {
			toolbarItems.push({
				id: 't111',
				sort: 112,
				caption: 'cloud.common.gridlayout',
				iconClass: 'tlb-icons ico-settings',
				type: 'item',
				fn: function () {
					platformGridAPI.configuration.openConfigDialog(scope.gridId);
				},
				disabled: function () {
					return scope.showInfoOverlay; //  || gridConfig.disableConfig;
				}
			});
		};

		service.addGroupingBtn = function addGroupingBtn(scope, toolbarItems) {
			var btnDef = {
				id: 't12',
				sort: 10,
				caption: 'cloud.common.taskBarGrouping',
				type: 'check',
				iconClass: 'tlb-icons ico-group-columns',
				fn: function () {
					platformGridAPI.grouping.toggleGroupPanel(scope.gridId, this.value);
				},
				value: platformGridAPI.grouping.toggleGroupPanel(scope.gridId),
				disabled: function () {
					return scope.showInfoOverlay;
				}
			};
			toolbarItems.push(btnDef);
		};

		service.addSearchColumnBtn = function addSearchColumnBtn(scope, toolbarItems) {
			var btnDef = {
				id: 'gridSearchColumn',
				sort: 160,
				caption: 'cloud.common.taskBarColumnFilter',
				type: 'check',
				iconClass: 'tlb-icons ico-search-column',
				fn: function () {
					toggleColumnFilter(scope.gridId, this.value);
					if (this.value) {
						var searchAllBtn = getBtn(toolbarItems, 'gridSearchAll');
						if (searchAllBtn) {
							searchAllBtn.value = false;
						}
						toggleFilter(scope.gridId, false, true);
					}
				},
				disabled: function () {
					return scope.showInfoOverlay;
				}
			};
			toolbarItems.push(btnDef);
		};

		service.addSearchAllBtn = function addSearchAllBtn(scope, toolbarItems) {
			var btnDef = {
				id: 'gridSearchAll',
				sort: 150,
				caption: 'cloud.common.taskBarSearch',
				type: 'check',
				iconClass: 'tlb-icons ico-search-all',
				fn: function () {
					scope.toggleFilter(this.value);
					if (this.value) {
						var searchColBtn = getBtn(toolbarItems, 'gridSearchColumn');
						if (searchColBtn) {
							searchColBtn.value = false;
						}
						toggleColumnFilter(scope.gridId, false, true);
					}
				},
				disabled: function () {
					return scope.showInfoOverlay;
				}
			};
			toolbarItems.push(btnDef);
		};

		service.addCopyPasteBtn = function addCopyPasteBtn(scope, toolbarItems) {
			var btnDef = {
				id: 'copyPaste',
				caption: 'cloud.common.exportClipboard',
				sort: 199,
				type: 'dropdown-btn',
				icoClass: 'tlb-icons ico-clipboard',
				cssClass: 'tlb-icons ico-clipboard',
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 't100',
							sort: 100,
							type: 'check',
							caption: 'cloud.common.exportArea',
							fn: function () {
								platformGridAPI.grids.setAllowCopySelection(scope.gridId, this.value);
							},
						},
						{
							id: 't200',
							sort: 200,
							caption: 'cloud.common.exportCopy',
							type: 'item',
							fn: function () {
								platformGridAPI.grids.copySelection(scope.gridId);
							}
						}
						// {
						// 	id: 't300',
						// 	sort: 300,
						// 	caption: 'cloud.common.exportPaste',
						// 	type: 'item',
						// 	fn: function () {
						// 		platformGridAPI.grids.pasteSelection(scope.gridId);
						// 	}
						// }
					]
				}
			};
			toolbarItems.push(btnDef);
		};

		function toggleFilter(gridId, active, clearFilter) {
			platformGridAPI.filters.showSearch(gridId, active, clearFilter);
		}

		function toggleColumnFilter(gridId, active, clearFilter) {
			platformGridAPI.filters.showColumnSearch(gridId, active, clearFilter);
		}

		function getBtn(toolbarItems, id) {
			return _.find(toolbarItems, function (item) {
				return item.id === id;
			});
		}

		function generateTreeLevelToolbaritems(scope, treeLevel, toolbar, currentID) {

			toolbar.maxLevel = treeLevel;
			let treeLevelItems = [];

			for (let level = 0; level <= treeLevel; level++) {
				treeLevelItems.push({
					id: level,
					type: 'item',
					caption: level,
					cssClass: 'tree-level-btn' + (!_.isUndefined(currentID) && currentID === level ? ' active' : ''),
					fn: function (value) {
						service.setSelectedTreeLevel(scope, parseInt(value));
						basicsLookupdataPopupService.hidePopup(0);
					},
					listCssClass: 'horizontal-list-item'
				});
			}

			toolbar.list.items = treeLevelItems;
		}

		service.setSelectedTreeLevel = function(scope, currentID) {
			$('.tree-level-btn.active').removeClass('active');
			if (scope.gridId) {
				platformGridAPI.grids.setTreeGridLevel(scope.gridId, currentID);
			}
			$('.tree-level-btn.level' + currentID).addClass('active');
		};

		service.setToolbarItemsForTreeLevel = function(scope, toolbar, maxLevel, selectedLevel) {
			generateTreeLevelToolbaritems(scope, maxLevel, toolbar, selectedLevel);
		};

		service.addToolbarItemsForTreeLevelGrid = function(scope, currentID) {

			//currentID = pre selection in Toolbar
			let toolbarItemId = 'treeGridAccordion';

			let toolbar = {
				id: toolbarItemId,
				sort: 58,
				type: 'sublist',
				cssClass: 'horizontal-list tree-level',
				contextAreas: [platformContextMenuTypes.gridRow.type],
				contextGroup: 5,
				list: {
					items: [],
					initOnce: true
				}
			}

			generateTreeLevelToolbaritems(scope, 9, toolbar, currentID);

			return toolbar;
		};

		return service;
	}

	angular.module('platform').factory('platformToolbarBtnService', toolbarBtnService);

})();
