// jshint -W072
// jshint +W098

/**
 * @ngdoc controller
 * @name cloudSettingsDialogController
 * @function
 *
 * @description
 * Controller for the Document Properties Structure Details view.
 */
angular.module('cloud.desktop').controller('cloudDesktopQuickStartController', ['$scope', 'platformTranslateService', '$translate', 'cloudDesktopSidebarService', '$state', 'cloudDesktopModuleService', '$timeout', '$filter', 'cloudDesktopQuickstartSettingsService', '_', 'cloudDesktopDesktopLayoutSettingsService', 'mainViewService', 'cloudDesktopQuickstartTabsSettingsService', 'toolbarCommonService', 'basicsCommonUtilities',
	function ($scope, platformTranslateService, $translate, cloudDesktopSidebarService, $state, cloudDesktopModuleService, $timeout, $filter, cloudDesktopQuickstartSettingsService, _, desktopLayoutSettingsService, mainViewService, cloudDesktopQuickstartTabsSettingsService, toolbarCommonService, basicsCommonUtilities) {
		'use strict';

		$scope.navigationListItemsSelector = '.quickstart-items'; // for the navigation by keys
		$scope.moduleTabItemsItemsForSearching = []; // for searching with tabs-view
		$scope.showQuickstartWithTabs = false; // for showing modulename with or without tabs
		$scope.pageItemsInAccordionUI = [];
		let quickstartIsOpen = false;
		/*
		Usecase: sidebar is closed, but items changed via settings-dialog.
		Then click Sidebar for opening --> call showItems().
		 */
		let _changedQuickstartItems = false;

		if (cloudDesktopSidebarService.checkedInLocalStorage(cloudDesktopSidebarService.getSidebarIds().quickStart)) {
			openSidebar();
		}

		function mergeCurrentStatusInOriginData(item, collapsed) {
			var index = _.findIndex($scope.moduleTabItemsItemsForSearching, ['id', item.id]);
			_.merge($scope.moduleTabItemsItemsForSearching[index], item);

			if (collapsed) {
				// if accordion collapsed --> remove tabs-key
				delete $scope.moduleTabItemsItemsForSearching[index].tabs;
			}
		}

		function searchTermContainsInModule(item) {
			let _DisplayName = item.displayName.toLowerCase();
			let _DisplayNameEN = item.displayNameEN.toLowerCase();

			return _DisplayName.includes($scope.searchmodule.toLowerCase()) || _DisplayNameEN.includes($scope.searchmodule.toLowerCase());
		}

		$scope.configtile = {
			valueMember: 'redirect',
			expandFn: function (selectedItem) {
				// save accordion state in user-settings
				cloudDesktopQuickstartTabsSettingsService.setTabsExpandedStatus(selectedItem.module.id);

			},
			collapseFn: function (selectedItem) {
				cloudDesktopQuickstartTabsSettingsService.deleteExpandedTabId(selectedItem.module.id);
			},
			clickHeaderFn: function (selectedItem, event) {
				if (event.shiftKey && event.which === 1 || event.ctrlKey && event.button === 0) {
					let url = $state.href(getItemById(selectedItem.module.id).redirect);
					window.open(url, '_blank');
				}
				else {
					$scope.redirect(getItemById(selectedItem.module.id).id, getItemById(selectedItem.module.id).redirect, event);
				}
			},
			clickTabFn: function (selectedItem, event) {
				if (event.shiftKey && event.which === 1 || event.ctrlKey && event.button === 0) {
					let url = $state.href(getItemById(selectedItem.module.id).redirect);
					window.open(url, '_blank');
				}
				else {
				// set tab index, then call module
				mainViewService.setActiveTabIndex(selectedItem.tab.id);
				$scope.redirect(getItemById(selectedItem.module.id).id, getItemById(selectedItem.module.id).redirect, event);
				}
			}
		};

		function getItemById(id) {
			return _.find($scope.allowedModuleItems, ['id', id]);
		}

		function setCopyItems(items) {
			// need for search function. One copy for the iteration.
			$scope.moduleTabItemsItemsForSearching = _.cloneDeep(items);
		}

		function managePageItemsForTabs(result) {
			let addItems = _.differenceBy(result.pages, $scope.pageItemsInAccordionUI, 'id');
			if (addItems.length !== 0) {
				for (let i = 0; i < addItems.length; i++) {
					$scope.pageItemsInAccordionUI.push(addItems[i]);
				}
			}

			let removeItems = _.differenceBy($scope.pageItemsInAccordionUI, result.pages, 'id');
			if (removeItems.length !== 0) {
				for (let i = 0; i < removeItems.length; i++) {
					_.remove($scope.pageItemsInAccordionUI, { id: removeItems[i].id });
				}
			}
		}

		function showModules(refreshData) {
			$scope.quickstartIsLoading = refreshData ? true : false;

			cloudDesktopQuickstartSettingsService.getSettings(refreshData).then(function (result) {

				// customer settings in Dialog is activated
				var quickstartSettings = result;

				$scope.showQuickstartWithTabs = quickstartSettings.showTabs;

				$scope.allowedModuleItems = result.desktopItems;

				/*
					for showing tabs.
					expand the object by 'expanded'. and for the expanded=true --> get the tabs
					*/
				if ($scope.showQuickstartWithTabs) {
					if (quickstartSettings.showPages) {
						managePageItemsForTabs(result);
					} else {
						$scope.pageItemsInAccordionUI.length = 0; // ALM#125434
					}

					showExpandedAccoridionsForTabsTree($scope.allowedModuleItems);
					setCopyItems($scope.allowedModuleItems);
				}

				_changedQuickstartItems = false;
				$scope.quickstartIsLoading = false;
			});
		}

		function externUrlCall(url) {
			window.open(url);
		}

		$scope.redirect = function (id, redirect, event) {
			event.stopPropagation();
			event.preventDefault();

			var item = getItemById(id);

			if (item && item.type !== 0) {
				if (item.type === 1) {
					// get the link from service
					desktopLayoutSettingsService.getExternalModuleUrl(item.id).then(function (result) {
						externUrlCall(result.url);
					});
				} else {
					// is type === 2 --> an external link
					externUrlCall(redirect ? basicsCommonUtilities.getUrlWithPrefix(redirect) : '');
				}
			} else {
				var itemRedirect = !_.startsWith(redirect, 'app.') ? 'app.' + redirect : redirect;

				$state.transitionTo(itemRedirect);
			}

			// close sidebar
			cloudDesktopSidebarService.onCloseSidebar.fire(false);
		};

		$scope.getE2eClass = function (item) {
			return 'e2e-quickstart-btn-' + _.kebabCase(_.replace(item.redirect, 'app.', ''));
		};

		function showExpandedAccoridionsForTabsTree(moduleItems) {
			var expandedTabs = cloudDesktopQuickstartTabsSettingsService.getTabsExpandedStatus();

			if (expandedTabs && expandedTabs.length > 0) {
				cloudDesktopQuickstartTabsSettingsService.getTabsByModulenames(expandedTabs).then(function (tabsContent) {
					moduleItems = _.map(moduleItems, function (item) {
						if (tabsContent.hasOwnProperty(item.id)) {
							// set expanded for accordion open-state
							item.expanded = true;
							item.tabs = {};
							// set tabs in object
							item.tabs.items = _.filter(tabsContent[item.id], { 'Isvisible': true });

							// for searching
							mergeCurrentStatusInOriginData(item, false);
						}
						return item;
					});
				});
			}
		}

		$scope.sidebarOptions = {
			name: cloudDesktopSidebarService.getSidebarIds().quickStart,
			title: 'Quick-Start',
			title$tr$: 'cloud.common.sidebarQuickStart'
		};

		platformTranslateService.registerModule('cloud.desktop');

		// loads or updates translated strings
		var loadTranslations = function () {
			// load translation ids and convert result to object
			platformTranslateService.translateObject($scope.sidebarOptions, ['text', 'title']);
		};

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule('cloud.desktop')) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		}

		// set focus of input-text-field
		function setFocusToSearchInput() {
			$timeout(function () {
				var elem = $('#searchmodule');
				if (elem) {
					elem.focus().select();
				}
			}, 200);
		}

		function openSidebar() {
			quickstartIsOpen = true;
			setFocusToSearchInput();
			if (!$scope.allowedModuleItems || _changedQuickstartItems) {
				showModules(_changedQuickstartItems ? true : false);
			}
		}

		$scope.quickstartFilter = function (item) {
			if ($scope.searchmodule && $scope.searchmodule !== '') {
				return searchTermContainsInModule(item);
			} else {
				return item;
			}
		};

		function onOpenSidebar(cmdId) {
			if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().quickStart)) {
				openSidebar();
			}
		}

		function onClosingSidebar(cmdId) {
			if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().quickStart)) {
				quickstartIsOpen = false;
			}
		}

		cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);
		cloudDesktopSidebarService.onClosingSidebar.register(onClosingSidebar);

		// value comes from User-Settings-Dialog via changes in quickstart
		var watchQuickstart = $scope.$watch(cloudDesktopQuickstartSettingsService.getLastSettingsUpdate, function (oldValue, newValue) {
			if (oldValue !== newValue) {
				_changedQuickstartItems = true;
				if (!quickstartIsOpen) {
					return;
				}
				showModules(true);
			}
		});

		// value comes from User-Settings-Dialog via changes in Desktop layouts
		var watchPageStructure = $scope.$watch(function () {
			return desktopLayoutSettingsService.getLastSettingsUpdate();
		}, function (newVal, oldVal) {
			if (newVal !== oldVal) {
				_changedQuickstartItems = true;
				if (!quickstartIsOpen) {
					return;
				}
				showModules(true);
			}
		}, true);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			// platformTranslateService.translationChanged.unregister(loadTranslations);
			watchPageStructure();
			watchQuickstart();
			cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
			cloudDesktopSidebarService.onClosingSidebar.unregister(onClosingSidebar);
		});
	}]);
