
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainInfoController', ['$scope', 'platformTranslateService',

		function ($scope, platformTranslateService) {

			$scope.path = globals.appBaseUrl;

			$scope.title = 'Business Partner Info';

			// let selectedItem = function () {
			// $scope.currentItem = {};
			// };

			// loads or updates translated strings
			let loadTranslations = function () {
				// platformTranslateService.translateFormContainerOptions($scope.formContainerOptions);
			};

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule(moduleName)) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			platformTranslateService.translationChanged.register(loadTranslations);
			// register translation changed event

			// do not forget to unregister your subscription
			$scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslations);
			});
		}
	]);
})(angular);
