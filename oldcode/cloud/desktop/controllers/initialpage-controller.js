/**
 @ngdoc controller
 * @name boqMainStructureDetailsController
 * @function
 *
 * @description
 * Controller for the Document Properties Structure Details view.
 */
/* globals app */
angular.module('cloud.desktop').controller('cloudDesktopInitialPageController',
	['$scope', 'globals', 'platformTranslateService', '$translate', 'platformLogonService',
		function ($scope, globals, platformTranslateService, $translate, platformLogonService) {
			'use strict';
			$scope.data = globals;

			platformTranslateService.registerModule('cloud.desktop');

			$scope.initOptions = {
				productName: app.productName,
				productLogoPrimary: app.productLogoPrimary,
				productVersion: app.productBuildVersion,
				productDate: app.productDate,
				headerText: function () {
					return platformLogonService.getProcessMainMsg();
				},
				subText: function () {
					return platformLogonService.getProcessSubMsg();
				}
			};

			// loads or updates translated strings
			function loadTranslations() {
				// load translation ids and convert result to object
			}

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('cloud.desktop')) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslations);
			});

		}
	]);
