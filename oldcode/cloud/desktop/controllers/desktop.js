/* global globals */
(function (angular) {
	'use strict';

	// config block of the desktop module.
	angular.module('cloud.desktop').config(cloudDesktopStateConfig);

	cloudDesktopStateConfig.$inject = ['$stateProvider'];
	var desktop = '.desktop';

	function cloudDesktopStateConfig($stateProvider) {
		// add default entrance point of the application. This state doesn't contain any tiles. It does only switch to the first valid user/rib page.
		$stateProvider
			.state(globals.defaultState + desktop, {
				id: 'desktop',
				url: '/desktop',
				isDesktop: true,
				templateUrl: window.location.pathname + 'cloud.desktop/partials/desktopview.html',
				controller: 'cloudDesktopController'
			});
	}

	angular.module('cloud.desktop').controller('cloudDesktopController', cloudDesktopController);

	cloudDesktopController.$inject = ['$scope', '$state', 'platformTranslateService', 'cloudDesktopInfoService', 'platformPermissionService', '_', 'cloudDesktopTilesConfig', '$document', '$timeout', 'cloudDesktopModuleService', 'cloudDesktopDesktopLayoutSettingsService', '$window', '$rootScope',
		'basicsWorkflowTaskPopUpService'];

	function cloudDesktopController($scope, $state, platformTranslateService, cloudDesktopInfoService, platformPermissionService, _, cloudDesktopTilesConfig, $document, $timeout, cloudDesktopModuleService, desktopLayoutSettingsService, $window, $rootScope,
		basicsWorkflowTaskPopUpService) { // jshint ignore:line
		var moduleName = 'cloud.desktop';

		$scope.appPath = window.location.pathname;

		// object holding translated strings
		$scope.translate = {};

		// object data desktop directive
		$scope.tilegroups = [];
		$scope.renderTilegroups = 0;

		$window.onbeforeunload = function () {
			$rootScope.$emit('platform:onBeforeUnload');
		};

		desktopLayoutSettingsService.getDesktopPagesStructure().then(function () {
			// desktopLayoutSettingsService.desktopPagesStructurePromise.then(function() {
			setDesktopPage(getCurrentState().id);
			// set pagename in headerinfo
			cloudDesktopInfoService.updateModuleInfo(getCurrentState().displayName, 'desktoppage');
		});

		var desktopListener = $scope.$watch(desktopLayoutSettingsService.getLastSettingsUpdate, function (newVal, oldVal) {
			if (!_.isUndefined(newVal) && newVal !== oldVal) {
				desktopLayoutSettingsService.getDesktopPagesStructure().then(function (result) {
					desktopLayoutSettingsService.extendStateProvider(result);
					refreshDesktopPage();
				});
			}
		});


		function setDesktopPage(id) {
			desktopLayoutSettingsService.getSettings().then(function (result) {
				let currentSettings = result;
				let pagesStructure = currentSettings.desktopPagesStructure;

				let defaultPage = _.find(pagesStructure, function (page) {
					return page.id === currentSettings.homeId;
				});

				if (id === 'desktop') {
					let url;

					if (defaultPage && defaultPage.id !== $state.current.id) {
						url = defaultPage.routeUrl;
					} else {
						url = pagesStructure[0].routeUrl;
					}
					$state.transitionTo(url);
				} else {
					let page = _.find(pagesStructure, {id: id === 'desktop' ? defaultPage.id : id});
					setPageData(page);
				}
			});

		}

		function refreshDesktopPage() {
			let page;
			desktopLayoutSettingsService.getSettings().then(function (result) {
				let config = result.desktopPagesStructure;

				if (config.length) {
					page = _.find(config, {id: $state.current.id});

					if (_.isUndefined(page)) {
						setDesktopPage('desktop', $scope);
					}
				}

				setPageData(page);
			});
		}

		function setPageData(page) {
			if (page && page.groups) {
				$scope.tilegroups = page.groups;
			} else {
				$scope.tilegroups = [];
			}

			$timeout(function () {
				++$scope.renderTilegroups;
			}, 250);
		}

		// loads or updates translated strings
		function loadTranslations() {
			// load translation of tile-group definition
			platformTranslateService.translateTileGroupConfig(cloudDesktopTilesConfig);

			// is the timeout necessary?
			$timeout(function () {
				++$scope.renderTilegroups;
			}, 250);
		}

		$timeout(function () {
			++$scope.renderTilegroups;
		}, 500);

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformTranslateService.translationChanged.unregister(loadTranslations);
			desktopListener();
			$window.onbeforeunload = undefined;
		});

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule([moduleName, 'cloud.common'])) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		}

		var wasClicked = false;
		// desktop directive redirect method
		$scope.redirectTo = function (routeUrl, $event) {
			if (!wasClicked) {
				if ($event && ($event.shiftKey || $event.ctrlKey)) {
					var windowOptions = 'location=yes';
					var url = $state.href(routeUrl, {}, {absolute: true});
					// window.open(url,'_blank', $event.shiftKey ? windowOptions : null);

					if ($event.shiftKey) {
						window.open(url, '_newtab', windowOptions);
					} else {
						window.open(url, '_blank');
					}
				} else {
					$state.transitionTo(routeUrl);
					wasClicked = true;
				}
			} else {
				wasClicked = false;
			}
		};

		function getCurrentState() {
			return $state.current;
		}

		basicsWorkflowTaskPopUpService.start();
	}
})(angular);
