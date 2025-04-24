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
angular.module('cloud.desktop').controller('cloudDesktopSearchEnhancedController',
	['$scope', 'platformTranslateService', '$translate', 'cloudDesktopSidebarService', 'cloudDesktopEnhancedFilterService', 'platformModalService', '$timeout',
		'cloudDesktopSidebarSearchFormService', '_',
		function ($scope, platformTranslateService, $translate, cloudDesktopSidebarService, eFilterService, platformModalService,
			$timeout, cloudDesktopSidebarSearchFormService, _) {
			'use strict';

			var currentModuleName; //  = cloudDesktopSidebarService.filterRequest.moduleName;

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
				// ,onChange: function onChange(p1, p2, p3) {
				//	console('onChange called: ', p1, p2, p3);
				// }
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

			/**
			 *
			 * @param item
			 */
			function onSelectionChanged(item) { // jshint ignore:line

				if (eFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
					eFilterService.selectedFilterDefDto.setModified(false);
				}

				if ($scope.searchOptions.selectedItem) {
					try {
						$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.getCurrentFilterDef($scope.searchOptions.selectedItem);
						$scope.searchOptions.selectedItem.setModified(false);
					} catch (e) {
						console.log('onSelectionChanged() failed to interpret filter expression ', $scope.searchOptions.selectedItem);
					}
				}
			}

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

			/**
			 *
			 * @param options
			 */
			function filterStartEnhancedSearch(options /* {resetPageNumber: true} */) {

				// serialize filter and put into filterRequest
				var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
				var filterOption = {
					resetPageNumber: options ? options.resetPageNumber : false,
					filterDefAsJSONString: eFilterService.filterDefAsJSONString(filterDef),
					interfaceVersion: '1.0'
				};
				cloudDesktopSidebarService.filterStartEnhancedSearch(filterOption, true);

			}

			/**
			 *  l o a d i n g  F i l t e r M e t a D a t a   and filter definition list
			 */
			function setFilterEnvironment() {
				$scope.filterDataLoading = true;
				$scope.searchOptions.enhancedFilter.currentFilterDef = undefined; // eFilterService.createDefaultFilterDefinition(true);
				currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;

				// l o a d i n g  F i l t e r M e t a D a t a   and filter definition list
				eFilterService.loadFilterBaseData(currentModuleName)
					.then(function () {
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

			// var selectedFilterItem
			// s e a r c h O p t i o n s   searchOptions searchOptions searchOptions
			$scope.searchOptions = {
				// filter selection box
				// dataSourceOptions: savedFilterList,  // old cn implementatio, can be deleted....
				dropboxOptions: savedFilterList,
				searchListSelectbox: filterListinSelectbox,
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
				onDiscardBtnText: $translate.instant('cloud.common.undo'),
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
					return eFilterService.hasUserFtrWrAccess;
				},
				onPageFirst: function () {
					cloudDesktopSidebarService.filterPageFirst();
					filterStartEnhancedSearch();
				},
				onPageLast: function () {
					cloudDesktopSidebarService.filterPageLast();
					filterStartEnhancedSearch();
				},
				discardSearchFilter: function () {
					$scope.searchOptions.enhancedFilter.currentFilterDef = eFilterService.getCurrentFilterDef($scope.searchOptions.selectedItem);
				},
				onOpenSearchForm: function () {
					cloudDesktopSidebarSearchFormService.openSearchForm(eFilterService.currentFilterDefItem, false);
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

			// Object.defineProperties($scope.searchOptions, {
			// 	'selectedItemId': {
			// 		get: function () {
			// 			return $scope.searchOptions.selectedItem ? $scope.searchOptions.selectedItem.filterName : '';
			// 		},
			// 		set: function (itemFilterName) {
			// 			$scope.searchOptions.selectedItem = eFilterService.getAvailableFilterDefsByName(itemFilterName);
			// 		}
			// 	}
			// });

			setFilterEnvironment();

			/**
			 * @description this function checks the filter  for valid expressions.
			 * @param filterDefinition
			 * @returns {boolean}
			 */
			function checkforValidFilterDefinition(filterDefinition) {
				if (!filterDefinition) {
					filterDefinition = $scope.searchOptions.enhancedFilter.currentFilterDef;
				}
				var valid = filterDefinition.isValidFilterDefinition(true /* showError */); // jshint ignore:line
				return valid;
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

			/**
			 *
			 * @param withDialog
			 */
			function onSaveFilter(withDialog) {
				var filterDef;

				function showfilterSaveDialog() {
					var dialogOption = {
						templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
						controller: 'cloudDesktopFilterDefinitionSaveDialogController',
						scope: $scope  // pass parameters to dialog via current scope
					};

					var instance = platformModalService.showDialog(dialogOption); // jshint ignore:line
					// instance.then(function (data) { console.log('platformModalService then: ', data);	},
					//              function (data) { console.log('platformModalService else: ', data);	}				);
					return instance;
				}

				/**
				 *
				 */
				function doSaveFilterDefinition() {

					$scope.filterDataLoading = true;

					eFilterService.saveFilterDefinition(currentModuleName, filterDef).then(function (addUpdatedFilterDefEntry) {
						$scope.filterDataLoading = false;
						selectFilterDef(addUpdatedFilterDefEntry);
						// $scope.searchOptions.selectedItem = addUpdatedFilterDefEntry;
						// console.log(' saveFilterDefinition done... ', data);
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
								// $scope.searchOptions.selectedItem = nextFilterDefEntry;
								selectFilterDef(nextFilterDefEntry);
								// console.log(' deleteFilterDefinition done... ', data);
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
					$scope.searchOptions.searchListSelectbox.items = setItemsFormatInSelectbox(eFilterService.availableFilterDefs);
				}
			}, true);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				eFilterService.onResetFilter.unregister(onResetFilter);
				cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
			});
		}]);
