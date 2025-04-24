/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _, $ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainExpertFilterDirective', [
		'$translate', '$injector', 'platformPermissionService', 'platformTranslateService', 'cloudDesktopSidebarService', 'platformModalService',
		'constructionsystemCommonFilterServiceCache', 'constructionsystemCommonFilterDataService', 'estimateMainSelStatementFilterEditorTranslateService',
		function ($translate, $injector, platformPermissionService, platformTranslateService, cloudDesktopSidebarService, platformModalService,
			filterServiceCache, filterDataService, estimateMainSelStatementFilterEditorTranslateService) {

			return {
				restrict: 'A',
				scope: false,
				replace: true,
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/selection-statement/line-item-selection-statement-expert-filter.html',
				controller: ['$scope', controller]
			};

			function controller($scope) {
				// get data from parent scope, get the parent servie
				let mainDataService = $scope.parentService;
				$scope.parentServiceName = mainDataService.getServiceName();

				let expertFilterService = filterServiceCache.getService('estimateMainSelStatementExpertFilterService', $scope.parentServiceName);


				let savedFilterList = {
					items: [],
					displayMember: 'displayName',
					valueMember: 'filterName',
					templateResult: function (item) {
						let acl = item.origin ? item.origin.accessLevel : '';
						let ico = (acl === 'System') ? (expertFilterService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
							: (acl === 'User') ? (expertFilterService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
								: (acl === 'Role') ? (expertFilterService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
									: (acl === 'New') ? 'ico-search-new'
										: '';
						return $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
					}
				};
				let permissions = null;

				expertFilterService.retrieveFilterPermissions().then(function (rights) {
					$scope.$evalAsync(function () {
						permissions = rights;
					});
				});

				$scope.searchOptions = {
					searchType: 'expert',
					active: false,
					canNotEditMsg: 'Click to Active Expert Filter Container',
					dropboxOptions: savedFilterList,
					selectedItem: null,
					getSelectionParameterVersion:function getSelectionParameterVersion() {
						return expertFilterService.selectionParameter.version;
					},
					getSelectionParameters:function getSelectionParameters() {
						return expertFilterService.selectionParameter.parameters;
					},
					selectionChanged: onSelectionChanged,
					filterDataLoading: false,
					enhancedFilter: {
						currentFilterDef: null
					},
					filterRequest: {
						pattern: ''
					},

					onDeleteFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnDelete'),
					onSaveFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSave'),
					onSaveAsFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSaveAs'),

					onRefreshFilter: function () {
						expertFilterService.refresh($scope.currentHeaderId);
					},

					onClearSearch: function () {
						$scope.searchOptions.filterRequest.pattern = '';
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
							$scope.searchOptions.selectedItem = _.find(expertFilterService.availableFilterDefs, function (item) {
								return item.filterName === itemFilterName;
							});
						}
					}
				});

				function onSelectionChanged() {
					if (expertFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
						expertFilterService.selectedFilterDefDto.setModified(false);
					}

					resetByFilterDto($scope.searchOptions.selectedItem);

					if ($scope.searchOptions.selectedItem) {
						onSave2SelectionStatement();
					}
				}

				function selectFilterDto(filterDto, filterText) {
					if ($scope.searchOptions.selectedItem) {
						$scope.searchOptions.selectedItem.setModified(false);
					}
					$scope.searchOptions.selectedItem = filterDto;

					resetByFilterDto(filterDto, filterText);
				}

				/**
				 * set related values when the selected filter dto changed.
				 */
				function resetByFilterDto(filterDto, filterText) {
					if ($scope.searchOptions.selectedItem && filterDto.filterDef) {
						$scope.searchOptions.filterRequest.pattern = expertFilterService.getCurrentFilterDef(filterDto);
						$scope.searchOptions.selectedItem.setModified(false);
					} else if (filterText) {
						$scope.searchOptions.filterRequest.pattern = filterText;
					} else {
						$scope.searchOptions.onClearSearch();
					}
				}

				function setFilterEnvironment(active) {
					$scope.searchOptions.active = false;
					$scope.searchOptions.filterDataLoading = true;
					$scope.searchOptions.enhancedFilter.currentFilterDef = {};

					expertFilterService.loadFilterBaseData().then(function () {

						expertFilterService.loadSelectionParameter($scope.currentHeaderId).then(function () {

							$scope.searchOptions.filterDataLoading = false;

							if (expertFilterService.availableFilterDefs && expertFilterService.availableFilterDefs.length > 0) {
								$scope.searchOptions.dropboxOptions.items = expertFilterService.availableFilterDefs;
								selectFilterDto(expertFilterService.selectedFilterDefDto || expertFilterService.availableFilterDefs[0]);
							}

							// set default value when controller initialized.
							if (mainDataService.hasSelection()) {
								let header = mainDataService.getSelected();
								if (header.SelectStatement) {
									let selectStatmentSelectedDto = {
										filterType: $scope.searchOptions.searchType,
										filterText: estimateMainSelStatementFilterEditorTranslateService.getSelStatementTranslated(header.SelectStatement)
									};

									let selectedItem = selectStatmentSelectedDto.selectedItem;
									if (selectedItem) {
										selectedItem = _.find(expertFilterService.availableFilterDefs, {
											accessLevel: selectedItem.accessLevel,
											displayName: selectedItem.displayName
										});
									} else {
										selectedItem = expertFilterService.availableFilterDefs[0];
									}
									let showFilterText = selectStatmentSelectedDto.filterType === $scope.searchOptions.searchType ?
										selectStatmentSelectedDto.filterText : '';
									selectFilterDto(selectedItem, showFilterText);

									if (selectStatmentSelectedDto.filterType === $scope.searchOptions.searchType) {
										$scope.searchOptions.active = true;
									} else {
										$scope.searchOptions.active = false;
									}
								}
							}
							$scope.searchOptions.active = active;
						});
					}, function (errdata) {
						// eslint-disable-next-line no-console
						console.error('loadFilterBaseData failed', errdata);
					});
				}

				function onSaveFilter(isSaveAs) {
					let filterDto = {
						filterDef: {
							filterType: $scope.searchOptions.searchType,
							filterText: $scope.searchOptions.filterRequest.pattern
						}
					};

					if (isSaveAs) {
						showfilterSaveDialog().then(function () {
							let filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
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
						let dialogOption = {
							templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
							controller: 'cloudDesktopFilterDefinitionSaveDialogController',
							scope: $scope  // pass parameters to dialog via current scope
						};
						return platformModalService.showDialog(dialogOption);
					}

					function doSaveFilterDefinition() {
						$scope.searchOptions.filterDataLoading = true;

						expertFilterService.saveFilterDefinition(filterDto).then(function (addUpdatedFilterDefEntry) {
							$scope.searchOptions.filterDataLoading = false;
							selectFilterDto(addUpdatedFilterDefEntry);
						});
					}
				}

				function onSave2SelectionStatement() {
					if ($scope.searchOptions.active === true) {
						let filterObj = {
							filterType: $scope.searchOptions.searchType,
							filterText: $scope.searchOptions.filterRequest.pattern
						};

						filterDataService.setSelectedFilter($scope.parentServiceName, filterObj);
						if (mainDataService.hasSelection()) {
							let item = mainDataService.getSelected();
							item.SelectStatement = estimateMainSelStatementFilterEditorTranslateService.getSelStatementToSave(filterObj.filterText);
							mainDataService.markItemAsModified(item);
						}
					}
				}

				function onDeleteFilter() {
					function showConfirmDeleteDialog(filterName) {
						let modalOptions = {
							headerTextKey: 'cloud.desktop.filterdefConfirmDeleteTitle',
							bodyTextKey: $translate.instant('cloud.desktop.filterdefConfirmDeleteBody', {p1: filterName}),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question'
						};
						return platformModalService.showDialog(modalOptions);
					}

					let filterDto = $scope.searchOptions.selectedItem;
					if (filterDto) {
						showConfirmDeleteDialog(filterDto.filterName).then(function (result) {
							if (result.yes) {
								$scope.searchOptions.filterDataLoading = true;
								expertFilterService.deleteFilterDefinition(filterDto).then(function (nextFilterDto) {
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
					expertFilterService.clearSelectedFilter();
					if (mainDataService.unregisterSelectStatementChanged) {
						mainDataService.unregisterSelectStatementChanged(onParentSelectionChanged);
					}
				});

				onParentSelectionChanged();

				function onParentSelectionChanged(e, arg) {
					arg = arg ||  mainDataService.getSelected();

					// If does not have write permission, then set isActive false
					if (!platformPermissionService.hasWrite($scope.getContentValue('permission'))){
						return setFilterEnvironment(false);
					}

					let isContainerActive = false;
					let isHeaderReadOnly = $injector.get('estimateMainService').getHeaderStatus();
					if (isHeaderReadOnly){
						setFilterEnvironment(isContainerActive);
					}
					expertFilterService.clearSelectedFilter();
					$scope.searchOptions.onClearSearch();

					if (_.isEmpty(arg)){
						setFilterEnvironment(isContainerActive);
					}else{
						setFilterEnvironment(arg.EstLineItemSelStatementType === 0);
					}
				}
			}


		}
	]);
})(angular);
