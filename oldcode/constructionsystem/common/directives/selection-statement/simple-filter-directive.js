(function (angular) {
	'use strict';
	/* global globals,_,$ */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).directive('simpleFilterDirective', [
		'$translate', 'cloudDesktopSidebarService', 'platformModalService',
		'constructionsystemCommonFilterServiceCache',
		'constructionsystemCommonFilterDataService',
		function ($translate, cloudDesktopSidebarService, platformModalService,
			filterServiceCache, filterDataService) {

			return {
				restrict: 'A',
				scope: false,
				replace: true,
				templateUrl: globals.appBaseUrl + 'constructionsystem.common/templates/simple-filter.html',
				controller: ['$scope', controller]
			};

			function controller($scope) {

				// get data from parent scope, get the parent servie
				var mainDataService = $scope.parentService;
				$scope.parentServiceName = mainDataService.getServiceName();

				var simpleFilterService = filterServiceCache.getService('constructionsystemCommonSimpleFilterService', $scope.parentServiceName);

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
						var ico = (acl === 'System') ? (simpleFilterService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
							: (acl === 'User') ? (simpleFilterService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
								: (acl === 'Role') ? (simpleFilterService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
									: (acl === 'New') ? 'ico-search-new'
										: '';
						return $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
					}
				};
				var permissions = null;

				simpleFilterService.retrieveFilterPermissions().then(function (rights) {
					$scope.$evalAsync(function () {
						permissions = rights;
					});
				});
				$scope.searchOptions = {
					searchType: $scope.$parent.searchOptions.searchType,
					active: false,
					canNotEditMsg: 'Click to Active Simple Filter Container',
					dropboxOptions: savedFilterList,
					selectedItem: null,
					selectionChanged: onSelectionChanged,
					filterDataLoading: false,
					enhancedFilter: {
						currentFilterDef: null
					},
					filterRequest: {
						treePartMode: 'min',
						pattern: ''
					},

					placeholder: $translate.instant('constructionsystem.master.placeholder'),
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
						simpleFilterService.refresh();
					},

					onClearSearch: function () {
						$scope.searchOptions.filterRequest.pattern = '';
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
					onSaveAsSelectionStatement: function () {
						onSave2SelectionStatement();
					},
					canSaveOrDeleteFilter: function () {
						return $scope.searchOptions.selectedItem &&
							($scope.searchOptions.selectedItem.accessLevel !== 'New') &&
							$scope.searchOptions.filterRequest.pattern;
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
							$scope.searchOptions.selectedItem = _.find(simpleFilterService.availableFilterDefs, function (item) {
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

				function onSelectionChanged() {
					if (simpleFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
						simpleFilterService.selectedFilterDefDto.setModified(false);
					}

					resetByFilterDto($scope.searchOptions.selectedItem);

					if ($scope.searchOptions.selectedItem) {
						onSave2SelectionStatement();
					}
				}

				function selectFilterDto(filterDto, filter) {
					if ($scope.searchOptions.selectedItem) {
						$scope.searchOptions.selectedItem.setModified(false);
					}
					$scope.searchOptions.selectedItem = filterDto;

					resetByFilterDto(filterDto, filter);
				}

				/**
				 * set related values when the selected filter dto changed.
				 */
				function resetByFilterDto(filterDto, filter) {
					if ($scope.searchOptions.selectedItem && filterDto.filterDef) {
						var currentFilterDef = simpleFilterService.getCurrentFilterDef(filterDto);
						$scope.searchOptions.filterRequest.pattern = currentFilterDef.filterText;
						$scope.searchOptions.filterRequest.treePartMode = currentFilterDef.treePartMode;
						$scope.searchOptions.selectedItem.setModified(false);
					} else if (filter) {
						$scope.searchOptions.filterRequest.treePartMode = filter.treePartMode;
						$scope.searchOptions.filterRequest.pattern = filter.filterText;
					} else {
						$scope.searchOptions.onClearSearch();
					}
				}

				function setFilterEnvironment() {
					$scope.searchOptions.active = false;
					$scope.searchOptions.filterDataLoading = true;
					$scope.searchOptions.enhancedFilter.currentFilterDef = {};

					simpleFilterService.loadFilterBaseData().then(function () {
						$scope.searchOptions.filterDataLoading = false;
						if (simpleFilterService.availableFilterDefs && simpleFilterService.availableFilterDefs.length > 0) {
							$scope.searchOptions.dropboxOptions.items = simpleFilterService.availableFilterDefs;
							selectFilterDto(simpleFilterService.selectedFilterDefDto || simpleFilterService.availableFilterDefs[0]);
						}

						// set default value when controller initialized.
						if (mainDataService.hasSelection()) {
							var header = mainDataService.getSelected();
							if (header.SelectStatement) {
								var selectStatmentSelectedDto = JSON.parse(header.SelectStatement);
								var selectedItem = selectStatmentSelectedDto.selectedItem;
								if (selectedItem) {
									selectedItem = _.find(simpleFilterService.availableFilterDefs, {
										accessLevel: selectedItem.accessLevel,
										displayName: selectedItem.displayName
									});
								} else {
									selectedItem = simpleFilterService.availableFilterDefs[0];
								}
								var treePartMode = selectStatmentSelectedDto.filterComposite ?  'min' : 'l';
								if(_.isString(selectStatmentSelectedDto.treePartMode)) {
									treePartMode = selectStatmentSelectedDto.treePartMode;
								}
								$scope.searchOptions.filterRequest.treePartMode = treePartMode;

								var showFilterText = selectStatmentSelectedDto.filterType === $scope.searchOptions.searchType ?
									selectStatmentSelectedDto.filterText : '';
								selectFilterDto(selectedItem, {
									treePartMode: treePartMode,
									filterText: showFilterText
								});

								$scope.searchOptions.active = selectStatmentSelectedDto.filterType === $scope.searchOptions.searchType;
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
						filterDef: {
							filterType: $scope.searchOptions.searchType,
							treePartMode: $scope.searchOptions.filterRequest.treePartMode,
							filterText: $scope.searchOptions.filterRequest.pattern
						}
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

						simpleFilterService.saveFilterDefinition(filterDto).then(function (addUpdatedFilterDefEntry) {
							$scope.searchOptions.filterDataLoading = false;
							selectFilterDto(addUpdatedFilterDefEntry);
						});
					}
				}

				/**
				 * collect simple filter and saved to the field 'SelectStatement' of COS Master.
				 */
				function onSave2SelectionStatement() {
					if ($scope.searchOptions.active === true) {
						var filterObj = {
							filterType: $scope.searchOptions.searchType,
							treePartMode: $scope.searchOptions.filterRequest.treePartMode,
							filterText: $scope.searchOptions.filterRequest.pattern
							// selectedItem: $scope.searchOptions.selectedItem
						};
						if (filterObj && !filterObj.filterText) {
							const header = mainDataService.getSelected();
							if (header) {
								const selectStatement = JSON.parse(header.SelectStatement);
								if (selectStatement && selectStatement.filterType !== 'simple')
									return;
							}
						}
						filterDataService.setSelectedFilter($scope.parentServiceName, filterObj);
						if (mainDataService.hasSelection()) {
							var item = mainDataService.getSelected();
							item.SelectStatement = JSON.stringify(filterObj);
							mainDataService.markItemAsModified(item);
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
								simpleFilterService.deleteFilterDefinition(filterDto).then(function (nextFilterDto) {
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

				mainDataService.registerSelectionChanged(onParentSelectionChanged);
				if (mainDataService.registerSelectStatementChanged) {
					mainDataService.registerSelectStatementChanged(onParentSelectionChanged);
				}

				$scope.$on('$destroy', function () {
					mainDataService.unregisterSelectionChanged(onParentSelectionChanged);
					simpleFilterService.clearSelectedFilter();
					if (mainDataService.unregisterSelectStatementChanged) {
						mainDataService.unregisterSelectStatementChanged(onParentSelectionChanged);
					}
				});

				onParentSelectionChanged();

				function onParentSelectionChanged() {
					simpleFilterService.clearSelectedFilter();
					$scope.searchOptions.onClearSearch();
					setFilterEnvironment();
				}

			}

		}
	]);
})(angular);
