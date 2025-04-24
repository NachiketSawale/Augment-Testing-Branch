/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global $ */
	/* global globals */
	'use strict';
// jshint -W072
// jshint +W098
	/**
 @ngdoc controller
	 * @name cloudSettingsDialogController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	angular.module('model.main').controller('modelMainObjectSidebarSearchEnhancedController',
		['$scope', 'platformTranslateService', '$translate', 'cloudDesktopSidebarService',
			'modelMainObjectSidebarEnhancedFilterService', 'platformModalService', '$timeout',
			'modelViewerModelSelectionService', '_', 'modelViewerObjectTreeService', 'modelViewerModelIdSetService',
			'modelViewerStandardFilterService', '$q', '$log',
			function ($scope, platformTranslateService, $translate, cloudDesktopSidebarService, eFilterService,
			          platformModalService, $timeout, modelSelectionService, _, modelViewerObjectTreeService,
			          modelViewerModelIdSetService, modelViewerStandardFilterService, $q, $log) {

				// TODO: keep this code?
				// coming from .net class FilterDefinitionInfo
				var savedFilterList = {
					items: [],
					displayMember: 'displayName', // 'filterName',
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
					//,onChange: function onChange(p1, p2, p3) {
					//	console('onChange called: ', p1, p2, p3);
					//}
				};

				function onSelectionChanged(item) { // jshint ignore:line

					if (eFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
						eFilterService.selectedFilterDefDto.setModified(false);
					}

					if ($scope.searchOptions.selectedItem) {
						try {
							//var filterDefDto = $scope.searchOptions.selectedItem;
							//var filterDefinition = JSON.parse(filterDefDto.filterDef);
							//$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.processFilterDefinition(filterDefinition);
							//eFilterService.selectedFilterDefDto = filterDefDto;
							$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.getCurrentFilterDef($scope.searchOptions.selectedItem);
							$scope.searchOptions.selectedItem.setModified(false);
						} catch (e) {
							$log.error('onSelectionChanged() failed to interpret filter expression ', $scope.searchOptions.selectedItem);
						}
					}
				}

				var permissions = null;
				eFilterService.retrieveFilterPermissions().then(function (rights) {
					$scope.$evalAsync(function () {
						permissions = rights;
					});
				});

				/**
				 *
				 * @param filterDefDto
				 */
				function selectFilterDef(filterDefDto) {
					if ($scope.searchOptions.selectedItem) {
						$scope.searchOptions.selectedItem.setModified(false);
					}
					$scope.searchOptions.selectedItem = filterDefDto;
					// parse first filter and take as default
					if ($scope.searchOptions.selectedItem) {
						try {
							if (filterDefDto.filterDef) {
								//var filterDefinition = JSON.parse(filterDefDto.filterDef);
								//$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.processFilterDefinition(filterDefinition);
								//eFilterService.selectedFilterDefDto = filterDefDto;
								$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.getCurrentFilterDef(filterDefDto);
								$scope.searchOptions.selectedItem.setModified(false);
							}
						} catch (e) {
							$log.error('selectFilterDef failed ', e);
						}
					}
				}

				/**
				 *
				 * @param options
				 */
				function filterStartEnhancedSearch(options /* {resetPageNumber: true}*/) {

					// serialize filter and put into filterRequest
					var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
					var filterOption = {
						resetPageNumber: options ? options.resetPageNumber : false,
						filterDefAsJSONString: eFilterService.filterDefAsJSONString(filterDef)
					};

					var filter = modelViewerStandardFilterService.getFilterById('objectSearchSidebar');
					if (filter.isPending) {
						return;
					}
					filter.isPending = true;

					var selModelId = modelSelectionService.getSelectedModelId();
					if (selModelId) {
						eFilterService.filterObjectsEnhanced(filterOption, selModelId).then(function (result) {
							var treeInfo = modelViewerObjectTreeService.getTree();
							if (treeInfo) {
								var resultMap = modelViewerModelIdSetService.createFromCompressedStringWithArrays(result);
								resultMap = resultMap.useSubModelIds();
								filter.getResultController().setIncludedMeshIds(treeInfo.objectToMeshIds(resultMap));
							}
							filter.isPending = false;
						}, function () {
							filter.isPending = false;
							return $q.reject();
						});
					}
				}

				/**
				 *  l o a d i n g  F i l t e r M e t a D a t a   and filter definition list
				 */
				function setFilterEnvironment() {
					var selModelId = modelSelectionService.getSelectedModelId();
					if (selModelId) {
						$scope.filterDataLoading = true;
						$scope.searchOptions.enhancedFilter.currentFilterDef = undefined; // eFilterService.createDefaultFilterDefinition(true);

						// l o a d i n g  F i l t e r M e t a D a t a   and filter definition list
						eFilterService.loadFilterBaseData(selModelId).then(function () {
							$scope.filterDataLoading = false;
							if (eFilterService.availableFilterDefs && eFilterService.availableFilterDefs.length > 0) {
								$scope.searchOptions.dropboxOptions.items = eFilterService.availableFilterDefs;
								selectFilterDef(eFilterService.selectedFilterDefDto || eFilterService.availableFilterDefs[0]);
							}

						}, function (errdata) {
							$log.error('loadFilterBaseData failed', errdata);
						});
					}
				}

				// var selectedFilterItem
				// s e a r c h O p t i o n s   searchOptions searchOptions searchOptions
				$scope.searchOptions = {
					// filter selection box
					// dataSourceOptions: savedFilterList,  // old cn implementatio, can be deleted....
					dropboxOptions: savedFilterList,
					selectedItem: null,
					selectionChanged: onSelectionChanged,
					// end filter selection box

					enhancedFilter: {
						currentFilterDef: null
					},

					onDeleteFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnDelete'),
					onSaveFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSave'),
					onSaveAsFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSaveAs'),
					onExecuteSearchBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSearch'),
					filterInfo: cloudDesktopSidebarService.filterInfo,
					filterRequest: cloudDesktopSidebarService.filterRequest,
					showRecordsInfo: true,
					cssClassForParent: {
						parentName: 'content-inner',
						newCss: 'sidebar-enhanced'
					},
					onClearSearch: function () {
						cloudDesktopSidebarService.filterResetPattern();
					},
					onStartSearch: function () {
						//console.log('search button pressed', this.pattern);
						if (!checkforValidFilterDefinition($scope.searchOptions.enhancedFilter.currentFilterDef)) {
							return false;
						}
						filterStartEnhancedSearch({resetPageNumber: true});
					},
					onPageBackward: function () {
						cloudDesktopSidebarService.filterPageBackward();
						filterStartEnhancedSearch();
					},
					onPageForward: function () {
						cloudDesktopSidebarService.filterPageForward();
						filterStartEnhancedSearch();
					},
					onDeleteFilter: function () {
						onDeleteFilter();
					},
					onSaveFilter: function () {
						onSaveFilter(false);
					},
					onSaveAsFilter: function () {
						onSaveFilter(true);
					},

					canDeleteFilter: function () {
						return canSaveDeleteModified(false);
					},
					canSaveFilter: function () {
						return canSaveDeleteModified(true);
					},
					canSaveFilterAs: function () {
						return permissions && (permissions.u || permissions.r || permissions.g);
					},
					onPageFirst: function () {
						cloudDesktopSidebarService.filterPageFirst();
						filterStartEnhancedSearch();
					},
					onPageLast: function () {
						cloudDesktopSidebarService.filterPageLast();
						filterStartEnhancedSearch();
					}
				};
				if (!$scope.searchOptions.filterRequest.pinningOptions) {
					$scope.searchOptions.filterRequest.pinningOptions = {};
				}
				$scope.searchOptions.filterRequest.pinningOptions.showPinningContext = [{
					show: true,
					token: 'project.main'
				}, {
					show: true,
					token: 'model.main'
				}];

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

				setFilterEnvironment();

				modelSelectionService.onSelectedModelChanged.register(setFilterEnvironment);

				/**
				 * @description this function checks the filter  for valid expressions.
				 * @param filterDefinition
				 * @returns {boolean}
				 */
				function checkforValidFilterDefinition(filterDefinition) {
					if (!filterDefinition) {
						filterDefinition = $scope.searchOptions.enhancedFilter.currentFilterDef;
					}
					// jshint ignore:line
					return filterDefinition.isValidFilterDefinition(true /*showError*/);
				}

				/**
				 *
				 * @param checkModified
				 * @returns {boolean}
				 */
				function canSaveDeleteModified(checkModified) {
					if (!$scope.searchOptions.enhancedFilter || !$scope.searchOptions.enhancedFilter.currentFilterDef) {
						return false;
					}
					return $scope.searchOptions.enhancedFilter.currentFilterDef.canSaveDeleteModified(checkModified);
				}

				function onSaveFilter(withDialog) {
					var filterDef;

					function showfilterSaveDialog() {
						var dialogOption = {
							templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
							controller: 'cloudDesktopFilterDefinitionSaveDialogController',
							scope: $scope  // pass parameters to dialog via current scope
						};


						// jshint ignore:line
						//instance.then(function (data) { console.log('platformModalService then: ', data);	},
						//              function (data) { console.log('platformModalService else: ', data);	}				);
						return platformModalService.showDialog(dialogOption);
					}

					function doSaveFilterDefinition() {

						$scope.filterDataLoading = true;

						eFilterService.saveFilterDefinition(filterDef).then(function (addUpdatedFilterDefEntry) {
							$scope.filterDataLoading = false;
							selectFilterDef(addUpdatedFilterDefEntry);
							//$scope.searchOptions.selectedItem = addUpdatedFilterDefEntry;
							//console.log(' saveFilterDefinition done... ', data);
						});
					}

					filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;

					if (!checkforValidFilterDefinition(filterDef)) {
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

					var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
					if (filterDef) {
						showConfirmDeleteDialog(filterDef.name).then(function (result) {
							if (result.yes) {
								$scope.filterDataLoading = true;
								eFilterService.deleteFilterDefinition(filterDef).then(function (nextFilterDefEntry) {
									$scope.filterDataLoading = false;
									// $scope.searchOptions.selectedItem = nextFilterDefEntry;
									selectFilterDef(nextFilterDefEntry);
									//console.log(' deleteFilterDefinition done... ', data);
								});
							}
						});
					}
				}

				/**
				 *
				 */
				function onResetFilter() {
					// console.log('onResetFilter() received');
					setFilterEnvironment();
				}

				/**
				 * selfexplaining....
				 */
				function setFocusToOnStartSearch() {
					// must run in new digest cycle, otherwise focus not working, we delay it slightly to be sure focus
					// move to this input field
					$timeout(function () {
						var elem = $('#onStartSearch');
						if (elem) {
							elem.focus();
						}
					}, 50);
				}

				/**
				 * trigger in case of Sidebar Search is opened
				 * @param cmdId
				 */
				function onOpenSidebar(cmdId) {
					if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().search)) {
						setFocusToOnStartSearch();
					}
				}

				// register translation changed event
				cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);
				eFilterService.onResetFilter.register(onResetFilter);

				setFocusToOnStartSearch();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					eFilterService.onResetFilter.unregister(onResetFilter);
					cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
					modelSelectionService.onSelectedModelChanged.unregister(setFilterEnvironment);
				});

			}]);
})(angular);
