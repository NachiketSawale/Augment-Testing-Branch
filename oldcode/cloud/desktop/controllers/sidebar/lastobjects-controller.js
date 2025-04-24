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
angular.module('cloud.desktop').controller('cloudDesktopLastObjectsController',
	['$scope', '$state', 'platformTranslateService', '$translate', 'cloudDesktopSidebarService', 'cloudCommonLastObjectsService', 'platformContextService', 'platformModuleInfoService',
		function ($scope, $state, platformTranslateService, $translate, cloudDesktopSidebarService, cloudCommonLastObjectsService, platformContextService, platformModuleInfoService) {
			'use strict';

			var sidebarIsOpen = false;
			if (cloudDesktopSidebarService.checkedInLocalStorage(cloudDesktopSidebarService.getSidebarIds().lastobjects)) {
				sidebarIsOpen = true;
			}

			$scope.getModuleImageClass = function (lo) {
				if (!angular.isUndefined(lo)) {
					return platformModuleInfoService.getImageClass(lo.moduleName);
				} else {
					return 'ico-rib-logo';
				}
			};

			$scope.getlocalizedSubSummary = function (lo) {
				if (!angular.isUndefined(lo)) {
					return lo.lastChanged + ' / ' + platformModuleInfoService.getI18NName(lo.moduleName);
				} else {
					return 'n/a';
				}
			};

			var startsWith = function (self, str) {
				return self.substring(0, str.length) === str;
			};

			$scope.onNavigateToObject = function goTo(lo) {
				var url = globals.defaultState + '.' + lo.moduleName.replace('.', '');

				if (startsWith($state.current.name, url)) {
					cloudDesktopSidebarService.filterSearchFromPKeys([lo.objectId]);
				} else {
					try {
						// first setup StartupFilter since checkStartupFilter() will be called in main controller
						cloudDesktopSidebarService.setStartupFilter({filter: [lo.proxy.ObjectId]});
						$state.go(url).then(function () {
							// platformContextService.setApplicationValue('cloud.desktop.StartupParameter', {filter: [lo.proxy.ObjectId]});
						});
					} catch (ex) {
						cloudDesktopSidebarService.removeStartupFilter();
						throw new Error('Navigate to module ' + url + ' failed');
					}
				}
			};

			$scope.sidebarOptions = {
				name: cloudDesktopSidebarService.getSidebarIds().lastobjects,
				title: 'Last Objects'
			};

			$scope.onRefreshLastObjects = function () {
				if (!sidebarIsOpen) {
					return;
				}
				cloudCommonLastObjectsService.loadLastObjects().then(function (lastObjectList) {
					$scope.lastObjectsOptions.lastObjects = lastObjectList;
				});
			};

			function resetLastObjects() {
				$scope.lastObjectsOptions.lastObjects = [];
			}

			$scope.onLastObjectsSettings = function (/* id, value */) {

			};

			$scope.lastObjectsOptions = {
				title$tr$: 'cloud.desktop.sdCmdBarLastObjects',
				// settings: false,
				// settingsUrl: '',
				toolBarDefs: {},
				lastObjects: [] // cloudCommonLastObjectsService.CreateDummyLastObjects() // holding all lastObject in the list
			};

			$scope.lastObjectsOptions.toolBarDefs = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'refresh',
						caption: 'refresh',
						caption$tr$: 'cloud.desktop.sdrefresh',
						type: 'item',
						cssClass: 'ico-txt-rotate-right',
						fn: function () {
							$scope.onRefreshLastObjects();
						}
					},
					{
						id: 'eSettings',
						caption$tr$: 'cloud.desktop.sdMainSearchBtnSettings',
						type: 'item',
						cssClass: 'ico-settings',
						fn: function (id) {
							$scope.onLastObjectsSettings(id, this.value);
						}
					}
				]
			};

			/**
			 * trigger in case of Sidebar Search is opened
			 * @param cmdId
			 */
			function onOpenSidebar(cmdId) {
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().lastobjects)) {
					sidebarIsOpen = true;
					$scope.onRefreshLastObjects();
				}
			}

			function onClosingSidebar(cmdId) {
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().lastobjects)) {
					sidebarIsOpen = false;
					resetLastObjects();
				}

			}

			platformTranslateService.registerModule('cloud.desktop');

			// loads or updates translated strings
			var loadTranslations = function () {
				platformTranslateService.translateObject($scope.lastObjectsOptions, ['title', 'caption']);
				$scope.onRefreshLastObjects();
			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('cloud.desktop')) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			// force refreshing
			function onLastObjectsAdded() {
				$scope.lastObjectsOptions.lastObjects = cloudCommonLastObjectsService.getLastObjects();
			}

			cloudCommonLastObjectsService.onLastObjectsAdded.register(onLastObjectsAdded);

			// register translation changed event
			cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);
			cloudDesktopSidebarService.onClosingSidebar.register(onClosingSidebar);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslations);
				cloudCommonLastObjectsService.onLastObjectsAdded.unregister(onLastObjectsAdded);
				cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
				cloudDesktopSidebarService.onClosingSidebar.unregister(onClosingSidebar);
			});
		}
	]);
