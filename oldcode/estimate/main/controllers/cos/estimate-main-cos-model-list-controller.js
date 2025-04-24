/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	/* globals _ */
	let moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstance2ObjectListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance2object grid.
	 */
	angular.module(moduleName).controller('estimateMainCosModelListController', [
		'$scope', '$timeout', 'platformGridControllerService', 'constructionSystemMainObjectUIConfigService', 'constructionSystemMainObjectService',
		'constructionSystemMainClipboardService', 'platformGridAPI',
		'constructionSystemHighlightToggleService', '$translate', 'basicsCommonHeaderColumnCheckboxControllerService',
		'mainViewService', 'modelMainObjectSidebarService', 'modelViewerModelSelectionService', '$injector', 'constructionSystemMainInstanceService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($scope, $timeout, platformGridControllerService, uiConfigService, dataService, cosMainClipboardService,
			platformGridAPI, constructionSystemHighlightToggleService, $translate, basicsCommonHeaderColumnCheckboxControllerService,
			mainViewService, objectSidebarSvc, modelViewerModelSelectionService, $injector, constructionSystemMainInstanceService) {

			// noinspection JSUnusedGlobalSymbols
			let gridConfig = {
				idProperty: 'IdString',
				columns: [],
				type: 'cosModelObjects',
				dragDropService: cosMainClipboardService,
				dragTextCallback: function (items) {
					/* let mainObjectsSelected = _.filter(dataService.getList(), function (item) {
					 return angular.isDefined(item.IsChecked) === true && item.IsChecked === true;
					 });
					 if (mainObjectsSelected.length > 0) {
					 return mainObjectsSelected.length + (mainObjectsSelected.length > 1 ? ' (items)' : '  (item)');
					 } */
					if (items.length > 0) {
						return items.length + (items.length > 1 ? ' (items)' : ' (item)');
					}
					return '';
				}
			};

			let modelId = constructionSystemMainInstanceService.getCurrentSelectedModelId();
			dataService.loadDataOnlyOnce(modelId);

			platformGridControllerService.initListController($scope, uiConfigService, dataService, null, gridConfig);

			let checkAll = function checkAll(e) {
				dataService.checkAllItems(e.target.checked);
			};
			let headerCheckBoxFields = ['IsChecked'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}
			];

			basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataService, headerCheckBoxFields, headerCheckBoxEvents);

			/* function updateTools() {
				$scope.tools.update();  // force to call disabled fn of toolbar buttons
			} */

			$scope.isCheckedValueChange = dataService.isCheckedValueChange;

			let setCellEditable = function (e, arg) {
				return arg.column.field === 'IsChecked';
			};

			// TODO: platformGridAPI.rows.selection need get Selected Rows Items, but now it can't
			function getGridItemList(gridId) {
				return platformGridAPI.rows.getRows(gridId);
			}

			let objectSelectedList = [];
			cosMainClipboardService.objectSelectedList.register(function () {
				dataService.objectSelectList.fire(objectSelectedList);
			});

			function fillSelectedObjects(rows, items) {
				objectSelectedList = [];
				_.forEach(rows, function (item) {
					objectSelectedList.push(items[item]);
				});
			}

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', function (e, arg) {
				fillSelectedObjects(arg.rows, getGridItemList($scope.gridId));
				constructionSystemHighlightToggleService.setMainSelectionOnViewer(e, arg, getGridItemList($scope.gridId));
			});

			let removeItems = ['create', 'delete', 'createChild'];

			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});

			$scope.tools.items.unshift({
				id: 't1000',
				sort: 2,
				caption: $translate.instant('constructionsystem.main.toggleHighlight'),
				type: 'check',
				iconClass: 'tlb-icons ico-view-select',
				value: constructionSystemHighlightToggleService.highlight.isMainObject(),
				fn: function () {
					constructionSystemHighlightToggleService.toggleHighlight(getGridItemList($scope.gridId),
						constructionSystemHighlightToggleService.highlight.mainObject);
				}
			});

			$scope.viewerSettings = _.extend({filter: 'disabled'}, mainViewService.customData($scope.gridId, 'viewerSettings'));

			/**
			 * @ngdoc function
			 * @name saveViewerSettings
			 * @function
			 * @methodOf modelViewerHoopsController
			 * @description Saves the current viewer settings to the database.
			 */
			function saveViewerSettings() {
				mainViewService.customData($scope.gridId, 'viewerSettings', $scope.viewerSettings);
			}

			modelViewerModelSelectionService.setItemSource('pinnedModel');

			// filter Objects
			$scope.tools.items.unshift({
				id: 'objectFilter',
				caption: 'model.viewer.filterSelector',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-menu2',
				list: {
					cssClass: 'radio-group',
					activeValue: $scope.viewerSettings.filter,
					items: [{
						id: 'disableFilter',
						type: 'radio',
						value: 'disabled',
						caption: $translate.instant('model.viewer.filters.disabled.command'),
						fn: function () {
							$scope.viewerSettings.filter = this.value;
							dataService.setFilterId(this.value);
							saveViewerSettings();
						}
					}, {
						id: 'filterByMain',
						type: 'radio',
						value: 'moduleContext',
						caption: $translate.instant('model.viewer.filters.mainEntity.command'),
						fn: function () {
							$scope.viewerSettings.filter = this.value;
							dataService.setFilterId(this.value);
							saveViewerSettings();
						}
					}, {
						id: 'sidebarFilter',
						type: 'radio',
						value: 'objectSearchSidebar',
						caption: $translate.instant('model.viewer.filters.objectSideBar.command'),
						fn: function () {
							$scope.viewerSettings.filter = this.value;
							dataService.setFilterId(this.value);
							saveViewerSettings();
						}
					}]
				}
			});
			// use time out to set filter and load objects, according db config set
			$timeout(function () {
				dataService.setFilterId($scope.viewerSettings.filter);
			});

			// show sidebar filter model object
			dataService.registerObjectsFilter();
			objectSidebarSvc.requireSidebar();

			// use for 3DViewer highlight toggle between main object and assigned object
			let toggleHighlight = function toggleHighlight() {
				let t1000 = _.filter($scope.tools.items, {id: 't1000'})[0];
				t1000.value = constructionSystemHighlightToggleService.highlight.isMainObject();
				$scope.tools.update();
			};

			constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.register(toggleHighlight);

			function costGroupLoaded(costGroupCatalogs){
				$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, uiConfigService, costGroupCatalogs, dataService, {});
			}
			dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

			/* refresh the columns configuration when controller is created */
			if(dataService.costGroupCatalogs){
				costGroupLoaded(dataService.costGroupCatalogs);
			}

			$scope.$on('$destroy', function () {
				dataService.unregisterObjectsFilter();
				objectSidebarSvc.unrequireSidebar();
				constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.unregister(toggleHighlight);
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', constructionSystemHighlightToggleService.setMainSelectionOnViewer);
				dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});
		}
	]);
})(angular);
