angular.module('basics.workflow').controller('basicsWorkflowGroupSettingController',
	['_', '$scope', 'platformTranslateService', '$translate', 'cloudDesktopSidebarService', 'basicsWorkflowGroupSettingEfilterService', 'platformModalService', '$timeout',
		'cloudDesktopSidebarSearchFormService', 'basicsWorkflowInstanceService',
		function (_, $scope, platformTranslateService, $translate, cloudDesktopSidebarService, eFilterService, platformModalService,
		          $timeout, cloudDesktopSidebarSearchFormService, basicsWorkflowInstanceService) {
			'use strict';

			var currentModuleName = 'basics.workflow';

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
					var res = $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
					return res;
				}
			};

			var setItemsFormatInSelectbox = function (items) {
				var generatedItems = [];

				var accessLevels = [
					{
						id: 'System',
						caption: $translate.instant('basics.common.configLocation.system'),
						cssClass: 'title control-icons ' + (eFilterService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
					},
					{
						id: 'User',
						caption: $translate.instant('basics.common.configLocation.user'),
						cssClass: 'title control-icons ' + (eFilterService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
					},
					{
						id: 'Role',
						caption: $translate.instant('basics.common.configLocation.role'),
						cssClass: 'title control-icons ' + (eFilterService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
					}
				];

				angular.forEach(accessLevels, function (level) {
					var itemsFromList = _.filter(items, {accessLevel: level.id});

					if (itemsFromList.length > 0) {
						generatedItems.push({
							id: 666,
							displayName: level.caption,
							type: 'title',
							childId: level.id,
							cssClassButton: level.cssClass,
							disabled: true
						});

						generatedItems = generatedItems.concat(itemsFromList);
					}
				});

				_.find(items, function (item) {
					if (item.accessLevel === 'New') {
						item.cssClassButton = 'control-icons ico-search-new';

						generatedItems.unshift(item);
					}
				});

				return generatedItems;
			};

			var filterListinSelectbox = {
				valueMember: 'id',
				displayMember: 'displayName',
				showSearchfield: true,
				watchItems: true,
				group: {
					groupById: 'accessLevel'
				},
				items: []
			};

			function onSelectionChanged(item) { // jshint ignore:line

				if (eFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
					eFilterService.selectedFilterDefDto.setModified(false);
				}

				if ($scope.searchOptions.selectedItem) {
					try {
						$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.getCurrentFilterDef($scope.searchOptions.selectedItem);
						eFilterService.onTodoSettingsChange.fire(null, $scope.searchOptions.enhancedFilter.currentFilterDef);
						$scope.searchOptions.selectedItem.setModified(false);
					} catch (e) {
						console.log('onSelectionChanged() failed to interpret filter expression ', $scope.searchOptions.selectedItem);
					}
				}
			}

			function selectFilterDef(filterDefDto) {
				if ($scope.searchOptions.selectedItem) {
					$scope.searchOptions.selectedItem.setModified(false);
				}
				$scope.searchOptions.selectedItem = filterDefDto;
				// parse first filter and take as default
				if ($scope.searchOptions.selectedItem) {
					try {
						// autofilter validation
						if (!_.isEmpty(eFilterService.autoFilterDefDto)) {
							$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.loadAutoFilter(eFilterService.autoFilterDefDto);
							$scope.searchOptions.selectedItem = eFilterService.selectedFilterDefDto;
						} else if (filterDefDto.filterDef) {
							$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.getCurrentFilterDef(filterDefDto);
							$scope.searchOptions.selectedItem.setModified(false);
						}
					} catch (e) {
						console.error('selectFilterDef failed ', e);
					}
				}
			}

			function setFilterEnvironment() {
				$scope.filterDataLoading = true;

				eFilterService.loadFilterBaseData(currentModuleName).then(function () {
					$scope.filterDataLoading = false;
					if (eFilterService.availableFilterDefs && eFilterService.availableFilterDefs.length > 0) {
						$scope.searchOptions.dropboxOptions.items = eFilterService.availableFilterDefs;

						$scope.searchOptions.searchListSelectbox.items = setItemsFormatInSelectbox(eFilterService.availableFilterDefs);

						selectFilterDef(eFilterService.selectedFilterDefDto || eFilterService.availableFilterDefs[0]);
					}

				}, function (errdata) {
					console.error('loadFilterBaseData failed', errdata);
				});

			}

			$scope.searchOptions = {
				dropboxOptions: savedFilterList,
				searchListSelectbox: filterListinSelectbox,
				selectedItem: null,
				selectionChanged: onSelectionChanged,

				enhancedFilter: {
					currentFilterDef: null
				},

				onDeleteFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnDelete'),
				onSaveFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSave'),
				onSaveAsFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSaveAs'),
				onExecuteSearchBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSearch'),
				onDiscardBtnText: $translate.instant('cloud.common.undo'),
				onDeleteBtnText: 'Delete',
				filterInfo: cloudDesktopSidebarService.filterInfo,
				filterRequest: cloudDesktopSidebarService.filterRequest,
				cssClassForParent: {
					parentName: 'content-inner',
					newCss: 'sidebar-enhanced'
				},
				onClearSearch: function () {
					cloudDesktopSidebarService.filterResetPattern();
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
					return eFilterService.hasUserFtrWrAccess;
				}
			};

			Object.defineProperties($scope.searchOptions, {
				'selectedItemId': {
					get: function () {
						return $scope.searchOptions.selectedItem ? $scope.searchOptions.selectedItem.id : '';
					},
					set: function (itemFilterId) {
						$scope.searchOptions.selectedItem = eFilterService.getAvailableFilterDefsByID(itemFilterId);
					}
				}
			});

			setFilterEnvironment();

			function onSaveFilter(withDialog) {
				$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.getCurrentFilterDef($scope.searchOptions.selectedItem);
				$scope.searchOptions.enhancedFilter.currentFilterDef.todoSettings = basicsWorkflowInstanceService.todoSettings;

				var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;

				function showfilterSaveDialog() {
					$scope.headerTextKey = 'basics.workflow.task.list.groupOrSortingSettingHeaderText';
					$scope.nameLabelTextKey = 'basics.workflow.task.list.groupOrSortingSettingnameLabelText';
					$scope.namePlaceHolderKey = 'basics.workflow.task.list.groupOrSortingSettingareaLabelText';
					var dialogOption = {
						templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
						controller: 'basicWorkflowFilterSaveDialogController',
						scope: $scope
					};

					var instance = platformModalService.showDialog(dialogOption); // jshint ignore:line
					return instance;
				}

				function doSaveFilterDefinition() {
					$scope.filterDataLoading = true;

					eFilterService.saveFilterDefinition(currentModuleName, filterDef).then(function (addUpdatedFilterDefEntry) {
						$scope.filterDataLoading = false;
						selectFilterDef(addUpdatedFilterDefEntry);
					});
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

			function canSaveDeleteModified(checkModified) {
				if (!$scope.searchOptions.enhancedFilter || !$scope.searchOptions.enhancedFilter.currentFilterDef) {
					return false;
				}
				return $scope.searchOptions.enhancedFilter.currentFilterDef.canSaveDeleteModified(checkModified);
			}

			function onDeleteFilter() {
				function showConfirmDeleteDialog(filterName) {
					var modalOptions = {
						headerTextKey: 'basics.workflow.task.list.settingdefConfirmDeleteTitle',
						bodyTextKey: $translate.instant('basics.workflow.task.list.settingdefConfirmDeleteBody', {p1: filterName}),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};
					var instancePromise = platformModalService.showDialog(modalOptions);
					return instancePromise;
				}

				var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
				if (filterDef) {
					showConfirmDeleteDialog(filterDef.name).then(function (result) {
						if (result.yes) {
							$scope.filterDataLoading = true;
							eFilterService.deleteFilterDefinition(currentModuleName, filterDef).then(function (nextFilterDefEntry) {
								$scope.filterDataLoading = false;
								selectFilterDef(nextFilterDefEntry);
							});
						}
					});
				}
			}

			function setFocusToOnStartSearch() {
				$timeout(function () {
					var elem = $('#onStartSearch');
					if (elem) {
						elem.focus();
					}
				}, 50);
			}

			function onOpenSidebar(cmdId) {
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().search)) {
					setFocusToOnStartSearch();
				}
			}

			cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);
			basicsWorkflowInstanceService.registerUpdateViewEvent(updateViewEvent);

			setFocusToOnStartSearch();

			function updateViewEvent() {
				if (eFilterService.selectedFilterDefDto) {
					eFilterService.selectedFilterDefDto.setModified(true);
				}
			}

			$scope.option = {
				title: $translate.instant('basics.workflow.task.list.groupOrSortingSetting')
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
						makeItem($scope.searchOptions.onDeleteBtnText, 'tlb-icons ico-delete2 ' + cssDeleteBtnFn(), $scope.searchOptions.onDeleteFilter, canDeleteFilterFn)
					]
				}
			};

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

			$scope.$watch(function () {
				return eFilterService.availableFilterDefs;
			}, function (newVal, oldVal) {
				if (oldVal !== newVal) {
					if ($scope.searchOptions.searchListSelectbox.items.length > 0) {
						$scope.searchOptions.searchListSelectbox.items = setItemsFormatInSelectbox(eFilterService.availableFilterDefs);
					}
				}
			}, true);

			$scope.$on('$destroy', function () {
				cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
				basicsWorkflowInstanceService.updateViewEvent.unregister(updateViewEvent);
			});
		}]);
