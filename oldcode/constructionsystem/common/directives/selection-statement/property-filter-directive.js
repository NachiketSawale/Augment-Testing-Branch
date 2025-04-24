(function (angular) {
	'use strict';
	/* global globals,_,$ */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).directive('propertyFilterDirective', [
		'$translate', 'platformTranslateService', 'cloudDesktopSidebarService',
		'platformModalService', 'constructionsystemCommonFilterServiceCache', 'constructionsystemCommonFilterDataService',
		function ($translate, platformTranslateService, cloudDesktopSidebarService,
			platformModalService, filterServiceCache, filterDataService) {

			return {
				restrict: 'A',
				scope: false,
				replace: true,
				templateUrl: globals.appBaseUrl + 'constructionsystem.common/templates/property-filter.html',
				controller: ['$scope', controller]
			};

			function controller($scope) {
				// get data from parent scope, get the parent servie
				var mainDataService = $scope.parentService;
				$scope.parentServiceName = mainDataService.getServiceName();

				var propertyFilterService = filterServiceCache.getService('constructionsystemCommonPropertyFilterService', $scope.parentServiceName);
				var propertyFilterGridDataService = filterServiceCache.getService('constructionsystemCommonPropertyFilterGridDataService', $scope.parentServiceName);

				// get data from parent scope, model id may be null,
				// null is not limit the property key by the model,
				// and show all the property.
				// var currentModelId = $scope.currentModelId;

				var savedFilterList = {
					items: [],
					displayMember: 'displayName',
					valueMember: 'filterName',
					templateResult: function (item) {
						var acl = item.origin ? item.origin.accessLevel : '';
						var ico = (acl === 'System') ? (propertyFilterService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
							: (acl === 'User') ? (propertyFilterService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
								: (acl === 'Role') ? (propertyFilterService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
									: (acl === 'New') ? 'ico-search-new'
										: '';
						return $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
					}
				};
				var permissions = null;

				propertyFilterService.retrieveFilterPermissions().then(function (rights) {
					$scope.$evalAsync(function () {
						permissions = rights;
					});
				});

				var matchOptionDefault = 1;
				$scope.searchOptions = {
					searchType: $scope.$parent.searchOptions.searchType,
					active: false,
					canNotEditMsg: 'Click to Active Property Filter Container',
					dropboxOptions: savedFilterList,
					selectedItem: null,
					selectionChanged: onSelectionChanged,
					filterDataLoading: false,
					enhancedFilter: {
						currentFilterDef: null
					},
					filterRequest: {
						treePartMode: 'min',
						matchOption: matchOptionDefault
					},
					matchOptions:{
						items:[{
							id: 1, uiDisplayName: $translate.instant('cloud.common.FilterUi_MatchAll')
						},{
							id: 2, uiDisplayName: $translate.instant('cloud.common.FilterUi_MatchAny')
						}],
						valueMember: 'id', displayMember: 'uiDisplayName'
					},

					onDeleteFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnDelete'),
					onSaveFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSave'),
					onSaveAsFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSaveAs'),
					onRevertFilterBtnText: $translate.instant('constructionsystem.common.caption.revert'),
					refreshBtnText: $translate.instant('constructionsystem.common.caption.refresh'),


					onRevertFilter: function(){
						if($scope.$parent.onRevertFilter){
							$scope.$parent.onRevertFilter();
							setFilterEnvironment();
						}
					},

					canRevertFilter: function(){
						return $scope.$parent.canRevertFilter && $scope.$parent.canRevertFilter();
					},

					onRefreshFilter: function () {
						propertyFilterService.refresh();
					},

					onClearSearch: function () {
						setFilterText('{}');
						$scope.searchOptions.filterRequest.treePartMode = 'min';
						$scope.searchOptions.filterRequest.matchOption = matchOptionDefault;

						$scope.searchOptions.enhancedFilter.currentFilterDef = {};
					},
					onDeleteFilter: function () {
						onDeleteFilter();
					},
					onSaveFilter: function () {
						onSaveFilter(false);
						onSave2SelectionStatement();
					},
					onSaveAsFilter: function () {
						onSaveFilter(true);
						onSave2SelectionStatement();
					},
					onSaveAsSelectionStatement: function () {
						onSave2SelectionStatement();
					},
					canSaveOrDeleteFilter: function () {
						return $scope.searchOptions.selectedItem && $scope.searchOptions.selectedItem.accessLevel !== 'New';
					},
					canSaveFilterAs: function () {
						return permissions && (permissions.u || permissions.r || permissions.g);
					}
				};

				Object.defineProperties($scope.searchOptions, {
					'selectedItemId': {
						get: function () {
							return $scope.searchOptions.selectedItem ? $scope.searchOptions.selectedItem.filterName : '';
						},
						set: function (itemFilterName) {
							$scope.searchOptions.selectedItem = _.find(propertyFilterService.availableFilterDefs, function (item) {
								return item.filterName === itemFilterName;
							});
						}
					}
				});

				init();

				// //////////////////////////////////////////////////////////////////////////////////////////////////////////
				function init() {
					// update toolbar when search type changed
					var availableItemsIds = ['execute', 'filterComposite', 'filter'];
					$scope.tools.items = _.filter($scope.tools.items, function (item) {
						return availableItemsIds.indexOf(item.id)!==-1;
					});
					$scope.tools.update();
					// setFilterEnvironment();
				}

				propertyFilterGridDataService.onPropertyFilterChanged.register(onSave2SelectionStatement);

				// //////////////////////////////////////////////////////////////////////////////////////////////////////////
				function onSelectionChanged() {
					if (propertyFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
						propertyFilterService.selectedFilterDefDto.setModified(false);
					}

					resetByFilterDto($scope.searchOptions.selectedItem);

					if ($scope.searchOptions.selectedItem) {
						onSave2SelectionStatement();
					}
				}

				function selectFilterDto(filterDto) {
					if ($scope.searchOptions.selectedItem) {
						$scope.searchOptions.selectedItem.setModified(false);
					}
					$scope.searchOptions.selectedItem = filterDto;

					resetByFilterDto(filterDto);
				}

				/**
				 * set related values when the selected filter dto changed.
				 */
				function resetByFilterDto(filterDto) {
					if ($scope.searchOptions.selectedItem && filterDto.filterDef) {
						setFilterText(filterDto.filterDef);
						var currentFilterDef = propertyFilterService.getCurrentFilterDef(filterDto);
						$scope.searchOptions.filterRequest.treePartMode = currentFilterDef.treePartMode;
						$scope.searchOptions.selectedItem.setModified(false);
					} else {
						$scope.searchOptions.onClearSearch();
					}
				}

				function setFilterEnvironment() {
					$scope.searchOptions.active = false;
					$scope.searchOptions.filterDataLoading = true;
					$scope.searchOptions.enhancedFilter.currentFilterDef = {};

					propertyFilterService.loadFilterBaseData().then(function () {
						$scope.searchOptions.filterDataLoading = false;
						if (propertyFilterService.availableFilterDefs && propertyFilterService.availableFilterDefs.length > 0) {
							$scope.searchOptions.dropboxOptions.items = propertyFilterService.availableFilterDefs;
							selectFilterDto(propertyFilterService.selectedFilterDefDto || propertyFilterService.availableFilterDefs[0]);
						}

						if (mainDataService.hasSelection()) {
							var selectStatement = mainDataService.getSelected().SelectStatement;
							if (selectStatement) {
								setFilterText(selectStatement);
								var filterObj = JSON.parse(selectStatement);
								var treePartMode = filterObj.filterComposite ? 'min' : 'l';
								if(_.isString(filterObj.treePartMode)) {
									treePartMode = filterObj.treePartMode;
								}
								$scope.searchOptions.filterRequest.treePartMode = treePartMode;

								if (filterObj && filterObj.filterType === $scope.searchOptions.searchType) {
									$scope.searchOptions.active = true;
								} else {
									$scope.searchOptions.active = false;
								}
							}
						}
						$scope.searchOptions.active = true;
						filterServiceCache.setFilterReadOnly($scope);
					}, function (errdata) {
						console.error('loadFilterBaseData failed', errdata);
					});
				}

				function onSaveFilter(isSaveAs) {
					var filterDto = {
						filterDef: getFilterDef()
					};

					if (isSaveAs) {
						showfilterSaveDialog().then(function () {
							var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
							filterDto.name = filterDef.name;
							filterDto.accessLevel = filterDef.accesslevel;

							doSaveFilterDefinition();
						}
						);
					}
					else {
						filterDto.name = $scope.searchOptions.selectedItem.filterName;
						filterDto.accessLevel = $scope.searchOptions.selectedItem.accessLevel;

						doSaveFilterDefinition();
					}

					function showfilterSaveDialog() {
						var dialogOption = {
							templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
							controller: 'cloudDesktopFilterDefinitionSaveDialogController',
							scope: $scope  // pass parameters to dialog via current scope
						};
						return platformModalService.showDialog(dialogOption);
					}

					function doSaveFilterDefinition() {
						$scope.searchOptions.filterDataLoading = true;

						propertyFilterService.saveFilterDefinition(filterDto).then(function (addUpdatedFilterDefEntry) {
							$scope.searchOptions.filterDataLoading = false;
							selectFilterDto(addUpdatedFilterDefEntry);
						});
					}
				}

				/**
				 * collect property filter and saved to the field 'SelectStatement' of COS Master.
				 */
				function onSave2SelectionStatement() {
					if ($scope.searchOptions.active === true) {
						var filterObj = getFilterDef();
						if(filterObj && filterObj.filterText){
							var filter = JSON.parse(filterObj.filterText);
							if(filter.items.length === 0){
								const header = mainDataService.getSelected();
								if (header) {
									const selectStatement = JSON.parse(header.SelectStatement);
									if(selectStatement && selectStatement.filterType !== 'property')
										return;
								}
							}
						}
						filterDataService.setSelectedFilter($scope.parentServiceName, filterObj);
						if (mainDataService.hasSelection()) {
							var header = mainDataService.getSelected();
							header.SelectStatement = JSON.stringify(filterObj);
							mainDataService.markItemAsModified(header);
						}
					}
				}

				function onDeleteFilter() {
					function showConfirmDeleteDialog(filterName) {
						var modalOptions = {
							headerTextKey: 'cloud.desktop.filterdefConfirmDeleteTitle',
							bodyTextKey: $translate.instant('cloud.desktop.filterdefConfirmDeleteBody', {p1: filterName}),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question'
						};
						return platformModalService.showDialog(modalOptions);
					}

					var filterDto = $scope.searchOptions.selectedItem;
					if (filterDto) {
						showConfirmDeleteDialog(filterDto.filterName).then(function (result) {
							if (result.yes) {
								$scope.searchOptions.filterDataLoading = true;
								propertyFilterService.deleteFilterDefinition(filterDto).then(function (nextFilterDto) {
									$scope.searchOptions.filterDataLoading = false;
									selectFilterDto(nextFilterDto);
									onSave2SelectionStatement();
								}, function () {
									$scope.searchOptions.filterDataLoading = false;
								});
							}
						});
					}
				}

				function getFilterDef() {
					var filterObj = {
						matchOption: $scope.searchOptions.filterRequest.matchOption,
						items: getFilterText()
					};
					return {
						version: '1.0',
						filterType: $scope.searchOptions.searchType,
						treePartMode: $scope.searchOptions.filterRequest.treePartMode,
						filterText: JSON.stringify(filterObj)
					};
				}

				function getFilterText() {
					var result = [];
					var propertyList = propertyFilterGridDataService.getList();
					angular.forEach(propertyList, function (item) {
						var newItem = {
							PropertyId: item.PropertyId,
							PropertyName: item.PropertyName,
							ValueType: item.ValueType,
							Operation: item.Operation,
							PropertyValue: item.PropertyValue
						};
						result.push(newItem);
					});
					return result;
				}

				function setFilterText(filterDef) {
					var filterObj = JSON.parse(filterDef);
					// get the existing item list
					if (filterObj && (filterObj.filterType === $scope.searchOptions.searchType) && !_.isEmpty(filterObj.filterText)) {
						var index = 0;
						var list = [];
						if (filterObj.version === '1.0') {
							try {
								var filter = JSON.parse(filterObj.filterText);
								$scope.searchOptions.filterRequest.matchOption = filter.matchOption;
								list = filter.items;
							} catch (e) {
								console.log(e);
							}
						} else {
							try {
								list = JSON.parse(filterObj.filterText);
							} catch (e) {
								console.log(e);
							}
						}

						var items = [];
						angular.forEach(_.isArray(list) ? list : list.items, function (item) {
							var newItem = {
								Id: ++index,
								PropertyId: item.PropertyId,
								PropertyName: item.PropertyName,
								ValueType: item.ValueType,
								Operation: item.Operation || 1,
								PropertyValue: item.PropertyValue
							};
							items.push(newItem);
						});
						propertyFilterGridDataService.setList(items);
					} else {
						propertyFilterGridDataService.setList([]);
					}
				}


				var onEntityCreated = function onEntityCreated() {
					onSave2SelectionStatement();
				};
				propertyFilterGridDataService.registerEntityCreated(onEntityCreated);

				var onEntityDeleted = function onEntityDeleted() {
					onSave2SelectionStatement();
					// propertyFilterGridDataService.goToFirst();
				};
				propertyFilterGridDataService.registerEntityDeleted(onEntityDeleted);


				mainDataService.registerSelectionChanged(onParentSelectionChanged);

				if (mainDataService.registerSelectStatementChanged) {
					mainDataService.registerSelectStatementChanged(onParentSelectionChanged);
				}

				$scope.$on('$destroy', function () {
					mainDataService.unregisterSelectionChanged(onParentSelectionChanged);
					propertyFilterGridDataService.unregisterEntityCreated(onEntityCreated);
					propertyFilterGridDataService.unregisterEntityDeleted(onEntityDeleted);
					propertyFilterService.clearSelectedFilter();
					if (mainDataService.unregisterSelectStatementChanged) {
						mainDataService.unregisterSelectStatementChanged(onParentSelectionChanged);
					}
				});

				onParentSelectionChanged();

				function onParentSelectionChanged() {
					propertyFilterService.clearSelectedFilter();
					$scope.searchOptions.onClearSearch();
					setFilterEnvironment();
				}
			}
		}
	]);
})(angular);
