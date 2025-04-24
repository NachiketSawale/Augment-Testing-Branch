(function (angular) {

	'use strict';

	angular.module('basics.lookupdata').factory('lookupFilterDialogControllerService', LookupFilterDialogControllerService);
	LookupFilterDialogControllerService.$inject = [
		'$q',
		'$translate',
		'$injector',
		'$timeout',
		'platformGridAPI',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupControllerFactory',
		'platformCreateUuid',
		'basicsLookupdataTreeHelper',
		'basicsCommonUtilities'];
	function LookupFilterDialogControllerService($q,
												 $translate,
												 $injector,
												 $timeout,
												 platformGridAPI,
												 platformTranslateService,
												 basicsLookupdataConfigGenerator,
												 lookupControllerFactory,
												 platformCreateUuid,
												 basicsLookupdataTreeHelper,
												 basicsCommonUtilities) {

		function initFilterDialogController($scope, $modalInstance) {
			$scope.gridTriggersSelectionChange = false;

			// grid's id === container's uuid
			var gridId = $scope.settings.uuid || platformCreateUuid();
			_.extend($scope, {
				gridId: gridId,
				gridData: {
					state: gridId
				},
				isLoading: false
			});

			var sOptions = $scope.options;
			sOptions.dataService.clearSelectionFilter();
			if (!sOptions.isTranslated) {
				platformTranslateService.translateGridConfig(sOptions.columns);
				sOptions.isTranslated = true;
			}
			var formConfig = platformTranslateService.translateFormConfig(sOptions.detailConfig);
			formConfig.dirty = function () {
				angular.noop();
			};

			var entity = {};

			if (_.isFunction(sOptions.defaultFilter)) {
				sOptions.defaultFilter(entity);
			}

			var focusRow = null;
			angular.forEach(sOptions.detailConfig.rows, function (row) {
				entity[row.model] = entity[row.model] ? entity[row.model] : null;
				if (row.type === 'radio' && entity[row.model] === null) {
					if (row.options && row.options.items) {
						entity[row.model] = row.options.items[0].value;
					}
				}
				if (!_.isNil(sOptions.defaultFilter) && !_.isFunction(sOptions.defaultFilter) && !_.isNil(sOptions.defaultFilter[row.model])) {
					if (_.isBoolean(sOptions.defaultFilter[row.model]) || row.type === 'radio') {
						entity[row.model] = sOptions.defaultFilter[row.model];
					} else if(_.isFunction(sOptions.defaultFilter[row.model])){
						sOptions.defaultFilter[row.model](entity);
					} else if (!_.isNil($scope.entity)) {
						entity[row.model] = $scope.entity[sOptions.defaultFilter[row.model]];
					}
					if (sOptions.defaultFilter[row.model + 'ReadOnly'] && entity[row.model]) {
						row.readonly = sOptions.defaultFilter[row.model + 'ReadOnly'];
					}
					if (sOptions.defaultFilter[row.model + 'Visible']) {
						row.visible = sOptions.defaultFilter[row.model + 'Visible'];
					}
				}

				//set default filter from external entity(e.g. Site)
				if (!_.isNil(sOptions.additionalFilters) && sOptions.additionalFilters.length > 0) {
					angular.forEach(sOptions.additionalFilters, function (additionalFilter) {
						if (!_.isNil(additionalFilter[row.model]) && _.isFunction(additionalFilter.getAdditionalEntity)) {
							if (_.isBoolean(additionalFilter[row.model]) || row.type === 'radio') {
								entity[row.model] = additionalFilter[row.model];
							}
							let value = additionalFilter.getAdditionalEntity($scope.entity)[additionalFilter[row.model]];
							if (value !== null) {
								entity[row.model] = value;
							}
							if (additionalFilter[row.model + 'ReadOnly'] && entity[row.model]) {
								row.readonly = additionalFilter[row.model + 'ReadOnly'];
							}
							if(additionalFilter.hasOwnProperty([row.model + 'Visible'])) {
								row.visible = additionalFilter[row.model + 'Visible'];
							}
						}
					});
				}

				if (entity[row.model]) {
					sOptions.dataService.setSelectedFilter(row.model, entity[row.model]);
				} else {
					if (focusRow === null){
						if(row.sortOrder && row.sortOrder > 0) {
							focusRow = row.sortOrder - 1;
						}
					}
				}
				row.change = function () {
					change(row.model);
				};
			});
			function change(model) {
				sOptions.dataService.setSelectedFilter(model, $scope.request[model]/*, filter*/);
			}
			var gridOptions = {
					gridId: gridId,
					idProperty: $scope.settings.idProperty,
					lazyInit: true
				},
				ctrlConfig = {
					grid: true,
					dialog: true,
					search: true
				},
				extension = _.merge({}, $scope.settings, gridOptions),
				self = lookupControllerFactory.create(ctrlConfig, $scope, extension);

			$scope.formOptions = {
				configure: formConfig,
				onLeaveLastRow: function () {
					sOptions.dataService.loadSelected();
					// $scope.disableOkButton = sOptions.dataService.hasSelection;
					$scope.disableOkButton = !self.getSelectedItems().length;

				}
			};

			$scope.request = entity;
			$scope.focusRow = -1;
			if(sOptions.setFocusToFirstEmptyFilter) {
				$scope.focusRow = focusRow !== null ? focusRow : sOptions.detailConfig.rows.length > 0 ? sOptions.detailConfig.rows.length : 0;
			}

			var selectedRowId = $scope.editModeHandler ? $scope.editModeHandler.getSelectedRowId() : null;

			$scope.searchValue = '';
			$scope.alerts = [];
			$scope.settings = extension;
			$scope.searchValueModified = undefined;
			$scope.disableOkButton = true;

			/**
			 * @description: search data from server side.
			 */

			$scope.search = function (searchValue, doRefresh) {
				var searchValueModified = searchValue !== $scope.searchValue;
				$scope.searchValue = searchValue;

				var isFilterSet = sOptions.dataService.isUsedFilterSet();
				if (searchValueModified) {
					// reset data page.
					$scope.settings.dataView.resetDataPage();
					sOptions.dataService.setOwnFilter();
				}
				$scope.searchValueModified = searchValueModified;
				if (!$scope.searchValue && searchValueModified) {
					$scope.refresh();
				} else if (isFilterSet) {
					$scope.isLoading = true;

					if (sOptions.dataProvider.identifier === 'default') {
						$scope.settings.dataView.simpleSearch({
							searchFields: $scope.settings.inputSearchMembers,
							searchString: searchValue,
							doRefresh: doRefresh
						}).then(function (data) {
							refreshGridData(data);
						});
					} else {
						sOptions.dataService.getSearchList($scope.searchValue, $scope.settings, {
							searchFields: $scope.settings.inputSearchMembers,
							searchString: $scope.searchValue
						}).then(function (data) {
							refreshGridData(angular.isArray(data) ? data : []);
						});
					}
				}
			};
			/**
			 * @description reload lookup data.
			 */
			// if (!$scope.settings.pageOptions || $scope.settings.pageOptions && !$scope.settings.pageOptions.enabled) {
			if (!$scope.settings.pageOptions || $scope.settings.pageOptions && !$scope.settings.pageOptions.enabled || sOptions.dataProvider.identifier !== 'default') {
				$scope.refresh = function () {
					var isFilterSet = sOptions.dataService.isUsedFilterSet();
					if (isFilterSet) {
						$scope.isLoading = true;
						if ($scope.searchValue) {
							$scope.search($scope.searchValue);
						}
						else {
							sOptions.dataService.loadSelected(sOptions);
							$scope.disableOkButton = true;
						}
					}
				};
			} else {
				$scope.refresh = function () {
					var isFilterSet = sOptions.dataService.isUsedFilterSet();
					sOptions.dataService.setOwnFilter();
					var requestArgs = null;
					if ($scope.settings.dataView.dataPage.enabled) {
						$scope.settings.dataView.resetDataPage();
						requestArgs = {
							searchFields: $scope.settings.inputSearchMembers,
							searchString: $scope.searchValue,
							isCaseSensitive: $scope.settings.isCaseSensitiveSearch,
							paging: true
						};
					}
					if (isFilterSet) {
						$scope.isLoading = true;
						$scope.settings.dataView.loadData(requestArgs).then(function (data) {
							refreshGridData(data);
						});
						$scope.disableOkButton = true;
					}
				};
			}
			// publish method to refresh grid data
			$scope.refreshData = refreshGridData;

			$scope.$on('$destroy', function () {
				$scope.close();
				unsubscribeGridEvents();
				self.destroy();
				$scope.disableOkButton = true;
				sOptions.dataService.clearSelectionFilter();
			});

			$scope.modalOptions = {
				headerText: $translate.instant($scope.settings.title),
				cancel: function(){
					$scope.close(false);
				},
				btnMouseMoveHandler: function btnMouseMoveHandler() {
					event.stopPropagation();
					event.preventDefault();
				}
			};
			/**
			 * @ngdoc function
			 * @name onReturnButtonPress
			 * @methodOf platform.platformModalService.controller
			 * @description click event for the default button, when 'enter' key is pressed.
			 */
			$scope.modalOptions.onReturnButtonPress = function onReturnButtonPress() {
				if (!$scope.disableOkButton) {
					$scope.close(true);
				}
			};

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

						// $('div[modal-window]').find('input:first').focus();
					}, 300); // wait for modal dialog animation finished.
				});

				subscribeGridEvents();
				self.onApply.register(applySelection);
				self.onSearch.register(search);

				// show initial data item depend on edit value in grid.
				//added below function because selectedRowId can not be set as editable value which caused unexpected result
				if ($scope.settings.isTextEditable) {
					if (angular.isDefined($scope.ngModel)) {
						if ($scope.settings.dataProvider.identifier === 'default') { // default lookup data provider
							$scope.search($scope.ngModel);
						}
						else {
							// custom lookup provider (estimate code lookup dialog)
							$scope.settings.dataProvider.getSearchList($scope.ngModel, $scope, {
								searchFields: $scope.settings.inputSearchMembers,
								searchString: $scope.searchValue
							}).then(function (data) {
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
							var resData;
							if ($scope.settings.dataView.dataProcessor && angular.isFunction($scope.settings.dataView.dataProcessor.execute)) {
								resData = $scope.settings.dataView.dataProcessor.execute(data, $scope.settings);
							}
							else {
								resData = data;
							}
							if (angular.isArray(resData)) {
								refreshGridData(resData, true);
							}
							else {
								refreshGridData(!_.isEmpty(resData) ? [resData] : [], true);
							}
							if (resData && resData.Id === $scope.ngModel) {
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
							$scope.settings.dataProvider.getSearchList($scope.ngModel, $scope, {
								searchFields: $scope.settings.inputSearchMembers,
								searchString: $scope.searchValue
							}).then(function (data) {
								var resData;
								if ($scope.settings.dataView.dataProcessor && angular.isFunction($scope.settings.dataView.dataProcessor.execute)) {
									resData = $scope.settings.dataView.dataProcessor.execute(data, $scope.settings);
								}
								else {
									resData = data;
								}
								if (angular.isArray(resData)) {
									refreshGridData(resData);
								}
								else {
									refreshGridData(!_.isEmpty(resData) ? [resData] : []);
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

				if ($scope.canSelect && $scope.canSelect(selectedItem)) {
					$scope.$close({
						isOk: true,
						selectedItem: selectedItem
					});
				}

				// Handle multi-selection, special case for estimate module.
				if ($scope.settings.gridOptions.multiSelect) {
					$scope.onSelectedItemsChanged.fire(globals.event, {
						selectedItems: selectedItems,
						lookupOptions: $scope.options
					}, $scope);
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
								collapsed: false,
								children: level > 0
							};
						} else {
							node.nodeInfo.level = level;
							node.nodeInfo.collapsed = false;
							node.nodeInfo.children = level > 0;
						}

						var childItems = $scope.extractValue(node, $scope.settings.treeOptions.childProp);
						if (angular.isArray(childItems)) {
							if (!_.isEmpty($scope.settings.dataProcessors)) {
								_.forEach(childItems, function resDataIterator(item) {
									_.forEach($scope.settings.dataProcessors, function processorIterator(processor) {
										processor.processItem(item);
									});
								});
							}
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

					if (!targetStr || targetStr === -1) {
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

			sOptions.dataService.listLoaded.register(refreshGridData);


			/**
			 * @description: refresh grid data.
			 */
			function refreshGridData(data, withoutFilter) {
				if(!withoutFilter && sOptions.showFilteredData && _.isFunction(sOptions.filterOnLoadFn)){
					data  = _.filter(data,sOptions.filterOnLoadFn);
				}
				if (sOptions.processData) {
					data = sOptions.processData(data);
				}
				processGridData(data);
				self.updateData(data);
				// handle "selectedRowId" in processGridData function if isTextEditable = true
				self.selectRowById(selectedRowId);
			}

			function onSelectedRowsChanged() {

				var selected = platformGridAPI.rows.selection({
					gridId: gridId
				});

				$scope.gridTriggersSelectionChange = true;
				if (!_.isNil(selected) ) {
					sOptions.dataService.setSelected(_.isArray(selected) ? selected[0] : selected);
					$scope.disableOkButton = sOptions.selectableCallback ? !sOptions.selectableCallback(_.isArray(selected) ? selected[0] : selected) : !self.getSelectedItems().length;
				}
				$scope.gridTriggersSelectionChange = false;
			}

			/**
			 * @description: subscribe slick grid events after it initialized.
			 */
			function subscribeGridEvents() {
				platformGridAPI.events.register(gridId, 'onDblClick', applySelection);
				platformGridAPI.events.register(gridId, 'onRowsChanged', onGridDataViewRowsChanged);
				platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}

			/**
			 * @description: unsubscribe slick grid events before it destroyed.
			 */
			function unsubscribeGridEvents() {
				platformGridAPI.events.unregister(gridId, 'onDblClick', applySelection);
				platformGridAPI.events.unregister(gridId, 'onRowsChanged', onGridDataViewRowsChanged);
				platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
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

			function selectionChanged(item) {
				var value = true;
				if (item && item.Id) {
					value = false;
				}
				$scope.disableOkButton = sOptions.selectableCallback ? !sOptions.selectableCallback(item) : !self.getSelectedItems().length;
			}

			sOptions.dataService.selectionChanged.register(selectionChanged);

			return self;
		}

		return {
			initFilterDialogController: initFilterDialogController
		};
	}
})(angular);
