(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopBulkSearchFormController', cloudDesktopBulkSearchFormController);

	cloudDesktopBulkSearchFormController.$inject = ['$rootScope', '$scope', 'cloudDesktopSidebarBulkSearchFormService', 'basicsLookupdataPopupService', '$templateCache', '_', 'cloudDesktopSidebarService', '$translate',
		'platformModalService', 'moment', '$timeout'];

	function cloudDesktopBulkSearchFormController($rootScope, $scope, cloudDesktopSidebarBulkSearchFormService, basicsLookupdataPopupService, $templateCache, _, cloudDesktopSidebarService, $translate,
		platformModalService, moment, $timeout) {

		$scope.searchFormOptions = {
			filterInfo: cloudDesktopSidebarService.filterInfo,
			filterRequest: cloudDesktopSidebarService.filterRequest,
			onExecuteSearchBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSearch'),
			selectedItem: cloudDesktopSidebarBulkSearchFormService.getSelectedItem(),
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

			includeRadiusSearchChk: {
				ctrlId: 'includeRadiusSearchId',
				labelText: $translate.instant('cloud.desktop.sdGoogleRadiusSearchChk'),
				labelText$tr$: 'cloud.desktop.sdGoogleRadiusSearchChk'
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
				cloudDesktopSidebarBulkSearchFormService.createManagerConfig($scope.bulkManager).then(function (manager) {
					cloudDesktopSidebarBulkSearchFormService.openSearchForm(angular.copy($scope.searchFormOptions.selectedItem), true, manager);
				});
			},
			onEnterKeyPress: function (event) {

				angular.element('.jsSearchFormButton').attr('disabled', true);

				setTimeout(function () {
					$scope.searchFormOptions.onStartSearch();
				}, 2000);
			},
			discardSearchFilter: function () {
				// reset the search form
				$scope.searchFormOptions.selectedItem.reset();
			},
			selectAll: function () {
				// select/deselect all conditions
				let setAll = cloudDesktopSidebarBulkSearchFormService.getSelectedItem().allSelected;
				$scope.searchFormOptions.selectedItem.selectAll(setAll);
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
			cloudDesktopSidebarBulkSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);
			setFilterDefinition();
		};

		function setFilterDefinition() {

			if ($scope.searchFormOptions.selectedItem) {
				$scope.searchFormOptions.selectedItem.filterDef = angular.fromJson($scope.searchFormOptions.selectedItem.filterDef);

				// wenn die values ein date-format ist = values in moment umwandeln
				if ($scope.searchFormOptions.selectedItem.filterDef && $scope.searchFormOptions.selectedItem.filterDef.hasOwnProperty('criteria')) {
					$scope.searchFormOptions.triggerButton = true;

					checkTriggerButtonProcess();
				}

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
			// restore autoFilter at init
			let autofilterDef = cloudDesktopSidebarService.getAutoFilter('bulkForm','radiusParameters');
			let filterDefUpdated = false;
			if (autofilterDef) {
				if (autofilterDef.hasOwnProperty('RadiusParameters')) {
					Object.assign(autofilterDef, autofilterDef.RadiusParameters);
				}
				let filterDef = _.filter($scope.searchFormOptions.selectboxItems, f => f.id === autofilterDef.id);
				if(filterDef.length > 0){
					filterDefUpdated = filterDef && !_.isUndefined(filterDef[0].updated) && (moment(filterDef[0].updated)).diff(moment(autofilterDef.updated)) > 0;
				}else{
					autofilterDef = null;
					// if autofilterDef id is not found i.e. it's deleted then autofilter is set to null.
					cloudDesktopSidebarService.setAutoFilter('bulkForm', null);
				}

			}


			if (autofilterDef && !cloudDesktopSidebarBulkSearchFormService.filterRequested() && !filterDefUpdated && !_.isUndefined(autofilterDef.updated)) {
				var args = {
					searchType: 'bulkForm',
					parameters: autofilterDef
				};
				onAutoFilterChanged(null, args);
			} else if (!cloudDesktopSidebarBulkSearchFormService.getSelectedItem()) {
				if ($scope.searchFormOptions.selectedItem && $scope.searchFormOptions.listDeclaration.items[1].moduleName === $rootScope.currentModule) {
					// e.g. edit in wizard -> go back in sidebar-searchform
					$scope.searchFormOptions.selectedItem = _.filter($scope.searchFormOptions.listDeclaration.items, {'id': $scope.searchFormOptions.selectedItem.id, 'accessLevel': $scope.searchFormOptions.selectedItem.accessLevel})[0];
				} else {
					$scope.searchFormOptions.selectedItem = filterDefUpdated ? _.filter($scope.searchFormOptions.listDeclaration.items, f => f.id === autofilterDef.id)[0] : $scope.searchFormOptions.listDeclaration.items[1];
				}
			} else {
				if (cloudDesktopSidebarBulkSearchFormService.getSelectedItem().moduleName === $rootScope.currentModule) {
					/*
						UseCase: in Edit Modus -> show a label and go to finish -> changes not in getSelectedItem(). Therefore get selected Item fresh from list
					 */
					$scope.searchFormOptions.selectedItem = _.filter($scope.searchFormOptions.listDeclaration.items, {
						'id': cloudDesktopSidebarBulkSearchFormService.getSelectedItem().id,
						'accessLevel': cloudDesktopSidebarBulkSearchFormService.getSelectedItem().accessLevel
					})[0];
				} else {
					// is selected item defined and its not in same module -> define one selected item for common Module.
					$scope.searchFormOptions.selectedItem = $scope.searchFormOptions.listDeclaration.items[1];
				}
			}
		}

		function loadItems() {
			$scope.bulkManager = cloudDesktopSidebarBulkSearchFormService.loadManager(cloudDesktopSidebarService.filterRequest.moduleName);

			cloudDesktopSidebarBulkSearchFormService.loadModule(cloudDesktopSidebarService.filterRequest.moduleName).then(function (result) {

				initSelectBoxItems(result);

				$scope.searchFormOptions.listDeclaration.items = cloudDesktopSidebarBulkSearchFormService.createItemsForSelectBox($scope.searchFormOptions.selectboxItems); // selectboxItems initialize in function initSelectBoxItems

				if ($scope.searchFormOptions.listDeclaration.items.length > 0) {

					getRightSelectedItem();

					cloudDesktopSidebarBulkSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);

					$scope.option.mainMenuDeclaration.disabled = false;
				} else {
					// useCase: delete last item in the selectbox -> after delete call loadItems -> no items, but selected existing
					$scope.searchFormOptions.selectedItem = undefined;
					cloudDesktopSidebarBulkSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);

					$scope.option.mainMenuDeclaration.disabled = true;
				}

				setFilterDefinition();

				$scope.filterDataLoading = false;
			});
		}

		// preparation for the domain controller select
		// brauche ich es noch??? checken
		function initSelectBoxItems(items) {
			$scope.searchFormOptions.selectboxItems = items;
		}

		function filterStartEnhancedSearch(options /* {resetPageNumber: true} */) {
			let assign;

			let locationFilter = cloudDesktopSidebarService.getAutoFilter('bulkForm', 'radiusParameters');

			var aFilter = {
				id: $scope.searchFormOptions.selectedItem.id,
				parameters: $scope.searchFormOptions.selectedItem.filterDef.parameters,
				updated: moment().format()
			};

			if (locationFilter && locationFilter.hasOwnProperty('RadiusParameters')) {
				assign = Object.assign(aFilter, locationFilter);
				cloudDesktopSidebarService.setAutoFilter('bulkForm', assign, 'radiusParameters');
			} else {
				cloudDesktopSidebarService.setAutoFilter('bulkForm', aFilter, 'radiusParameters');
			}

			var enhancedFilter = cloudDesktopSidebarBulkSearchFormService.getProcessedFilter();

			var filterOption = {
				resetPageNumber: options ? options.resetPageNumber : false,
				filterDefAsJSONString: enhancedFilter,
				interfaceVersion: '2.0'
			};

			cloudDesktopSidebarService.filterStartEnhancedSearch(filterOption, true);
		}

		function onAutoFilterChanged(event, args) {
			if (args.searchType !== 'bulkForm') {
				return;
			}
			var modifiedFilter = cloudDesktopSidebarBulkSearchFormService.modifyFilter(args.parameters.id, args.parameters.parameters);
			if (modifiedFilter) {
				cloudDesktopSidebarBulkSearchFormService.setSelectedItem(modifiedFilter);
				$scope.searchFormOptions.selectedItem = cloudDesktopSidebarBulkSearchFormService.getSelectedItem();
				cloudDesktopSidebarBulkSearchFormService.filterRequested(true);
			}
		}

		/*
			init navigation
		 */
		$scope.option = {
			title: $translate.instant('cloud.desktop.searchform.maintitle')
		};

		function diableDeleteSearch() {
			if ($scope.searchFormOptions.selectedItem && cloudDesktopSidebarBulkSearchFormService.accessRights) {
				return _.findIndex(cloudDesktopSidebarBulkSearchFormService.accessRights, {'id': $scope.searchFormOptions.selectedItem.accessLevel}) < 0;
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
					makeItem($translate.instant('cloud.desktop.searchform.dropdownItemDelete'), 'tlb-icons ico-delete2', $scope.searchFormOptions.onDeleteCurrentForm, diableDeleteSearch)
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
						cloudDesktopSidebarBulkSearchFormService.deleteSearchformItem($scope.searchFormOptions.selectedItem).then(function (response) {

							// delete associated json-file, if is not accellevel user
							if ($scope.searchFormOptions.selectedItem.accessLevel !== 'u') {
								cloudDesktopSidebarBulkSearchFormService.deleteTranslationById($scope.searchFormOptions.selectedItem.id);
							}

							$scope.searchFormOptions.selectedItem = undefined;
							cloudDesktopSidebarBulkSearchFormService.setSelectedItem($scope.searchFormOptions.selectedItem);

							$scope.filterDataLoading = false;
						});
						// when search form is deleted then autofilter is set to null.
						cloudDesktopSidebarService.setAutoFilter('bulkForm', null);

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
		loadItems();
		cloudDesktopSidebarBulkSearchFormService.onSearchFormsChanged.register(loadItems);
		cloudDesktopSidebarService.onModuleChanged.register(loadItems);
		cloudDesktopSidebarService.onAutoFilterChanged.register(onAutoFilterChanged);
		$scope.$on('$destroy', function () {
			cloudDesktopSidebarBulkSearchFormService.onSearchFormsChanged.unregister(loadItems);
			cloudDesktopSidebarService.onModuleChanged.unregister(loadItems);
			cloudDesktopSidebarService.onAutoFilterChanged.unregister(onAutoFilterChanged);
		});

	}
})(angular);