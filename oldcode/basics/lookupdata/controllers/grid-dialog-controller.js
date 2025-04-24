/**
 * Created by wui on 7/31/2015.
 */

(function(angular, global){
	'use strict';

	var moduleName = 'basics.lookupdata';

	/*jshint -W072*/ // has too many parameters.
	angular.module(moduleName).controller('basicsLookupdataGridDialogController',[
		'$scope',
		'$log',
		'platformGridAPI',
		'$modalInstance',
		'keyCodes',
		'basicsCommonUtilities',
		'$timeout',
		'basicsLookupdataTreeHelper',
		'basicsLookupdataLookupControllerFactory',
		'_',
		'platformTranslateService',
		'platformCreateUuid',
		function ($scope,
				  $log,
				  platformGridAPI,
				  $modalInstance,
				  keyCodes,
				  basicsCommonUtilities,
				  $timeout,
				  basicsLookupdataTreeHelper,
				  lookupControllerFactory,
				  _,
				  platformTranslateService,
				  platformCreateUuid) {
			var setting = $scope.settings,
				gridId = setting.uuid,
				selectedRowId = $scope.editModeHandler.getSelectedRowId();

			if (!gridId) {
				$log.warn('Lookup ' + setting.lookupType + ' miss uuid definition!');
				gridId = platformCreateUuid();
			}

			var gridOptions = {
					gridId: gridId,
					idProperty: setting.idProperty,
					lazyInit: angular.isDefined(setting.gridOptions.lazyInit) ? setting.gridOptions.lazyInit : true
				},
				ctrlConfig = {
					grid: true,
					dialog: true,
					search: true
				},
				extension = _.merge({}, setting, gridOptions),
				self = lookupControllerFactory.create(ctrlConfig, $scope, extension);

			$scope.searchValue = '';
			$scope.alerts = [];
			$scope.settings = extension;
			$scope.searchValueModified = undefined;
			$scope.okBtnDisabled = function(){
				return typeof $scope.canSelect === 'function' && !$scope.canSelect();
			};
			$scope.canSelect = function(){
				var selectItem = self.getSelectedItems();
				if(_.isArray(selectItem)){
					selectItem = selectItem[0];
				}
				if(!selectItem) {
					//no selected items.
					return false;
				}
				if(!!$scope.settings && angular.isFunction($scope.settings.selectableCallback) && !$scope.settings.selectableCallback(selectItem)) {
					//inaccessible selected item.
					return false;
				}
				//it is an accessible selected item.
				return true;
			};
			/**
			 * @description: search data from server side.
			 */
			$scope.search = function (searchValue, doRefresh, doBeforeSearch, doProcessData) {
				var searchValueModified = searchValue !== $scope.searchValue;
				$scope.searchValue = searchValue;
				$scope.isLoading = true;

				if ($scope.settings.treeOptions && $scope.settings.treeOptions.dataProvider) {
					var dataProvider = $scope.settings.treeOptions.dataProvider,
						filter = {
							SearchString: searchValue,
							StartId: 0,
							Depth: 3
						};

					dataProvider.getSearchList(filter).then(function (data) {
						refreshGridData(angular.isArray(data) ? data : []);
					});
				}
				else {
					if(searchValueModified) {
						// reset data page.
						$scope.settings.dataView.resetDataPage();
					}

					if ($scope.settings.treeOptions && $scope.settings.treeOptions.lazyLoad) {
						$scope.settings.treeOptions.startId = null;
						$scope.settings.treeOptions.initialState = null;
					}

					if (angular.isFunction(doBeforeSearch)) {
						doBeforeSearch();
					}

					$scope.settings.dataView.simpleSearch({
						searchFields: $scope.settings.inputSearchMembers,
						searchString: searchValue,
						doRefresh: doRefresh,
						formEntity: processFormEntity(),
						treeOptions: $scope.settings.treeOptions
					}).then(function (data) {
						if (angular.isFunction(doProcessData)) {
							data = doProcessData(data, $scope.settings.treeOptions);
						}
						refreshGridData(data);
						if (data.length > 0){
							$log.log(data[0].log);
						}
					});
				}
				$scope.searchValueModified = searchValueModified;
			};

			if ($scope.settings && $scope.settings.formContainerOptions) {
				$scope.formData = _.isFunction($scope.settings.formContainerOptions.entity) ?
					$scope.settings.formContainerOptions.entity($scope.entity) :
					$scope.settings.formContainerOptions.entity;
			}

			$scope.onSearch = function (searchValue) {
				if (self.isMultiCheckEnabled()) {
					self.clearSelectedItems();
				}

				$scope.search(searchValue);
			};

			/**
			 * @description reload lookup data.
			 */
			$scope.refresh = function () {
				if (self.isMultiCheckEnabled()) {
					self.clearSelectedItems();
				}

				// exists external data refresh callback.
				if ($scope.settings.onDataRefresh) {
					$scope.settings.onDataRefresh($scope);
				} else {
					$scope.search($scope.searchValue, true);
				}
			};

			// publish method to refresh grid data
			$scope.refreshData = refreshGridData;

			$scope.$on('$destroy', function () {
				$scope.close();
				unsubscribeGridEvents();
				self.destroy();
			});

			initialize();

			/**
			 * @description: initialize.
			 */
			/* jshint -W035 */
			function initialize() {
				$modalInstance.opened.then(function () {
					$timeout(function () {
						if ($scope.settings.isTextEditable) {
							$scope.searchValue = $scope.ngModel;
						}
						else {
							$scope.searchValue = $scope.displayText;
						}

						$('div[modal-window]').find('input:first').focus();
					}, 300); // wait for modal dialog animation finished.
				});

				$scope.alerts = handleAlert($scope.settings.dialogOptions.alerts);
				subscribeGridEvents();
				self.onApply.register(applySelection);
				self.onSearch.register(search);

				// show initial data item depend on edit value in grid.
				//added below function because selectedRowId can not be set as editable value which caused unexpected result
				if(angular.isFunction($scope.settings.dataProvider.getInitData)) {
					$scope.settings.dataProvider.getInitData($scope).then(function (data) {
						if (angular.isArray(data)) {
							refreshGridData(data);
						}
					});
				}
				else if ($scope.settings.isTextEditable) {
					if (angular.isDefined($scope.ngModel)) {
						if ($scope.settings.dataProvider.identifier === 'default') { // default lookup data provider
							$scope.search($scope.ngModel);
						}
						else {
							// custom lookup provider (estimate code lookup dialog)
							$scope.settings.dataProvider.getSearchList($scope.ngModel, $scope.settings.displayMember).then(function (data) {
								if (angular.isArray(data)) {
									// build tree structure
									if ($scope.settings.treeOptions) {
										var context = {
											treeOptions: $scope.settings.treeOptions,
											IdProperty: $scope.settings.treeOptions.idProperty
										};
										data = basicsLookupdataTreeHelper.buildTree(data, context);
									}
									refreshGridData(data);
								}
								else {
									refreshGridData(!_.isEmpty(data) ? [data] : []);
								}
							});
						}
					}
				}
				else {
					if (selectedRowId) {
						$scope.settings.dataView.getItemById($scope.ngModel).then(function (data) {
							if (angular.isArray(data)) {
								refreshGridData(data);
							}
							else {
								refreshGridData(!_.isEmpty(data) ? [data] : []);
							}
							if (data && data.Id === $scope.ngModel) {
								$scope.settings.dataView.resetDataPage({
									count: 1,
									currentLength: 1,
									number: 0,
									totalLength: 1
								});
							}
						});
					}
					else if (selectedRowId === null) {
						if (angular.isDefined($scope.ngModel) && $scope.ngModel !== null) {
							$scope.settings.dataProvider.getSearchList($scope.ngModel, $scope.settings.displayMember).then(function (data) {
								if (angular.isArray(data)) {
									refreshGridData(data);
								}
								else {
									refreshGridData(!_.isEmpty(data) ? [data] : []);
								}
							});
						}
					}
				}

				// reset dataPage parameters.
				$scope.settings.dataView.resetDataPage();
			}

			/**
			 * @description: close search dialog.
			 */
			function applySelection() {
				var selectedItems = self.getSelectedItems(),
					selectedItem = selectedItems.length ? selectedItems[0] : null;

				if ($scope.canSelect(selectedItem)) {
					$scope.$close({
						isOk: true,
						selectedItem: selectedItem
					});
				}

				// Handle multi-selection, special case for estimate module.
				if ($scope.settings.gridOptions.multiSelect) {
					$scope.onSelectedItemsChanged.fire(global.event, {
						selectedItems: selectedItems,
						lookupOptions: $scope.options
					}, $scope);
				}

				// if it is multi-checked, apply other checked items directly except the first one
				if (self.isMultiCheckEnabled() && selectedItems?.length > 1) {
					if (!$scope.settings.multiCheckOptions.applyCallback) {
						throw new Error('multiCheckOptions.applyCallback is undefined!')
					}
					selectedItems.shift();
					$scope.settings.multiCheckOptions.applyCallback(selectedItems, $scope.entity);
				}
			}

			/**
			 * @description: do search.
			 */
			function search(e, searchValue) {
				$scope.search(searchValue);
			}

			/**
			 * @description: set node info for tree view to select initial item.
			 */
			function processGridData(items) { /*jshint -W074*/ // this function's cyclomatic is too high
				if (!angular.isArray(items)) {
					return;
				}

				if ($scope.settings.treeOptions && $scope.settings.treeOptions.dataProcessor) {
					items = $scope.settings.treeOptions.dataProcessor(items);
				}
				else if($scope.settings.dataProcessors && _.isArray($scope.settings.dataProcessors)){
					_.forEach($scope.settings.dataProcessors, function(proc){
						_.forEach(items, function(item){
							proc.processItem(item);
						});
					});
				}
				//add css 'disabled' according to method 'selectableCallback'.
				var selectableCallback = $scope.settings.selectableCallback;
				if(angular.isFunction(selectableCallback)){
					var disabledOption = {rowCss: 'disabled', grid:{mergedCells:{selectable: false}}};
					var treeOptions = $scope.settings.treeOptions;
					applyOptionToItems(items, disabledOption, treeOptions && treeOptions.childProp , selectableCallback);
				}
				// var idMatch = function (dataItem) {
				// 	return $scope.extractValue(dataItem, $scope.settings.valueMember) === selectedRowId;
				// };

				var textMatchBest = function (dataItem, targetStr, displayMember) {
					var testStr = $scope.extractValue(dataItem, displayMember);
					var targetPattern = '^' + basicsCommonUtilities.ensurePattern(targetStr) + '$';
					var targetRegExp = new RegExp(targetPattern, 'i');
					return targetRegExp.test(testStr);
				};

				var textMatchBetter = function (dataItem, targetStr, displayMember) {
					var testStr = $scope.extractValue(dataItem, displayMember);
					var targetPattern = basicsCommonUtilities.ensurePattern(targetStr);
					var targetRegExp = new RegExp(targetPattern, 'i');
					return targetRegExp.test(testStr);
				};

				var textMatchLess = function (dataItem, targetStr, displayMember) {
					var testStr = $scope.extractValue(dataItem, displayMember);
					var wordList = _.words(targetStr);
					var targetPattern = '';
					wordList.forEach(function (word) {
						if (targetPattern) {
							targetPattern += '|';
						}
						targetPattern += basicsCommonUtilities.ensurePattern(word);
					});
					var targetRegExp = new RegExp(targetPattern, 'i');
					return targetRegExp.test(testStr);
				};

				if ($scope.settings.treeOptions) { // tree data.

					var bestMatchedNode = null, betterMatchedNode = null, lessMatchedNode = null;
					var processNode = function (node, level, targetStr, displayMember) { // set value of collapsed true for all parent items of selected item.

						if (!bestMatchedNode && textMatchBest(node, targetStr, displayMember)) {
							bestMatchedNode = node;
						}
						if (!bestMatchedNode && !betterMatchedNode && textMatchBetter(node, targetStr, displayMember)) {
							betterMatchedNode = node;
						}
						if (!bestMatchedNode && !betterMatchedNode && !lessMatchedNode && textMatchLess(node, targetStr, displayMember)) {
							lessMatchedNode = node;
						}

						// If has search keyword expands all nodes.
						if (angular.isUndefined(node.nodeInfo)) {
							node.nodeInfo = {
								level: level,
								collapsed: !!$scope.settings.treeOptions.lazyLoad && !$scope.searchValue,
								children: level > 0
							};
						} else {
							node.nodeInfo.level = level;
							node.nodeInfo.collapsed = (!!$scope.settings.treeOptions.lazyLoad && !$scope.searchValue) ? node.nodeInfo.collapsed : false;
							node.nodeInfo.children = level > 0;
						}

						var childItems = $scope.extractValue(node, $scope.settings.treeOptions.childProp);
						if (angular.isArray(childItems)) {
							for (var k = 0; k < childItems.length; k++) {
								processNode(childItems[k], level + 1, targetStr, displayMember);
							}
						}
					};

					// if ($scope.settings.isTextEditable) {
					var targetStr;
					if (_.isEmpty($scope.searchValue)) {
						targetStr = $scope.ngModel;
					}
					else {
						targetStr = $scope.searchValue;
					}

					if (!targetStr || targetStr === -1 || (!!$scope.settings.treeOptions.lazyLoad && !$scope.searchValue)) {
						return false;
					}

					var getMatchNode = function (displayMember) {
						for (var ti1 = 0; ti1 < items.length; ti1++) {
							processNode(items[ti1], 0, targetStr, displayMember);
						}
					};

					if (!$scope.settings.matchDisplayMembers) {
						$scope.settings.matchDisplayMembers = [$scope.settings.displayMember];
					}

					angular.forEach($scope.settings.matchDisplayMembers, function (displayMember) {
						getMatchNode(displayMember);
					});

					var matchedNode = bestMatchedNode || betterMatchedNode || lessMatchedNode;
					if (matchedNode) {
						$scope.displayItem = matchedNode; // set display item.
						selectedRowId = $scope.displayItem.Id; // temporarily, later will add an option 'idProperty' to adapt to new case(estimate resource dialog edit)
					}

				}
				else { // flat data.
					if ($scope.settings.isTextEditable) {
						for (var j = 0; j < items.length; j++) {
							if ($scope.extractValue(items[j], $scope.settings.displayMember) === $scope.ngModel) {
								// set display item through edit value.
								$scope.displayItem = items[j];
								selectedRowId = $scope.editModeHandler.getSelectedRowId();
								break;
							}
						}
					}
				}
			}
			/**
			 * @description: apply option to items.
			 */
			function applyOptionToItems(items, option, childProp, callback){
				for(var i = 0; i< items.length; i++){
					if( !callback(items[i]) ){
						items[i].__rt$data = _.merge(items[i].__rt$data || {},option);
					}
					if( childProp && angular.isArray(items[i][childProp]) ){
						applyOptionToItems((items[i][childProp]), option, childProp, callback);
					}
				}
			}

			/**
			 * @description: refresh grid data.
			 */
			function refreshGridData(data) {
				processGridData(data);
				self.updateData(data);
				// handle "selectedRowId" in processGridData function if isTextEditable = true
				self.selectRowById(selectedRowId);
			}

			function loadTreeChildrenAsync(e, arg) {
				if (!_.isEmpty(arg.item[$scope.settings.treeOptions.childProp])) {
					return;
				}
				selectedRowId = arg.item.Id;
				var dataView = platformGridAPI.grids.element('id', $scope.gridId).dataView,
					treeRoots = dataView.getItems(),
					filteredItems = dataView.getFilteredItems().rows;

				$scope.search('', null, function doBeforeSearch() {
					$scope.settings.treeOptions.startId = arg.item.Id;
				}, function doProcessData(resultData) {
					var parent = _.find(filteredItems, {Id: arg.item.Id});
					if (parent) {
						parent[$scope.settings.treeOptions.childProp] = resultData;
					}
					return treeRoots;
				});
			}

			function onGridDblClick() {
				if (self.isMultiCheckEnabled()) {
					const selectedItem = platformGridAPI.rows.selection({gridId: gridId});

					if (selectedItem) {
						self.checkItem(selectedItem);
					}
				}

				applySelection();
			}

			function onGridHeaderCheckboxChanged() {
				$scope.$root.safeApply();
			}

			/**
			 * @description: subscribe slick grid events after it initialized.
			 */
			function subscribeGridEvents() {
				platformGridAPI.events.register(gridId, 'onDblClick', onGridDblClick);
				platformGridAPI.events.register(gridId, 'onRowsChanged', onGridDataViewRowsChanged);
				if ($scope.settings && $scope.settings.treeOptions && $scope.settings.treeOptions.lazyLoad) {
					platformGridAPI.events.register(gridId, 'onTreeNodeExpanding', loadTreeChildrenAsync);
				}
				if(self.isMultiCheckEnabled()) {
					platformGridAPI.events.register(gridId, 'onHeaderCheckboxChanged', onGridHeaderCheckboxChanged);
				}
			}

			/**
			 * @description: unsubscribe slick grid events before it destroyed.
			 */
			function unsubscribeGridEvents() {
				platformGridAPI.events.unregister(gridId, 'onDblClick', onGridDblClick);
				platformGridAPI.events.unregister(gridId, 'onRowsChanged', onGridDataViewRowsChanged);
				if ($scope.settings && $scope.settings.treeOptions && $scope.settings.treeOptions.lazyLoad) {
					platformGridAPI.events.unregister(gridId, 'onTreeNodeExpanding', loadTreeChildrenAsync);
				}
				if(self.isMultiCheckEnabled()) {
					platformGridAPI.events.unregister(gridId, 'onHeaderCheckboxChanged', onGridHeaderCheckboxChanged);
				}
			}

			/**
			 * @description: slick grid event handler
			 */
			function onGridDataViewRowsChanged(e, args) {
				var gridInstance = self.getGrid();
				var selectedRows = gridInstance.getSelectedRows();

				if (gridInstance && args.rows.length > 0 && selectedRows.length === 0 && selectedRowId) {
					self.selectRowById(selectedRowId);
				}
			}

			/**
			 * show dialog alerts.
			 * @param items
			 * @returns {*}
			 */
			function handleAlert(items) {
				if (!angular.isArray(items)) {
					return [];
				}

				return platformTranslateService.translateObject(items.map(function (item) {
					var defaults = {};

					switch (item.theme) {
						case 'info':
							defaults = {title: 'Note', title$tr$: 'basics.common.alert.info', css: 'alert-info'};
							break;
						case 'error':
							defaults = {title: 'Error', title$tr$: 'basics.common.alert.danger', css: 'alert-danger'};
							break;
						case 'success':
							defaults = {title: 'Success', title$tr$: 'basics.common.alert.success', css: 'alert-success'};
							break;
						case 'warning':
							defaults = {title: 'Warning', title$tr$: 'basics.common.alert.warning', css: 'alert-warning'};
							break;
					}

					return _.merge(defaults, item);
				}));
			}

			function processFormEntity() {
				var formData = null;
				if (!$scope.settings || !$scope.settings.formContainerOptions) {
					return formData;
				}

				var formOptions = $scope.settings.formContainerOptions.formOptions,
					entity = $scope.formData;
				if (formOptions.configure) {
					formData = _.reduce(formOptions.configure.rows, function rowIterator(result, row) {
						var dataValue = entity[row.model];
						if (!_.isUndefined(dataValue) && dataValue !== null && dataValue !== '') {
							result[row.model] = dataValue;
						}
						return result;
					}, {});
				}
				return formData;
			}
		}
	]);

})(angular, window);
