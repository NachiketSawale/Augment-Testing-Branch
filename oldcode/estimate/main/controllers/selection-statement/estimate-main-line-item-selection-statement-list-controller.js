/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemSelectionStatementListController
	 * @function
	 * @description
	 * Controller for the  list view of Estimate Line Item Selection Statement
	 **/
	angular.module(moduleName).controller('estimateMainLineItemSelectionStatementListController', [
		'$scope', '$translate', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainLineItemSelStatementListService', 'estimateMainLineItemSelStatementConfigurationService',
		'estimateMainLiSelStatementListValidationService', 'estimateMainClipboardService', 'platformPermissionService','basicsCommonHeaderColumnCheckboxControllerService',
		function ($scope, $translate, $injector, platformGridAPI, platformGridControllerService, estimateMainLineItemSelStatementListService, estimateMainLineItemSelStatementConfigurationService,
				  estimateMainLiSelStatementListValidationService, estimateMainClipboardService,platformPermissionService, basicsCommonHeaderColumnCheckboxControllerService) {

			let gridConfig = {
				parentProp: 'EstLineItemSelStatementFk',
				childProp: 'EstLineItemSelStatementChildren',
				childSort: true,
				type: 'estlineitemselstatements',
				propagateCheckboxSelection : true,
				// skipPermissionCheck : true,
				cellChangeCallBack: onCellChangeCallBack,
				rowChangeCallBack: rowChangeCallBack,

				// allowedDragActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy, platformDragdropService.actions.link],
				dragDropService: estimateMainClipboardService,
				extendDraggedData: function (draggedData) {
					draggedData.modelDataSource = estimateMainClipboardService.myDragdropAdapter;
				}
			};

			$scope.subDivisionDisabled = true;

			platformGridControllerService.initListController($scope, estimateMainLineItemSelStatementConfigurationService, estimateMainLineItemSelStatementListService, estimateMainLiSelStatementListValidationService, gridConfig);

			let additionalTools = [
				{
					id: 'filterSelectionStatements',
					caption: 'cloud.common.toolbarFilter',
					type: 'check',
					value: estimateMainLineItemSelStatementListService.getFilterStatus(),
					iconClass: 'tlb-icons ico-filter',
					fn: function () {
						estimateMainLineItemSelStatementListService.setFilterStatus(this.value);
						estimateMainLineItemSelStatementListService.filterChanged.fire();
					},
					disabled: function(){
						return !isProjectLoaded();
					}
				},
				{
					id: 'dividerForApply',
					type: 'divider'
				},
				{
					id: 'applyForCurrentLineItems',
					caption: 'estimate.main.lineItemSelStatement.applySelectionStForCurrentLineItems',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh-one',
					fn: function () {
						let applyForCurrentLineItems = true;
						applySelectionStatementFn(applyForCurrentLineItems);
					},
					disabled: applyDisabledFn
				},
				{
					id: 'apply',
					caption: 'estimate.main.lineItemSelStatement.applySelectionSt',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh-all',
					fn: applySelectionStatementFn,
					disabled: applyDisabledFn
				},
				{
					id: 'dividerForApply',
					type: 'divider'
				},
				{
					id: 'import',
					caption: 'estimate.main.lineItemSelStatement.import',
					type: 'item',
					iconClass: 'tlb-icons ico-import',
					fn: function () {
						let basicsImportService = $injector.get('basicsImportService');

						let options = estimateMainLineItemSelStatementListService.getImportOptions();
						basicsImportService.showImportDialog(options);
					},
					disabled: function () {
						let isHeaderReadOnly = $injector.get('estimateMainService').isReadonly();
						if (isHeaderReadOnly){
							return true;
						}
						if(!platformPermissionService.hasWrite('49e56a48a2b5481189f871774a0e641a')){
							return true;
						}
						return !isProjectLoaded();
					}
				},
				{
					id: 'export',
					caption: 'estimate.main.lineItemSelStatement.export',
					type: 'item',
					iconClass: 'tlb-icons ico-export',
					fn: function () {
						let platformModalService = $injector.get('platformModalService');
						let selStatements = estimateMainLineItemSelStatementListService.getList();
						if (_.isEmpty(selStatements)) {
							platformModalService.showErrorBox('estimate.main.lineItemSelStatement.exportNoRecordsError', 'estimate.main.lineItemSelStatement.export');
							return;
						}
						let basicsExportService = $injector.get('basicsExportService');
						let options = estimateMainLineItemSelStatementListService.getExportOptions();

						basicsExportService.showExportDialog(options);
					},
					disabled: function(){
						let isHeaderReadOnly = $injector.get('estimateMainService').isReadonly();
						if (isHeaderReadOnly){
							return true;
						}
						let items = estimateMainLineItemSelStatementListService.getList();
						if (isProjectLoaded()){
							if (_.size(items) > 0){
								return false;
							}
						}
						return true;
					}
				},
				{
					id: 'tbNewDivision',
					caption: $translate.instant('cloud.common.toolbarNewDivision'),
					type: 'item',
					iconClass: 'tlb-icons ico-fld-ins-below',
					// permission: {'49e56a48a2b5481189f871774a0e641a':4},
					fn: function () {
						estimateMainLineItemSelStatementListService.createNewDivision();
					},
					disabled: function () {
						let isHeaderReadOnly = $injector.get('estimateMainService').getHeaderStatus();
						if (isHeaderReadOnly) {
							return true;
						}
						return !isProjectLoaded();
					}
				}
			];

			let tbCreateItem = _.find($scope.tools.items, {'id': 'create'});
			// eslint-disable-next-line no-prototype-builtins
			if (tbCreateItem && tbCreateItem.hasOwnProperty('fn')){
				tbCreateItem.fn = function () {
					estimateMainLineItemSelStatementListService.createNewItem();
				};
				tbCreateItem.disabled = function(){
					return !isProjectLoaded();
				};
			}
			let tbCreateChildItem = _.find($scope.tools.items, {'id': 'createChild'});
			// eslint-disable-next-line no-prototype-builtins
			if (tbCreateChildItem && tbCreateChildItem.hasOwnProperty('fn')){
				tbCreateChildItem.fn = estimateMainLineItemSelStatementListService.createNewSubDivision;
			}
			tbCreateChildItem.disabled = function () {
				return !!$scope.subDivisionDisabled;
			};

			_.forEach(additionalTools.reverse(), function(tool){
				$scope.tools.items.unshift(tool);
			});

			function showSelStatementExecutionReport(response){
				$scope.isLoading = false;
				$scope.isLoadingInfo = '';
				let dataItems = response.data;

				// Update line item selection statements state
				let data = { EstLineItemSelStatements: [] };
				_.forEach(dataItems.selStateDtos || [], function(item){
					data.EstLineItemSelStatements.push({ Id: item.EstLineItemSelStatementFk, StartTime: item.StartTime, LoggingMessage: item.LoggingMessage });
				});
				estimateMainLineItemSelStatementListService.handleUpdateDone(data);
				estimateMainLineItemSelStatementListService.gridRefresh();

				// Show dialog result
				let platformModalService = $injector.get('platformModalService');
				let modalOptions = {
					headerTextKey: 'estimate.main.lineItemSelStatement.report.title',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/selection-statement/line-item-selection-statement-result-report.html',
					iconClass: 'ico-info',
					dataItems: dataItems
				};

				// After dialog is closed, we filter the affected line items
				let filterLineItemsBySelStatementResult = function filterLineItemsBySelStatementResult() {
					let lineItemsResult = dataItems.lineItemsListUpdated;
					if (!_.isEmpty(lineItemsResult)){
						let lineItemIds = _.map(lineItemsResult, 'LineItemId');
						let lineItemsToFilter = { data:{ lineItemIds: lineItemIds } };
						// Display line items affected by selection statement only when it is not for current line items
						// if (dataItems.hasOwnProperty('isForCurrentLineItems') && dataItems.isForCurrentLineItems === false){
						estimateMainLineItemSelStatementListService.setFilterStatus(true);

						let filterTb = _.find($scope.tools.items, {'id' : 'filterSelectionStatements'});
						if (filterTb){
							filterTb.value = true;
						}
						$scope.tools.update();

						showSelStatementLineItemsFiltered(lineItemsToFilter);
						// }
					}
				};

				let selStatementResultDialog = platformModalService.showDialog(modalOptions);
				selStatementResultDialog.then(filterLineItemsBySelStatementResult,filterLineItemsBySelStatementResult);
			}

			function showSelStatementExecutionReportError() {
				$scope.isLoading = false;
				$scope.isLoadingInfo = '';
			}

			function onCellChangeCallBack(arg) {
				let grid = arg.grid,
					item = arg.item,
					field = arg.grid.getColumns()[arg.cell].field,
					cellIdx = arg.cell;
				if (field === 'IsExecute') {
					$scope.isLoading = true;
					estimateMainLineItemSelStatementListService.traverseCheckTree(item,item[field]);
					estimateMainLineItemSelStatementListService.gridRefresh();
					loopThroughParents(grid, item, field, cellIdx);
					estimateMainLineItemSelStatementListService.update().then(()=>{
						estimateMainLineItemSelStatementListService.filterChanged.fire();
						$scope.isLoading = false;
					});
					$scope.tools.update();
				}
			}

			// Workaround to update header checkbox status when children item is checked
			function checkIndeterminateness(){

				let grid = platformGridAPI.grids.element('id', $scope.gridId);
				if (grid && grid.instance){
					let _grid = grid.instance;
					let columnDef = _.find(_grid.getColumns(), {id: 'isexecute'});

					let headers = _grid.getColumnHeaders();
					let ele = headers.find('#chkbox_' + _grid.getUID() + '_' + columnDef.id);

					if(ele.length) {
						let data = estimateMainLineItemSelStatementListService.getList();
						let hasTrueValue = false;
						let hasFalseValue = false;

						if(data.length) {
							hasTrueValue = _.findIndex(data, _.set({}, columnDef.field, true)) !== -1;
							hasFalseValue = _.findIndex(data, _.set({}, columnDef.field, false)) !== -1;
						}

						ele.prop('disabled', !data.length);
						ele.prop('indeterminate', hasTrueValue && hasFalseValue);
						ele.prop('checked', hasTrueValue && !hasFalseValue);
					}
				}

			}

			function rowChangeCallBack(){
			}

			function applySelectionStatementFn(applyForCurrentLineItems) {
				let list = estimateMainLineItemSelStatementListService.getList();
				let selectStatements = _.filter(list, function(item){ return item.IsExecute === true && item.EstLineItemSelStatementType === 0; });
				if (_.isArray(selectStatements) && selectStatements.length > 0){
					$scope.isLoading = true;
					$scope.isLoadingInfo = $translate.instant('estimate.main.lineItemSelStatement.applying');

					estimateMainLineItemSelStatementListService.applyFilters(selectStatements, applyForCurrentLineItems).then(showSelStatementExecutionReport, showSelStatementExecutionReportError);
				}
			}

			function applyDisabledFn(){

				let isHeaderReadOnly = $injector.get('estimateMainService').isReadonly();
				if (isHeaderReadOnly ){
					return true;
				}
				let list = estimateMainLineItemSelStatementListService.getList();
				let selectStatements = _.filter(list, function(item){ return item.IsExecute === true && item.EstLineItemSelStatementType === 0; });
				if (isProjectLoaded()){
					if (_.size(selectStatements) === 0){
						return true;
					}
				}
				if(!platformPermissionService.hasRead('681223e37d524ce0b9bfa2294e18d650')){
					return true;
				}
				if(platformPermissionService.hasWrite('681223e37d524ce0b9bfa2294e18d650')){
					return false;
				}
				return true;
			}

			function isProjectLoaded(){
				let estimateMainService = $injector.get('estimateMainService');
				let projectId = estimateMainService.getSelectedProjectId();
				return _.isNumber(projectId) && projectId > 0;
			}

			function updateSubDivisionItem(){
				$scope.$evalAsync(function () {
					$scope.subDivisionDisabled = true;
					let currentItem = estimateMainLineItemSelStatementListService.getSelected();
					if (currentItem && Object.prototype.hasOwnProperty.call(currentItem, 'EstLineItemSelStatementType')) {
						if (currentItem.EstLineItemSelStatementType === 1) {
							$scope.subDivisionDisabled = false;
						}
					}
				});
				$scope.tools.update();
			}

			estimateMainLineItemSelStatementListService.registerSelectionChanged(updateSubDivisionItem);


			function onInitialized(){
				if(!platformPermissionService.hasCreate('49e56a48a2b5481189f871774a0e641a')){
					_.remove($scope.tools.items,{'id': 'tbNewDivision'});
				}
				updateCheckBoxStatus();
			}

			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			function onHeaderCheckboxChanged(e){
				$scope.isLoading = true;
				let data = estimateMainLineItemSelStatementListService.getList();
				_.forEach(data, function (item) {
					item.IsExecute = e.target.checked;
					estimateMainLineItemSelStatementListService.markItemAsModified(item);
				});
				estimateMainLineItemSelStatementListService.gridRefresh();
				estimateMainLineItemSelStatementListService.update().then(()=>{
					estimateMainLineItemSelStatementListService.filterChanged.fire();
					$scope.isLoading = false;
				});
				// Update toolbar
				$scope.tools.update();
			}

			function onFilterChange(){
				let estimateMainFilterService = $injector.get('estimateMainFilterService');
				let filterObjects = estimateMainFilterService.getFilterObjects();
				let selStFilter = 'estimateMainLineItemSelectionStatementListController';

				let filterKey = 'EST_SEL_STATEMENT';
				let isActive = estimateMainLineItemSelStatementListService.getFilterStatus();
				if (isActive){

					let list = estimateMainLineItemSelStatementListService.getList();
					let selectStatements = _.filter(list, function(item){ return item.IsExecute === true && item.EstLineItemSelStatementType === 0; });
					if (_.isArray(selectStatements) && selectStatements.length > 0){
						if (_.size(selectStatements) > 0){
							$scope.isLoading = true;
							$scope.isLoadingInfo = $translate.instant('estimate.main.lineItemSelStatement.filtering');
							estimateMainLineItemSelStatementListService.filterSelectionSt(selectStatements).then(showSelStatementLineItemsFiltered, showSelStatementLineItemsFilteredError);
						}
					}else{
						estimateMainFilterService.setFilterIds(filterKey, []);
						estimateMainFilterService.addFilter('estimateMainLineItemSelectionStatementListController', estimateMainLineItemSelStatementListService, function () {
							return true; // return all line items
						}, {id: filterKey, iconClass: 'tlb-icons ico-filter-script', captionId: 'filteringBySelStatements'}, 'Id');
					}
				}else{
					// eslint-disable-next-line no-prototype-builtins
					if (!filterObjects.hasOwnProperty(selStFilter)){
						return false;
					}
					estimateMainFilterService.setFilterIds(filterKey, []);
					estimateMainFilterService.removeFilter(selStFilter); // Remove the filter from LineItem

					let filterTb = _.find($scope.tools.items, {'id' : 'filterSelectionStatements'});
					if (filterTb){
						filterTb.value = false;
					}
					$scope.tools.update();
				}
			}

			function showSelStatementLineItemsFiltered(response){
				// Wait for line items to load
				setTimeout(function(){
					$scope.isLoading = false;
					$scope.isLoadingInfo = '';
				}, 600);

				let data = response.data;
				// eslint-disable-next-line no-prototype-builtins
				if (data.hasOwnProperty('lineItemIds')){

					let filterKey = 'EST_SEL_STATEMENT';
					let allFilterIds = [];
					let estimateMainFilterService = $injector.get('estimateMainFilterService');

					if (_.isArray(data.lineItemIds) && _.size(data.lineItemIds) > 0) {
						allFilterIds = data.lineItemIds;

						estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
						estimateMainFilterService.addFilter('estimateMainLineItemSelectionStatementListController', estimateMainLineItemSelStatementListService, function (lineItem) {
							return allFilterIds.indexOf(lineItem.Id) >= 0;
						}, {id: filterKey, iconClass: 'tlb-icons ico-filter-script', captionId: 'filteringBySelStatements'}, 'Id');
					} else {
						estimateMainFilterService.setFilterIds(filterKey, []);
						estimateMainFilterService.addFilter('estimateMainLineItemSelectionStatementListController', estimateMainLineItemSelStatementListService, function () {
							return false;
						}, {id: filterKey, iconClass: 'tlb-icons ico-filter-script', captionId: 'filteringBySelStatements'}, 'Id');
					}
				}
			}

			function showSelStatementLineItemsFilteredError() {
				$scope.isLoading = false;
				$scope.isLoadingInfo = '';
			}

			function onListLoaded(){
				updateCheckBoxStatus();
			}



			function updateCheckBoxStatus(){
				setTimeout(function(){
					let eleGrid = platformGridAPI.grids.element('id', $scope.gridId);
					if (eleGrid) {
						let grid = eleGrid.instance;
						let list = estimateMainLineItemSelStatementListService.getList();
						let cellIndex = _.findIndex(grid.getColumns(),{'id':'isexecute'});
						if(list.length) {
							loopThroughParents(grid, list[list.length-1],'IsExecute',cellIndex);
						}
					}
					checkIndeterminateness();
					$scope.tools.update();
				},200);
			}

			estimateMainLineItemSelStatementListService.updateCheckBoxStatus.register(updateCheckBoxStatus);

			// Translations are not applied when we do not have the filter editor properties. so we refresh the grid here to translate the selection statement properties
			estimateMainLineItemSelStatementListService.refreshToShowTranslations.register(estimateMainLineItemSelStatementListService.gridRefresh);

			estimateMainLineItemSelStatementListService.filterChanged.register(onFilterChange);

			estimateMainLineItemSelStatementListService.registerListLoaded(onListLoaded);

			var headerCheckBoxFields = ['IsExecute'];
			var headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: function(e){
						onHeaderCheckboxChanged(e);
					}
				}
			];

			function loopThroughParents(_grid, item, field, cellIdx) {
				if (!gridConfig.propagateCheckboxSelection) {
					return;
				}
				if (_grid) {
					let parentId = _.get(item, gridConfig.parentProp);
					if (parentId) {
						let rowIdx = _grid.getData().getIdxById(parentId);
						let parentItem = _grid.getData().getRows()[rowIdx];
						let childItems = _.get(parentItem, gridConfig.childProp);
						if (childItems) {
							loopThroughBrotherParent(_grid, field, cellIdx, _.filter(childItems, (e) => e.Id !== item.Item && e.HasChildren));
							loopThroughSingleParent(_grid, parentItem, field, cellIdx, parentId, childItems);
						}
						loopThroughParents(_grid, parentItem, field, cellIdx);
					}
				}
			}

			function loopThroughSingleParent(_grid, parentItem, field, cellIdx,parentId,childItems) {
				const trueCnt = childItems.filter(function (i) {
					return _.get(i, field) === true;
				}).length;
				const falseCnt = childItems.filter(function (i) {
					return _.get(i, field, false) === false;
				}).length;
				let value;
				let ele = angular.element('.item-id_' + parentId + ' >.r' + cellIdx + '.item-field_' + field + ' :input[type="checkbox"]');
				if (ele) {
					if ((trueCnt !== 0 && trueCnt !== childItems.length) || (falseCnt !== 0 && falseCnt !== childItems.length) || (trueCnt === 0 && falseCnt === 0)) {
						ele.prop('indeterminate', true);
						value = null;
					} else if (trueCnt === 0) {
						ele.prop('checked', false);
						value = false;
					} else {
						ele.prop('checked', true);
						value = true;
					}
				}
				_.set(parentItem, field, value);
			}

			function loopThroughBrotherParent(_grid, field, cellIdx, childItems) {
				_.forEach(childItems, function (item) {
					if (_.some(item[gridConfig.childProp], {'HasChildren': true})) {
						loopThroughBrotherParent(_grid, field, cellIdx, _.filter(item[gridConfig.childProp], (e) => e.HasChildren));
					}
					loopThroughSingleParent(_grid, item, field, cellIdx, item.Id, item[gridConfig.childProp]);
				});
			}

			basicsCommonHeaderColumnCheckboxControllerService.init($scope, estimateMainLineItemSelStatementListService, headerCheckBoxFields, headerCheckBoxEvents);

			$scope.$on('$destroy', function () {
				estimateMainLineItemSelStatementListService.filterChanged.unregister(onFilterChange);
				estimateMainLineItemSelStatementListService.updateCheckBoxStatus.unregister(updateCheckBoxStatus);
				estimateMainLineItemSelStatementListService.refreshToShowTranslations.unregister(estimateMainLineItemSelStatementListService.gridRefresh);
				estimateMainLineItemSelStatementListService.unregisterListLoaded(onListLoaded);
				estimateMainLineItemSelStatementListService.unregisterSelectionChanged(updateSubDivisionItem);
				platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
			});
		}
	]);
})(angular);
