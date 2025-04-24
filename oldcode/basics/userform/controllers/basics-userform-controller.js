(function () {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc controller
	 * @name basicsUserformController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.userform module
	 **/

	angular.module(moduleName).controller('basicsUserformController', [
		'$rootScope',
		'$scope',
		'platformMainControllerService',
		'basicsUserformMainService',
		'platformNavBarService',
		'basicsUserformTranslationService',
		'platformModalService',
		function (
			$rootScope,
			$scope,
			platformMainControllerService,
			mainDataService,
			platformNavBarService,
			translationService,
			platformModalService) {

			$rootScope.loading = true;
			$rootScope.desktopLoading = true;

			//
			var opt = {search: true, reports: false};
			var ctrlProxy = {};
			var environment = platformMainControllerService.registerCompletely($scope, mainDataService, ctrlProxy, translationService, moduleName, opt);

			var showMessageNeed2SaveChangesFirst = function () {
				var modalOptions = {
					headerTextKey: 'cloud.common.informationDialogHeader',
					bodyTextKey: 'cloud.common.informationNeed2SaveChangesFirst',
					showOkButton: true,
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			};
			mainDataService.failedOnOutstandingChanges.register(showMessageNeed2SaveChangesFirst);

			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(mainDataService, environment, translationService, opt);
			});

		}
	]);
})();