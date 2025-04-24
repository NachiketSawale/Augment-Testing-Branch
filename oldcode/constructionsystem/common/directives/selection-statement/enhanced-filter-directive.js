(function (angular) {
	'use strict';
	/* global globals,_,$ */
	var moduleName = 'constructionsystem.common';
	angular.module(moduleName).directive('enhancedFilterDirective',
		['platformTranslateService', '$translate', 'cloudDesktopSidebarService',
			'constructionsystemCommonFilterServiceCache', 'platformModalService', 'constructionsystemCommonFilterDataService',
			function (platformTranslateService, $translate, cloudDesktopSidebarService,
				filterServiceCache, platformModalService, filterDataService) {
				return {
					restrict: 'A',
					scope: false,
					replace: true,
					templateUrl: globals.appBaseUrl + 'constructionsystem.common/templates/enhanced-filter.html',
					controller: ['$scope', controller]
				};

				function controller($scope) {
					// get data from parent scope, get the parent servie
					var mainDataService = $scope.parentService;
					$scope.parentServiceName = mainDataService.getServiceName();

					var eFilterService = filterServiceCache.getService('constructionsystemCommonEnhancedFilterService', $scope.parentServiceName);
					eFilterService.onFilterValueChanged.register(onSave2SelectionStatement);

					// get data from parent scope, model id may be null,
					// null is not limit the property key by the model,
					// and show all the property.
					var currentModelId = $scope.currentModelId;

					var savedFilterList = {
						items: [],
						displayMember: 'displayName',
						valueMember: 'filterName',
						templateResult: function (item) {
							var acl = item.origin ? item.origin.accessLevel : '';
							var ico = (acl === 'System') ? (eFilterService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
								: (acl === 'User') ? (eFilterService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
									: (acl === 'Role') ? (eFilterService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
										: (acl === 'New') ? 'ico-search-new'
											: '';
							return $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
						}
					};

					var permissions = null;
					eFilterService.retrieveFilterPermissions().then(function (rights) {
						$scope.$evalAsync(function () {
							permissions = rights;
						});
					});

					$scope.searchOptions = {
						searchType: $scope.$parent.searchOptions.searchType,
						active: false,
						canNotEditMsg: 'Click to Active Enhanced Filter Container',
						dropboxOptions: savedFilterList,
						selectedItem: null,
						selectionChanged: onSelectionChanged,
						filterDataLoading: false,
						initialized: false,
						enhancedFilter: {
							currentFilterDef: null
						},
						filterRequest: {
							treePartMode: 'min'
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
							eFilterService.refresh();
						},

						onClearSearch: function () {
							$scope.searchOptions.filterRequest.treePartMode = 'min';
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
						canDeleteFilter: function () {
							// onSave2SelectionStatement();
							return $scope.searchOptions.selectedItem &&
								$scope.searchOptions.selectedItem.accessLevel !== 'New' &&
								canSaveDeleteModified(false);
						},
						canSaveFilter: function () {
							// onSave2SelectionStatement();
							return $scope.searchOptions.selectedItem &&
								$scope.searchOptions.selectedItem.accessLevel !== 'New' &&
								canSaveDeleteModified(true);
						},
						canSaveFilterAs: function () {
							// onSave2SelectionStatement();
							return permissions && (permissions.u || permissions.r || permissions.g);
						},
						onSaveAsSelectionStatement: function () {
							onSave2SelectionStatement();
						}
					};

					Object.defineProperties($scope.searchOptions, {
						'selectedItemId': {
							get: function () {
								return $scope.searchOptions.selectedItem ? $scope.searchOptions.selectedItem.filterName : '';
							},
							set: function (itemFilterName) {
								$scope.searchOptions.selectedItem = eFilterService.getAvailableFilterDefsByName(itemFilterName);
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

					function onSelectionChanged() {
						if (eFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
							eFilterService.selectedFilterDefDto.setModified(false);
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
							var currentFilterDef = eFilterService.getCurrentFilterDef(filterDto);
							var filterDefinition = JSON.parse(currentFilterDef.filterText);
							$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.processFilterDefinition(filterDefinition);
							$scope.searchOptions.filterRequest.treePartMode = currentFilterDef.treePartMode;
							$scope.searchOptions.selectedItem.setModified(false);
							setFilter(filterDto.filterDef);
						} else {
							$scope.searchOptions.onClearSearch();
						}
					}

					function setFilter(filterDef) {
						var filterObj = JSON.parse(filterDef);
						if (filterObj && filterObj.filterType === $scope.searchOptions.searchType && !_.isEmpty(filterObj.filterText)) {
							var filterDefinition = JSON.parse(filterObj.filterText);
							if (!_.isEmpty(filterDefinition)) {
								eFilterService.currentFilterDefItem = eFilterService.processFilterDefinition(filterDefinition);
								$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.currentFilterDefItem;
							}
						}
					}


					function setFilterEnvironment() {
						if($scope.searchOptions.filterDataLoading){
							return;
						}

						$scope.searchOptions.active = false;
						$scope.searchOptions.initialized = false;
						$scope.searchOptions.filterDataLoading = true;
						$scope.searchOptions.enhancedFilter.currentFilterDef = {};

						eFilterService.loadFilterBaseData(currentModelId).then(function () {
							$scope.searchOptions.filterDataLoading = false;
							if (eFilterService.availableFilterDefs && eFilterService.availableFilterDefs.length > 0) {
								$scope.searchOptions.dropboxOptions.items = eFilterService.availableFilterDefs;
								selectFilterDto(eFilterService.selectedFilterDefDto || eFilterService.availableFilterDefs[0]);
							}
							if (mainDataService.hasSelection()) {
								var selectStatement = mainDataService.getSelected().SelectStatement;
								if (selectStatement) {
									setFilter(selectStatement);
									var filterObj = JSON.parse(selectStatement);
									var treePartMode = filterObj.filterComposite ?  'min' : 'l';
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
							$scope.searchOptions.initialized = true;
							$scope.searchOptions.active = true;
							filterServiceCache.setFilterReadOnly($scope);
						}, function (errdata) {
							console.error('loadFilterBaseData failed', errdata);
						});
					}


					function checkforValidFilterDefinition(filterDefinition) {
						if (!filterDefinition) {
							filterDefinition = $scope.searchOptions.enhancedFilter.currentFilterDef;
						}
						var valid = filterDefinition.isValidFilterDefinition(true /* showError */); // jshint ignore:line
						return valid;
					}


					function canSaveDeleteModified(checkModified) {
						var enhancedFilter = $scope.searchOptions.enhancedFilter;
						if (!enhancedFilter || !enhancedFilter.currentFilterDef || !enhancedFilter.currentFilterDef.canSaveDeleteModified) {
							return false;
						}
						return enhancedFilter.currentFilterDef.canSaveDeleteModified(checkModified);
					}

					/**
					 *
					 * @param withDialog
					 */
					function onSaveFilter(withDialog) {

						function showfilterSaveDialog() {
							var dialogOption = {
								templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
								controller: 'cloudDesktopFilterDefinitionSaveDialogController',
								scope: $scope
							};
							return platformModalService.showDialog(dialogOption);
						}

						function doSaveFilterDefinition() {
							$scope.searchOptions.filterDataLoading = true;

							var filterDto = {
								filterDef: {
									filterType: $scope.searchOptions.searchType,
									treePartMode: $scope.searchOptions.filterRequest.treePartMode,
									filterText: getFilterText()
								}
							};
							var filterDef = getFilterDef();
							filterDto.name = filterDef.name;
							filterDto.accessLevel = filterDef.accesslevel;


							eFilterService.saveFilterDefinition(filterDto).then(function (addUpdatedFilterDefEntry) {
								$scope.searchOptions.filterDataLoading = false;
								selectFilterDto(addUpdatedFilterDefEntry);
							});
						}

						if (!checkforValidFilterDefinition($scope.searchOptions.enhancedFilter.currentFilterDef)) {
							return;
						}

						if (withDialog) {
							showfilterSaveDialog().then(function () {
								doSaveFilterDefinition();
							}
							);
						} else {
							doSaveFilterDefinition();
						}
					}

					/**
					 * collect property filter and saved to the field 'SelectStatement' of COS Master.
					 */
					function onSave2SelectionStatement() {
						if ($scope.searchOptions.initialized) {
							if ($scope.searchOptions.active === true) {
								var filterObj = {
									filterType: $scope.searchOptions.searchType,
									treePartMode: $scope.searchOptions.filterRequest.treePartMode,
									filterText: getFilterText()
								};
								if (filterObj && filterObj.filterText) {
									var filter = JSON.parse(filterObj.filterText);
									if (filter.criteria
											&& filter.criteria.criterion.length === 0
											&& filter.criteria.criteria.length === 0){
										const header = mainDataService.getSelected();
										if (header) {
											const selectStatement = JSON.parse(header.SelectStatement);
											if(selectStatement && selectStatement.filterType !== 'enhanced')
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
					}

					function getFilterText() {
						return JSON.stringify(getFilterDef());
					}

					function getFilterDef() {
						var currentFilterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
						return currentFilterDef.getAsJson ? currentFilterDef.getAsJson() : {};
					}

					/**
					 *
					 */
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
									eFilterService.deleteFilterDefinition(filterDto).then(function (nextFilterDefEntry) {
										$scope.searchOptions.filterDataLoading = false;
										selectFilterDto(nextFilterDefEntry);
										onSave2SelectionStatement();
									}, function () {
										$scope.searchOptions.filterDataLoading = false;
									});
								}
							});
						}
					}


					mainDataService.registerSelectionChanged(onParentSelectionChanged);

					if (mainDataService.registerSelectStatementChanged) {
						mainDataService.registerSelectStatementChanged(onParentSelectionChanged);
					}

					$scope.$on('$destroy', function () {
						mainDataService.unregisterSelectionChanged(onParentSelectionChanged);
						eFilterService.clearSelectedFilter();
						eFilterService.onFilterValueChanged.unregister(onSave2SelectionStatement);
						if (mainDataService.unregisterSelectStatementChanged) {
							mainDataService.unregisterSelectStatementChanged(onParentSelectionChanged);
						}
					});

					onParentSelectionChanged();

					function onParentSelectionChanged() {
						eFilterService.clearSelectedFilter();
						$scope.searchOptions.onClearSearch();
						setFilterEnvironment();
					}
				}
			}]);
})(angular);