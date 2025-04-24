(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopSearchFormController', cloudDesktopSearchFormController);

	cloudDesktopSearchFormController.$inject = ['$rootScope', '$scope', 'cloudDesktopSidebarSearchFormService', 'basicsLookupdataPopupService', '$templateCache', '_', 'cloudDesktopSidebarService', 'cloudDesktopEnhancedFilterService', '$translate',
		'platformModalService', 'moment'];

	function cloudDesktopSearchFormController($rootScope, $scope, cloudDesktopSidebarSearchFormService, basicsLookupdataPopupService, $templateCache, _, cloudDesktopSidebarService, cloudDesktopEnhancedFilterService, $translate,
		platformModalService, moment) {

		$scope.searchFormOptions = {
			filterInfo: cloudDesktopSidebarService.filterInfo,
			filterRequest: cloudDesktopSidebarService.filterRequest,
			onExecuteSearchBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSearch'),
			selectedItem: cloudDesktopSidebarSearchFormService.getSelectedItem(),
			triggerButton: true,
			// add css class for flex-styling
			cssClassForParent: {
				parentName: 'content-inner',
				newCss: 'sidebar-enhanced'
			},
			// listing available searchform items. Need while filtering
			selectboxItems: [],
			// options for selectbox
			listDeclaration: {
				displayMember: 'name',
				valueMember: 'id',
				showSearchfield: true,
				group: {
					groupById: 'accessLevel'
				},
				items: []
			},

			onClearSearch: function () {
				cloudDesktopSidebarService.filterResetPattern();
			},
			onStartSearch: function () {
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
			onClearProjectContext: function () {
				cloudDesktopSidebarService.clearProjectContext();
			},
			onPageFirst: function () {
				cloudDesktopSidebarService.filterPageFirst();
				filterStartEnhancedSearch();
			},
			onPageLast: function () {
				cloudDesktopSidebarService.filterPageLast();
				filterStartEnhancedSearch();
			},
			onDeleteCurrentForm: function () {
				deleteCurrentForm($scope.searchFormOptions.selectedItem.name);
			},
			onOpenSearchForm: function () {
				cloudDesktopSidebarSearchFormService.openSearchForm(angular.copy($scope.searchFormOptions.selectedItem), true);
			},
			onEnterKeyPress: function () {

				angular.element('.jsSearchFormButton').attr('disabled', true);

				setTimeout(function () {
					$scope.searchFormOptions.onStartSearch();
				}, 2000);
			}
		};

		$scope.filterDataLoading = true;

		/*
			when clicking on the tab, dont trigger the search-button.
			default: true
		 */
		var tabChanged = true;

		$scope.itemChanged = function () {
			tabChanged = false;
			$scope.searchFormOptions.selectedItem = _.find($scope.searchFormOptions.listDeclaration.items, ['id', $scope.searchFormOptions.selectedItem.id]);
			cloudDesktopSidebarSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);
			setFilterDefinition();
		};

		function setFilterDefinition() {

			if ($scope.searchFormOptions.selectedItem) {
				$scope.searchFormOptions.selectedItem.filterDef = angular.fromJson($scope.searchFormOptions.selectedItem.filterDef);

				// wenn die values ein date-format ist = values in moment umwandeln
				if ($scope.searchFormOptions.selectedItem.filterDef && $scope.searchFormOptions.selectedItem.filterDef.hasOwnProperty('criteria')) {
					$scope.searchFormOptions.triggerButton = true;
					processCriteriosValues($scope.searchFormOptions.selectedItem.filterDef.criteria);

					checkTriggerButtonProcess();
				}
			}
		}

		function processCriteriosValues(filterDef) {
			if (filterDef.hasOwnProperty('criterion')) {
				angular.forEach(filterDef.criterion, function (criterion) {
					if (criterion.datatype === 'date') {
						criterion.value1 = criterion.value1 !== '' ? moment(criterion.value1) : criterion.value1;
						criterion.value2 = criterion.value2 !== '' ? moment(criterion.value2) : criterion.value2;
					}
					setTriggerButton(criterion.search_form_items.checked);
				});
			}

			if (filterDef.hasOwnProperty('criteria')) {
				angular.forEach(filterDef.criteria, function (criteria) {
					processCriteriosValues(criteria);
				});
			}
		}

		function setTriggerButton(term) {
			if (term || tabChanged) {
				$scope.searchFormOptions.triggerButton = false;
			}
		}

		function checkTriggerButtonProcess() {
			if ($scope.searchFormOptions.triggerButton) {
				filterStartEnhancedSearch({resetPageNumber: true});
			}
		}

		function getRightSelectedItem() {
			if (!cloudDesktopSidebarSearchFormService.getSelectedItem()) {
				if ($scope.searchFormOptions.selectedItem && $scope.searchFormOptions.listDeclaration.items[1].moduleName === $rootScope.currentModule) {
					// e.g. edit in wizard -> go back in sidebar-searchform
					$scope.searchFormOptions.selectedItem = _.filter($scope.searchFormOptions.listDeclaration.items, {'id': $scope.searchFormOptions.selectedItem.id, 'accessLevel': $scope.searchFormOptions.selectedItem.accessLevel})[0];
				} else {
					$scope.searchFormOptions.selectedItem = $scope.searchFormOptions.listDeclaration.items[1];
				}
			} else {
				if (cloudDesktopSidebarSearchFormService.getSelectedItem().moduleName === $rootScope.currentModule) {
					/*
						UseCase: in Edit Modus -> show a label and go to finish -> changes not in getSelectedItem(). Therefore get selected Item fresh from list
					 */
					$scope.searchFormOptions.selectedItem = _.filter($scope.searchFormOptions.listDeclaration.items, {
						'id': cloudDesktopSidebarSearchFormService.getSelectedItem().id,
						'accessLevel': cloudDesktopSidebarSearchFormService.getSelectedItem().accessLevel
					})[0];
				} else {
					// is selected item defined and its not in same module -> define one selected item for common Module.
					$scope.searchFormOptions.selectedItem = $scope.searchFormOptions.listDeclaration.items[1];
				}
			}
		}

		function loadItems() {

			cloudDesktopSidebarSearchFormService.loadAllSearchFormFilter(cloudDesktopSidebarService.filterRequest.moduleName).then(function (result) {
				initSelectBoxItems(result);

				$scope.searchFormOptions.listDeclaration.items = cloudDesktopSidebarSearchFormService.createItemsForSelectBox($scope.searchFormOptions.selectboxItems); // selectboxItems initialize in function initSelectBoxItems

				if ($scope.searchFormOptions.listDeclaration.items.length > 0) {

					if (!_.isEmpty(cloudDesktopSidebarSearchFormService.autoFilterDefDto)) {
						cloudDesktopSidebarSearchFormService.loadAutoFilter(cloudDesktopSidebarSearchFormService.autoFilterDefDto);
					}

					getRightSelectedItem();

					cloudDesktopSidebarSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);

					$scope.option.mainMenuDeclaration.disabled = false;
				} else {
					// useCase: delete last item in the selectbox -> after delete call loadItems -> no items, but selected existing
					$scope.searchFormOptions.selectedItem = undefined;
					cloudDesktopSidebarSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);

					$scope.option.mainMenuDeclaration.disabled = true;
				}

				setFilterDefinition();

				$scope.filterDataLoading = false;

				// get the user rights
				setAccessRightsForSearchForms();
			});
		}

		function setAccessRightsForSearchForms() {
			cloudDesktopSidebarSearchFormService.accessRightsForSearchForms().then(function (result) {
				// user has these rights
				$scope.searchFormOptions.accessRights = result;
			});
		}

		// function setDescriptionInJSON() {
		// 	$scope.searchFormOptions.selectedItem.description = angular.fromJson($scope.searchFormOptions.selectedItem.description);
		// }

		// preparation for the domain controller select
		// brauche ich es noch??? checken
		function initSelectBoxItems(items) {
			$scope.searchFormOptions.selectboxItems = items;
		}

		function filterStartEnhancedSearch(options /* {resetPageNumber: true} */) {

			/*
				On the basis of the check boxes it's best to use a copy of the object.
			 */
			var referenzFilterDef = angular.extend(angular.copy($scope.searchFormOptions.selectedItem.filterDef));
			/*
			 remove any checkboxes that are not checked.
			 */
			processBeforeSearch(referenzFilterDef.criteria);

			// serialize filter and put into filterRequest
			var filterOption = {
				resetPageNumber: options ? options.resetPageNumber : false,
				// filterDefAsJSONString: JSON.stringify($scope.searchFormOptions.selectedItem.filterDef)
				filterDefAsJSONString: JSON.stringify(referenzFilterDef),
				interfaceVersion: '1.0'
			};

			cloudDesktopSidebarService.filterStartEnhancedSearch(filterOption, true);
		}

		function processBeforeSearch(filterDef) {
			if (filterDef.hasOwnProperty('criterion')) {

				_.remove(filterDef.criterion, function (item) {
					return item.search_form_items.showCriterionItem === false || !checkIsValueNull(item);
				});
			}

			if (filterDef.hasOwnProperty('criteria') && filterDef.criteria.length > 0) {
				processBeforeSearch(filterDef.criteria[0]);
			}
		}

		function checkTextFieldContent(item, keyName) {
			if (_.isUndefined(item)) {
				return false;
			}

			item[keyName] = _.isString(item[keyName]) ? item[keyName].trim() : item[keyName];
			return !_.isEmpty(item[keyName]);
		}

		function checkIsValueNull(item) {
			if (_.isUndefined(item)) {
				return false;
			}

			// info: return true --> is valid

			// if no textfield is visible, then it is valid
			if (!_.get(item, 'search_form_items.showSearchterm')) {
				return true;
			}

			// e.g. list of status
			if (checkTextFieldContent(item, 'valuelist')) {
				return true;
			} else if (_.get(item, 'search_form_items.value2Hidden') && checkTextFieldContent(item, 'value1')) {
				return true;
			} else if (checkTextFieldContent(item, 'value1') && checkTextFieldContent(item, 'value2')) {
				return true;
			}

			// if false = remove item
			return false;
		}

		/*
			init navigation
		 */
		$scope.option = {
			title: $translate.instant('cloud.desktop.searchform.maintitle')
		};

		function canDeleteSearch() {
			/*
				Alm#106974 | Currently system-wide search forms can be deleted by any user. Provide a user right to control this.
				Depending on which item is selected, the menu item is set to disabled or not disabled.
				To save and delete the selected items, there are access rights in the container 'Rights' under 'Sidebar Search Form'
			*/
			if ($scope.searchFormOptions.selectedItem && $scope.searchFormOptions.accessRights) {
				return _.findIndex($scope.searchFormOptions.accessRights, {'id': $scope.searchFormOptions.selectedItem.accessLevel}) < 0;
			}

			return true;
		}

		$scope.option.mainMenuDeclaration = {
			cssClass: 'btn tlb-icons ico-menu btn-square-26',
			showSVGTag: false,
			list: {
				cssClass: 'dropdown-menu dropdown-menu-right',
				items: [
					makeItem($translate.instant('cloud.desktop.searchform.dropdownItemEdit'), 'tlb-icons ico-create-form', $scope.searchFormOptions.onOpenSearchForm, false),
					// makeItem('Change View', 'ico-settings', $scope.searchFormOptions.onOpenSearchForm, false),
					makeItem($translate.instant('cloud.desktop.searchform.dropdownItemDelete'), 'tlb-icons ico-delete2', $scope.searchFormOptions.onDeleteCurrentForm, canDeleteSearch)
				]
			}
		};

		// End Main Settings Menu definitions
		function makeItem(captionTr, cssclass, fn, disabled) {
			return {
				caption: captionTr,
				caption$tr$: captionTr,
				disabled: disabled,
				type: 'item',
				cssClass: cssclass,
				fn: function fnX() {
					fn();
				}
			};
		}

		function deleteCurrentForm(item) {
			platformModalService.showYesNoDialog($translate.instant('cloud.desktop.filterdefConfirmDeleteBody', {p1: item}), 'cloud.desktop.filterdefConfirmDeleteTitle')
				.then(function (result) {
					if (result.yes) {
						$scope.filterDataLoading = true;
						$scope.searchFormOptions.selectedItem.description = '';
						cloudDesktopSidebarSearchFormService.deleteSearchformItem($scope.searchFormOptions.selectedItem).then(function (response) {

							// delete associated json-file, if is not accellevel user
							if ($scope.searchFormOptions.selectedItem.accessLevel !== 'u') {
								cloudDesktopSidebarSearchFormService.deleteTranslationById($scope.searchFormOptions.selectedItem.id);
							}

							$scope.searchFormOptions.selectedItem = undefined;
							cloudDesktopSidebarSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);

							$scope.filterDataLoading = false;
						});
					}
				});
		}

		/*
			init popup-menu for the search-form-list
		 */
		var instance;
		var popupOpen = false;

		// Popup-Dropdown for the tab-items, that hidden in the man-view. These items shows in Popup-Dropdown.
		$scope.openPopup = function (event) {
			if (instance && !instance.isClosed) {
				instance.close();
				return;
			}

			var subMenuPopupTemplate = $templateCache.get('custom-select-domain.html');

			var popupOptions = {
				scope: $scope,
				multiPopup: false,
				plainMode: true,
				controller: 'searchFormSelectContainer',
				hasDefaultWidth: false,
				focusedElement: $(event.target),
				template: subMenuPopupTemplate
			};

			// used showPopup. Open and close problem with getToggleHelper(). And After click an item on popup-> popup dont close
			instance = basicsLookupdataPopupService.showPopup(popupOptions);
		};

		// function for: add new item in Enchanced Search or after delete Item. Get actually Searchformlist.
		$scope.$watch(function () {
			return cloudDesktopSidebarSearchFormService.allSerachFormItems;
		}, function (newVal, oldVal) {
			loadItems();
		}, true);
	}
})(angular);
