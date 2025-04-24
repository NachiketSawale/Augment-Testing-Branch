/*
 * $Id: search-bulk-controller.js 587855 2020-05-19 14:29:59Z saa\hof $
 * Copyright (c) RIB Software SE
 */
/* global _,globals */

(function (angular) {

	'use strict';
	var moduleName = 'cloud.desktop';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRuleEditorController
	 * @function
	 *
	 * @description
	 * Controller for the model evaluation rule editor.
	 **/
	angular.module(moduleName).controller('cloudDesktopSearchBulkController', ['$scope', '$translate',
		'cloudDesktopSidebarService', 'cloudDesktopBulkSearchDataService', 'platformModalService',
		'cloudDesktopSidebarSearchFormService', 'cloudDesktopSidebarBulkSearchFormService',
		function ($scope, $translate, cloudDesktopSidebarService, cloudDesktopBulkSearchDataService, platformModalService,
			cloudDesktopSidebarSearchFormService, cloudDesktopSidebarBulkSearchFormService) {

			var currentModuleName; //  = cloudDesktopSidebarService.filterRequest.moduleName;

			const showActiveItemsSetting = 'onlyShowActiveEntities';

			var listOptions = {
				displayMember: 'displayName',
				valueMember: 'id',
				showSearchfield: true,
				watchItems: true,
				group: {
					groupById: 'accessLevel'
				},
				items: []
			};

			var setItemsFormatInSelectbox = function (items) {
				var generatedItems = [];

				var accessLevels = [
					{
						id: 'System',
						caption: $translate.instant('basics.common.configLocation.system'),
						cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
					},
					{
						id: 'User',
						caption: $translate.instant('basics.common.configLocation.user'),
						cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
					},
					{
						id: 'Role',
						caption: $translate.instant('basics.common.configLocation.role'),
						cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
					}
				];

				angular.forEach(accessLevels, function (level) {
					var itemsFromList = _.filter(items, {accessLevel: level.id});

					// fill title
					if (itemsFromList.length > 0) {
						generatedItems.push({
							id: 666,
							displayName: level.caption,
							type: 'title',
							childId: level.id,
							cssClassButton: level.cssClass,
							disabled: true
						});

						// fill items for access level
						generatedItems = generatedItems.concat(itemsFromList);
					}
				});

				_.find(items, function (item) {
					if (item.accessLevel === 'New') {
						const itemExists = generatedItems.some(gItem => gItem.accessLevel === item.accessLevel);
						if(!itemExists){
							item.cssClassButton = 'control-icons ico-search-new';
							generatedItems.unshift(item);
						}
					}
				});

				$scope.searchOptions.searchListSelectbox.items = generatedItems;
			};

			function setEnvironment() {
				currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;
				var tableName = cloudDesktopSidebarService.filterRequest.bulkSearchTable;
				cloudDesktopBulkSearchDataService.changeModule(currentModuleName, tableName).then(function (filters) {
					if (filters) {
						setItemsFormatInSelectbox(filters);
						// default item -> change with autofilter
						let autofilterDef = cloudDesktopSidebarService.getAutoFilter('bulk', 'radiusParameters');
						if (autofilterDef) {
							if (autofilterDef.hasOwnProperty('RadiusParameters')) {
								Object.assign(autofilterDef, autofilterDef.RadiusParameters);
							}
							let filterDef = _.filter(filters, f => f.id === autofilterDef.id);
							if (Array.isArray(filterDef) && filterDef.length) {
								let filterDefUpdated = (!_.isUndefined(autofilterDef.updated) && !_.isUndefined(filterDef[0].updated) && (moment(filterDef[0].updated)).diff(moment(autofilterDef.updated))) > 0 || _.isUndefined(autofilterDef.updated) && !_.isUndefined(filterDef[0].updated);
								if (!cloudDesktopBulkSearchDataService.filterRequested()) {
									cloudDesktopBulkSearchDataService.setCurrentFilter(autofilterDef.id, !filterDefUpdated ? autofilterDef.currentDefinition : null);
									cloudDesktopBulkSearchDataService.filterRequested(true);
								}
							}
						}

						$scope.searchOptions.selectedItem = cloudDesktopBulkSearchDataService.getCurrentFilter() || $scope.searchOptions.searchListSelectbox.items[0];

						// set editor in scope
						$scope.currentEditor = cloudDesktopBulkSearchDataService.currentEditor;
						updateRuleSelection();
					}
				});
			}

			$scope.isRuleEditorReadOnly = true;

			function updateRuleSelection() {
				$scope.$evalAsync(function () {
					if ($scope.searchOptions.selectedItem) {
						cloudDesktopSidebarService.updateNavbarRefreshTooltip($scope.searchOptions.selectedItem.displayName);
						cloudDesktopBulkSearchDataService.setCurrentFilter($scope.searchOptions.selectedItem.id);
						// $scope.isRuleEditorReadOnly = modelEvaluationRuleDataService.isRuleReadOnly(newRule) || !platformPermissionService.hasWrite('3e58fcde812847c89942f3d365dc2d9b');
						$scope.isRuleEditorReadOnly = false;
					}
				});
			}

			/**
			 *
			 * @param options
			 */
			function filterStartBulkSearch(options /* {resetPageNumber: true} */) {
				let assign;
				let locationFilter = cloudDesktopSidebarService.getAutoFilter('bulk', 'radiusParameters');

				let bulkFilter = cloudDesktopBulkSearchDataService.getAutoFilter();

				if (locationFilter && locationFilter.hasOwnProperty('RadiusParameters')) {
					assign = Object.assign(bulkFilter, locationFilter);
					cloudDesktopSidebarService.setAutoFilter('bulk', assign, 'radiusParameters');
				} else {
					cloudDesktopSidebarService.setAutoFilter('bulk', bulkFilter, 'radiusParameters');
				}
				var filterDef = cloudDesktopBulkSearchDataService.getProcessedFilter();
				var filterOption = {
					resetPageNumber: options ? options.resetPageNumber : false,
					filterDefAsJSONString: filterDef,
					interfaceVersion: '2.0'
				};
				cloudDesktopSidebarService.filterStartEnhancedSearch(filterOption, true);
			}

			$scope.searchOptions = {
				// filter selection box
				searchListSelectbox: listOptions,
				selectedItem: null,
				selectionChanged: updateRuleSelection,
				// end filter selection box

				enhancedSearchTools: {
					showImages: true,
					showTite: true,
					cssClass: 'tools',
					items: [
						{
							id: 'resetFilter',
							caption$tr$: 'cloud.desktop.navBarDiscardDesc',
							type: 'item',
							iconClass: 'tlb-icons ico-discard',
							fn: function () {
								$scope.searchOptions.selectedItem.reset();
							}
						},
						{
							id: 'onlyShowActive',
							caption$tr$: 'cloud.desktop.searchEnhanced.onlyShowActive',
							type: 'check',
							value: cloudDesktopBulkSearchDataService.accessEditorSettings(showActiveItemsSetting),
							iconClass: 'tlb-icons ico-filter-inactive',
							fn: function (toolId, toolState) {
								cloudDesktopBulkSearchDataService.accessEditorSettings(showActiveItemsSetting, toolState.value);
							}
						}
					]
				},

				includeRadiusSearchChk: {
					ctrlId: 'includeRadiusSearchId',
					labelText: $translate.instant('cloud.desktop.sdGoogleRadiusSearchChk'),
					labelText$tr$: 'cloud.desktop.sdGoogleRadiusSearchChk'
				},

				enhancedFilter: {
					currentFilterDef: null
				},

				onDeleteFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnDelete'),
				onSaveFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSave'),
				onSaveAsFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSaveAs'),
				onExecuteSearchBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSearch'),
				onCreateSearchform: $translate.instant('cloud.desktop.searchEnhanced.dropdownCreate'),
				onDeleteBtnText: 'Delete',
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
					// console.log('search button pressed', this.pattern);
					if (!checkforValidFilterDefinition($scope.searchOptions.selectedItem.currentDefinition)) {
						return false;
					}
					filterStartBulkSearch({resetPageNumber: true});
				},
				onPageBackward: function () {
					cloudDesktopSidebarService.filterPageBackward();
					filterStartBulkSearch();
				},
				onPageForward: function () {
					cloudDesktopSidebarService.filterPageForward();
					filterStartBulkSearch();
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
					return _.some(cloudDesktopBulkSearchDataService.filterPermissions);
				},
				onPageFirst: function () {
					cloudDesktopSidebarService.filterPageFirst();
					filterStartBulkSearch();
				},
				onPageLast: function () {
					cloudDesktopSidebarService.filterPageLast();
					filterStartBulkSearch();
				},
				onOpenSearchForm: function () {
					if (!checkforValidFilterDefinition($scope.searchOptions.selectedItem.currentDefinition)) {
						return false;
					}
					var formDef = {
						filterDef: {
							enhancedFilter: angular.copy($scope.searchOptions.selectedItem.currentDefinition)
						}
					};
					cloudDesktopSidebarBulkSearchFormService.openSearchForm(formDef, false, $scope.currentEditor.mgr);
					// cloudDesktopSidebarSearchFormService.openSearchForm($scope.searchOptions.selectedItem, false);
				}
			};

			$scope.option = {
				title: $translate.instant('cloud.desktop.sdMainSearchBtnEnhanced')
			};

			$scope.option.mainMenuDeclaration = {
				cssClass: 'btn tlb-icons ico-menu btn-square-26',
				showSVGTag: false,
				disabled: false,
				list: {
					cssClass: 'dropdown-menu dropdown-menu-right',
					items: [
						makeItem($scope.searchOptions.onSaveFilterBtnText, 'tlb-icons ico-save2', $scope.searchOptions.onSaveFilter, canSaveFilterFn),
						makeItem($scope.searchOptions.onSaveAsFilterBtnText, 'tlb-icons ico-save-as2', $scope.searchOptions.onSaveAsFilter, canSaveFilterAsFn),
						makeItem($scope.searchOptions.onDeleteBtnText, 'tlb-icons ico-delete2 ' + cssDeleteBtnFn(), $scope.searchOptions.onDeleteFilter, canDeleteFilterFn),
						makeItem($scope.searchOptions.onCreateSearchform, 'tlb-icons ico-create-form', $scope.searchOptions.onOpenSearchForm, null)
					]
				}
			};

			// End Main Settings Menu definitions
			function makeItem(captionTr, cssclass, fn, disabled) {
				return {
					caption: captionTr,
					// caption$tr$: captionTr,
					disabled: disabled,
					type: 'item',
					cssClass: cssclass,
					fn: function fnX() {
						fn();
					}
				};
			}

			/**
			 * @description this function checks the filter  for valid expressions.
			 * @param filterDefinition
			 * @returns {boolean}
			 */
			function checkforValidFilterDefinition(filterDefinition) {
				if (!filterDefinition) {
					filterDefinition = $scope.searchOptions.selectedItem.currentDefinition;
				}

				var validationReport = cloudDesktopBulkSearchDataService.validateFilterDefinition(filterDefinition);

				// openDialog?
				if (!validationReport.isValid) {
					var errorMessages = _.map(validationReport.errors, 'message');
					errorMessages.push('Please correct the filter definition and try again!');

					var messageJoin = errorMessages.join('<br>');

					platformModalService.showErrorBox(messageJoin, 'cloud.desktop.filterdefInvalidFilter');
				}

				return validationReport.isValid;
			}

			/**
			 *
			 * @param checkModified
			 * @returns {boolean}
			 */
			function canSaveDeleteModified(checkModified) {

				if (!$scope.searchOptions.selectedItem) {
					return false;
				}
				return $scope.searchOptions.selectedItem.canSaveDeleteModified(checkModified);

				// accessright validation pending!
				// return $scope.searchOptions.enhancedFilter.currentFilterDef.canSaveDeleteModified(checkModified);
			}

			/**
			 *
			 * @param withDialog
			 */
			function onSaveFilter(withDialog) {
				var filterDef;

				function showfilterSaveDialog() {
					var dialogOption = {
						templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
						controller: 'cloudDesktopFilterDefinitionBulkSaveDialogController',
						scope: $scope  // pass parameters to dialog via current scope
					};
					return platformModalService.showDialog(dialogOption);
				}

				/**
				 *
				 */
				function doSaveFilterDefinition(newFilter) {

					$scope.isLoading = true;

					cloudDesktopBulkSearchDataService.saveFilterDefinition(currentModuleName, newFilter).then(function (newFilterId) {
						if (newFilterId) {
							$scope.searchOptions.selectedItemId = newFilterId;
							updateRuleSelection();
						}
						$scope.isLoading = false;
					});
				}

				filterDef = $scope.searchOptions.selectedItem.currentDefinition;

				// if (!checkforValidFilterDefinition(filterDef)) {
				// return;
				// }

				if (withDialog) {
					showfilterSaveDialog().then(function (result) {
						doSaveFilterDefinition(result);
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

				var filterDef = $scope.searchOptions.selectedItem;
				if (filterDef) {
					showConfirmDeleteDialog(filterDef.filterName).then(function (result) {
						if (result.yes) {
							$scope.isLoading = true;

							// own method!!!
							cloudDesktopBulkSearchDataService.deleteFilterDefinition(currentModuleName, filterDef).then(function (nextFilterId) {
								$scope.isLoading = false;
								$scope.searchOptions.selectedItemId = nextFilterId;
								updateRuleSelection();
							});
						}
					});
				}
			}

			function canSaveFilterFn() {
				return !$scope.searchOptions.canSaveFilter();
			}

			function canSaveFilterAsFn() {
				return !$scope.searchOptions.canSaveFilterAs();
			}

			function canDeleteFilterFn() {
				return $scope.searchOptions.filterInfo.isPending || !$scope.searchOptions.canDeleteFilter();
			}

			function cssDeleteBtnFn() {
				return ($scope.searchOptions.filterInfo.isPending || !$scope.searchOptions.canDeleteFilter()) ? 'btndeactive' : '';
			}

			Object.defineProperties($scope.searchOptions, {
				'selectedItemId': {
					get: function () {
						return $scope.searchOptions.selectedItem ? $scope.searchOptions.selectedItem.id : '';
					},
					set: function (itemFilterId) {
						$scope.searchOptions.selectedItem = cloudDesktopBulkSearchDataService.getFilterByID(itemFilterId);
					}
				}
			});

			// this function is never being triggered
			function onModuleChanged() {
				cloudDesktopBulkSearchDataService.resetFilter();
			}

			function onAutoFilterChanged(event, args) {
				if (args.searchType !== 'bulk') {
					return;
				}
				var changedSelection = cloudDesktopBulkSearchDataService.setCurrentFilter(args.parameters.id, args.parameters.currentDefinition);
				if (changedSelection) {
					cloudDesktopBulkSearchDataService.filterRequested(true);
				}
				$scope.searchOptions.selectedItem = cloudDesktopBulkSearchDataService.getCurrentFilter();
			}

			cloudDesktopBulkSearchDataService.onResetFilter.register(setEnvironment);
			cloudDesktopBulkSearchDataService.onFiltersChanged.register(setItemsFormatInSelectbox);

			cloudDesktopSidebarService.onAutoFilterChanged.register(onAutoFilterChanged);
			cloudDesktopSidebarService.onModuleChanged.register(onModuleChanged);// this part is never being triggered

			// un-register on destroy
			$scope.$on('$destroy', function () {
				cloudDesktopBulkSearchDataService.onResetFilter.unregister(setEnvironment);
				cloudDesktopSidebarService.onAutoFilterChanged.unregister(onAutoFilterChanged);
				cloudDesktopSidebarService.onModuleChanged.unregister(onModuleChanged);
			});

			setEnvironment();

		}]);
})(angular);
